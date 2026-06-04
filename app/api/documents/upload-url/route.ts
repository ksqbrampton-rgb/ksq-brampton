import { NextResponse } from "next/server";
import { getUploadUrl, buildStoragePath, isAllowedMimeType, MAX_FILE_SIZE_BYTES } from "@/lib/storage";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const applicationId = searchParams.get("applicationId");
  const documentType = searchParams.get("documentType");
  const fileName = searchParams.get("fileName");
  const mimeType = searchParams.get("mimeType");
  const fileSize = parseInt(searchParams.get("fileSize") ?? "0");

  if (!applicationId || !documentType || !fileName || !mimeType) {
    return NextResponse.json({ error: "Missing required parameters." }, { status: 400 });
  }

  if (!isAllowedMimeType(mimeType)) {
    return NextResponse.json({ error: "File type not allowed. Accepted: PDF, JPG, PNG." }, { status: 400 });
  }

  if (fileSize > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json({ error: "File too large. Maximum size is 10 MB." }, { status: 400 });
  }

  try {
    const storagePath = buildStoragePath(applicationId, documentType, fileName);
    const signedUrl = await getUploadUrl(storagePath);
    return NextResponse.json({ signedUrl, storagePath });
  } catch (err) {
    console.error("[upload-url]", err);
    return NextResponse.json({ error: "Failed to generate upload URL." }, { status: 500 });
  }
}
