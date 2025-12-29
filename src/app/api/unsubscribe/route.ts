import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// POST - Add phone to opt-out list
export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone || phone.length < 9) {
      return NextResponse.json({ error: "מספר טלפון לא תקין" }, { status: 400 });
    }

    // Normalize phone number
    const cleanPhone = phone.replace(/\D/g, "");
    const normalizedPhone = cleanPhone.startsWith("0") 
      ? `972${cleanPhone.slice(1)}` 
      : cleanPhone.startsWith("972") 
        ? cleanPhone 
        : `972${cleanPhone}`;

    // Insert into opt-out list (upsert to handle duplicates)
    const { error } = await supabase
      .from("sms_opt_out")
      .upsert(
        { phone: normalizedPhone, opted_out_at: new Date().toISOString() },
        { onConflict: "phone" }
      );

    if (error) throw error;

    return NextResponse.json({ 
      success: true,
      message: "הוסרת בהצלחה מרשימת התפוצה" 
    });

  } catch (error) {
    console.error("Unsubscribe error:", error);
    return NextResponse.json({ error: "שגיאה בהסרה" }, { status: 500 });
  }
}

// GET - Check if phone is opted out (for admin)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get("phone");

  if (!phone) {
    return NextResponse.json({ error: "מספר טלפון חסר" }, { status: 400 });
  }

  const cleanPhone = phone.replace(/\D/g, "");
  const normalizedPhone = cleanPhone.startsWith("0") 
    ? `972${cleanPhone.slice(1)}` 
    : cleanPhone;

  const { data } = await supabase
    .from("sms_opt_out")
    .select("*")
    .eq("phone", normalizedPhone)
    .single();

  return NextResponse.json({ 
    optedOut: !!data,
    data 
  });
}
