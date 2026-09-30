import React from "react";
import Link from "next/link";
import { ArrowRight, Heart, Feather, Compass, ShieldCheck } from "lucide-react";
import SubstackCta from "@/components/SubstackCta";

export const metadata = {
  title: "About Glory & The Journal",
  description:
    "The story behind The Healing and Growth Journal. Written from lived experience, honoring grief, love, and the tender process of becoming.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-16">
      {/* Editorial Header */}
      <div className="text-center space-y-4 border-b border-[#EAE0D1] pb-12">
        <span className="text-xs uppercase tracking-[0.25em] text-[#866746] font-semibold">
          The Founder&apos;s Story
        </span>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#22160D] tracking-tight">
          About The Journal
        </h1>
        <p className="text-base sm:text-lg font-editorial text-[#4F3925] max-w-2xl mx-auto italic">
          &ldquo;Healing is not always about moving on. Sometimes, it is about learning how to carry what changed you.&rdquo;
        </p>
      </div>

      {/* Founder Intro Portrait Block */}
      <div className="paper-card p-8 sm:p-12 space-y-8 bg-[#FAF7F2]">
        <div className="flex flex-col sm:flex-row items-center gap-8 border-b border-[#EAE0D1] pb-8">
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-[#E5EDE6] border-2 border-[#283E2C] flex items-center justify-center text-3xl font-serif text-[#283E2C] shrink-0 shadow-inner">
            Glory
          </div>
          <div className="space-y-2 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-serif text-[#22160D]">
              Glory
            </h2>
            <p className="text-xs uppercase tracking-widest text-[#866746] font-sans font-semibold">
              Founder & Writer • The Healing and Growth Journal
            </p>
            <p className="text-sm font-sans text-[#4F3925] leading-relaxed pt-1">
              Writing from lived experience, sitting with people in their sorrow, and creating words that provide comfort, courage, and direction.
            </p>
          </div>
        </div>

        {/* The Exact Founder Story (Preserved per Brief Requirements) */}
        <div className="prose prose-stone max-w-none text-[#362618] font-editorial text-lg leading-relaxed space-y-6">
          <p className="first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-[#283E2C]">
            On the 19th of March 2025—just two days before my university convocation ceremony—my father passed away. In an instant, what was meant to be one of the most joyous weeks of my life transformed into a chapter of profound stillness, shock, and grief.
          </p>

          <p>
            While everyone around me celebrated accomplishments, I found myself navigating a reality I was utterly unprepared for. Grief did not announce itself politely; it arrived and rearranged everything I knew about time, memory, ambition, and identity.
          </p>

          <blockquote className="my-8 pl-6 border-l-2 border-[#283E2C] italic text-xl text-[#283E2C] font-editorial bg-[#F4ECE0]/50 py-3 pr-4 rounded-r-sm">
            &ldquo;I don&apos;t write because I have everything figured out. I write because I am learning too.&rdquo;
          </blockquote>

          <p>
            In the months that followed, I didn&apos;t turn to platitudes or shallow positive thinking. Instead, I began writing down the raw, honest truths of what it feels like to carry loss while still trying to show up for life. I sat with others in their pain—listening to their tears, their silent questions, and their fear that they would never feel whole again.
          </p>

          <p>
            Out of those quiet conversations and personal reflections, <strong>The Healing and Growth Journal</strong> was born.
          </p>

          <p>
            This space exists to help people find quiet strength during difficult seasons, courage when uncertain, and gentle hope when the road ahead feels foggy. We believe with wholehearted conviction that healing is possible, that grief does not have to make you hard-hearted, and that cherished memories can be carried with love.
          </p>
        </div>
      </div>

      {/* Non-Clinical Compassionate Guidance Note */}
      <div className="p-8 bg-[#E5EDE6]/60 border border-[#CBDECE] rounded-sm space-y-4">
        <div className="flex items-center gap-3 text-[#283E2C]">
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <h3 className="font-serif text-lg font-semibold">
            Our Approach to Guidance
          </h3>
        </div>
        <p className="text-sm font-sans text-[#283E2C] leading-relaxed">
          The Healing and Growth Journal is a companion for reflective self-support and community connection. While our writing is deeply intentional and informed by emotional intelligence and lived experience, it is not clinical psychotherapy or psychiatric care. If you are experiencing an acute mental health crisis, we warmly encourage seeking direct professional therapy or crisis support in tandem with your reflective practice.
        </p>
      </div>

      {/* The 4 Principles of the Journal */}
      <div className="space-y-6 pt-4">
        <h3 className="text-2xl font-serif text-[#22160D] text-center">
          What Guides Our Work
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="paper-card p-6 space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#866746] font-semibold">
              01 • Honesty
            </span>
            <h4 className="font-serif text-lg text-[#22160D]">No False Promises</h4>
            <p className="text-xs font-sans text-[#4F3925] leading-relaxed">
              We will never tell you that healing is fast, easy, or linear. We honor the real pace of human hearts.
            </p>
          </div>

          <div className="paper-card p-6 space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#866746] font-semibold">
              02 • Softness
            </span>
            <h4 className="font-serif text-lg text-[#22160D]">Gentle Words</h4>
            <p className="text-xs font-sans text-[#4F3925] leading-relaxed">
              Our writing seeks to soothe anxiety rather than produce guilt. You will never encounter aggressive sales language here.
            </p>
          </div>

          <div className="paper-card p-6 space-y-2">
            <span className="text-xs uppercase tracking-widest text-[#866746] font-semibold">
              03 • Companioning
            </span>
            <h4 className="font-serif text-lg text-[#22160D]">Walking Together</h4>
            <p className="text-xs font-sans text-[#4F3925] leading-relaxed">
              You are invited to read, reflect, and journal at your own pace, knowing others are walking the same path.
            </p>
          </div>
        </div>
      </div>

      {/* Substack Call to Action */}
      <SubstackCta
        title="Walk With Glory Each Sunday"
        description="Subscribe to receive personal letters, behind-the-scenes thoughts, and new essays delivered warmly to your inbox."
      />
    </div>
  );
}
