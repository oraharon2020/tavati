import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "שם, אימייל והודעה הם שדות חובה" },
        { status: 400 }
      );
    }

    // Save to database
    const { error } = await supabase.from("contact_messages").insert({
      name,
      email,
      phone: phone || null,
      subject,
      message,
      status: "new",
    });

    if (error) {
      console.error("Contact save error:", error);
      // Even if DB fails, we don't want to lose the message
      // In production, you'd also send an email notification here
    }

    // TODO: Send email notification to admin
    // await sendEmail({ to: 'admin@tavati.co.il', subject: `פנייה חדשה: ${subject}`, ... })

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact error:", error);
    return NextResponse.json(
      { error: "שגיאה בשליחת ההודעה" },
      { status: 500 }
    );
  }
}
