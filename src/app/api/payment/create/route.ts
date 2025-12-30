import { NextRequest, NextResponse } from "next/server";

// Meshulam API configuration
const MESHULAM_API_URL = process.env.MESHULAM_API_URL || "https://sandbox.meshulam.co.il/api/light/server/1.0";
const MESHULAM_PAGE_CODE = process.env.MESHULAM_PAGE_CODE || "";
const MESHULAM_USER_ID = process.env.MESHULAM_USER_ID || "";
const MESHULAM_API_KEY = process.env.MESHULAM_API_KEY || "";

interface CreatePaymentRequest {
  sessionId: string;
  amount: number;
  description: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
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
      customerEmail,
      customerPhone,
      successUrl,
      cancelUrl,
    } = body;

    if (!sessionId || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Build Meshulam payment request
    const paymentData = {
      pageCode: MESHULAM_PAGE_CODE,
      userId: MESHULAM_USER_ID,
      apiKey: MESHULAM_API_KEY,
      sum: amount,
      description: description || "כתב תביעה - תבעתי",
      pageField: JSON.stringify({
        fullName: customerName || "",
        email: customerEmail || "",
        phone: customerPhone || "",
      }),
      // Custom fields to pass session info
      cField1: sessionId,
      // Redirect URLs after payment
      successUrl: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/chat?payment=success`,
      cancelUrl: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/chat?payment=cancelled`,
      // Webhook for server notification
      notifyUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/webhook`,
    };

    // Call Meshulam API to create payment page
    const response = await fetch(`${MESHULAM_API_URL}/createPaymentProcess`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paymentData),
    });

    const result = await response.json();

    if (result.status === "1" || result.status === 1) {
      // Success - return payment URL
      return NextResponse.json({
        success: true,
        paymentUrl: result.data?.url || result.url,
        processId: result.data?.processId || result.processId,
      });
    } else {
      console.error("Meshulam API error:", result);
      return NextResponse.json(
        { 
          error: "Payment creation failed", 
          details: result.err?.message || result.message 
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
