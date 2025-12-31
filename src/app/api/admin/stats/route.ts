import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createClient } from "@supabase/supabase-js";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    throw new Error("Missing Supabase credentials");
  }
  
  return createClient(url, key);
}

export async function GET() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabaseClient();
    // Get all sessions
    const { data: sessions, error } = await supabase
      .from("chat_sessions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    // Calculate stats
    const totalSessions = sessions?.length || 0;
    const completedSessions = sessions?.filter(s => s.status === "completed").length || 0;
    const paidSessions = sessions?.filter(s => s.status === "paid").length || 0;
    
    // Revenue calculation (simulated - replace with real payment data)
    const totalRevenue = paidSessions * 79;

    // Sessions by status
    const byStatus = {
      in_progress: sessions?.filter(s => s.status === "in_progress").length || 0,
      completed: completedSessions,
      paid: paidSessions,
      pending_payment: sessions?.filter(s => s.status === "pending_payment").length || 0,
    };

    // Last 7 days activity
    const last7Days = sessions?.filter(s => {
      const created = new Date(s.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return created >= weekAgo;
    }).length || 0;

    // Today's activity
    const today = new Date().toDateString();
    const todaySessions = sessions?.filter(s => 
      new Date(s.created_at).toDateString() === today
    ).length || 0;

    return NextResponse.json({
      stats: {
        totalSessions,
        completedSessions,
        paidSessions,
        totalRevenue,
        last7Days,
        todaySessions,
        byStatus,
      },
      recentSessions: sessions?.slice(0, 50).map(s => ({
        id: s.id,
        phone: s.phone,
        status: s.status,
        currentStep: s.current_step,
        createdAt: s.created_at,
        updatedAt: s.updated_at,
        topic: s.claim_data?.claim?.type || "לא צוין",
        defendant: s.claim_data?.defendant?.name || "",
        amount: s.claim_data?.claim?.amount || 0,
        plaintiff: s.claim_data?.plaintiff?.fullName || "",
        serviceType: s.service_type || "claims",
      })),
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json(
      { error: "שגיאה בטעינת הנתונים" },
      { status: 500 }
    );
  }
}

// Get contact messages
export async function POST() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabaseClient();
    
    const { data: messages, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) throw error;

    return NextResponse.json({ messages: messages || [] });
  } catch (error) {
    console.error("Contact messages error:", error);
    return NextResponse.json(
      { error: "שגיאה בטעינת הפניות" },
      { status: 500 }
    );
  }
}
