"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2, Eye, EyeOff, Sparkles, Loader2 } from "lucide-react";

interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

interface PostsManagerProps {
  posts: Post[];
  onSave: (post: Partial<Post>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onTogglePublish: (id: string, published: boolean) => Promise<void>;
}

export default function PostsManager({ posts, onSave, onDelete, onTogglePublish }: PostsManagerProps) {
  const [editingPost, setEditingPost] = useState<Partial<Post> | null>(null);
  const [saving, setSaving] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [generating, setGenerating] = useState(false);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("he-IL", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    });
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^א-תa-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .substring(0, 50);
  };

  const handleSave = async () => {
    if (!editingPost?.title || !editingPost?.content) return;
    setSaving(true);
    try {
      await onSave({
        ...editingPost,
        slug: editingPost.slug || generateSlug(editingPost.title),
      });
      setEditingPost(null);
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateWithAI = async () => {
    if (!aiTopic.trim()) return;
    setGenerating(true);
    try {
      const res = await fetch("/api/admin/generate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: aiTopic }),
      });
      
      if (!res.ok) throw new Error();
      
      const post = await res.json();
      setEditingPost({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        published: false,
      });
      setShowAiModal(false);
      setAiTopic("");
    } catch {
      alert("שגיאה ביצירת הפוסט. נסה שוב.");
    } finally {
      setGenerating(false);
    }
  };

  // AI Modal
  if (showAiModal) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
        <div className="p-4 border-b border-neutral-100 flex justify-between items-center">
          <h3 className="font-bold text-neutral-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            צור פוסט עם AI
          </h3>
          <button
            onClick={() => setShowAiModal(false)}
            className="text-sm text-neutral-500 hover:text-neutral-700"
          >
            ביטול
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-neutral-700">
              על מה תרצה לכתוב?
            </label>
            <input
              type="text"
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              className="w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-purple-500 text-neutral-900"
              placeholder='למשל: "איך להתכונן לדיון בתביעות קטנות"'
              disabled={generating}
            />
          </div>

          <div className="text-sm text-neutral-500">
            <p>💡 רעיונות לנושאים:</p>
            <ul className="mt-2 space-y-1 mr-4">
              <li className="cursor-pointer hover:text-purple-600" onClick={() => setAiTopic("איך להגיש תביעה קטנה נגד חברת ביטוח")}>• איך להגיש תביעה נגד חברת ביטוח</li>
              <li className="cursor-pointer hover:text-purple-600" onClick={() => setAiTopic("מה לעשות כשמוצר שקניתי התקלקל")}>• מוצר שקניתי התקלקל - מה עושים?</li>
              <li className="cursor-pointer hover:text-purple-600" onClick={() => setAiTopic("זכויות שוכר דירה בישראל")}>• זכויות שוכר דירה</li>
              <li className="cursor-pointer hover:text-purple-600" onClick={() => setAiTopic("איך לתבוע על נזקי רכוש בתביעות קטנות")}>• תביעה על נזקי רכוש</li>
            </ul>
          </div>
        </div>

        <div className="p-4 border-t border-neutral-100 flex justify-end gap-2">
          <button
            onClick={() => setShowAiModal(false)}
            className="px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            ביטול
          </button>
          <button
            onClick={handleGenerateWithAI}
            disabled={generating || !aiTopic.trim()}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                יוצר...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                צור פוסט
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Edit Mode
  if (editingPost) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
        <div className="p-4 border-b border-neutral-100 flex justify-between items-center">
          <h3 className="font-bold text-neutral-900">
            {editingPost.id ? "עריכת פוסט" : "פוסט חדש"}
          </h3>
          <button
            onClick={() => setEditingPost(null)}
            className="text-sm text-neutral-500 hover:text-neutral-700"
          >
            ביטול
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-neutral-700">כותרת</label>
            <input
              type="text"
              value={editingPost.title || ""}
              onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
              className="w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-neutral-900"
              placeholder="כותרת הפוסט"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-neutral-700">Slug (לכתובת URL)</label>
            <input
              type="text"
              value={editingPost.slug || ""}
              onChange={(e) => setEditingPost({ ...editingPost, slug: e.target.value })}
              className="w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-neutral-900 font-mono text-sm"
              placeholder="slug-של-הפוסט"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-neutral-700">תקציר (לתוצאות חיפוש)</label>
            <textarea
              value={editingPost.excerpt || ""}
              onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
              className="w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-neutral-900 resize-none"
              rows={2}
              placeholder="תיאור קצר של הפוסט (160 תווים מומלץ)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-neutral-700">תוכן (Markdown)</label>
            <textarea
              value={editingPost.content || ""}
              onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
              className="w-full p-3 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500 text-neutral-900 font-mono text-sm resize-none"
              rows={15}
              placeholder="כתוב את תוכן הפוסט כאן...

## כותרת משנית
טקסט רגיל

**טקסט מודגש**

- פריט ברשימה
- פריט נוסף"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="published"
              checked={editingPost.published || false}
              onChange={(e) => setEditingPost({ ...editingPost, published: e.target.checked })}
              className="rounded border-neutral-300"
            />
            <label htmlFor="published" className="text-sm text-neutral-700">פרסם מיד</label>
          </div>
        </div>

        <div className="p-4 border-t border-neutral-100 flex justify-end gap-2">
          <button
            onClick={() => setEditingPost(null)}
            className="px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            ביטול
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !editingPost.title || !editingPost.content}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {saving ? "שומר..." : "שמור"}
          </button>
        </div>
      </div>
    );
  }

  // List Mode
  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
      <div className="p-4 border-b border-neutral-100 flex justify-between items-center">
        <h3 className="font-bold text-neutral-900">פוסטים ({posts.length})</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAiModal(true)}
            className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            צור עם AI
          </button>
          <button
            onClick={() => setEditingPost({ published: false })}
            className="flex items-center gap-2 px-3 py-2 bg-neutral-200 text-neutral-700 text-sm rounded-lg hover:bg-neutral-300 transition-colors"
          >
            <Plus className="w-4 h-4" />
            ידני
          </button>
        </div>
      </div>

      <div className="divide-y divide-neutral-100">
        {posts.map((post) => (
          <div key={post.id} className="p-4 hover:bg-neutral-50 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-neutral-900">{post.title}</span>
                  {post.published ? (
                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full">פורסם</span>
                  ) : (
                    <span className="text-xs px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-full">טיוטה</span>
                  )}
                </div>
                <div className="text-sm text-neutral-500">/blog/{post.slug}</div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-neutral-400 ml-2">{formatDate(post.updated_at)}</span>
                <button
                  onClick={() => onTogglePublish(post.id, !post.published)}
                  className="p-2 hover:bg-neutral-200 rounded-lg transition-colors"
                  title={post.published ? "בטל פרסום" : "פרסם"}
                >
                  {post.published ? (
                    <EyeOff className="w-4 h-4 text-neutral-500" />
                  ) : (
                    <Eye className="w-4 h-4 text-neutral-500" />
                  )}
                </button>
                <button
                  onClick={() => setEditingPost(post)}
                  className="p-2 hover:bg-neutral-200 rounded-lg transition-colors"
                  title="ערוך"
                >
                  <Edit2 className="w-4 h-4 text-neutral-500" />
                </button>
                <button
                  onClick={() => {
                    if (confirm("למחוק את הפוסט?")) onDelete(post.id);
                  }}
                  className="p-2 hover:bg-red-100 rounded-lg transition-colors"
                  title="מחק"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {posts.length === 0 && (
          <div className="px-4 py-8 text-center text-neutral-500">
            אין פוסטים עדיין. צור את הפוסט הראשון!
          </div>
        )}
      </div>
    </div>
  );
}
