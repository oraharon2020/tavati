import { NextRequest, NextResponse } from "next/server";
import { supabase, getSessionByPhone, createSession } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { phone, otp } = await request.json();

    if (!phone || !otp) {
      return NextResponse.json(
        { success: false, error: "חסרים פרטים" },
        { status: 400 }
      );
    }

    // Get stored OTP from database
    const { data: otpRecord, error: otpError } = await supabase
      .from("otp_codes")
      .select("*")
      .eq("phone", phone)
      .single();

    if (otpError || !otpRecord) {
      return NextResponse.json(
        { success: false, error: "לא נמצא קוד - נסה לשלוח שוב" },
        { status: 400 }
      );
    }

    // Check if OTP expired
    if (new Date(otpRecord.expires_at) < new Date()) {
      // Delete expired OTP
      await supabase.from("otp_codes").delete().eq("phone", phone);
      return NextResponse.json(
        { success: false, error: "הקוד פג תוקף - נסה שוב" },
        { status: 400 }
      );
    }

    // Verify OTP
    if (otpRecord.code !== otp) {
      return NextResponse.json(
        { success: false, error: "קוד שגוי" },
        { status: 400 }
      );
    }

    // OTP verified - delete it
    await supabase.from("otp_codes").delete().eq("phone", phone);

    // Check for existing session
    let session = await getSessionByPhone(phone);
    
    // If no existing session, create new one
    if (!session) {
      session = await createSession(phone);
    }

    return NextResponse.json({ 
      success: true, 
      sessionId: session?.id || null,
      hasExistingSession: session?.messages && session.messages.length > 0
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { success: false, error: "שגיאה בשרת" },
      { status: 500 }
    );
  }
}
