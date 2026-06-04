"use client";

import { useState, useCallback } from "react";
import DocumentUploader from "./DocumentUploader";

interface Document {
  id: string;
  fileName: string;
  type: string;
  status: string;
  mimeType: string;
  fileSize: number;
  createdAt?: string;
}

interface Props {
  applicationId: string;
  uploadedById: string;
  initialDocuments?: Document[];
}

const TYPE_LABELS: Record<string, string> = {
  NIGERIAN_PASSPORT: "Nigerian Passport",
  SECONDARY_ID: "Secondary ID",
  PAYMENT_RECEIPT: "Payment Receipt",
  PRE_ENROLLMENT_FORM: "Pre-Enrollment Form",
  PARENT_PASSPORT: "Parent's Passport",
  OTHER: "Other",
};

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  PENDING_REVIEW: { bg: "rgba(245,158,11,0.10)", color: "#d97706" },
  APPROVED:       { bg: "rgba(26,74,46,0.08)",   color: "var(--green)" },
  REJECTED:       { bg: "rgba(239,68,68,0.08)",  color: "#dc2626" },
};

export default function DocumentsPanel({ applicationId, uploadedById, initialDocuments = [] }: Props) {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [showUploader, setShowUploader] = useState(false);
  const [viewingUrl, setViewingUrl] = useState<string | null>(null);
  const [viewingName, setViewingName] = useState<string | null>(null);

  const refreshDocuments = useCallback(async () => {
    // TODO Phase 3 DB: fetch documents for this application from the API
    // For now, uploader adds a placeholder record
    setShowUploader(false);
  }, []);

  async function handleView(docId: string, fileName: string) {
    const res = await fetch(`/api/documents/${docId}`);
    const data = await res.json();
    if (data.url) {
      setViewingUrl(data.url);
      setViewingName(fileName);
    }
  }

  async function handleDelete(docId: string) {
    if (!confirm("Delete this document? This cannot be undone.")) return;
    await fetch(`/api/documents/${docId}`, { method: "DELETE" });
    setDocuments(d => d.filter(doc => doc.id !== docId));
  }

  async function handleReview(docId: string, status: "APPROVED" | "REJECTED") {
    // TODO Phase 3 DB: call documents.review tRPC procedure
    setDocuments(d => d.map(doc => doc.id === docId ? { ...doc, status } : doc));
  }

  return (
    <div className="space-y-4">
      {/* Document list */}
      {documents.length === 0 ? (
        <div
          className="p-6 rounded-lg text-center"
          style={{ background: "var(--light)", border: "1px dashed rgba(26,74,46,0.20)" }}
        >
          <p className="text-sm font-body" style={{ color: "var(--mid)" }}>
            No documents uploaded yet.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {documents.map(doc => {
            const statusStyle = STATUS_STYLES[doc.status] ?? STATUS_STYLES.PENDING_REVIEW;
            return (
              <div
                key={doc.id}
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{ background: "var(--light)", border: "1px solid rgba(26,74,46,0.08)" }}
              >
                {/* File icon */}
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: doc.mimeType === "application/pdf" ? "rgba(239,68,68,0.08)" : "rgba(59,130,246,0.08)",
                           color: doc.mimeType === "application/pdf" ? "#dc2626" : "#3b82f6" }}
                >
                  {doc.mimeType === "application/pdf" ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                    </svg>
                  ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-body font-medium truncate" style={{ color: "var(--dark)" }}>{doc.fileName}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-body" style={{ color: "var(--mid)" }}>{TYPE_LABELS[doc.type] ?? doc.type}</span>
                    <span className="text-xs font-body" style={{ color: "var(--mid)" }}>·</span>
                    <span className="text-xs font-body" style={{ color: "var(--mid)" }}>{(doc.fileSize / 1024).toFixed(0)} KB</span>
                  </div>
                </div>

                {/* Status badge */}
                <span
                  className="text-xs font-body font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: statusStyle.bg, color: statusStyle.color }}
                >
                  {doc.status === "PENDING_REVIEW" ? "Pending" : doc.status === "APPROVED" ? "✓ Approved" : "✗ Rejected"}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => handleView(doc.id, doc.fileName)}
                    className="p-1.5 rounded transition-colors hover:bg-white"
                    style={{ color: "var(--green)" }}
                    title="View"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                  {doc.status === "PENDING_REVIEW" && (
                    <>
                      <button onClick={() => handleReview(doc.id, "APPROVED")} className="p-1.5 rounded transition-colors hover:bg-white" style={{ color: "#059669" }} title="Approve">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      </button>
                      <button onClick={() => handleReview(doc.id, "REJECTED")} className="p-1.5 rounded transition-colors hover:bg-white" style={{ color: "#dc2626" }} title="Reject">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    </>
                  )}
                  <button onClick={() => handleDelete(doc.id)} className="p-1.5 rounded transition-colors hover:bg-white" style={{ color: "rgba(74,101,88,0.5)" }} title="Delete">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Uploader toggle */}
      {showUploader ? (
        <div className="p-4 rounded-lg" style={{ background: "white", border: "1px solid rgba(26,74,46,0.10)" }}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-body font-semibold uppercase tracking-wide" style={{ color: "var(--green)" }}>Upload Document</p>
            <button onClick={() => setShowUploader(false)} className="text-xs font-body" style={{ color: "var(--mid)" }}>Cancel</button>
          </div>
          <DocumentUploader
            applicationId={applicationId}
            uploadedById={uploadedById}
            onUploaded={refreshDocuments}
          />
        </div>
      ) : (
        <button
          onClick={() => setShowUploader(true)}
          className="w-full py-2.5 rounded-lg text-sm font-body font-medium flex items-center justify-center gap-2 transition-colors"
          style={{ background: "rgba(26,74,46,0.06)", color: "var(--green)", border: "1px dashed rgba(26,74,46,0.20)" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Upload Document
        </button>
      )}

      {/* Inline viewer modal */}
      {viewingUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.7)" }}
          onClick={() => { setViewingUrl(null); setViewingName(null); }}
        >
          <div
            className="bg-white rounded-xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-body font-medium" style={{ color: "var(--dark)" }}>{viewingName}</p>
              <button onClick={() => { setViewingUrl(null); setViewingName(null); }} style={{ color: "var(--mid)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-auto p-2">
              {viewingUrl.includes(".pdf") || viewingName?.endsWith(".pdf") ? (
                <iframe src={viewingUrl} className="w-full h-full min-h-[60vh]" title={viewingName ?? "Document"} />
              ) : (
                <img src={viewingUrl} alt={viewingName ?? "Document"} className="max-w-full mx-auto" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
