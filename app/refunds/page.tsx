import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata = {
  title: "Refund Policy",
  description: "Refund policy for digital products at The Healing and Growth Journal.",
};

export default function RefundsPage() {
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
          Digital Product Refund Policy
        </h1>
        <p className="text-xs text-[#866746]">
          Last updated: September 2026
        </p>
      </div>

      <div className="prose prose-stone text-[#362618] font-sans text-sm leading-relaxed space-y-6">
        <div className="p-6 bg-[#F4ECE0] border border-[#E6DCCE] rounded-sm flex items-start gap-4">
          <ShieldCheck className="w-6 h-6 text-[#283E2C] shrink-0 mt-0.5" />
          <div>
            <h3 className="font-serif text-base text-[#22160D] font-bold">
              Digital Downloads Notice
            </h3>
            <p className="text-xs text-[#4F3925] mt-1 leading-relaxed">
              Because all resources on {SITE_CONFIG.name} are digital, downloadable files (PDFs, prompt guides) that are delivered immediately upon checkout, standard tangible return rules cannot apply.
            </p>
          </div>
        </div>

        <h3 className="font-serif text-lg text-[#22160D] pt-4">General Policy</h3>
        <p>
          Due to the immediate access nature of digital downloads, sales are generally non-refundable once the file download link has been accessed.
        </p>

        <h3 className="font-serif text-lg text-[#22160D] pt-4">Exceptions & Technical Issues</h3>
        <p>
          Your satisfaction and peace of mind matter deeply to us. If you encounter any of the following:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Corrupted or incomplete download files that cannot be opened.</li>
          <li>Duplicate billing or accidental duplicate purchase of the exact same guide.</li>
          <li>Inability to access your purchased files despite contacting support.</li>
        </ul>
        <p>
          Please reach out to us at{" "}
          <a href={`mailto:${SITE_CONFIG.contactEmail}`} className="underline text-[#283E2C]">
            {SITE_CONFIG.contactEmail}
          </a>{" "}
          within 7 days of purchase. We will promptly issue replacement download links or process a refund through Paystack where appropriate.
        </p>
      </div>
    </div>
  );
}
