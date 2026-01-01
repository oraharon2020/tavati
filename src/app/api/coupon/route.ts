import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Validate coupon code
export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    
    if (!code) {
      return NextResponse.json({ error: "קוד קופון חסר" }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    
    // Look up the coupon
    const { data: coupon, error } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", code.toUpperCase())
      .eq("active", true)
      .single();

    if (error || !coupon) {
      return NextResponse.json({ 
        valid: false, 
        error: "קוד קופון לא תקף" 
      });
    }

    // Check if coupon is expired
    if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
      return NextResponse.json({ 
        valid: false, 
        error: "קוד הקופון פג תוקף" 
      });
    }

    // Check usage limit
    if (coupon.max_uses && coupon.used_count >= coupon.max_uses) {
      return NextResponse.json({ 
        valid: false, 
        error: "קוד הקופון מיצה את השימושים שלו" 
      });
    }

    // Calculate discounted price
    // Import price dynamically based on service type (default to claims)
    const { PRICES } = await import("@/lib/prices");
    const originalPrice = PRICES.claims;
    let discountAmount = 0;
    let finalPrice = originalPrice;

    if (coupon.discount_type === "percentage") {
      discountAmount = Math.round(originalPrice * (coupon.discount_value / 100));
      finalPrice = originalPrice - discountAmount;
    } else if (coupon.discount_type === "fixed") {
      discountAmount = coupon.discount_value;
      finalPrice = Math.max(0, originalPrice - discountAmount);
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        description: coupon.description,
        discountType: coupon.discount_type,
        discountValue: coupon.discount_value,
        discountAmount,
        originalPrice,
        finalPrice,
      }
    });

  } catch (error) {
    console.error("Coupon validation error:", error);
    return NextResponse.json({ error: "שגיאה בבדיקת הקופון" }, { status: 500 });
  }
}

// Apply coupon (increment usage count)
export async function PUT(request: NextRequest) {
  try {
    const { code, sessionId } = await request.json();
    
    if (!code || !sessionId) {
      return NextResponse.json({ error: "פרטים חסרים" }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    
    // Increment usage count
    const { error } = await supabase.rpc("increment_coupon_usage", {
      coupon_code: code.toUpperCase()
    });

    if (error) {
      console.error("Failed to increment coupon usage:", error);
    }

    // Log the usage
    await supabase.from("coupon_usage").insert({
      coupon_code: code.toUpperCase(),
      session_id: sessionId,
      used_at: new Date().toISOString()
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Coupon apply error:", error);
    return NextResponse.json({ error: "שגיאה בשימוש בקופון" }, { status: 500 });
  }
}
