import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

export async function POST(request: NextRequest) {
  const isAuth = await isAdminAuthenticated();
  if (!isAuth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { topic } = await request.json();

    if (!topic) {
      return NextResponse.json({ error: "נושא הפוסט חסר" }, { status: 400 });
    }

    const systemPrompt = `אתה כותב תוכן מקצועי בעברית עבור אתר "תבעתי" - שירות ליצירת כתבי תביעה לבית משפט לתביעות קטנות.

כתוב פוסט בלוג בנושא שיינתן לך. הפוסט צריך להיות:
- אינפורמטיבי ומועיל לקוראים
- כתוב בשפה ברורה ונגישה (לא משפטית מדי)
- מכיל טיפים מעשיים
- אורך: 400-600 מילים
- מובנה עם כותרות משנה (##)

פורמט התשובה (JSON בלבד):
{
  "title": "כותרת הפוסט",
  "excerpt": "תיאור קצר של 1-2 משפטים לתוצאות חיפוש",
  "content": "תוכן הפוסט עם ## לכותרות משנה, **להדגשה**, ו- לרשימות"
}

אל תכלול שום טקסט מחוץ ל-JSON.`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `כתוב פוסט בלוג בנושא: ${topic}`,
        },
      ],
      system: systemPrompt,
    });

    const content = response.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type");
    }

    // Parse JSON response
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not parse response");
    }

    const post = JSON.parse(jsonMatch[0]);

    // Generate slug from title
    const slug = post.title
      .replace(/[^א-תa-zA-Z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 50);

    return NextResponse.json({
      title: post.title,
      slug,
      excerpt: post.excerpt,
      content: post.content,
    });
  } catch (error) {
    console.error("AI post generation error:", error);
    return NextResponse.json(
      { error: "שגיאה ביצירת הפוסט" },
      { status: 500 }
    );
  }
}
