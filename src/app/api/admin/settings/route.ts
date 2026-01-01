import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

// Default prices
const DEFAULT_SETTINGS = {
  claims_price: 79,
  parking_price: 39,
};

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );
}

// GET - Get current settings
export async function GET(req: NextRequest) {
  const supabase = getSupabase();
  // Check admin auth
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get("admin_session");
  if (!adminCookie || adminCookie.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data, error } = await supabase
      .from("settings")
      .select("*")
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows found
      console.error("Error fetching settings:", error);
      return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
    }

    // Return settings or defaults
    const settings = data || DEFAULT_SETTINGS;
    return NextResponse.json({ settings });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// PUT - Update settings
export async function PUT(req: NextRequest) {
  const supabase = getSupabase();
  // Check admin auth
  const cookieStore = await cookies();
  const adminCookie = cookieStore.get("admin_session");
  if (!adminCookie || adminCookie.value !== "authenticated") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { claims_price, parking_price } = body;

    // Validate
    if (claims_price < 0 || parking_price < 0) {
      return NextResponse.json({ error: "Prices cannot be negative" }, { status: 400 });
    }

    // Check if settings row exists
    const { data: existing } = await supabase
      .from("settings")
      .select("id")
      .single();

    if (existing) {
      // Update existing
      const { error } = await supabase
        .from("settings")
        .update({
          claims_price,
          parking_price,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id);

      if (error) {
        console.error("Error updating settings:", error);
        return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
      }
    } else {
      // Insert new
      const { error } = await supabase.from("settings").insert({
        claims_price,
        parking_price,
      });

      if (error) {
        console.error("Error inserting settings:", error);
        return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
