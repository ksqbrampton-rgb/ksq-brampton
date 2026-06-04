import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getDownloadUrl, deleteStorageFile } from "@/lib/storage";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const doc = await db.document.findUnique({ where: { id: params.id } });
    if (!doc) return NextResponse.json({ error: "Document not found." }, { status: 404 });

    const url = await getDownloadUrl(doc.storagePath);
    return NextResponse.json({ url });
  } catch (err) {
    console.error("[documents/download]", err);
    return NextResponse.json({ error: "Failed to generate download URL." }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const doc = await db.document.findUnique({ where: { id: params.id } });
    if (!doc) return NextResponse.json({ error: "Document not found." }, { status: 404 });

    await deleteStorageFile(doc.storagePath);
    await db.document.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[documents/delete]", err);
    return NextResponse.json({ error: "Failed to delete document." }, { status: 500 });
  }
}
