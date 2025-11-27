import { NextRequest, NextResponse } from "next/server";
import { exportDocument } from "@/lib/services/documentExporter";
import type { Document } from "@/types/document";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { format, document } = body as {
      format: "pdf" | "docx" | "md";
      document: Document;
    };

    if (!format || !document) {
      return NextResponse.json(
        { error: "Format and document are required" },
        { status: 400 }
      );
    }

    const result = await exportDocument(document, format);

    return new NextResponse(result.buffer as unknown as BodyInit, {
      headers: {
        "Content-Type": result.mimeType,
        "Content-Disposition": `attachment; filename="${result.filename}"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Export failed" },
      { status: 500 }
    );
  }
}

