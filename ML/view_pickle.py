import pickle
import numpy as np

model = pickle.load(open("disease_model.pkl", "rb"))
vectorizer = pickle.load(open("vectorizer.pkl", "rb"))

print("\n=== DISEASE CLASSES ===")
print(model.classes_)

print("\n=== NUMBER OF DISEASES ===")
print(len(model.classes_))

print("\n=== TOP FEATURES (symptoms learned) ===")
features = vectorizer.get_feature_names_out()
print(features[:50])

print("\n=== MODEL COEFFICIENT SHAPE ===")
print(model.coef_.shape)

print("\n=== Example weights for first disease ===")
print(model.coef_[0][:20])
