"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Eraser, Check, RotateCcw } from "lucide-react";

interface SignaturePadProps {
  onSave: (signatureDataUrl: string) => void;
  onCancel?: () => void;
  title?: string;
}

export default function SignaturePad({ onSave, onCancel, title = "חתימה דיגיטלית" }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2; // Retina support
    canvas.height = rect.height * 2;
    context.scale(2, 2);

    // Set drawing style
    context.strokeStyle = "#1e3a5f";
    context.lineWidth = 2.5;
    context.lineCap = "round";
    context.lineJoin = "round";

    // Fill white background
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);

    setCtx(context);
  }, []);

  const getCoordinates = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    
    if ("touches" in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  }, []);

  const startDrawing = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!ctx) return;
    e.preventDefault();
    
    const { x, y } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasSignature(true);
  }, [ctx, getCoordinates]);

  const draw = useCallback((e: React.TouchEvent | React.MouseEvent) => {
    if (!isDrawing || !ctx) return;
    e.preventDefault();
    
    const { x, y } = getCoordinates(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  }, [isDrawing, ctx, getCoordinates]);

  const stopDrawing = useCallback(() => {
    if (!ctx) return;
    ctx.closePath();
    setIsDrawing(false);
  }, [ctx]);

  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width / 2, canvas.height / 2);
    setHasSignature(false);
  }, [ctx]);

  const saveSignature = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) return;

    // Get signature as PNG data URL
    const dataUrl = canvas.toDataURL("image/png");
    onSave(dataUrl);
  }, [hasSignature, onSave]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-neutral-200 shadow-lg overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-blue-600 to-emerald-500 text-white">
        <h3 className="font-semibold text-center">{title}</h3>
        <p className="text-xs text-white/80 text-center mt-1">חתום באמצעות האצבע או העכבר</p>
      </div>

      {/* Canvas */}
      <div className="p-4">
        <div className="relative border-2 border-dashed border-neutral-300 rounded-xl overflow-hidden bg-white">
          <canvas
            ref={canvasRef}
            className="w-full h-40 touch-none cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          
          {/* Placeholder text */}
          {!hasSignature && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-neutral-400 text-sm">חתום כאן</span>
            </div>
          )}

          {/* Signature line */}
          <div className="absolute bottom-4 left-4 right-4 border-b-2 border-neutral-300" />
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 flex gap-2">
        <button
          onClick={clearSignature}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          נקה
        </button>
        
        {onCancel && (
          <button
            onClick={onCancel}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl transition-colors"
          >
            <Eraser className="w-4 h-4" />
            ביטול
          </button>
        )}
        
        <button
          onClick={saveSignature}
          disabled={!hasSignature}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-md"
        >
          <Check className="w-4 h-4" />
          אישור
        </button>
      </div>
    </motion.div>
  );
}
