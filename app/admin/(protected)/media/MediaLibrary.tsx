"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { uploadMedia, deleteMedia } from "@/lib/admin/media";
import type { Database } from "@/lib/supabase/types";

type MediaRow = Database["public"]["Tables"]["media"]["Row"];

function fileNameFromPath(path: string) {
  return path.split("/").pop() ?? path;
}

export default function MediaLibrary({ initialMedia }: { initialMedia: MediaRow[] }) {
  const router = useRouter();
  const [media, setMedia] = useState<MediaRow[]>(initialMedia);
  const [isUploading, startUpload] = useTransition();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keeps local state in sync whenever the server component re-renders
  // fresh data after router.refresh() (post-upload / post-delete).
  useEffect(() => {
    setMedia(initialMedia);
  }, [initialMedia]);

  function handleUploadClick() {
    fileInputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    const formData = new FormData();
    formData.set("file", file);

    startUpload(async () => {
      const result = await uploadMedia(formData);
      if (result.ok) {
        router.refresh();
      } else {
        setError(result.error ?? "Upload failed.");
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    });
  }

  function handleDelete(row: MediaRow) {
    if (!window.confirm("Delete this file? This can't be undone.")) return;
    setPendingDeleteId(row.id);
    setError(null);
    startUpload(async () => {
      try {
        await deleteMedia(row.id, row.path);
        setMedia((prev) => prev.filter((m) => m.id !== row.id));
        router.refresh();
      } catch {
        setError("Couldn't delete file.");
      } finally {
        setPendingDeleteId(null);
      }
    });
  }

  return (
    <>
      <div className="a-section-heading">
        <h2>Media library</h2>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <button type="button" className="a-btn a-btn-primary" onClick={handleUploadClick} disabled={isUploading}>
            {isUploading ? "Uploading…" : "Upload file"}
          </button>
        </div>
      </div>

      {error ? (
        <p style={{ color: "#B91C1C", fontSize: "13.5px", marginBottom: "16px" }}>{error}</p>
      ) : null}

      {media.length === 0 ? (
        <div className="a-card">
          <p style={{ margin: 0, fontSize: "13.5px", color: "var(--aluminum)" }}>
            No media uploaded yet. Upload a file to get started.
          </p>
        </div>
      ) : (
        <div className="a-media-page-grid">
          {media.map((row) => (
            <div className="a-media-page-item" key={row.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={row.url} alt={row.alt_text ?? ""} />
              <button
                type="button"
                className="a-media-page-delete"
                onClick={() => handleDelete(row)}
                disabled={pendingDeleteId === row.id}
                aria-label="Delete file"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
              <div className="a-media-page-item-meta">{fileNameFromPath(row.path)}</div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
