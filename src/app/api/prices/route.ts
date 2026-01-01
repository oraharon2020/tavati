import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Default prices (fallback)
const DEFAULT_PRICES = {
  claims: 79,
  parking: 39,
};

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );
}

// GET - Get current prices (public)
export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("settings")
      .select("claims_price, parking_price")
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching prices:", error);
    }

    // Return prices
    const prices = {
      claims: data?.claims_price ?? DEFAULT_PRICES.claims,
      parking: data?.parking_price ?? DEFAULT_PRICES.parking,
    };

    return NextResponse.json({ prices });
  } catch (error) {
    console.error("Error:", error);
    // Return defaults on error
    return NextResponse.json({ prices: DEFAULT_PRICES });
  }
}
