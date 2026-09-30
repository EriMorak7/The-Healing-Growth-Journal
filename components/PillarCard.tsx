import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface PillarCardProps {
  title: string;
  slug: string;
  tagline: string;
  description: string;
}

export default function PillarCard({
  title,
  slug,
  tagline,
  description,
}: PillarCardProps) {
  return (
    <div className="paper-card p-8 flex flex-col justify-between group hover:-translate-y-1 transition-all duration-300">
      <div className="space-y-3">
        <div className="w-8 h-[2px] bg-[#283E2C] group-hover:w-16 transition-all duration-300" />
        <h3 className="text-2xl font-serif text-[#22160D] group-hover:text-[#283E2C] transition-colors">
          {title}
        </h3>
        <p className="text-xs uppercase tracking-wider text-[#866746] font-medium font-sans">
          {tagline}
        </p>
        <p className="text-sm text-[#4F3925] leading-relaxed pt-2">
          {description}
        </p>
      </div>
      <div className="pt-6 mt-6 border-t border-[#EAE0D1]">
        <Link
          href={`/journal?category=${slug}`}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#283E2C] group-hover:text-[#1D2D20] transition-colors"
        >
          <span>Explore {title}</span>
          <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
