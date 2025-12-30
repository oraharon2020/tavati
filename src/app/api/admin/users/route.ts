import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createClient } from "@supabase/supabase-js";

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// GET - Get users stats and opt-out list
export async function GET() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabaseClient();

    // Get unique phone numbers from chat_sessions
    const { data: sessions } = await supabase
      .from("chat_sessions")
      .select("phone")
      .not("phone", "is", null);

    // Count unique phones
    const uniquePhones = new Set(
      (sessions || [])
        .map(s => normalizePhone(s.phone))
        .filter(p => p.length > 0)
    );
    const totalUniqueUsers = uniquePhones.size;

    // Get opted-out users
    const { data: optedOutUsers } = await supabase
      .from("sms_opt_out")
      .select("*")
      .order("opted_out_at", { ascending: false });

    const optedOutCount = optedOutUsers?.length || 0;

    // Count opted-out phones for accurate "active" count
    const optedOutPhones = new Set(
      (optedOutUsers || []).map(u => normalizePhone(u.phone))
    );

    // Active = unique users minus opted out (only counting those who are actually in sessions)
    let activeUsersCount = 0;
    uniquePhones.forEach(phone => {
      if (!optedOutPhones.has(phone)) {
        activeUsersCount++;
      }
    });

    return NextResponse.json({
      totalUniqueUsers,
      optedOutCount,
      activeUsersCount,
      optedOutUsers: optedOutUsers || [],
    });
  } catch (error) {
    console.error("Users stats error:", error);
    return NextResponse.json({ error: "שגיאה בטעינת נתונים" }, { status: 500 });
  }
}

// DELETE - Remove user from opt-out list (re-subscribe)
export async function DELETE(request: NextRequest) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { phone } = await request.json();
    
    if (!phone) {
      return NextResponse.json({ error: "חסר מספר טלפון" }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    const normalizedPhone = normalizePhone(phone);

    const { error } = await supabase
      .from("sms_opt_out")
      .delete()
      .eq("phone", normalizedPhone);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Remove opt-out error:", error);
    return NextResponse.json({ error: "שגיאה בהסרה" }, { status: 500 });
  }
}

function normalizePhone(phone: string): string {
  if (!phone) return "";
  const clean = phone.replace(/\D/g, "");
  // Normalize to 972 format
  if (clean.startsWith("0")) return "972" + clean.slice(1);
  if (clean.startsWith("972")) return clean;
  return clean;
}
