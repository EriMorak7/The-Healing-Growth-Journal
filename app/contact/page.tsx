import React from "react";
import { Mail, Clock, MessageSquareQuote } from "lucide-react";
import ContactForm from "@/components/ContactForm";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata = {
  title: "Contact & Gentle Letters",
  description:
    "Get in touch with Glory and The Healing and Growth Journal. Questions, reflections, and heartfelt notes are welcomed.",
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-16">
      {/* Editorial Header */}
      <div className="text-center space-y-4 border-b border-[#EAE0D1] pb-10">
        <span className="text-xs uppercase tracking-[0.25em] text-[#866746] font-semibold">
          Get in Touch
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#22160D] tracking-tight">
          Letters to the Journal
        </h1>
        <p className="text-base sm:text-lg font-editorial text-[#4F3925] leading-relaxed max-w-xl mx-auto">
          Whether you want to share how a piece touched you, ask a question regarding our digital journals, or simply say hello.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        {/* Left Column: Guidelines & Contact Details */}
        <div className="md:col-span-5 space-y-8">
          <div className="paper-card p-6 space-y-4">
            <h3 className="font-serif text-lg text-[#22160D]">
              What You Can Write About
            </h3>
            <ul className="text-xs font-sans text-[#4F3925] space-y-2.5 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="text-[#283E2C] font-bold">•</span>
                <span>Feedback on essays, Sunday letters, or journal prompts.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#283E2C] font-bold">•</span>
                <span>Questions regarding digital journal purchases or download delivery.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#283E2C] font-bold">•</span>
                <span>Collaborations, podcast inquiries, or publishing opportunities.</span>
              </li>
            </ul>
          </div>

          <div className="p-6 bg-[#F4ECE0]/70 border border-[#E6DCCE] rounded-sm space-y-3">
            <div className="flex items-center gap-2 text-[#283E2C]">
              <Clock className="w-4 h-4" />
              <h4 className="text-xs uppercase tracking-wider font-semibold">
                Gentle Response Pace
              </h4>
            </div>
            <p className="text-xs text-[#6A4F35] leading-relaxed">
              We practice intentional presence and slow correspondence. Glory personally reads all incoming letters and typically responds within 2–4 business days.
            </p>
          </div>

          <div className="p-6 border border-[#EAE0D1] rounded-sm space-y-2">
            <span className="text-[10px] uppercase tracking-widest font-semibold text-[#866746]">
              Direct Email
            </span>
            <p className="font-serif text-base text-[#22160D]">
              {SITE_CONFIG.contactEmail}
            </p>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="md:col-span-7 paper-card p-8 sm:p-10">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
