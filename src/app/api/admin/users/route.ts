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

    // Get unique phone numbers from chat_sessions with their details
    const { data: sessions } = await supabase
      .from("chat_sessions")
      .select("phone, created_at, service_type")
      .not("phone", "is", null)
      .order("created_at", { ascending: false });

    // Build user list with session counts
    const userMap = new Map<string, { phone: string; firstSeen: string; lastSeen: string; sessionCount: number; services: Set<string> }>();
    
    (sessions || []).forEach(s => {
      const normalizedPhone = normalizePhone(s.phone);
      if (normalizedPhone.length === 0) return;
      
      if (userMap.has(normalizedPhone)) {
        const existing = userMap.get(normalizedPhone)!;
        existing.sessionCount++;
        existing.lastSeen = s.created_at > existing.lastSeen ? s.created_at : existing.lastSeen;
        existing.firstSeen = s.created_at < existing.firstSeen ? s.created_at : existing.firstSeen;
        if (s.service_type) existing.services.add(s.service_type);
      } else {
        userMap.set(normalizedPhone, {
          phone: normalizedPhone,
          firstSeen: s.created_at,
          lastSeen: s.created_at,
          sessionCount: 1,
          services: new Set(s.service_type ? [s.service_type] : [])
        });
      }
    });

    const allUsers = Array.from(userMap.values())
      .map(u => ({ ...u, services: Array.from(u.services) }))
      .sort((a, b) => new Date(b.lastSeen).getTime() - new Date(a.lastSeen).getTime());

    const totalUniqueUsers = allUsers.length;

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

    // Active = unique users minus opted out
    const activeUsersCount = allUsers.filter(u => !optedOutPhones.has(u.phone)).length;

    return NextResponse.json({
      totalUniqueUsers,
      optedOutCount,
      activeUsersCount,
      optedOutUsers: optedOutUsers || [],
      allUsers,
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
