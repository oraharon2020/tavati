import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create supabase client only when keys are available
const getSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !key) {
    return null;
  }
  
  return createClient(url, key);
};

// Webhook endpoint for Meshulam payment notifications
export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabase();
    
    if (!supabase) {
      console.error("Supabase not configured");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }
    
    const body = await req.json();
    
    console.log("Payment webhook received:", JSON.stringify(body, null, 2));

    // Meshulam sends different fields - adjust based on their documentation
    const {
      transactionId,      // מזהה העסקה
      pageCode,           // קוד דף התשלום
      status,             // סטטוס: success/failed/pending
      sum,                // סכום
      customFields,       // שדות מותאמים (נשלח את session_id כאן)
      asmachta,           // אסמכתא
      cardSuffix,         // 4 ספרות אחרונות
      paymentType,        // סוג תשלום
      numberOfPayments,   // מספר תשלומים
      description,        // תיאור
    } = body;

    // Extract session_id from custom fields
    const sessionId = customFields?.session_id || body.cField1;

    if (!sessionId) {
      console.error("No session_id in webhook payload");
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    // Check if payment was successful
    const isSuccess = status === "success" || status === "1" || body.status_code === "000";

    if (isSuccess) {
      // Update session as paid
      const { error: updateError } = await supabase
        .from("sessions")
        .update({
          has_paid: true,
          payment_data: {
            transaction_id: transactionId || asmachta,
            amount: sum,
            card_suffix: cardSuffix,
            payment_type: paymentType,
            payments: numberOfPayments,
            paid_at: new Date().toISOString(),
          },
          updated_at: new Date().toISOString(),
        })
        .eq("id", sessionId);

      if (updateError) {
        console.error("Error updating session:", updateError);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }

      console.log(`Payment successful for session ${sessionId}`);
    } else {
      console.log(`Payment failed/pending for session ${sessionId}:`, status);
    }

    // Meshulam expects a specific response format
    return NextResponse.json({ 
      status: "OK",
      message: "Webhook received successfully" 
    });

  } catch (error) {
    console.error("Payment webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Some payment providers send GET requests for verification
export async function GET(req: NextRequest) {
  return NextResponse.json({ 
    status: "OK", 
    message: "Meshulam webhook endpoint is active" 
  });
}
