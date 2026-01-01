import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { PRICES } from "@/lib/prices";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string) {
  // Decode the URL-encoded slug
  const decodedSlug = decodeURIComponent(slug);
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", decodedSlug)
    .eq("published", true)
    .single();

  return post;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: "פוסט לא נמצא | תבעתי" };
  }

  return {
    title: `${post.title} | תבעתי`,
    description: post.excerpt || post.content.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.substring(0, 160),
      type: "article",
      publishedTime: post.created_at,
      modifiedTime: post.updated_at,
    },
  };
}

// Simple Markdown-like rendering
function renderContent(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (const line of lines) {
    key++;
    
    // Headers
    if (line.startsWith("### ")) {
      elements.push(<h3 key={key} className="text-lg font-bold mt-6 mb-2 text-neutral-900">{line.slice(4)}</h3>);
    } else if (line.startsWith("## ")) {
      elements.push(<h2 key={key} className="text-xl font-bold mt-8 mb-3 text-neutral-900">{line.slice(3)}</h2>);
    } else if (line.startsWith("# ")) {
      elements.push(<h1 key={key} className="text-2xl font-bold mt-8 mb-4 text-neutral-900">{line.slice(2)}</h1>);
    }
    // List items
    else if (line.startsWith("- ")) {
      elements.push(
        <li key={key} className="mr-4 text-neutral-700">
          {formatInline(line.slice(2))}
        </li>
      );
    }
    // Numbered list
    else if (/^\d+\.\s/.test(line)) {
      elements.push(
        <li key={key} className="mr-4 text-neutral-700 list-decimal">
          {formatInline(line.replace(/^\d+\.\s/, ""))}
        </li>
      );
    }
    // Empty line
    else if (line.trim() === "") {
      elements.push(<br key={key} />);
    }
    // Regular paragraph
    else {
      elements.push(<p key={key} className="text-neutral-700 leading-relaxed mb-2">{formatInline(line)}</p>);
    }
  }

  return elements;
}

function formatInline(text: string) {
  // Bold
  text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // Italic
  text = text.replace(/\*(.+?)\*/g, "<em>$1</em>");
  
  return <span dangerouslySetInnerHTML={{ __html: text }} />;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <main className="flex-1 max-w-3xl mx-auto px-6 py-12 w-full">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 mb-6"
        >
          <ArrowRight className="w-4 h-4" />
          חזרה לבלוג
        </Link>

        <article>
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-neutral-900 mb-4">{post.title}</h1>
            <time className="text-sm text-neutral-500">
              {new Date(post.created_at).toLocaleDateString("he-IL", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
          </header>

          <div className="prose prose-lg max-w-none">
            {renderContent(post.content)}
          </div>
        </article>

        {/* CTA */}
        <div className="mt-12 p-6 bg-blue-50 rounded-xl text-center">
          <h3 className="text-lg font-bold text-neutral-900 mb-2">רוצה להגיש תביעה קטנה?</h3>
          <p className="text-neutral-600 mb-4">צור כתב תביעה מקצועי תוך דקות, בלי עורך דין</p>
          <Link
            href="/chat"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            התחל עכשיו - ₪{PRICES.claims}
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export const revalidate = 60;
