import React from "react";
import Link from "next/link";
import { ArrowUpRight, Heart, Mail } from "lucide-react";
import { SITE_CONFIG, NAV_LINKS, FOUR_PILLARS } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="bg-[#22160D] text-[#E6DCCE] border-t border-[#362618]">
      {/* Quiet Closing Invitation Strip (Section 5.7 & 19 of Brief) */}
      <div className="bg-[#1C2B19] text-[#CBDECE] border-b border-[#283E2C] py-8 px-4 text-center">
        <div className="max-w-2xl mx-auto space-y-2">
          <p className="font-editorial italic text-xl md:text-2xl text-[#E5EDE6]">
            &ldquo;Healing is not always about moving on. Sometimes, it is about learning how to carry what changed you.&rdquo;
          </p>
          <p className="text-xs uppercase tracking-[0.2em] text-[#A6C4AA] font-sans">
            You do not have to figure everything out alone.
          </p>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand Column */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <img
                src={SITE_CONFIG.logoUrl}
                alt="Logo"
                className="w-10 h-10 rounded-full border border-[#866746] object-cover"
              />
              <h3 className="text-2xl font-serif text-[#FAF7F2] tracking-tight">
                {SITE_CONFIG.name}
              </h3>
            </div>
            <p className="text-xs uppercase tracking-[0.15em] text-[#A6C4AA] font-sans font-medium">
              {SITE_CONFIG.heroText}
            </p>
            <p className="text-sm font-sans text-[#BCA17E] leading-relaxed">
              By Glory, Counselling Psychologist. A safe space to help people understand themselves, love better, heal deeper, and grow intentionally through reflective articles, poems, and weekly Sunday letters.
            </p>
            <div className="pt-2">
              <a
                href={SITE_CONFIG.substackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-wider font-semibold text-[#CBDECE] hover:text-white transition-colors"
              >
                <span>Join {SITE_CONFIG.subscriberCount} readers on Substack</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Pillars Navigation */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#866746]">
              What We Write About
            </h4>
            <ul className="space-y-2.5 text-sm">
              {FOUR_PILLARS.map((pillar) => (
                <li key={pillar.slug}>
                  <Link
                    href={`/journal?category=${pillar.slug}`}
                    className="text-[#D3BEA1] hover:text-white transition-colors font-serif"
                  >
                    {pillar.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Navigation Links */}
          <div className="md:col-span-2 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#866746]">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[#D3BEA1] hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/prompts"
                  className="text-[#D3BEA1] hover:text-white transition-colors"
                >
                  Prompt Library
                </Link>
              </li>
            </ul>
          </div>

          {/* Substack Newsletter & Socials */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#866746]">
              Stay Connected
            </h4>
            <p className="text-xs text-[#BCA17E] leading-relaxed">
              Join thousands of readers receiving gentle reflections, Sunday letters, and guided journal prompts straight to their inbox.
            </p>
            <div className="pt-2">
              <a
                href={SITE_CONFIG.substackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs uppercase tracking-wider font-semibold rounded-sm bg-[#35513A] text-[#FAF7F2] hover:bg-[#44694A] transition-colors shadow-sm"
              >
                <span>Subscribe on Substack</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="mt-16 pt-8 border-t border-[#362618] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#866746]">
          <p>© {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/privacy" className="hover:text-[#D3BEA1] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#D3BEA1] transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/refunds" className="hover:text-[#D3BEA1] transition-colors">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
