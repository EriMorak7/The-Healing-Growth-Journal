"use client";

import React, { useState, useEffect, useRef } from "react";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight, Feather } from "lucide-react";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const lastScrollY = useRef(0);
  const pathname = usePathname();

  // Close mobile menu on pathname change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Dynamic scroll listener: tracks scroll depth, compact mode, and smart hide/reveal
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 1. Calculate reading scroll progress percentage
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (currentScrollY / totalHeight) * 100)));
      }

      // 2. Compact mode when scrolled past top hero threshold
      setIsScrolled(currentScrollY > 30);

      // 3. Smart Hide/Reveal:
      // Always visible at the top
      if (currentScrollY < 60) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 160) {
        // Scrolling down past threshold -> hide navbar to maximize reading room
        if (!mobileMenuOpen) {
          setIsVisible(false);
        }
      } else if (currentScrollY < lastScrollY.current) {
        // Scrolling up -> instantly reveal navbar
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileMenuOpen]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out",
        isVisible ? "translate-y-0" : "-translate-y-full",
        isScrolled
          ? "bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#EAE0D1] shadow-sm py-2 sm:py-2.5"
          : "bg-[#FAF7F2] border-b border-[#EAE0D1] py-3 sm:py-4"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Mode: Single Unified Nav Bar */}
        {isScrolled ? (
          <div className="flex items-center justify-between gap-4 h-12">
            {/* Compact Brand Identity */}
            <NextLink
              href="/"
              className="inline-flex items-center gap-2.5 group shrink-0"
              title={SITE_CONFIG.name}
            >
              <img
                src={SITE_CONFIG.logoUrl}
                alt="Logo"
                className="w-9 h-9 rounded-full border border-[#D3BEA1] object-cover shadow-xs group-hover:scale-105 transition-transform"
              />
              <span className="font-serif text-lg sm:text-xl font-bold text-[#22160D] group-hover:text-[#283E2C] transition-colors leading-none truncate max-w-[200px] sm:max-w-none">
                The Healing &amp; Growth Journal
              </span>
            </NextLink>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-xs font-sans uppercase tracking-wider font-medium">
              {NAV_LINKS.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname?.startsWith(link.href));
                return (
                  <NextLink
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "py-1 text-[#4F3925] hover:text-[#283E2C] transition-colors relative",
                      isActive &&
                        "text-[#283E2C] font-semibold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#283E2C]"
                    )}
                  >
                    {link.label}
                  </NextLink>
                );
              })}
            </nav>

            {/* Actions: Subscribe & Mobile Button */}
            <div className="flex items-center gap-3 shrink-0">
              <a
                href={SITE_CONFIG.substackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-sm bg-[#283E2C] text-[#FAF7F2] hover:bg-[#1D2D20] transition-all shadow-xs hover:shadow-sm"
              >
                <span>Subscribe</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded text-[#4F3925] hover:bg-[#EAE0D1] transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        ) : (
          /* Full Masthead Mode (When at Top of Page) */
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE0D1]/60">
              {/* Brand Masthead */}
              <div className="flex-1">
                <NextLink href="/" className="inline-flex items-center gap-3.5 sm:gap-4 group">
                  <img
                    src={SITE_CONFIG.logoUrl}
                    alt="The Healing and Growth Journal Logo"
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full border-2 border-[#D3BEA1] object-cover shadow-sm shrink-0 transition-transform group-hover:scale-105"
                  />
                  <div>
                    <span className="block text-2xl sm:text-3xl font-serif tracking-tight text-[#22160D] group-hover:text-[#283E2C] transition-colors leading-tight">
                      The Healing &amp; Growth Journal
                    </span>
                    <span className="block text-[11px] sm:text-xs uppercase tracking-[0.2em] text-[#866746] font-sans mt-0.5 font-medium">
                      {SITE_CONFIG.heroText}
                    </span>
                  </div>
                </NextLink>
              </div>

              {/* Right Action */}
              <div className="flex items-center gap-3">
                <a
                  href={SITE_CONFIG.substackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 text-xs uppercase tracking-wider font-bold rounded-sm bg-[#4F3925] text-[#FAF7F2] hover:bg-[#283E2C] transition-all shadow-sm hover:shadow-md"
                >
                  <span>Subscribe on Substack</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="lg:hidden p-2 rounded text-[#4F3925] hover:bg-[#EAE0D1] transition-colors"
                  aria-label="Toggle Navigation Menu"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>

            {/* Desktop Navigation Links (Full Mode) */}
            <nav className="hidden lg:flex items-center justify-center gap-8 py-1 text-xs font-sans uppercase tracking-wider font-medium">
              {NAV_LINKS.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname?.startsWith(link.href));
                return (
                  <NextLink
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "py-1 text-[#4F3925] hover:text-[#283E2C] transition-colors relative",
                      isActive &&
                        "text-[#283E2C] font-semibold after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-[#283E2C]"
                    )}
                  >
                    {link.label}
                  </NextLink>
                );
              })}
            </nav>
          </div>
        )}

        {/* Mobile Drawer Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF7F2] border-t border-[#E6DCCE] mt-3 py-5 px-1 space-y-4 max-h-[calc(100vh-5rem)] overflow-y-auto animate-in fade-in duration-200">
            <nav className="flex flex-col space-y-2.5">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <NextLink
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "text-base font-serif text-[#362618] hover:text-[#283E2C] py-2 border-b border-[#E6DCCE]/40 transition-colors",
                      isActive && "text-[#283E2C] font-bold pl-2 border-l-2 border-[#283E2C]"
                    )}
                  >
                    {link.label}
                  </NextLink>
                );
              })}
            </nav>

            <div className="pt-2">
              <a
                href={SITE_CONFIG.substackUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 text-xs uppercase tracking-widest font-bold rounded-sm bg-[#283E2C] text-[#FAF7F2] shadow-sm"
              >
                <span>Subscribe on Substack</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Subtle Dynamic Reading Progress Line */}
      {isScrolled && (
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#EAE0D1]/60">
          <div
            className="h-full bg-[#BD7350] transition-all duration-150 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      )}
    </header>
  );
}
