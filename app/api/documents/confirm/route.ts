import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  let body: {
    applicationId: string;
    storagePath: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    documentType: string;
    uploadedById: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { applicationId, storagePath, fileName, fileSize, mimeType, documentType, uploadedById } = body;

  if (!applicationId || !storagePath || !fileName || !mimeType || !documentType || !uploadedById) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }

  try {
    const document = await db.document.create({
      data: {
        applicationId,
        storagePath,
        fileName,
        fileSize,
        mimeType,
        type: documentType as never,
        uploadedById,
        status: "PENDING_REVIEW",
      },
    });
    return NextResponse.json({ document });
  } catch (err) {
    console.error("[documents/confirm]", err);
    return NextResponse.json({ error: "Failed to save document." }, { status: 500 });
  }
}
