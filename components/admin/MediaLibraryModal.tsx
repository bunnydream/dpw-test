"use client";

import { useEffect, useState } from "react";
import { listMedia } from "@/lib/admin/media";
import type { Database } from "@/lib/supabase/types";

type MediaRow = Database["public"]["Tables"]["media"]["Row"];

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

/** Picks an existing upload from the media library instead of uploading a
 * new file. Reuses the same grid styling as the full media library page.
 * Shared by the page block editor's PhotoField and the blog editor. */
export default function MediaLibraryModal({ onSelect, onClose }: { onSelect: (url: string) => void; onClose: () => void }) {
  const [media, setMedia] = useState<MediaRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    listMedia()
      .then(setMedia)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load media library"));
  }, []);

  return (
    <div className="a-modal-overlay is-open" onClick={onClose}>
      <div className="a-modal a-modal--scroll" onClick={(e) => e.stopPropagation()}>
        <div className="a-modal-sticky">
          <div className="a-modal-header">
            <h2>Choose from media library</h2>
            <button type="button" className="a-modal-close" onClick={onClose}>
              <CloseIcon />
            </button>
          </div>
        </div>
        <div className="a-modal-scroll-body">
          {error ? (
            <p className="a-field-hint" style={{ color: "#B91C1C" }}>
              {error}
            </p>
          ) : !media ? (
            <p className="a-field-hint">Loading...</p>
          ) : media.length === 0 ? (
            <p className="a-field-hint">No photos uploaded yet. Upload one first.</p>
          ) : (
            <div className="a-media-page-grid">
              {media.map((m) => (
                <button
                  type="button"
                  key={m.id}
                  className="a-media-page-item a-media-picker-item"
                  onClick={() => onSelect(m.url)}
                  title="Use this photo"
                >
                  <img src={m.url} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
