import { NextResponse } from "next/server";
import { auth } from "../../../../auth";
import chatModel from "../../../../database/chat.js";

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const history = await chatModel.findOne(
      { userId },
      { messages: { $slice: -10 } }
    );

    const last10 = history?.messages || [];

    // Lazy import pdfkit on-demand to avoid bundling issues
    const PDFDocument = (await import("pdfkit"))?.default || (await import("pdfkit"));

    const doc = new PDFDocument({ margin: 36 });
    const chunks = [];
    doc.on("data", (c) => chunks.push(c));

    return await new Promise((resolve) => {
      doc.on("end", () => {
        const pdfBuffer = Buffer.concat(chunks);
        resolve(new NextResponse(pdfBuffer, {
          status: 200,
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": "attachment; filename=medical-history.pdf",
          },
        }));
      });

      doc.fontSize(18).text("Medical History (Last 10 Predictions)", { align: "left" });
      doc.moveDown(0.5);

      if (last10.length === 0) {
        doc.fontSize(12).text("No medical history found.");
      } else {
        last10.forEach((m, i) => {
          const ts = m.createdAt ? new Date(m.createdAt).toLocaleString() : "";
          doc.fontSize(12).fillColor("#111").text(`${i + 1}. ${ts}`, { continued: false });

          if (Array.isArray(m.predictions) && m.predictions.length > 0) {
            m.predictions.forEach((p) => {
              const line = `• ${p.disease} (${Math.round(Number(p.confidence) || 0)}%)`;
              doc.text(line, { indent: 16 });
            });
          } else {
            doc.text("• (no predictions)", { indent: 16 });
          }

          if (m.text) {
            doc.text(`Input: ${m.text}`, { indent: 16 });
          }

          doc.moveDown(0.5);
        });
      }

      doc.end();
    });
  } catch (err) {
    console.error("HISTORY PDF ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
