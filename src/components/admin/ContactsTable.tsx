"use client";

import { useState } from "react";
import { Search, Mail } from "lucide-react";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

interface ContactsTableProps {
  contacts: ContactMessage[];
}

export default function ContactsTable({ contacts }: ContactsTableProps) {
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("he-IL", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-neutral-100">
        <div className="relative max-w-sm">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="חיפוש לפי שם, אימייל או נושא..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-neutral-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-neutral-900"
          />
        </div>
      </div>

      {/* Messages List */}
      <div className="divide-y divide-neutral-100">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            className="p-4 hover:bg-neutral-50 transition-colors cursor-pointer"
            onClick={() => setExpandedId(expandedId === contact.id ? null : contact.id)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-neutral-900">{contact.name}</span>
                  <span className="text-xs px-2 py-0.5 bg-neutral-100 rounded-full text-neutral-600">
                    {contact.subject}
                  </span>
                </div>
                <div className="text-sm text-neutral-500">{contact.email}</div>
                {expandedId === contact.id && (
                  <div className="mt-3 p-3 bg-neutral-50 rounded-lg text-sm text-neutral-700 whitespace-pre-wrap">
                    {contact.message}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-neutral-400">{formatDate(contact.created_at)}</span>
                <a
                  href={`mailto:${contact.email}?subject=Re: ${contact.subject}`}
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 hover:bg-neutral-200 rounded-lg transition-colors"
                  title="השב במייל"
                >
                  <Mail className="w-4 h-4 text-neutral-500" />
                </a>
              </div>
            </div>
          </div>
        ))}
        {filteredContacts.length === 0 && (
          <div className="px-4 py-8 text-center text-neutral-500">
            {search ? "לא נמצאו תוצאות" : "אין פניות עדיין"}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-neutral-100 text-sm text-neutral-500">
        {filteredContacts.length} פניות
      </div>
    </div>
  );
}
