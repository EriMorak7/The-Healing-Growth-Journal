import React from "react";
import { ArrowUpRight, Mail } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

interface SubstackCtaProps {
  variant?: "inline" | "hero" | "card";
  className?: string;
  title?: string;
  description?: string;
}

export default function SubstackCta({
  variant = "inline",
  className = "",
  title = "Receive the Journal in Your Inbox",
  description = "Every week, Glory shares reflections, gentle healing notes, Sunday love letters, and guided journal prompts on Substack. Free to join.",
}: SubstackCtaProps) {
  if (variant === "card") {
    return (
      <div className={`p-8 bg-[#F4ECE0] border border-[#E6DCCE] rounded-sm text-center space-y-4 ${className}`}>
        <div className="w-10 h-10 mx-auto rounded-full bg-[#35513A] text-[#FAF7F2] flex items-center justify-center">
          <Mail className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-serif text-[#22160D]">{title}</h3>
        <p className="text-sm font-sans text-[#6A4F35] leading-relaxed max-w-md mx-auto">
          {description}
        </p>
        <div className="pt-2">
          <a
            href={SITE_CONFIG.substackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 text-xs uppercase tracking-widest font-semibold rounded-sm bg-[#283E2C] text-[#FAF7F2] hover:bg-[#35513A] transition-all shadow-sm"
          >
            <span>Subscribe on Substack</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-[#283E2C] text-[#FAF7F2] py-12 px-6 sm:px-12 rounded-sm border border-[#35513A] my-12 ${className}`}
    >
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <span className="text-xs uppercase tracking-[0.25em] text-[#A6C4AA] font-semibold">
          The Weekly Sanctuary
        </span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#FAF7F2] tracking-tight">
          {title}
        </h2>
        <p className="text-sm sm:text-base font-sans text-[#E5EDE6] max-w-xl mx-auto leading-relaxed">
          {description}
        </p>
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={SITE_CONFIG.substackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 text-xs uppercase tracking-widest font-semibold rounded-sm bg-[#FAF7F2] text-[#283E2C] hover:bg-[#EAE0D1] transition-all shadow-md"
          >
            <span>Subscribe on Substack</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
          <span className="text-xs text-[#A6C4AA]">No spam. Unsubscribe anytime.</span>
        </div>
      </div>
    </div>
  );
}
