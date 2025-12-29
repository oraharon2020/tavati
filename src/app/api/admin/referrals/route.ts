import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createClient } from "@supabase/supabase-js";

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// GET - List all referral codes and usage
export async function GET() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabaseClient();
    
    // Get referral codes
    const { data: referralCodes, error: codesError } = await supabase
      .from("referral_codes")
      .select("*")
      .order("created_at", { ascending: false });

    if (codesError) throw codesError;

    // Get referral usage
    const { data: referralUsage, error: usageError } = await supabase
      .from("referral_usage")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (usageError) throw usageError;

    return NextResponse.json({ 
      referralCodes: referralCodes || [],
      referralUsage: referralUsage || []
    });
  } catch (error) {
    console.error("Referrals fetch error:", error);
    return NextResponse.json({ error: "שגיאה בטעינת ההפניות" }, { status: 500 });
  }
}
