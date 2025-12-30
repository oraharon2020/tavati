import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Grow/Meshulam API configuration
const MESHULAM_API_URL = process.env.MESHULAM_API_URL || "https://sandbox.meshulam.co.il/api/light/server/1.0";
const MESHULAM_PAGE_CODE = process.env.MESHULAM_PAGE_CODE || "";
const MESHULAM_USER_ID = process.env.MESHULAM_USER_ID || "";

// Create supabase client only when keys are available
const getSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !key) {
    return null;
  }
  
  return createClient(url, key);
};

// Webhook endpoint for Grow/Meshulam payment notifications (Server-to-Server callback)
export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabase();
    
    if (!supabase) {
      console.error("Supabase not configured");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }
    
    // Parse form data (Grow sends as form-urlencoded)
    const contentType = req.headers.get("content-type") || "";
    let data: Record<string, string> = {};
    
    if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      formData.forEach((value, key) => {
        data[key] = value.toString();
      });
    } else {
      data = await req.json();
    }
    
    console.log("Payment webhook received:", JSON.stringify(data, null, 2));

    // Extract fields from Grow webhook
    // See: https://grow-il.readme.io/reference/server-response
    const {
      transactionId,        // מזהה העסקה
      processId,            // מזהה התהליך
      processToken,         // טוקן התהליך
      asmachta,             // אסמכתא
      cardSuffix,           // 4 ספרות אחרונות
      cardType,             // סוג כרטיס
      cardBrand,            // מותג כרטיס (visa/mastercard)
      paymentType,          // סוג תשלום (credit/bit/applepay/googlepay)
      sum,                  // סכום
      paymentsNum,          // מספר תשלומים
      firstPaymentSum,      // סכום תשלום ראשון
      periodicalPaymentSum, // סכום תשלום תקופתי
      status,               // סטטוס (1 = הצלחה)
      statusCode,           // קוד סטטוס
      fullName,             // שם הלקוח
      phone,                // טלפון
      email,                // אימייל
      cField1,              // שדה מותאם 1 (session_id)
    } = data;

    // Extract session_id from custom fields
    const sessionId = cField1;

    if (!sessionId) {
      console.error("No session_id (cField1) in webhook payload");
      // Still return success to Grow so they don't retry
      return NextResponse.json({ status: 1 });
    }

    // Check if payment was successful (status = 1 or "1")
    const isSuccess = status === "1" || String(status) === "1";

    if (isSuccess) {
      // Update session as paid
      const { error: updateError } = await supabase
        .from("sessions")
        .update({
          has_paid: true,
          payment_data: {
            transaction_id: transactionId,
            process_id: processId,
            process_token: processToken,
            asmachta: asmachta,
            amount: parseFloat(sum) || 0,
            card_suffix: cardSuffix,
            card_type: cardType,
            card_brand: cardBrand,
            payment_type: paymentType,
            payments_num: parseInt(paymentsNum) || 1,
            customer_name: fullName,
            customer_phone: phone,
            customer_email: email,
            paid_at: new Date().toISOString(),
          },
          updated_at: new Date().toISOString(),
        })
        .eq("id", sessionId);

      if (updateError) {
        console.error("Error updating session:", updateError);
        // Still return success to Grow
      } else {
        console.log(`Payment successful for session ${sessionId}, transaction ${transactionId}`);
      }

      // Call approve endpoint to confirm we received the webhook
      // This is required by Grow
      try {
        await approveTransaction(processId, processToken, sum);
        console.log(`Transaction ${transactionId} approved`);
      } catch (approveError) {
        console.error("Error approving transaction:", approveError);
        // Don't fail the webhook even if approve fails
      }
    } else {
      console.log(`Payment failed/pending for session ${sessionId}:`, status, statusCode);
    }

    // Grow expects status: 1 for success
    return NextResponse.json({ status: 1 });

  } catch (error) {
    console.error("Payment webhook error:", error);
    // Return success to prevent Grow from retrying
    return NextResponse.json({ status: 1 });
  }
}

// Approve transaction function
async function approveTransaction(processId: string, processToken: string, sum: string) {
  const formData = new FormData();
  formData.append("pageCode", MESHULAM_PAGE_CODE);
  formData.append("userId", MESHULAM_USER_ID);
  formData.append("processId", processId);
  formData.append("processToken", processToken);
  formData.append("sum", sum);

  const response = await fetch(`${MESHULAM_API_URL}/approveTransaction`, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();
  
  if (result.status !== 1 && result.status !== "1") {
    throw new Error(`Approve failed: ${JSON.stringify(result)}`);
  }
  
  return result;
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: "OK", 
    message: "Grow/Meshulam webhook endpoint is active" 
  });
}
