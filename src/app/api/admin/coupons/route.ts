import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";

function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// GET - List all coupons
export async function GET() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabaseClient();
    const { data: coupons, error } = await supabase
      .from("coupons")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ coupons: coupons || [] });
  } catch (error) {
    console.error("Coupons fetch error:", error);
    return NextResponse.json({ error: "שגיאה בטעינת הקופונים" }, { status: 500 });
  }
}

// POST - Create new coupon
export async function POST(request: NextRequest) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { 
      code, 
      description, 
      discountType, 
      discountValue, 
      maxUses, 
      expiresAt 
    } = await request.json();

    const supabase = getSupabaseClient();
    
    // Generate code if not provided
    const couponCode = code?.toUpperCase() || `TAVATI${nanoid(6).toUpperCase()}`;

    const { data, error } = await supabase
      .from("coupons")
      .insert({
        code: couponCode,
        description: description || "",
        discount_type: discountType || "percentage",
        discount_value: discountValue || 10,
        max_uses: maxUses || null,
        used_count: 0,
        expires_at: expiresAt || null,
        active: true,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ coupon: data });
  } catch (error) {
    console.error("Coupon create error:", error);
    return NextResponse.json({ error: "שגיאה ביצירת קופון" }, { status: 500 });
  }
}

// PUT - Update coupon
export async function PUT(request: NextRequest) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, active, description, maxUses, expiresAt } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "מזהה קופון חסר" }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("coupons")
      .update({
        active,
        description,
        max_uses: maxUses,
        expires_at: expiresAt,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ coupon: data });
  } catch (error) {
    console.error("Coupon update error:", error);
    return NextResponse.json({ error: "שגיאה בעדכון קופון" }, { status: 500 });
  }
}

// DELETE - Delete coupon
export async function DELETE(request: NextRequest) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "מזהה קופון חסר" }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from("coupons")
      .delete()
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Coupon delete error:", error);
    return NextResponse.json({ error: "שגיאה במחיקת קופון" }, { status: 500 });
  }
}
