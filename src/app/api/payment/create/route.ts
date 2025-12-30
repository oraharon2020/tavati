import { NextRequest, NextResponse } from "next/server";

// Grow/Meshulam API configuration
const MESHULAM_API_URL = process.env.MESHULAM_API_URL || "https://sandbox.meshulam.co.il/api/light/server/1.0";
const MESHULAM_PAGE_CODE = process.env.MESHULAM_PAGE_CODE || "";
const MESHULAM_USER_ID = process.env.MESHULAM_USER_ID || "";

interface CreatePaymentRequest {
  sessionId: string;
  amount: number;
  description?: string;
  customerName: string;  // Required - must be full name (first + last)
  customerPhone: string; // Required - Israeli phone starting with 05
  customerEmail?: string;
  successUrl?: string;
  cancelUrl?: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: CreatePaymentRequest = await req.json();
    
    const {
      sessionId,
      amount,
      description,
      customerName,
      customerPhone,
      customerEmail,
      successUrl,
      cancelUrl,
    } = body;

    if (!sessionId || !amount || !customerName || !customerPhone) {
      return NextResponse.json(
        { error: "Missing required fields: sessionId, amount, customerName, customerPhone" },
        { status: 400 }
      );
    }

    // Validate phone number (Israeli mobile: 05xxxxxxxx)
    const phoneRegex = /^05\d{8}$/;
    if (!phoneRegex.test(customerPhone.replace(/-/g, ""))) {
      return NextResponse.json(
        { error: "Invalid phone number. Must be Israeli mobile (05xxxxxxxx)" },
        { status: 400 }
      );
    }

    // Validate full name (must have at least 2 parts)
    if (customerName.trim().split(/\s+/).length < 2) {
      return NextResponse.json(
        { error: "Full name must contain first and last name" },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.tavati.app";

    // Build Grow/Meshulam payment request using form data format
    const formData = new FormData();
    formData.append("pageCode", MESHULAM_PAGE_CODE);
    formData.append("userId", MESHULAM_USER_ID);
    formData.append("sum", amount.toString());
    formData.append("description", description || "כתב תביעה - תבעתי");
    formData.append("successUrl", successUrl || `${appUrl}/chat?payment=success&session=${sessionId}`);
    formData.append("cancelUrl", cancelUrl || `${appUrl}/chat?payment=cancelled`);
    formData.append("notifyUrl", `${appUrl}/api/payment/webhook`);
    
    // Required customer fields
    formData.append("pageField[fullName]", customerName);
    formData.append("pageField[phone]", customerPhone.replace(/-/g, ""));
    if (customerEmail) {
      formData.append("pageField[email]", customerEmail);
    }
    
    // Custom field for session tracking
    formData.append("cField1", sessionId);

    // Call Grow API to create payment page
    const response = await fetch(`${MESHULAM_API_URL}/createPaymentProcess`, {
      method: "POST",
      body: formData,
    });

    const result = await response.json();

    console.log("Grow API response:", JSON.stringify(result, null, 2));

    // Check for success (status can be 1 or "1")
    if (result.status === 1 || result.status === "1") {
      // Success - return payment URL
      return NextResponse.json({
        success: true,
        paymentUrl: result.data?.url,
        processId: result.data?.processId,
        processToken: result.data?.processToken,
      });
    } else {
      console.error("Grow API error:", result);
      return NextResponse.json(
        { 
          error: "Payment creation failed", 
          details: result.err?.message || result.message || "Unknown error",
          code: result.err?.id
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error("Create payment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
