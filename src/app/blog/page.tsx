import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "בלוג | תבעתי - מאמרים על תביעות קטנות",
  description: "מאמרים, מדריכים וטיפים על תביעות קטנות בישראל. למדו איך להגיש תביעה, מה הזכויות שלכם, ואיך להתכונן לדיון.",
};

async function getPosts() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, excerpt, created_at")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return posts || [];
}

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">בלוג</h1>
          <p className="text-neutral-600">מאמרים ומדריכים על תביעות קטנות בישראל</p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12 text-neutral-500">
            עוד לא פורסמו מאמרים. חזרו בקרוב!
          </div>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="block p-6 bg-white border border-neutral-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all"
              >
                <h2 className="text-xl font-bold text-neutral-900 mb-2 hover:text-blue-600">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-neutral-600 mb-3 line-clamp-2">{post.excerpt}</p>
                )}
                <time className="text-sm text-neutral-400">
                  {new Date(post.created_at).toLocaleDateString("he-IL", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export const revalidate = 60; // Revalidate every 60 seconds
