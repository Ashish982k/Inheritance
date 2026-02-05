import argparse
import json
import os
from dataclasses import dataclass

import torch
import torch.nn as nn
from torch.utils.data import DataLoader
from torchvision import datasets, models, transforms


@dataclass
class TrainConfig:
    data_dir: str
    epochs: int
    batch_size: int
    lr: float
    num_workers: int
    img_size: int
    out_model: str
    out_classes: str
    freeze_backbone: bool


def build_transforms(img_size: int):
    train_tf = transforms.Compose(
        [
            transforms.RandomResizedCrop(img_size),
            transforms.RandomHorizontalFlip(),
            transforms.ColorJitter(brightness=0.1, contrast=0.1, saturation=0.1, hue=0.02),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ]
    )

    val_tf = transforms.Compose(
        [
            transforms.Resize(img_size + 32),
            transforms.CenterCrop(img_size),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ]
    )
    return train_tf, val_tf


def accuracy(outputs: torch.Tensor, targets: torch.Tensor) -> float:
    preds = outputs.argmax(dim=1)
    correct = (preds == targets).sum().item()
    return correct / max(1, targets.size(0))


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--data-dir", default=os.path.join("IMGdisease", "Split_smol"))
    parser.add_argument("--epochs", type=int, default=5)
    parser.add_argument("--batch-size", type=int, default=32)
    parser.add_argument("--lr", type=float, default=1e-3)
    parser.add_argument("--num-workers", type=int, default=2)
    parser.add_argument("--img-size", type=int, default=224)
    parser.add_argument("--out-model", default="img_model.pt")
    parser.add_argument("--out-classes", default="img_classes.json")
    parser.add_argument("--freeze-backbone", action="store_true")
    args = parser.parse_args()

    cfg = TrainConfig(
        data_dir=args.data_dir,
        epochs=args.epochs,
        batch_size=args.batch_size,
        lr=args.lr,
        num_workers=args.num_workers,
        img_size=args.img_size,
        out_model=args.out_model,
        out_classes=args.out_classes,
        freeze_backbone=args.freeze_backbone,
    )

    train_dir = os.path.join(cfg.data_dir, "train")
    val_dir = os.path.join(cfg.data_dir, "val")

    if not os.path.isdir(train_dir) or not os.path.isdir(val_dir):
        raise FileNotFoundError(
            f"Expected train/val folders at: {train_dir} and {val_dir}"
        )

    train_tf, val_tf = build_transforms(cfg.img_size)

    train_ds = datasets.ImageFolder(train_dir, transform=train_tf)
    val_ds = datasets.ImageFolder(val_dir, transform=val_tf)

    class_names = train_ds.classes
    num_classes = len(class_names)

    if num_classes < 2:
        raise ValueError(f"Found {num_classes} classes. Need at least 2 classes.")

    train_loader = DataLoader(
        train_ds,
        batch_size=cfg.batch_size,
        shuffle=True,
        num_workers=cfg.num_workers,
        pin_memory=True,
    )

    val_loader = DataLoader(
        val_ds,
        batch_size=cfg.batch_size,
        shuffle=False,
        num_workers=cfg.num_workers,
        pin_memory=True,
    )

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    weights = models.ResNet18_Weights.DEFAULT
    model = models.resnet18(weights=weights)

    if cfg.freeze_backbone:
        for p in model.parameters():
            p.requires_grad = False

    in_features = model.fc.in_features
    model.fc = nn.Linear(in_features, num_classes)
    model = model.to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(filter(lambda p: p.requires_grad, model.parameters()), lr=cfg.lr)

    best_val_acc = 0.0

    for epoch in range(1, cfg.epochs + 1):
        model.train()
        train_loss = 0.0
        train_acc = 0.0

        for images, targets in train_loader:
            images = images.to(device)
            targets = targets.to(device)

            optimizer.zero_grad(set_to_none=True)
            outputs = model(images)
            loss = criterion(outputs, targets)
            loss.backward()
            optimizer.step()

            train_loss += loss.item()
            train_acc += accuracy(outputs.detach(), targets.detach())

        train_loss /= max(1, len(train_loader))
        train_acc /= max(1, len(train_loader))

        model.eval()
        val_loss = 0.0
        val_acc = 0.0

        with torch.no_grad():
            for images, targets in val_loader:
                images = images.to(device)
                targets = targets.to(device)

                outputs = model(images)
                loss = criterion(outputs, targets)

                val_loss += loss.item()
                val_acc += accuracy(outputs, targets)

        val_loss /= max(1, len(val_loader))
        val_acc /= max(1, len(val_loader))

        print(
            f"Epoch {epoch}/{cfg.epochs} | "
            f"train_loss={train_loss:.4f} train_acc={train_acc:.4f} | "
            f"val_loss={val_loss:.4f} val_acc={val_acc:.4f}"
        )

        if val_acc > best_val_acc:
            best_val_acc = val_acc
            checkpoint = {
                "arch": "resnet18",
                "num_classes": num_classes,
                "class_names": class_names,
                "img_size": cfg.img_size,
                "state_dict": model.state_dict(),
            }
            torch.save(checkpoint, cfg.out_model)
            with open(cfg.out_classes, "w", encoding="utf-8") as f:
                json.dump(class_names, f, ensure_ascii=False, indent=2)

    print(f"Best val_acc={best_val_acc:.4f}")
    print(f"Saved model: {cfg.out_model}")
    print(f"Saved classes: {cfg.out_classes}")


if __name__ == "__main__":
    main()
