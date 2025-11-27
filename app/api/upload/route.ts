import { NextRequest, NextResponse } from "next/server";
import { parseDocument } from "@/lib/services/documentParser";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const document = await parseDocument(buffer, file.name, file.type);

    return NextResponse.json({
      success: true,
      document: {
        ...document,
        id: crypto.randomUUID(),
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}

