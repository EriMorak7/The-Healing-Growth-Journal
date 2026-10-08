"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Heart,
  ShoppingBag,
  Mail,
  ExternalLink,
  LogOut,
  Menu,
  X,
  PlusCircle,
  Sparkles,
} from "lucide-react";

interface AdminSidebarProps {
  user: {
    email: string;
    name: string;
  };
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const navLinks = [
    { label: "Dashboard Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Articles & Reflections", href: "/admin/articles", icon: FileText },
    { label: "Digital Products", href: "/admin/products", icon: ShoppingBag },
    { label: "Contact Inquiries", href: "/admin/contacts", icon: Mail },
  ];

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      window.location.href = "/admin/login";
    } catch {
      setLoggingOut(false);
    }
  };

  const navContent = (
    <div className="flex flex-col h-full justify-between bg-[#1C2B19] text-[#FAF7F2] p-6 border-r border-[#283E2C]">
      {/* Brand Header */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 pb-6 border-b border-[#283E2C]">
          <img
            src="/images/journal-logo.png"
            alt="Logo"
            className="w-10 h-10 rounded-full border border-[#D3BEA1] object-cover shrink-0"
          />
          <div>
            <h1 className="font-serif text-lg leading-none tracking-tight text-[#FAF7F2]">
              The Healing & Growth
            </h1>
            <span className="block text-[10px] uppercase tracking-widest text-[#CBDECE] font-sans mt-1 font-semibold">
              Editorial Desk
            </span>
          </div>
        </div>

        {/* Quick New Article CTA */}
        <div>
          <Link
            href="/admin/articles/new"
            onClick={() => setMobileOpen(false)}
            className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-sm bg-[#BD7350] hover:bg-[#A35E3D] text-[#FAF7F2] text-xs uppercase tracking-widest font-bold transition-all shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Write New Piece</span>
          </Link>
        </div>

        {/* Primary Navigation */}
        <nav className="space-y-1 pt-2">
          {navLinks.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname?.startsWith(item.href);

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-sm text-xs uppercase tracking-wider font-semibold transition-colors ${
                  isActive
                    ? "bg-[#283E2C] text-[#FAF7F2] shadow-sm font-bold"
                    : "text-[#CBDECE] hover:bg-[#283E2C]/50 hover:text-white"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#BD7350]" : "text-[#CBDECE]"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Account / Logout */}
      <div className="pt-6 border-t border-[#283E2C] space-y-4">
        {/* Public Website Link */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between text-xs text-[#CBDECE] hover:text-white transition-colors py-1"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Website</span>
          </span>
          <span className="text-[10px] uppercase tracking-wider opacity-60">Live</span>
        </a>

        {/* User Badge */}
        <div className="bg-[#283E2C]/80 p-3 rounded-sm flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="block text-xs font-semibold text-[#FAF7F2] truncate">
              {user.name}
            </span>
            <span className="block text-[10px] text-[#A6C4AA] truncate font-sans">
              {user.email}
            </span>
          </div>
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            title="Sign Out"
            className="p-1.5 rounded text-[#CBDECE] hover:text-[#BD7350] hover:bg-[#1C2B19] transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden flex items-center justify-between bg-[#1C2B19] text-[#FAF7F2] p-4 border-b border-[#283E2C]">
        <div className="flex items-center gap-2.5">
          <img
            src="/images/journal-logo.png"
            alt="Logo"
            className="w-8 h-8 rounded-full border border-[#D3BEA1] object-cover"
          />
          <span className="font-serif text-sm">Editorial Desk</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded text-[#CBDECE] hover:bg-[#283E2C]"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 h-screen sticky top-0">
        {navContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-72 max-w-full h-full relative z-10">{navContent}</div>
          <div
            className="flex-1 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
        </div>
      )}
    </>
  );
}
