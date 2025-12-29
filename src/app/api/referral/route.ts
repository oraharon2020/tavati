import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// GET - Get or create referral code for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get("phone");
    
    if (!phone) {
      return NextResponse.json({ error: "מספר טלפון חסר" }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    
    // Check if user already has a referral code
    const { data: existing } = await supabase
      .from("referral_codes")
      .select("*")
      .eq("phone", phone)
      .single();

    if (existing) {
      return NextResponse.json({ 
        referralCode: existing.code,
        referralCount: existing.referral_count,
        totalEarnings: existing.total_earnings
      });
    }

    // Create new referral code
    const code = `REF${nanoid(6).toUpperCase()}`;
    
    const { data: newCode, error } = await supabase
      .from("referral_codes")
      .insert({
        phone,
        code,
        referral_count: 0,
        total_earnings: 0,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      referralCode: newCode.code,
      referralCount: 0,
      totalEarnings: 0
    });

  } catch (error) {
    console.error("Referral code error:", error);
    return NextResponse.json({ error: "שגיאה ביצירת קוד הפניה" }, { status: 500 });
  }
}

// POST - Track referral usage
export async function POST(request: NextRequest) {
  try {
    const { referralCode, newUserPhone, sessionId } = await request.json();
    
    if (!referralCode || !newUserPhone) {
      return NextResponse.json({ error: "פרטים חסרים" }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    
    // Get the referral code info
    const { data: referrer, error: fetchError } = await supabase
      .from("referral_codes")
      .select("*")
      .eq("code", referralCode.toUpperCase())
      .single();

    if (fetchError || !referrer) {
      return NextResponse.json({ error: "קוד הפניה לא תקף" }, { status: 400 });
    }

    // Make sure user isn't referring themselves
    if (referrer.phone === newUserPhone) {
      return NextResponse.json({ error: "לא ניתן להפנות את עצמך" }, { status: 400 });
    }

    // Check if this user already used a referral code
    const { data: existingUsage } = await supabase
      .from("referral_usage")
      .select("id")
      .eq("referred_phone", newUserPhone)
      .single();

    if (existingUsage) {
      return NextResponse.json({ 
        success: true, 
        message: "כבר השתמשת בקוד הפניה בעבר",
        discount: 0
      });
    }

    // Log the referral usage
    await supabase.from("referral_usage").insert({
      referral_code: referralCode.toUpperCase(),
      referrer_phone: referrer.phone,
      referred_phone: newUserPhone,
      session_id: sessionId,
      status: "pending", // Will become "completed" after payment
    });

    // The referred user gets 10% discount
    return NextResponse.json({ 
      success: true,
      discount: 10, // 10% off
      message: "קיבלת 10% הנחה בזכות הפניה!"
    });

  } catch (error) {
    console.error("Referral tracking error:", error);
    return NextResponse.json({ error: "שגיאה בעיבוד ההפניה" }, { status: 500 });
  }
}

// PUT - Complete referral (after payment)
export async function PUT(request: NextRequest) {
  try {
    const { referralCode, referredPhone } = await request.json();
    
    const supabase = getSupabaseClient();
    
    // Update referral usage status
    await supabase
      .from("referral_usage")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("referral_code", referralCode.toUpperCase())
      .eq("referred_phone", referredPhone);

    // Update referrer stats (add 10 NIS credit)
    const creditAmount = 10;
    await supabase.rpc("increment_referral_stats", {
      referral_code: referralCode.toUpperCase(),
      credit_amount: creditAmount
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Referral completion error:", error);
    return NextResponse.json({ error: "שגיאה בהשלמת ההפניה" }, { status: 500 });
  }
}
