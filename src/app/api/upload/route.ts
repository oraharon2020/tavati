import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const sessionId = formData.get("sessionId") as string;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const fileName = `${sessionId || "anonymous"}/${Date.now()}-${file.name}`;
    
    // Read file content
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // For text files (WhatsApp export), return the content for AI analysis
    if (file.type === "text/plain" || file.name.endsWith(".txt")) {
      const textContent = buffer.toString("utf-8");
      
      // Parse WhatsApp format and extract messages
      const parsed = parseWhatsAppExport(textContent);
      
      return NextResponse.json({
        success: true,
        type: "text",
        content: textContent,
        parsed: parsed,
        summary: parsed.summary,
        fileName: file.name,
      });
    }

    // For images/PDFs - convert to base64 data URL (works without Supabase Storage)
    // This is suitable for small files. For production with large files, set up Supabase Storage bucket.
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    // Check file size - limit to 5MB for base64 storage
    if (buffer.length > 5 * 1024 * 1024) {
      return NextResponse.json({
        success: true,
        type: "file",
        fileName: file.name,
        fileType: file.type,
        note: "הקובץ גדול מדי (מקסימום 5MB). הקובץ צוין בתיק אך לא נשמר.",
      });
    }

    return NextResponse.json({
      success: true,
      type: file.type.startsWith("image/") ? "image" : "file",
      url: dataUrl,
      fileName: file.name,
      fileType: file.type,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}

// Parse WhatsApp export format
function parseWhatsAppExport(content: string): {
  messages: Array<{
    date: string;
    time: string;
    sender: string;
    message: string;
  }>;
  participants: string[];
  summary: string;
} {
  const lines = content.split("\n");
  const messages: Array<{
    date: string;
    time: string;
    sender: string;
    message: string;
  }> = [];
  const participants = new Set<string>();

  // WhatsApp format: [DD/MM/YYYY, HH:MM:SS] Sender: Message
  // or: DD/MM/YYYY, HH:MM - Sender: Message
  const regex1 = /\[(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s*(\d{1,2}:\d{2}(?::\d{2})?)\]\s*([^:]+):\s*(.+)/;
  const regex2 = /(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s*(\d{1,2}:\d{2})\s*-\s*([^:]+):\s*(.+)/;

  for (const line of lines) {
    let match = line.match(regex1) || line.match(regex2);
    if (match) {
      const [, date, time, sender, message] = match;
      // Skip system messages
      if (!sender.includes("Messages and calls are end-to-end encrypted") &&
          !sender.includes("הודעות ושיחות מוצפנות")) {
        messages.push({ date, time, sender: sender.trim(), message: message.trim() });
        participants.add(sender.trim());
      }
    }
  }

  return {
    messages,
    participants: Array.from(participants),
    summary: `נמצאו ${messages.length} הודעות בין ${participants.size} משתתפים`,
  };
}
