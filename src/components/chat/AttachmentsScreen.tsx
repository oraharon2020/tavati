"use client";

import { ArrowLeft, Plus, Loader2, FileText, File, Eye, Trash2, CheckCircle2, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Attachment } from "./types";

interface AttachmentsScreenProps {
  attachments: Attachment[];
  setAttachments: React.Dispatch<React.SetStateAction<Attachment[]>>;
  isUploading: boolean;
  attachmentInputRef: React.RefObject<HTMLInputElement | null>;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onBack: () => void;
  onDownloadWithAttachments: () => void;
}

export function AttachmentsScreen({
  attachments,
  setAttachments,
  isUploading,
  attachmentInputRef,
  onUpload,
  onBack,
  onDownloadWithAttachments,
}: AttachmentsScreenProps) {
  return (
    <div className="min-h-screen bg-[var(--background)] p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6 pt-4">
          <button
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-[var(--secondary)] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">הוספת נספחים לתביעה</h1>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <h4 className="font-bold text-blue-800 mb-2">💡 מהם נספחים?</h4>
          <p className="text-sm text-blue-700">
            נספחים הם ראיות שתומכות בתביעה: צילומי מסך של שיחות, קבלות, חשבוניות, תמונות של המוצר הפגום וכו׳.
            הם יצורפו לכתב התביעה ויוגשו לבית המשפט.
          </p>
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          ref={attachmentInputRef}
          onChange={onUpload}
          accept=".jpg,.jpeg,.png,.heic,.webp,.pdf,.doc,.docx"
          multiple
          className="hidden"
        />

        {/* Upload Button */}
        <button
          onClick={() => attachmentInputRef.current?.click()}
          disabled={isUploading}
          className="w-full mb-6 p-6 border-2 border-dashed border-[var(--border)] rounded-xl hover:border-[var(--primary)] hover:bg-[var(--secondary)] transition-all flex flex-col items-center gap-3"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-10 h-10 text-[var(--primary)] animate-spin" />
              <span className="text-[var(--muted)]">מעלה קבצים...</span>
            </>
          ) : (
            <>
              <Plus className="w-10 h-10 text-[var(--primary)]" />
              <span className="font-medium">לחץ להוספת קבצים</span>
              <span className="text-sm text-[var(--muted)]">תמונות, PDF, מסמכי Word</span>
            </>
          )}
        </button>

        {/* Attachments List */}
        {attachments.length > 0 && (
          <div className="space-y-3 mb-6">
            <h3 className="font-medium text-sm text-[var(--muted)]">נספחים שהועלו ({attachments.length}):</h3>
            {attachments.map((attachment, idx) => (
              <div
                key={idx}
                className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-3 flex items-center gap-3"
              >
                {/* Preview or icon */}
                {attachment.preview ? (
                  <img
                    src={attachment.preview}
                    alt={attachment.name}
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                ) : attachment.type?.includes("pdf") ? (
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-red-600" />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-[var(--secondary)] rounded-lg flex items-center justify-center">
                    <File className="w-6 h-6 text-[var(--muted)]" />
                  </div>
                )}
                
                {/* Name */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{attachment.name}</p>
                  <p className="text-xs text-[var(--muted)]">נספח {String.fromCharCode(1488 + idx)}</p>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2">
                  {attachment.url && (
                    <a
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg hover:bg-[var(--secondary)] transition-colors"
                      title="צפה בקובץ"
                    >
                      <Eye className="w-4 h-4 text-[var(--muted)]" />
                    </a>
                  )}
                  <button
                    onClick={() => setAttachments(prev => prev.filter((_, i) => i !== idx))}
                    className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                    title="הסר"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Suggested attachments based on claim */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-4 mb-6">
          <h3 className="font-bold mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--accent)]" />
            נספחים מומלצים לתביעה שלך:
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-[var(--muted)]">☐</span>
              צילום מסך של ההזמנה/חשבונית
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[var(--muted)]">☐</span>
              תכתובת עם הנתבע (WhatsApp/מייל)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[var(--muted)]">☐</span>
              תמונות של הפגם/נזק (אם יש)
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[var(--muted)]">☐</span>
              אישור תשלום (העברה בנקאית/כרטיס אשראי)
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onDownloadWithAttachments}
            disabled={attachments.length === 0}
            className={cn(
              "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors",
              attachments.length > 0
                ? "bg-[var(--accent)] text-white hover:opacity-90"
                : "bg-[var(--secondary)] text-[var(--muted)] cursor-not-allowed"
            )}
          >
            <Download className="w-5 h-5" />
            הורד תביעה עם {attachments.length} נספחים
          </button>
          <button
            onClick={onBack}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[var(--secondary)] rounded-xl hover:bg-[var(--border)] transition-colors"
          >
            חזרה למסך ההנחיות
          </button>
        </div>

        {/* Tip */}
        <p className="text-xs text-center text-[var(--muted)] mt-4">
          💡 טיפ: אפשר גם להדפיס את הנספחים בנפרד ולצרף אותם ידנית לתביעה
        </p>
      </div>
    </div>
  );
}
