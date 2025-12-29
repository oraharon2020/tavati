import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createClient } from "@supabase/supabase-js";

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// GET - Get reminder stats for admin
export async function GET() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabaseClient();

    // Get incomplete sessions from 24+ hours ago that haven't been reminded
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const { count: pendingReminders } = await supabase
      .from("chat_sessions")
      .select("*", { count: "exact", head: true })
      .eq("status", "in_progress")
      .is("reminder_sent", null)
      .lt("created_at", oneDayAgo.toISOString())
      .not("phone", "is", null);

    // Get recent reminder logs
    const { data: recentLogs } = await supabase
      .from("reminder_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    return NextResponse.json({
      pendingReminders: pendingReminders || 0,
      recentLogs: recentLogs || [],
    });
  } catch (error) {
    console.error("Reminders stats error:", error);
    return NextResponse.json({ error: "שגיאה בטעינת נתונים" }, { status: 500 });
  }
}

// POST - Manually trigger reminders
export async function POST() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabaseClient();

    // Get opt-out list first
    const { data: optOutList } = await supabase
      .from("sms_opt_out")
      .select("phone");
    
    const optOutPhones = new Set((optOutList || []).map(o => normalizePhone(o.phone)));

    // Get incomplete sessions from 24+ hours ago
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const { data: incompleteSessions, error } = await supabase
      .from("chat_sessions")
      .select("id, phone, created_at, claim_data, reminder_sent, reminder_count")
      .eq("status", "in_progress")
      .is("reminder_sent", null)
      .lt("created_at", oneDayAgo.toISOString())
      .not("phone", "is", null)
      .limit(50);

    if (error) throw error;

    if (!incompleteSessions || incompleteSessions.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: "No reminders to send",
        sent: 0,
        failed: 0,
        skipped: 0,
      });
    }

    const results = {
      sent: 0,
      failed: 0,
      skipped: 0,
      errors: [] as string[],
    };

    // Send reminders
    for (const session of incompleteSessions) {
      try {
        // Check if phone opted out
        if (optOutPhones.has(normalizePhone(session.phone))) {
          results.skipped++;
          continue;
        }

        // Check if already sent reminder (max 1 per user)
        if (session.reminder_count && session.reminder_count >= 1) {
          results.skipped++;
          continue;
        }

        const message = generateReminderMessage(session.claim_data);
        const smsSent = await sendSMS(session.phone, message);
        
        if (smsSent) {
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
      details: { ...results, skipped_opt_out: results.skipped },
    });

    return NextResponse.json({ 
      success: true,
      sent: results.sent,
      failed: results.failed,
      skipped: results.skipped,
    });

  } catch (error) {
    console.error("Reminder send error:", error);
    return NextResponse.json({ error: "שגיאה בשליחת תזכורות" }, { status: 500 });
  }
}

function normalizePhone(phone: string): string {
  const clean = phone.replace(/\D/g, "");
  // Normalize to 972 format
  if (clean.startsWith("0")) return "972" + clean.slice(1);
  if (clean.startsWith("972")) return clean;
  return clean;
}

function generateReminderMessage(claimData?: { topic?: string }): string {
  const topicText = claimData?.topic ? ` בנושא "${claimData.topic}"` : "";
  
  const messages = [
    `היי! 👋 התחלת תביעה${topicText} באתר תבעתי אבל לא סיימת. רוצים לעזור לך להשלים? tavati.co.il/my-area`,
    `שלום! ראינו שהתחלת תביעה${topicText} ב-תבעתי. חבל לוותר! המשיכו: tavati.co.il/my-area`,
    `תזכורת: יש לך תביעה${topicText} שמחכה לך ב-תבעתי. עוד כמה דקות והיא מוכנה! tavati.co.il/my-area`,
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

  // TextMe SMS (Israeli provider)
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
      
      // TextMe returns status 0 for success
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

  // Dev mode - just log
  console.log(`[SMS Reminder] Would send to ${phone}: ${message}`);
  return true;
}
