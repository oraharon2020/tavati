import { NextRequest, NextResponse } from "next/server";

interface WhatsAppMessage {
  date: string;
  time: string;
  sender: string;
  message: string;
  isMedia: boolean;
}

interface ParsedWhatsApp {
  messages: WhatsAppMessage[];
  participants: string[];
  dateRange: { start: string; end: string };
  totalMessages: number;
}

// Parse WhatsApp export text file
function parseWhatsAppExport(content: string): ParsedWhatsApp {
  const lines = content.split("\n");
  const messages: WhatsAppMessage[] = [];
  const participantsSet = new Set<string>();
  
  // WhatsApp format: "DD/MM/YYYY, HH:MM - Sender: Message"
  // or: "DD.MM.YYYY, HH:MM - Sender: Message"
  const messageRegex = /^(\d{1,2}[\/\.]\d{1,2}[\/\.]\d{2,4}),?\s*(\d{1,2}:\d{2}(?::\d{2})?)\s*-\s*([^:]+):\s*(.+)$/;
  
  let currentMessage: WhatsAppMessage | null = null;
  
  for (const line of lines) {
    const match = line.match(messageRegex);
    
    if (match) {
      // Save previous message if exists
      if (currentMessage) {
        messages.push(currentMessage);
      }
      
      const [, date, time, sender, message] = match;
      const isMedia = message.includes("<מדיה לא נכללה>") || 
                      message.includes("<Media omitted>") ||
                      message.includes("תמונה") ||
                      message.includes("סרטון");
      
      currentMessage = {
        date: date.trim(),
        time: time.trim(),
        sender: sender.trim(),
        message: message.trim(),
        isMedia,
      };
      
      participantsSet.add(sender.trim());
    } else if (currentMessage && line.trim()) {
      // Continuation of previous message
      currentMessage.message += "\n" + line.trim();
    }
  }
  
  // Don't forget last message
  if (currentMessage) {
    messages.push(currentMessage);
  }
  
  const participants = Array.from(participantsSet);
  const dateRange = {
    start: messages[0]?.date || "",
    end: messages[messages.length - 1]?.date || "",
  };
  
  return {
    messages,
    participants,
    dateRange,
    totalMessages: messages.length,
  };
}

// Filter messages by keywords relevant to legal claims
function filterRelevantMessages(messages: WhatsAppMessage[]): WhatsAppMessage[] {
  const keywords = [
    // כסף ותשלום
    "שקל", "₪", "כסף", "תשלום", "שילמתי", "החזר", "פיצוי", "עלות", "מחיר",
    // בעיות
    "בעיה", "תקלה", "שבור", "פגום", "לא עובד", "נזק", "פגיעה",
    // התחייבויות
    "הבטחת", "הבטחתי", "התחייבת", "התחייבתי", "הסכם", "חוזה",
    // תלונות
    "מתלונן", "תלונה", "אכזבה", "מאוכזב", "לא מרוצה",
    // דרישות
    "דורש", "מבקש", "רוצה", "צריך",
    // זמנים
    "מתי", "תאריך", "יום", "שבוע", "חודש",
    // ביטול
    "ביטול", "לבטל", "ביטלתי",
    // אישורים
    "אישור", "אישרת", "מאשר", "הסכמתי",
  ];
  
  return messages.filter(msg => {
    const lowerMessage = msg.message.toLowerCase();
    return keywords.some(keyword => lowerMessage.includes(keyword));
  });
}

// Summarize conversation for the claim
function summarizeForClaim(parsed: ParsedWhatsApp, filtered: WhatsAppMessage[]): string {
  const summary = [];
  
  summary.push(`📱 ניתוח שיחת WhatsApp`);
  summary.push(`━━━━━━━━━━━━━━━━━━━━`);
  summary.push(`👥 משתתפים: ${parsed.participants.join(", ")}`);
  summary.push(`📅 תאריכים: ${parsed.dateRange.start} עד ${parsed.dateRange.end}`);
  summary.push(`💬 סה"כ הודעות: ${parsed.totalMessages}`);
  summary.push(`⚖️ הודעות רלוונטיות לתביעה: ${filtered.length}`);
  summary.push(``);
  
  if (filtered.length > 0) {
    summary.push(`📋 הודעות מרכזיות:`);
    summary.push(`━━━━━━━━━━━━━━━━━━━━`);
    
    // Show up to 20 most relevant messages
    const toShow = filtered.slice(0, 20);
    toShow.forEach((msg, i) => {
      summary.push(`${i + 1}. [${msg.date} ${msg.time}] ${msg.sender}:`);
      summary.push(`   "${msg.message.slice(0, 200)}${msg.message.length > 200 ? "..." : ""}"`);
    });
    
    if (filtered.length > 20) {
      summary.push(`\n... ועוד ${filtered.length - 20} הודעות רלוונטיות`);
    }
  }
  
  return summary.join("\n");
}

export async function POST(request: NextRequest) {
  try {
    const { content, filterByDates, startDate, endDate } = await request.json();
    
    if (!content) {
      return NextResponse.json(
        { success: false, error: "חסר תוכן" },
        { status: 400 }
      );
    }
    
    // Parse the WhatsApp export
    const parsed = parseWhatsAppExport(content);
    
    if (parsed.messages.length === 0) {
      return NextResponse.json({
        success: false,
        error: "לא נמצאו הודעות בקובץ. וודא שזה קובץ ייצוא מ-WhatsApp.",
      });
    }
    
    // Filter by dates if requested
    let messages = parsed.messages;
    if (filterByDates && startDate && endDate) {
      messages = messages.filter(msg => {
        // Simple date comparison (assumes DD/MM/YYYY format)
        return msg.date >= startDate && msg.date <= endDate;
      });
    }
    
    // Filter relevant messages
    const relevantMessages = filterRelevantMessages(messages);
    
    // Create summary
    const summary = summarizeForClaim(
      { ...parsed, messages },
      relevantMessages
    );
    
    // Prepare content for Claude (limited to avoid token explosion)
    const limitedMessages = relevantMessages.slice(0, 50);
    const chatContent = limitedMessages.map(msg => 
      `[${msg.date} ${msg.time}] ${msg.sender}: ${msg.message}`
    ).join("\n");
    
    return NextResponse.json({
      success: true,
      parsed: {
        participants: parsed.participants,
        dateRange: parsed.dateRange,
        totalMessages: parsed.totalMessages,
        relevantCount: relevantMessages.length,
      },
      summary,
      content: chatContent,
      allRelevantMessages: relevantMessages.map(msg => ({
        date: msg.date,
        time: msg.time,
        sender: msg.sender,
        message: msg.message,
      })),
    });
  } catch (error) {
    console.error("WhatsApp parse error:", error);
    return NextResponse.json(
      { success: false, error: "שגיאה בעיבוד הקובץ" },
      { status: 500 }
    );
  }
}
