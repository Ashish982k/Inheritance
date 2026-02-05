import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "file is required" }, { status: 400 });
    }

    const upstream = new FormData();
    upstream.append("file", file, file.name);

    const controller = new AbortController();
    const timeoutMs = 30000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    let mlRes;
    try {
      mlRes = await fetch("http://localhost:8000/predict-image", {
        method: "POST",
        body: upstream,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeoutId);
    }

    const text = await mlRes.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: text };
    }

    if (!mlRes.ok) {
      return NextResponse.json(
        { error: data?.detail || data?.error || "ML server error" },
        { status: mlRes.status }
      );
    }

    return NextResponse.json(data);
  } catch (e) {
    const msg = e?.message || "Unknown error";
    if (e?.name === "AbortError") {
      return NextResponse.json(
        { error: "Image prediction timed out. Make sure ML server is running on port 8000." },
        { status: 504 }
      );
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
