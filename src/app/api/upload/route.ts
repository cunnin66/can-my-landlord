import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { extractTextFromPdf } from "@/lib/pdf";
import { uploadPdf, uploadExtractedText } from "@/lib/storage";
import type { UploadResponse } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are accepted" },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const documentId = uuidv4();

    const { text, pageCount } = await extractTextFromPdf(buffer);

    if (!text.trim()) {
      return NextResponse.json(
        {
          error:
            "Could not extract text from PDF. The file may be scanned or image-based.",
        },
        { status: 422 }
      );
    }

    await Promise.all([
      uploadPdf(documentId, buffer),
      uploadExtractedText(documentId, text),
    ]);

    const response: UploadResponse = {
      documentId,
      filename: file.name,
      pageCount,
      textPreview: text.slice(0, 200) + (text.length > 200 ? "..." : ""),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to process PDF" },
      { status: 500 }
    );
  }
}
