import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// This endpoint cleans up old completed sessions
// Recommended: Run weekly on Sunday at 3:00 AM Israel time

export async function POST(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getSupabaseClient();

    // Delete completed/paid sessions older than 90 days
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const { data: deletedCompleted, error: errorCompleted } = await supabase
      .from("chat_sessions")
      .delete()
      .in("status", ["completed", "paid"])
      .lt("updated_at", ninetyDaysAgo.toISOString())
      .select("id");

    if (errorCompleted) {
      console.error("Error deleting completed sessions:", errorCompleted);
    }

    // Delete abandoned sessions (in_progress) older than 180 days
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setDate(sixMonthsAgo.getDate() - 180);

    const { data: deletedAbandoned, error: errorAbandoned } = await supabase
      .from("chat_sessions")
      .delete()
      .eq("status", "in_progress")
      .lt("updated_at", sixMonthsAgo.toISOString())
      .select("id");

    if (errorAbandoned) {
      console.error("Error deleting abandoned sessions:", errorAbandoned);
    }

    // Delete old reminder logs (older than 90 days)
    const { error: errorLogs } = await supabase
      .from("reminder_logs")
      .delete()
      .lt("created_at", ninetyDaysAgo.toISOString());

    if (errorLogs) {
      console.error("Error deleting old reminder logs:", errorLogs);
    }

    // Delete expired OTP codes (older than 1 day)
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const { error: errorOtp } = await supabase
      .from("otp_codes")
      .delete()
      .lt("expires_at", oneDayAgo.toISOString());

    if (errorOtp) {
      console.error("Error deleting expired OTP codes:", errorOtp);
    }

    const results = {
      completedSessionsDeleted: deletedCompleted?.length || 0,
      abandonedSessionsDeleted: deletedAbandoned?.length || 0,
      timestamp: new Date().toISOString(),
    };

    console.log("[Cleanup Cron] Results:", results);

    return NextResponse.json({ 
      success: true,
      ...results,
    });

  } catch (error) {
    console.error("Cleanup cron error:", error);
    return NextResponse.json({ error: "שגיאה בניקוי נתונים" }, { status: 500 });
  }
}

// GET - Get cleanup stats
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseClient();

  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setDate(sixMonthsAgo.getDate() - 180);

  // Count sessions that would be deleted
  const { count: completedToDelete } = await supabase
    .from("chat_sessions")
    .select("*", { count: "exact", head: true })
    .in("status", ["completed", "paid"])
    .lt("updated_at", ninetyDaysAgo.toISOString());

  const { count: abandonedToDelete } = await supabase
    .from("chat_sessions")
    .select("*", { count: "exact", head: true })
    .eq("status", "in_progress")
    .lt("updated_at", sixMonthsAgo.toISOString());

  return NextResponse.json({
    completedSessionsToDelete: completedToDelete || 0,
    abandonedSessionsToDelete: abandonedToDelete || 0,
    cleanupRules: {
      completedSessions: "90 days",
      abandonedSessions: "180 days",
    },
  });
}
