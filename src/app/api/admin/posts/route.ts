import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createClient } from "@supabase/supabase-js";

function getSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing Supabase credentials");
  return createClient(url, key);
}

// GET - fetch all posts (admin)
export async function GET() {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = getSupabaseClient();
    const { data: posts, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ posts: posts || [] });
  } catch (error) {
    console.error("Posts fetch error:", error);
    return NextResponse.json({ error: "שגיאה בטעינת הפוסטים" }, { status: 500 });
  }
}

// Helper to create URL-safe slug
function createSlug(title: string): string {
  // Keep Hebrew letters, numbers, and convert spaces to hyphens
  return title
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\u0590-\u05FFa-zA-Z0-9-]/g, "") // Keep Hebrew, English, numbers, hyphens
    .replace(/-+/g, "-") // Remove multiple hyphens
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

// POST - create new post
export async function POST(request: NextRequest) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { title, slug, excerpt, content, published } = await request.json();

    if (!title || !content) {
      return NextResponse.json({ error: "כותרת ותוכן הם שדות חובה" }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .insert({
        title,
        slug: slug || createSlug(title),
        excerpt: excerpt || "",
        content,
        published: published || false,
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ post: data });
  } catch (error) {
    console.error("Post create error:", error);
    return NextResponse.json({ error: "שגיאה ביצירת הפוסט" }, { status: 500 });
  }
}

// PUT - update post
export async function PUT(request: NextRequest) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, title, slug, excerpt, content, published } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "מזהה פוסט חסר" }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("blog_posts")
      .update({
        title,
        slug,
        excerpt,
        content,
        published,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ post: data });
  } catch (error) {
    console.error("Post update error:", error);
    return NextResponse.json({ error: "שגיאה בעדכון הפוסט" }, { status: 500 });
  }
}

// DELETE - delete post
export async function DELETE(request: NextRequest) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "מזהה פוסט חסר" }, { status: 400 });
    }

    const supabase = getSupabaseClient();
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Post delete error:", error);
    return NextResponse.json({ error: "שגיאה במחיקת הפוסט" }, { status: 500 });
  }
}
