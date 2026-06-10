"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LegalDocument } from "./legal-document";
import {
  TERMS_SECTIONS,
  PRIVACY_SECTIONS,
} from "@/content/legal";
import { Button } from "@/components/ui";

export type LegalDocType = "terms" | "privacy";

const DOCS: Record<
  LegalDocType,
  { title: string; sections: typeof TERMS_SECTIONS }
> = {
  terms: { title: "Terms of Service", sections: TERMS_SECTIONS },
  privacy: { title: "Privacy Policy", sections: PRIVACY_SECTIONS },
};

export function LegalModal({
  type,
  open,
  onClose,
  onAccept,
}: {
  type: LegalDocType | null;
  open: boolean;
  onClose: () => void;
  onAccept?: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || !type) return null;

  const doc = DOCS[type];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-dark/50 backdrop-blur-sm"
        aria-label="Close"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className={cn(
          "relative w-full max-w-lg max-h-[85vh] bg-surface rounded-2xl shadow-xl border border-border",
          "flex flex-col animate-fade-in"
        )}
      >
        <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-border shrink-0">
          <h2 id="legal-modal-title" className="font-semibold text-lg">
            {doc.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-surface-hover transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <LegalDocument title="" sections={doc.sections} />
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-3 px-6 py-4 border-t border-border shrink-0">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Close
          </Button>
          {onAccept && (
            <Button className="flex-1" onClick={onAccept}>
              I agree
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
