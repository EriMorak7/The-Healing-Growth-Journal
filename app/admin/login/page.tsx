"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Feather, Lock, Mail, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      window.location.href = "/admin";
    } catch (err: any) {
      setError(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail("glory@thehealingandgrowthjournal.com");
    setPassword("healing2026!");
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        {/* Brand Logo */}
        <Link href="/" className="inline-block group">
          <img
            src="/images/journal-logo.png"
            alt="The Healing and Growth Journal"
            className="w-16 h-16 rounded-full border-2 border-[#D3BEA1] mx-auto object-cover shadow-sm group-hover:scale-105 transition-transform"
          />
        </Link>

        <div>
          <h2 className="text-3xl font-serif text-[#22160D] tracking-tight">
            Journal Editorial Desk
          </h2>
          <p className="text-xs uppercase tracking-[0.2em] text-[#866746] font-sans font-semibold mt-1">
            Author & Management Portal
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="paper-card p-8 sm:p-10 space-y-6">
          {error && (
            <div className="p-4 rounded-sm bg-[#FDF2F0] border border-[#F3C8C2] text-xs font-sans text-[#A83226]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-xs uppercase tracking-wider font-semibold text-[#4F3925] font-sans mb-1.5"
              >
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A3845F]">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="glory@thehealingandgrowthjournal.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-[#D3BEA1] rounded-sm text-sm font-sans text-[#22160D] focus:outline-none focus:ring-1 focus:ring-[#283E2C] focus:border-[#283E2C]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs uppercase tracking-wider font-semibold text-[#4F3925] font-sans"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#A3845F]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FAF7F2] border border-[#D3BEA1] rounded-sm text-sm font-sans text-[#22160D] focus:outline-none focus:ring-1 focus:ring-[#283E2C] focus:border-[#283E2C]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-xs uppercase tracking-widest font-bold rounded-sm bg-[#283E2C] text-[#FAF7F2] hover:bg-[#1D2D20] transition-colors shadow-sm disabled:opacity-50"
            >
              <span>{loading ? "Verifying Access..." : "Sign in to Editorial Desk"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Credential Fill for Development */}
          <div className="pt-4 border-t border-[#EAE0D1]/80 text-center">
            <button
              type="button"
              onClick={handleFillDemo}
              className="inline-flex items-center gap-1.5 text-xs text-[#866746] hover:text-[#283E2C] transition-colors font-sans"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#BD7350]" />
              <span>Fill Glory&apos;s Default Credentials</span>
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link
            href="/"
            className="text-xs uppercase tracking-wider text-[#866746] hover:text-[#283E2C] font-semibold font-sans"
          >
            ← Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  );
}
