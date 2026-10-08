"use client";

import React, { useState } from "react";
import { formatDate } from "@/lib/utils";
import {
  Mail,
  MailOpen,
  Trash2,
  CheckCircle2,
  Clock,
  Eye,
  X,
  Filter,
} from "lucide-react";

interface ContactItem {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: string | Date;
}

interface ContactsManagerProps {
  initialSubmissions: ContactItem[];
}

export default function ContactsManager({
  initialSubmissions,
}: ContactsManagerProps) {
  const [submissions, setSubmissions] = useState<ContactItem[]>(initialSubmissions);
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);
  const [activeMessage, setActiveMessage] = useState<ContactItem | null>(null);

  const filtered = submissions.filter((s) => !filterUnreadOnly || !s.isRead);

  const handleToggleRead = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: !currentStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, isRead: !currentStatus } : s))
      );

      if (activeMessage?.id === id) {
        setActiveMessage({ ...activeMessage, isRead: !currentStatus });
      }
    } catch (err: any) {
      alert(err.message || "Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this contact message?")) return;

    try {
      const res = await fetch(`/api/admin/contacts/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete message");

      setSubmissions((prev) => prev.filter((s) => s.id !== id));
      if (activeMessage?.id === id) {
        setActiveMessage(null);
      }
    } catch (err: any) {
      alert(err.message || "Failed to delete message");
    }
  };

  const handleOpenDetail = (item: ContactItem) => {
    setActiveMessage(item);
    if (!item.isRead) {
      handleToggleRead(item.id, false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="paper-card p-4 flex items-center justify-between">
        <span className="text-xs text-[#866746] font-medium">
          Showing {filtered.length} of {submissions.length} message{submissions.length === 1 ? "" : "s"}
        </span>

        <button
          type="button"
          onClick={() => setFilterUnreadOnly(!filterUnreadOnly)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm text-xs uppercase tracking-wider font-semibold border transition-all ${
            filterUnreadOnly
              ? "bg-[#283E2C] text-[#FAF7F2] border-[#283E2C]"
              : "bg-[#FAF7F2] text-[#4F3925] border-[#D3BEA1] hover:bg-[#EAE0D1]"
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Unread Only</span>
        </button>
      </div>

      {/* Submissions List */}
      <div className="paper-card overflow-hidden divide-y divide-[#EAE0D1]/80">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#866746]">
            No messages found.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                !item.isRead ? "bg-[#F7EBE4]/30" : "hover:bg-[#F4ECE0]/30"
              }`}
            >
              <div
                className="space-y-1 flex-1 min-w-0 cursor-pointer"
                onClick={() => handleOpenDetail(item)}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`font-serif text-sm font-semibold ${
                      !item.isRead ? "text-[#22160D]" : "text-[#4F3925]"
                    }`}
                  >
                    {item.name}
                  </span>
                  {!item.isRead && (
                    <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold rounded-sm bg-[#FFEDD5] text-[#C2410C]">
                      New
                    </span>
                  )}
                  <span className="text-[11px] text-[#866746]">
                    • {item.email}
                  </span>
                </div>

                <div className="text-xs font-medium text-[#283E2C] truncate">
                  {item.subject || "General Inquiry"}
                </div>

                <p className="text-xs text-[#6A4F35] line-clamp-1 leading-relaxed">
                  {item.message}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0 pt-2 sm:pt-0">
                <span className="text-[11px] text-[#A3845F] whitespace-nowrap">
                  {formatDate(item.createdAt)}
                </span>

                <button
                  type="button"
                  onClick={() => handleToggleRead(item.id, item.isRead)}
                  className={`p-1.5 rounded transition-colors ${
                    item.isRead
                      ? "text-[#866746] hover:bg-[#EAE0D1]"
                      : "text-[#283E2C] hover:bg-[#E5EDE6]"
                  }`}
                  title={item.isRead ? "Mark as unread" : "Mark as read"}
                >
                  {item.isRead ? (
                    <MailOpen className="w-4 h-4" />
                  ) : (
                    <Mail className="w-4 h-4" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenDetail(item)}
                  className="px-3 py-1.5 text-xs font-semibold text-[#283E2C] bg-[#E5EDE6] hover:bg-[#D4E2D6] rounded-sm transition-colors"
                >
                  View
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded text-[#A83226] hover:bg-[#FDF2F0] transition-colors"
                  title="Delete message"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Detail Modal */}
      {activeMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-[#FAF7F2] border border-[#D3BEA1] rounded-sm shadow-xl max-w-xl w-full p-6 sm:p-8 space-y-6">
            <div className="flex items-start justify-between pb-4 border-b border-[#EAE0D1]">
              <div className="space-y-1">
                <h2 className="font-serif text-xl text-[#22160D]">
                  {activeMessage.name}
                </h2>
                <a
                  href={`mailto:${activeMessage.email}`}
                  className="text-xs text-[#283E2C] underline hover:text-[#1D2D20]"
                >
                  {activeMessage.email}
                </a>
              </div>
              <button
                type="button"
                onClick={() => setActiveMessage(null)}
                className="p-1.5 rounded text-[#866746] hover:bg-[#EAE0D1]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-widest text-[#866746] font-semibold">
                Subject
              </span>
              <p className="text-sm font-semibold text-[#22160D]">
                {activeMessage.subject || "No subject provided"}
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-widest text-[#866746] font-semibold">
                Message Content
              </span>
              <div className="p-4 bg-[#F4ECE0]/50 rounded-sm border border-[#EAE0D1] text-xs font-sans text-[#362618] leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                {activeMessage.message}
              </div>
            </div>

            <div className="text-[11px] text-[#866746]">
              Received on {formatDate(activeMessage.createdAt)}
            </div>

            <div className="pt-4 border-t border-[#EAE0D1] flex justify-between items-center">
              <button
                type="button"
                onClick={() => handleDelete(activeMessage.id)}
                className="inline-flex items-center gap-1.5 text-xs text-[#A83226] hover:underline"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Message</span>
              </button>

              <div className="flex items-center gap-3">
                <a
                  href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(activeMessage.subject || "Your message to The Healing & Growth Journal")}`}
                  className="px-4 py-2 bg-[#283E2C] text-[#FAF7F2] rounded-sm text-xs uppercase tracking-wider font-semibold hover:bg-[#1D2D20]"
                >
                  Reply via Email
                </a>
                <button
                  type="button"
                  onClick={() => setActiveMessage(null)}
                  className="px-4 py-2 border border-[#D3BEA1] rounded-sm text-xs font-semibold text-[#4F3925] hover:bg-[#EAE0D1]"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
