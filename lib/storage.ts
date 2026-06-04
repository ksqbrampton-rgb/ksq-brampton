import { createClient } from "@supabase/supabase-js";

const BUCKET = "nin-brampton-documents";

/**
 * Server-side Supabase client using service role key.
 * Never expose this to the browser.
 */
function getServiceClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase environment variables.");
  return createClient(url, key);
}

/**
 * Generate a pre-signed upload URL for direct browser → Supabase upload.
 * Valid for 60 seconds.
 */
export async function getUploadUrl(storagePath: string): Promise<string> {
  const supabase = getServiceClient();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUploadUrl(storagePath);
  if (error || !data) throw new Error(`Failed to create upload URL: ${error?.message}`);
  return data.signedUrl;
}

/**
 * Generate a pre-signed download URL valid for 15 minutes.
 */
export async function getDownloadUrl(storagePath: string): Promise<string> {
  const supabase = getServiceClient();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(storagePath, 60 * 15);
  if (error || !data) throw new Error(`Failed to create download URL: ${error?.message}`);
  return data.signedUrl;
}

/**
 * Delete a file from storage.
 */
export async function deleteStorageFile(storagePath: string): Promise<void> {
  const supabase = getServiceClient();
  const { error } = await supabase.storage.from(BUCKET).remove([storagePath]);
  if (error) throw new Error(`Failed to delete file: ${error.message}`);
}

/**
 * Build a storage path for a document.
 * Format: applications/{applicationId}/{type}/{filename}
 */
export function buildStoragePath(
  applicationId: string,
  documentType: string,
  fileName: string
): string {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "bin";
  const slug = documentType.toLowerCase().replace(/_/g, "-");
  const ts = Date.now();
  return `applications/${applicationId}/${slug}/${ts}.${ext}`;
}

/**
 * Validate MIME type for identity documents.
 */
export function isAllowedMimeType(mimeType: string): boolean {
  return ["application/pdf", "image/jpeg", "image/png", "image/jpg"].includes(mimeType);
}

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
