import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-8xl font-bold text-blue-600 mb-4">404</div>
        <h1 className="text-2xl font-bold text-neutral-800 mb-2">הדף לא נמצא</h1>
        <p className="text-neutral-600 mb-8">
          מצטערים, הדף שחיפשת לא קיים או שהוזז למקום אחר.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-xl font-semibold hover:opacity-90 transition-all"
          >
            לדף הבית
          </Link>
          <Link
            href="/chat"
            className="px-6 py-3 bg-white border border-neutral-200 text-neutral-700 rounded-xl font-semibold hover:bg-neutral-50 transition-all"
          >
            התחל תביעה
          </Link>
        </div>
      </div>
    </div>
  );
}
