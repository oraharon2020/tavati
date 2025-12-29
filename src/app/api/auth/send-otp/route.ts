import { NextRequest, NextResponse } from "next/server";
import { textMeService } from "@/lib/textme";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone) {
      return NextResponse.json(
        { success: false, error: "מספר טלפון חסר" },
        { status: 400 }
      );
    }

    // Generate and send OTP via TextMe
    const result = await textMeService.sendOTP(phone);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "שגיאה בשליחת הקוד" },
        { status: 400 }
      );
    }

    // Store OTP in database with expiration (5 minutes)
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    
    // Delete any existing OTP for this phone
    await supabase
      .from("otp_codes")
      .delete()
      .eq("phone", phone);

    // Insert new OTP
    await supabase
      .from("otp_codes")
      .insert({
        phone,
        code: result.code,
        expires_at: expiresAt,
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { success: false, error: "שגיאה בשרת" },
      { status: 500 }
    );
  }
}
