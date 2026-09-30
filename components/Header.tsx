"use client";

import React, { useState } from "react";
import Link from "next/navigation";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight, BookOpen, Heart } from "lucide-react";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="w-full bg-[#FAF7F2] border-b border-[#EAE0D1] sticky top-0 z-50">

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-5 border-b border-[#EAE0D1]/60">
          {/* Brand Masthead */}
          <div className="flex-1">
            <NextLink href="/" className="inline-block group">
              <span className="block text-2xl sm:text-3xl md:text-4xl font-serif tracking-tight text-[#22160D] group-hover:text-[#283E2C] transition-colors">
                The Healing & Growth Journal
              </span>
              <span className="block text-xs uppercase tracking-[0.2em] text-[#866746] font-sans mt-0.5 font-medium">
                Reflections • Grief Support • Personal Growth • Sunday Love
              </span>
            </NextLink>
          </div>

          {/* Right Action: Substack CTA & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <a
              href={SITE_CONFIG.substackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-sm bg-[#4F3925] text-[#FAF7F2] hover:bg-[#283E2C] transition-all shadow-sm hover:shadow"
            >
              <span>Join on Substack</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded text-[#4F3925] hover:bg-[#EAE0D1] transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Desktop Primary Navigation Bar */}
        <nav className="hidden md:flex items-center justify-center gap-8 py-3 text-sm font-sans tracking-wide">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
            return (
              <NextLink
                key={link.href}
                href={link.href}
                className={cn(
                  "relative py-1 text-[#4F3925] hover:text-[#283E2C] font-medium transition-colors uppercase tracking-wider text-xs",
                  isActive && "text-[#283E2C] font-semibold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#283E2C]"
                )}
              >
                {link.label}
              </NextLink>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#F4ECE0] border-b border-[#E6DCCE] px-6 py-6 space-y-4 animate-in fade-in duration-200">
          <nav className="flex flex-col space-y-3">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <NextLink
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "text-base font-serif text-[#362618] hover:text-[#283E2C] py-1 border-b border-[#E6DCCE]/50 transition-colors",
                    isActive && "text-[#283E2C] font-bold pl-2 border-l-2 border-[#283E2C]"
                  )}
                >
                  {link.label}
                </NextLink>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-[#E6DCCE]">
            <a
              href={SITE_CONFIG.substackUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 text-xs uppercase tracking-widest font-semibold rounded-sm bg-[#283E2C] text-[#FAF7F2] shadow-sm"
            >
              <span>Subscribe on Substack</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
