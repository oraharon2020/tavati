"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PenTool, CheckCircle } from "lucide-react";
import SignaturePad from "./SignaturePad";

interface SignatureRequestProps {
  onSignatureSaved: (signature: string) => void;
  documentName?: string;
}

export default function SignatureRequest({ onSignatureSaved, documentName = "המסמך" }: SignatureRequestProps) {
  const [showPad, setShowPad] = useState(false);
  const [signed, setSigned] = useState(false);
  const [savedSignature, setSavedSignature] = useState<string | null>(null);

  const handleSave = (signatureDataUrl: string) => {
    setSavedSignature(signatureDataUrl);
    setSigned(true);
    setShowPad(false);
    onSignatureSaved(signatureDataUrl);
  };

  if (signed && savedSignature) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="font-semibold text-emerald-800">החתימה נשמרה בהצלחה!</p>
            <p className="text-sm text-emerald-600">החתימה תתווסף ל{documentName}</p>
          </div>
        </div>
        <div className="bg-white rounded-lg p-3 border border-emerald-100">
          <img 
            src={savedSignature} 
            alt="החתימה שלך" 
            className="max-h-16 mx-auto"
          />
        </div>
        <button
          onClick={() => {
            setSigned(false);
            setShowPad(true);
          }}
          className="mt-3 text-sm text-emerald-600 hover:text-emerald-700 underline"
        >
          לחתום מחדש
        </button>
      </motion.div>
    );
  }

  if (showPad) {
    return (
      <SignaturePad
        onSave={handleSave}
        onCancel={() => setShowPad(false)}
        title={`חתימה על ${documentName}`}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-50 to-emerald-50 border border-blue-200 rounded-2xl p-4"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
          <PenTool className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-neutral-800 mb-1">נדרשת חתימה</p>
          <p className="text-sm text-neutral-600 mb-3">
            לפני הורדת {documentName}, יש לחתום דיגיטלית. החתימה תופיע במסמך הסופי.
          </p>
          <button
            onClick={() => setShowPad(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-xl font-medium hover:shadow-md transition-all"
          >
            <PenTool className="w-4 h-4" />
            לחץ לחתימה
          </button>
        </div>
      </div>
    </motion.div>
  );
}
