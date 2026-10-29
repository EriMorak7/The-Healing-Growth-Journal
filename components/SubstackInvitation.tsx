import React from "react";
import { Feather, Heart, Mail, ExternalLink, ArrowRight } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";

interface SubstackInvitationProps {
  className?: string;
}

export default function SubstackInvitation({
  className = "",
}: SubstackInvitationProps) {
  return (
    <div
      className={`relative paper-card overflow-hidden bg-gradient-to-br from-[#FAF7F2] via-[#F4ECE0]/70 to-[#FAF7F2] border-2 border-[#D3BEA1] p-8 sm:p-12 md:p-16 shadow-lg ${className}`}
    >
      {/* Decorative Stamp Emblem */}
      <div className="absolute top-6 right-6 opacity-15 pointer-events-none hidden sm:block">
        <div className="w-24 h-24 rounded-full border-2 border-dashed border-[#283E2C] flex items-center justify-center rotate-12">
          <Feather className="w-10 h-10 text-[#283E2C]" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Letter Heading */}
        <div className="border-b border-[#EAE0D1] pb-6 space-y-2 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5EDE6] text-[#283E2C] text-xs uppercase tracking-[0.2em] font-medium font-sans">
            <Mail className="w-3.5 h-3.5" />
            <span>An Invitation from Glory</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#22160D] tracking-tight">
            Stay With Us
          </h2>
        </div>

        {/* Letter Body */}
        <div className="space-y-5 text-[#362618] font-editorial text-lg sm:text-xl leading-relaxed">
          <p className="font-serif text-2xl text-[#22160D] font-bold">
            Dear Brave Mind,
          </p>

          <p>
            Some words find us at just the right time. They help us understand what
            we’ve been feeling, make sense of a season we cannot quite explain, or
            remind us of something important we’ve forgotten along the way.
          </p>

          <p>
            If something you’ve read here has spoken to you, I’d love for you to stay.
          </p>

          <p>
            <strong>The Healing and Growth Journal</strong> is a safe space to heal,
            love, and grow. A space for honest reflections, meaningful conversations,
            and gentle reminders that becoming a healthier version of yourself is a
            journey, not a race.
          </p>

          <p>
            Through reflective articles, healing notes, poems, practical guidance,
            journal prompts, and thoughtful resources, I hope to offer you words
            that meet you where you are and encourage you towards where you hope to be.
          </p>

          <p>
            Some words may help you understand yourself a little better. Some may
            give language to feelings you’ve struggled to explain. Some may
            challenge you to see things differently, love more intentionally, or take
            that small step towards growth you’ve been putting off. And sometimes, I
            hope, you’ll find a simple reminder that you are not alone, that your
            story is still unfolding, and that there is room for you to begin again.
          </p>

          <p>
            So, if you’re looking for a space that encourages you to look inward,
            approach yourself and others with greater understanding, and navigate
            life’s seasons without losing yourself, I’d love to welcome you into our
            community.
          </p>

          <p>
            Subscribe to receive new reflections and resources directly in your inbox.
            Stay connected, take what speaks to you, reflect on what challenges you,
            and grow at your own pace.
          </p>

          <div className="py-4 my-2 border-y border-[#EAE0D1]/80 space-y-1 font-serif text-xl sm:text-2xl text-[#283E2C] italic">
            <p>You don’t have to have everything figured out to belong here.</p>
            <p className="font-bold not-italic">Come as you are. Stay for the journey.</p>
          </div>
        </div>

        {/* Call to Action Box */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-6 bg-[#FAF7F2] p-6 sm:p-8 rounded-sm border border-[#EAE0D1]">
          <div className="space-y-1 text-center sm:text-left">
            <p className="font-serif text-xl font-bold text-[#22160D]">
              A safe space to heal, love, and grow.
            </p>
            <p className="text-xs uppercase tracking-widest text-[#866746] font-sans">
              Join 440+ thoughtful readers • Delivered weekly to your inbox
            </p>
          </div>

          <a
            href={SITE_CONFIG.substackUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-sm bg-[#283E2C] text-[#FAF7F2] hover:bg-[#1D2D20] text-xs sm:text-sm uppercase tracking-[0.18em] font-semibold transition-all shadow-md hover:shadow-lg shrink-0 w-full sm:w-auto"
          >
            <span>Subscribe to The Healing and Growth Journal</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        {/* Letter Closing */}
        <div className="pt-2 text-center sm:text-left space-y-1 font-serif">
          <p className="text-sm italic text-[#866746]">
            Welcome to our community, Dear Brave Mind.
          </p>
          <p className="text-xl font-bold text-[#22160D]">
            I&apos;m glad you&apos;re here.
          </p>
          <p className="text-xs uppercase tracking-widest text-[#866746] font-sans pt-1">
            Glory Ekanem • The Healing and Growth Journal
          </p>
        </div>
      </div>
    </div>
  );
}
