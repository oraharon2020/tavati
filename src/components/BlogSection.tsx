import { createClient } from "@supabase/supabase-js";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  created_at: string;
}

async function getRecentPosts(): Promise<Post[]> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: posts } = await supabase
      .from("blog_posts")
      .select("id, title, slug, excerpt, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(3);

    return posts || [];
  } catch {
    return [];
  }
}

export default async function BlogSection() {
  const posts = await getRecentPosts();

  if (posts.length === 0) {
    return null; // Don't show section if no posts
  }

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-2">מאמרים ומדריכים</h2>
            <p className="text-neutral-600">טיפים ומידע שימושי על תביעות קטנות</p>
          </div>
          <Link
            href="/blog"
            className="hidden md:flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            לכל המאמרים
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group bg-neutral-50 rounded-xl p-6 hover:bg-blue-50 transition-colors border border-transparent hover:border-blue-200"
            >
              <h3 className="font-bold text-neutral-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                {post.title}
              </h3>
              {post.excerpt && (
                <p className="text-sm text-neutral-600 mb-3 line-clamp-2">{post.excerpt}</p>
              )}
              <time className="text-xs text-neutral-400">
                {new Date(post.created_at).toLocaleDateString("he-IL", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </time>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
          >
            לכל המאמרים
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
