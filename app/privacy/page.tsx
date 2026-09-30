import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

export const metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for The Healing and Growth Journal.",
};

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="text-xs text-[#866746]">
          Last updated: September 2026 • Effective immediately
        </p>
      </div>

      <div className="prose prose-stone text-[#362618] font-sans text-sm leading-relaxed space-y-6">
        <p>
          At <strong>{SITE_CONFIG.name}</strong> (&ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;), we hold the sacred trust of our readers and community in the highest regard. This Privacy Policy details how we handle information collected through our website.
        </p>

        <h3 className="font-serif text-lg text-[#22160D] pt-4">1. Information We Collect</h3>
        <p>
          We only collect personal information that you voluntarily supply to us, including:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li><strong>Correspondence Data:</strong> Name, email address, and message contents when submitting our contact form.</li>
          <li><strong>Purchase Information:</strong> Name, billing details, and email when purchasing digital journals (processed securely by Paystack; we never store your full payment card number on our servers).</li>
          <li><strong>Newsletter Subscriptions:</strong> Managed directly through Substack under Substack’s independent privacy policy.</li>
        </ul>

        <h3 className="font-serif text-lg text-[#22160D] pt-4">2. How We Use Your Information</h3>
        <p>
          We use your data solely to fulfill orders, respond to your inquiries, deliver purchased digital PDF downloads, and maintain the integrity of our platform. We never sell, rent, or trade your personal data to third parties.
        </p>

        <h3 className="font-serif text-lg text-[#22160D] pt-4">3. Data Security</h3>
        <p>
          We employ standard industry safeguards, including SSL/TLS encryption, to protect your personal information during transmission.
        </p>

        <h3 className="font-serif text-lg text-[#22160D] pt-4">4. Inquiries & Data Rights</h3>
        <p>
          You may request access to, correction of, or deletion of your personal contact data at any time by emailing us at{" "}
          <a href={`mailto:${SITE_CONFIG.contactEmail}`} className="underline text-[#283E2C]">
            {SITE_CONFIG.contactEmail}
          </a>.
        </p>
      </div>
    </div>
  );
}
