"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit.");
      }

      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "An unexpected error occurred. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="p-8 bg-[#E5EDE6] border border-[#283E2C] rounded-sm text-center space-y-4 animate-in fade-in duration-300">
        <CheckCircle2 className="w-12 h-12 text-[#283E2C] mx-auto" />
        <h3 className="font-serif text-2xl text-[#283E2C]">Message Received</h3>
        <p className="text-sm font-sans text-[#283E2C] max-w-md mx-auto leading-relaxed">
          Thank you for reaching out with your heart and thoughts. Glory reads each note thoughtfully and will reply as soon as possible.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-4 px-6 py-2 text-xs uppercase tracking-widest font-semibold text-[#283E2C] border border-[#283E2C] rounded-sm hover:bg-[#283E2C] hover:text-[#FAF7F2] transition-colors"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status === "error" && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs rounded-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label
            htmlFor="name"
            className="block text-xs uppercase tracking-wider font-semibold text-[#866746]"
          >
            Your Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="How may we address you?"
            className="w-full px-4 py-3 text-sm bg-[#FAF7F2] border border-[#D3BEA1] rounded-sm text-[#22160D] focus:outline-none focus:border-[#283E2C]"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-xs uppercase tracking-wider font-semibold text-[#866746]"
          >
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="where to send our reply"
            className="w-full px-4 py-3 text-sm bg-[#FAF7F2] border border-[#D3BEA1] rounded-sm text-[#22160D] focus:outline-none focus:border-[#283E2C]"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="subject"
          className="block text-xs uppercase tracking-wider font-semibold text-[#866746]"
        >
          Subject
        </label>
        <input
          id="subject"
          type="text"
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          placeholder="e.g. Sunday letters feedback, question about journals, collaboration"
          className="w-full px-4 py-3 text-sm bg-[#FAF7F2] border border-[#D3BEA1] rounded-sm text-[#22160D] focus:outline-none focus:border-[#283E2C]"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="message"
          className="block text-xs uppercase tracking-wider font-semibold text-[#866746]"
        >
          Your Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          required
          rows={6}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Take all the space you need..."
          className="w-full px-4 py-3 text-sm bg-[#FAF7F2] border border-[#D3BEA1] rounded-sm text-[#22160D] focus:outline-none focus:border-[#283E2C] leading-relaxed"
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-4 text-xs uppercase tracking-widest font-semibold rounded-sm bg-[#283E2C] text-[#FAF7F2] hover:bg-[#1D2D20] transition-colors flex items-center justify-center gap-2 disabled:opacity-75 shadow-sm"
      >
        <Send className="w-4 h-4" />
        <span>{status === "loading" ? "Sending..." : "Send Note"}</span>
      </button>
    </form>
  );
}
