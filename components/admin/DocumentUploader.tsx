"use client";

import { useRef, useState } from "react";

const DOCUMENT_TYPES = [
  { value: "NIGERIAN_PASSPORT",   label: "Nigerian Passport" },
  { value: "SECONDARY_ID",        label: "Secondary ID" },
  { value: "PAYMENT_RECEIPT",     label: "Payment Receipt" },
  { value: "PRE_ENROLLMENT_FORM", label: "Pre-Enrollment Form (2D Barcode)" },
  { value: "PARENT_PASSPORT",     label: "Parent's Passport" },
  { value: "OTHER",               label: "Other" },
];

interface Props {
  applicationId: string;
  uploadedById: string;
  onUploaded: () => void;
}

type UploadState = "idle" | "uploading" | "success" | "error";

export default function DocumentUploader({ applicationId, uploadedById, onUploaded }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [docType, setDocType] = useState(DOCUMENT_TYPES[0].value);
  const [file, setFile] = useState<File | null>(null);
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  function handleFile(f: File) {
    if (f.size > 10 * 1024 * 1024) {
      setErrorMsg("File is too large. Maximum size is 10 MB.");
      return;
    }
    if (!["application/pdf","image/jpeg","image/png","image/jpg"].includes(f.type)) {
      setErrorMsg("Only PDF, JPG, and PNG files are accepted.");
      return;
    }
    setErrorMsg(null);
    setFile(f);
    setState("idle");
  }

  async function handleUpload() {
    if (!file) return;
    setState("uploading");
    setProgress(10);

    try {
      // 1. Get pre-signed upload URL
      const urlRes = await fetch(
        `/api/documents/upload-url?applicationId=${applicationId}&documentType=${docType}&fileName=${encodeURIComponent(file.name)}&mimeType=${encodeURIComponent(file.type)}&fileSize=${file.size}`
      );
      const urlData = await urlRes.json();
      if (!urlRes.ok) throw new Error(urlData.error ?? "Failed to get upload URL");

      setProgress(30);

      // 2. Upload directly to Supabase Storage
      const uploadRes = await fetch(urlData.signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      if (!uploadRes.ok) throw new Error("Upload to storage failed");

      setProgress(70);

      // 3. Confirm — save metadata to DB
      const confirmRes = await fetch("/api/documents/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId,
          storagePath: urlData.storagePath,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          documentType: docType,
          uploadedById,
        }),
      });
      if (!confirmRes.ok) throw new Error("Failed to save document record");

      setProgress(100);
      setState("success");
      setFile(null);
      setTimeout(() => { setState("idle"); setProgress(0); onUploaded(); }, 1500);
    } catch (err) {
      setState("error");
      setErrorMsg(err instanceof Error ? err.message : "Upload failed. Please try again.");
      setProgress(0);
    }
  }

  return (
    <div className="space-y-3">
      {/* Document type selector */}
      <div>
        <label className="block text-xs font-body font-medium uppercase tracking-wide mb-1.5" style={{ color: "var(--mid)" }}>
          Document Type
        </label>
        <select
          value={docType}
          onChange={e => setDocType(e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-sm font-body outline-none"
          style={{ border: "1px solid rgba(26,74,46,0.12)", background: "var(--cream)", color: "var(--dark)" }}
        >
          {DOCUMENT_TYPES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      {/* Drop zone */}
      <div
        className="relative rounded-lg border-2 border-dashed p-6 text-center cursor-pointer transition-all"
        style={{
          borderColor: dragging ? "var(--green)" : file ? "var(--gold)" : "rgba(26,74,46,0.20)",
          background: dragging ? "rgba(26,74,46,0.04)" : "var(--cream)",
        }}
        onClick={() => inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        />

        {file ? (
          <div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2" style={{ background: "rgba(201,151,58,0.12)", color: "var(--gold)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <p className="text-sm font-body font-medium" style={{ color: "var(--dark)" }}>{file.name}</p>
            <p className="text-xs font-body mt-0.5" style={{ color: "var(--mid)" }}>
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2" style={{ background: "rgba(26,74,46,0.08)", color: "var(--green)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <p className="text-sm font-body" style={{ color: "var(--mid)" }}>
              Drop file here or <span style={{ color: "var(--green)", fontWeight: 600 }}>browse</span>
            </p>
            <p className="text-xs font-body mt-0.5" style={{ color: "rgba(74,101,88,0.5)" }}>PDF, JPG, PNG · Max 10 MB</p>
          </div>
        )}
      </div>

      {/* Progress bar */}
      {state === "uploading" && (
        <div className="rounded-full overflow-hidden h-1.5" style={{ background: "rgba(26,74,46,0.10)" }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%`, background: "var(--green)" }}
          />
        </div>
      )}

      {/* Error */}
      {errorMsg && (
        <p className="text-xs font-body" style={{ color: "#dc2626" }}>{errorMsg}</p>
      )}

      {/* Upload button */}
      <button
        onClick={handleUpload}
        disabled={!file || state === "uploading" || state === "success"}
        className="w-full py-2.5 rounded-lg text-sm font-body font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-40"
        style={{
          background: state === "success" ? "rgba(26,74,46,0.10)" : "var(--green)",
          color: state === "success" ? "var(--green)" : "white",
        }}
      >
        {state === "uploading" && (
          <span className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "white", borderTopColor: "transparent" }} />
        )}
        {state === "success" && "✓ Uploaded"}
        {state === "uploading" && "Uploading…"}
        {(state === "idle" || state === "error") && "Upload Document"}
      </button>
    </div>
  );
}
