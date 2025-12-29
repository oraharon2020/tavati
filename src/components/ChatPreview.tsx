"use client";

import { useState, useEffect } from "react";

interface Message {
  id: number;
  type: "bot" | "user";
  text: string;
  delay: number;
}

const messages: Message[] = [
  { id: 1, type: "bot", text: "ברוכים הבאים ל-תבעתי, המערכת שעוזרת לכם לכתוב תביעות קטנות בקלות", delay: 0 },
  { id: 2, type: "bot", text: "נעים מאד, אני מייק ואני פה כדי להכין עבורכם כל תביעה קטנה שתרצו", delay: 1500 },
];

export default function ChatPreview() {
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);

  useEffect(() => {
    messages.forEach((msg) => {
      setTimeout(() => {
        setVisibleMessages((prev) => [...prev, msg.id]);
      }, msg.delay);
    });
  }, []);

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Clean Chat Container */}
      <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_20px_60px_-15px_rgba(59,130,246,0.25)] overflow-hidden border border-white/50">
        
        {/* Chat Messages Area */}
        <div className="min-h-[320px] p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex justify-end ${
                visibleMessages.includes(msg.id)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              } transition-all duration-500 ease-out`}
            >
              {/* Message Bubble */}
              <div className="max-w-[90%] bg-white rounded-2xl rounded-tr-sm px-5 py-4 shadow-md border border-gray-100">
                {/* Label */}
                <div className="text-xs font-bold text-blue-600 mb-2 flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 bg-blue-600 rounded-full" />
                  תבעתי
                </div>
                <p className="text-gray-800 text-sm leading-relaxed font-medium text-right">
                  {msg.text}
                </p>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {visibleMessages.length === messages.length && (
            <div className="flex justify-end opacity-100">
              <div className="bg-white rounded-2xl rounded-tr-sm px-5 py-4 shadow-md border border-gray-100">
                <div className="flex gap-1.5 items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-gray-100 px-5 py-4 flex items-center gap-3">
          <button className="w-11 h-11 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all hover:scale-105 flex-shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
          <div className="flex-1 bg-gray-50 rounded-full px-5 py-3 text-sm text-blue-600 font-semibold border-2 border-gray-100 text-right">
            כתבו כאן על מה תרצו לתבוע
          </div>
        </div>
      </div>
    </div>
  );
}
