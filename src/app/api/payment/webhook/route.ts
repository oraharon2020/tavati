import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Grow/Meshulam API configuration
const MESHULAM_API_URL = process.env.MESHULAM_API_URL || "https://sandbox.meshulam.co.il/api/light/server/1.0";
const MESHULAM_PAGE_CODE = process.env.MESHULAM_PAGE_CODE || "";
const MESHULAM_USER_ID = process.env.MESHULAM_USER_ID || "";

// Log config on startup (without sensitive values)
console.log("[Webhook] Config loaded:", {
  API_URL: MESHULAM_API_URL,
  PAGE_CODE_SET: !!MESHULAM_PAGE_CODE,
  USER_ID_SET: !!MESHULAM_USER_ID,
});

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
  console.log("[Webhook] ====== RECEIVED PAYMENT WEBHOOK ======");
  
  try {
    const supabase = getSupabase();
    
    if (!supabase) {
      console.error("Webhook error: SUPABASE_SERVICE_ROLE_KEY is not configured in environment variables");
      // Return success to Grow to prevent retries, but log the error
      return NextResponse.json({ 
        status: 1, 
        message: "Webhook received but database not configured" 
      });
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
      transactionToken,     // טוקן העסקה
      TransactionTypeId,    // סוג תשלום (1=כרטיס, 6=ביט, 13=אפל פיי, 14=גוגל פיי)
      processId,            // מזהה התהליך
      processToken,         // טוקן התהליך
      asmachta,             // אסמכתא
      cardSuffix,           // 4 ספרות אחרונות
      cardType,             // סוג כרטיס
      cardTypeCode,         // קוד סוג כרטיס
      cardBrand,            // מותג כרטיס (visa/mastercard)
      cardBrandCode,        // קוד מותג כרטיס
      cardExp,              // תוקף כרטיס
      paymentType,          // סוג תשלום (1=רגיל, 2=תשלומים, 4=הוראת קבע)
      sum,                  // סכום
      paymentsNum,          // מספר תשלום נוכחי
      allPaymentsNum,       // סה"כ תשלומים
      firstPaymentSum,      // סכום תשלום ראשון
      periodicalPaymentSum, // סכום תשלום תקופתי
      paymentDate,          // תאריך תשלום
      description,          // תיאור
      status,               // סטטוס (1 = הצלחה)
      statusCode,           // קוד סטטוס
      fullName,             // שם הלקוח
      payerPhone,           // טלפון
      payerEmail,           // אימייל
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
          status: 'paid',
          payment_data: {
            transaction_id: transactionId,
            transaction_token: transactionToken,
            process_id: processId,
            process_token: processToken,
            asmachta: asmachta,
            amount: parseFloat(sum) || 0,
            card_suffix: cardSuffix,
            card_type: cardType,
            card_type_code: cardTypeCode,
            card_brand: cardBrand,
            card_brand_code: cardBrandCode,
            card_exp: cardExp,
            payment_type: paymentType,
            payments_num: parseInt(paymentsNum) || 1,
            all_payments_num: parseInt(allPaymentsNum) || 1,
            first_payment_sum: firstPaymentSum,
            periodical_payment_sum: periodicalPaymentSum,
            payment_date: paymentDate,
            description: description,
            customer_name: fullName,
            customer_phone: payerPhone,
            customer_email: payerEmail,
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
      // This is required by Grow - must send all webhook data back
      try {
        console.log(`[Webhook] Calling approveTransaction for transactionId: ${transactionId}`);
        await approveTransaction(data);
        console.log(`[Webhook] Transaction ${transactionId} approved successfully!`);
      } catch (approveError) {
        console.error("[Webhook] Error approving transaction:", approveError);
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

// Approve transaction function - must send ALL fields received from webhook
async function approveTransaction(webhookData: Record<string, string>) {
  const formData = new FormData();
  
  // Required auth fields
  formData.append("pageCode", MESHULAM_PAGE_CODE);
  formData.append("userId", MESHULAM_USER_ID);
  
  // All required fields from webhook data - use exact field names from Grow
  formData.append("transactionId", webhookData.transactionId || "");
  formData.append("transactionToken", webhookData.transactionToken || "");
  formData.append("transactionTypeId", webhookData.TransactionTypeId || webhookData.transactionTypeId || "1");
  formData.append("paymentType", webhookData.paymentType || "1");
  formData.append("sum", webhookData.sum || "0");
  formData.append("firstPaymentSum", webhookData.firstPaymentSum || webhookData.sum || "0");
  formData.append("periodicalPaymentSum", webhookData.periodicalPaymentSum || "0");
  formData.append("paymentsNum", webhookData.paymentsNum || "1");
  formData.append("allPaymentsNum", webhookData.allPaymentsNum || webhookData.paymentsNum || "1");
  formData.append("paymentDate", webhookData.paymentDate || new Date().toLocaleDateString('en-GB').replace(/\//g, '/'));
  formData.append("asmachta", webhookData.asmachta || "");
  formData.append("description", webhookData.description || "תביעה קטנה - tavati.app");
  formData.append("fullName", webhookData.fullName || "");
  formData.append("payerPhone", webhookData.payerPhone || "");
  formData.append("payerEmail", webhookData.payerEmail || "");
  formData.append("cardSuffix", webhookData.cardSuffix || "");
  formData.append("cardType", webhookData.cardType || "");
  formData.append("cardTypeCode", webhookData.cardTypeCode || "1");
  formData.append("cardBrand", webhookData.cardBrand || "");
  formData.append("cardBrandCode", webhookData.cardBrandCode || "3");
  formData.append("cardExp", webhookData.cardExp || "");
  formData.append("processId", webhookData.processId || "");
  formData.append("processToken", webhookData.processToken || "");

  console.log("[Webhook] Sending approveTransaction with pageCode:", MESHULAM_PAGE_CODE ? "SET" : "MISSING");
  console.log("[Webhook] Sending approveTransaction with userId:", MESHULAM_USER_ID ? "SET" : "MISSING");
  console.log("[Webhook] approveTransaction data:", {
    transactionId: webhookData.transactionId,
    processId: webhookData.processId,
    sum: webhookData.sum,
    asmachta: webhookData.asmachta,
  });

  const response = await fetch(`${MESHULAM_API_URL}/approveTransaction`, {
    method: "POST",
    body: formData,
  });

  const result = await response.json();
  console.log("[Webhook] approveTransaction response status:", response.status);
  console.log("[Webhook] approveTransaction response:", JSON.stringify(result));
  
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
