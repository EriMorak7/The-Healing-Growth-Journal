import React from "react";
import Link from "next/link";
import { Compass, BookOpen, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 sm:py-32 text-center space-y-8">
      <div className="w-16 h-16 rounded-full bg-[#E5EDE6] text-[#283E2C] flex items-center justify-center mx-auto">
        <Compass className="w-8 h-8" />
      </div>

      <div className="space-y-3">
        <span className="text-xs uppercase tracking-[0.25em] text-[#866746] font-semibold">
          Error 404 • A Gentle Pause
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#22160D]">
          This page seems to have wandered
        </h1>
        <p className="text-base font-editorial text-[#4F3925] leading-relaxed max-w-md mx-auto">
          The link you followed may have moved, or the page may be resting. Take a gentle breath and let us guide you back.
        </p>
      </div>

      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs uppercase tracking-widest font-semibold rounded-sm bg-[#283E2C] text-[#FAF7F2] hover:bg-[#1D2D20] transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
        <Link
          href="/start-here"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-xs uppercase tracking-widest font-semibold rounded-sm bg-[#FAF7F2] text-[#4F3925] border border-[#D3BEA1] hover:bg-[#EAE0D1] transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          <span>Start Here Pathways</span>
        </Link>
      </div>
    </div>
  );
}
