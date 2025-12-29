import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// This endpoint should be called by a cron job (e.g., Vercel Cron, GitHub Actions)
// Recommended: Run once daily at 10:00 AM Israel time

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getSupabaseClient();

    // Find incomplete sessions from 24+ hours ago that haven't been reminded yet
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const { data: incompleteSessions, error } = await supabase
      .from("chat_sessions")
      .select("id, phone, created_at, claim_data, reminder_sent")
      .eq("status", "in_progress")
      .is("reminder_sent", null)
      .lt("created_at", oneDayAgo.toISOString())
      .not("phone", "is", null)
      .limit(50); // Process in batches

    if (error) throw error;

    if (!incompleteSessions || incompleteSessions.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: "No reminders to send",
        count: 0 
      });
    }

    const results = {
      sent: 0,
      failed: 0,
      errors: [] as string[],
    };

    // Send reminders
    for (const session of incompleteSessions) {
      try {
        const message = generateReminderMessage(session.claim_data);
        
        // Send SMS via your SMS provider (e.g., Twilio, MessageBird, etc.)
        const smsSent = await sendSMS(session.phone, message);
        
        if (smsSent) {
          // Mark as reminder sent
          await supabase
            .from("chat_sessions")
            .update({ 
              reminder_sent: new Date().toISOString(),
              reminder_count: 1
            })
            .eq("id", session.id);
          
          results.sent++;
        } else {
          results.failed++;
        }
      } catch (err) {
        results.failed++;
        results.errors.push(`Session ${session.id}: ${err}`);
      }
    }

    // Log results
    await supabase.from("reminder_logs").insert({
      type: "incomplete_claim",
      sent_count: results.sent,
      failed_count: results.failed,
      details: results,
    });

    return NextResponse.json({ 
      success: true,
      sent: results.sent,
      failed: results.failed,
    });

  } catch (error) {
    console.error("Reminder cron error:", error);
    return NextResponse.json({ error: "שגיאה בשליחת תזכורות" }, { status: 500 });
  }
}

function generateReminderMessage(claimData?: { topic?: string }): string {
  const topicText = claimData?.topic ? ` בנושא "${claimData.topic}"` : "";
  
  const messages = [
    `היי! 👋 התחלת תביעה${topicText} באתר תבעתי אבל לא סיימת. רוצים לעזור לך להשלים? הקישור שלך שמור: tavati.co.il/my-area`,
    `שלום! ראינו שהתחלת תביעה${topicText} ב-תבעתי. חבל לוותר! המשיכו מאיפה שהפסקתם: tavati.co.il/my-area`,
    `תזכורת קטנה: יש לך תביעה${topicText} שמחכה לך ב-תבעתי. עוד כמה דקות והיא מוכנה! tavati.co.il/my-area`,
  ];
  
  const baseMessage = messages[Math.floor(Math.random() * messages.length)];
  // חובה להוסיף אופציית הסרה לפי חוק הספאם
  return `${baseMessage}\n\nלהסרה: tavati.co.il/unsubscribe`;
}

async function sendSMS(phone: string, message: string): Promise<boolean> {
  const cleanPhone = phone.replace(/\D/g, "");
  // TextMe expects Israeli format without country code prefix
  const formattedPhone = cleanPhone.startsWith("972") 
    ? "0" + cleanPhone.slice(3) 
    : cleanPhone.startsWith("0") 
      ? cleanPhone 
      : "0" + cleanPhone;

  // TextMe SMS (Israeli provider) - Primary
  if (process.env.TEXTME_USERNAME && process.env.TEXTME_TOKEN) {
    try {
      const response = await fetch("https://www.sms4free.co.il/ApiSMS/v2/SendSMS", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: process.env.TEXTME_USERNAME,
          token: process.env.TEXTME_TOKEN,
          source: process.env.TEXTME_SOURCE || "תבעתי",
          destination: formattedPhone,
          text: message,
        }),
      });
      
      const result = await response.json();
      console.log("[TextMe SMS] Response:", result);
      
      return result.status === 0 || response.ok;
    } catch (error) {
      console.error("[TextMe SMS] Error:", error);
      return false;
    }
  }

  // Twilio (fallback)
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    try {
      const intlPhone = cleanPhone.startsWith("0") 
        ? `972${cleanPhone.slice(1)}` 
        : cleanPhone;
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
        {
          method: "POST",
          headers: {
            "Authorization": `Basic ${Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString("base64")}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            To: `+${intlPhone}`,
            From: process.env.TWILIO_PHONE_NUMBER || "",
            Body: message,
          }),
        }
      );
      
      return response.ok;
    } catch {
      return false;
    }
  }

  // No SMS provider configured - log only
  console.log(`[SMS Reminder] Would send to ${phone}: ${message}`);
  return true; // Return true in dev mode
}

// GET - Get reminder stats (for admin)
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseClient();

  // Get incomplete sessions count
  const { count: incompleteCount } = await supabase
    .from("chat_sessions")
    .select("*", { count: "exact", head: true })
    .eq("status", "in_progress")
    .is("reminder_sent", null);

  // Get recent reminder logs
  const { data: recentLogs } = await supabase
    .from("reminder_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  return NextResponse.json({
    pendingReminders: incompleteCount || 0,
    recentLogs: recentLogs || [],
  });
}
