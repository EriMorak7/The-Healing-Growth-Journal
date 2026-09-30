import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for The Healing and Growth Journal.",
};

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-12">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#866746] hover:text-[#283E2C] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="border-b border-[#EAE0D1] pb-6 space-y-2">
        <h1 className="text-3xl sm:text-4xl font-serif text-[#22160D]">
          Terms & Conditions
        </h1>
        <p className="text-xs text-[#866746]">
          Last updated: September 2026
        </p>
      </div>

      <div className="prose prose-stone text-[#362618] font-sans text-sm leading-relaxed space-y-6">
        <p>
          Welcome to <strong>{SITE_CONFIG.name}</strong>. By accessing this website or purchasing our digital resources, you agree to comply with and be bound by the following terms.
        </p>

        <h3 className="font-serif text-lg text-[#22160D] pt-4">1. Nature of the Content</h3>
        <p>
          All writing, essays, prompts, and resources provided on this website are created for informational, reflective, and educational purposes. They represent reflections from lived experience and are not intended as clinical psychological, medical, or psychiatric diagnosis or treatment.
        </p>

        <h3 className="font-serif text-lg text-[#22160D] pt-4">2. Intellectual Property & Digital Products</h3>
        <p>
          All essays, letters, artwork, digital journals, workbooks, and prompt guides are the copyrighted intellectual property of Glory and {SITE_CONFIG.name}.
        </p>
        <p>
          When you purchase a digital journal or guide, you are granted a non-exclusive, non-transferable, single-user personal license. You may not resell, redistribute, share, modify, or upload these digital files to public platforms without explicit written permission.
        </p>

        <h3 className="font-serif text-lg text-[#22160D] pt-4">3. Governing Law</h3>
        <p>
          These terms are governed by and construed in accordance with applicable laws, with operations based in Nigeria.
        </p>
      </div>
    </div>
  );
}
