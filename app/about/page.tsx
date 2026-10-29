import React from "react";
import Link from "next/link";
import {
  Heart,
  Feather,
  Compass,
  BookOpen,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import SubstackCta from "@/components/SubstackCta";

export const metadata = {
  title: "About The Healing and Growth Journal | Glory Ekanem",
  description:
    "The story, beliefs, and voice behind The Healing and Growth Journal. Created by Glory Ekanem, counselling psychologist, writer, and teacher.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-20">
      {/* 1. Header: About The Healing and Growth Journal */}
      <section className="text-center space-y-6 border-b border-[#EAE0D1] pb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E5EDE6] text-[#283E2C] text-xs uppercase tracking-[0.2em] font-medium font-sans">
          <Feather className="w-3.5 h-3.5" />
          <span>Our Digital Home</span>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif text-[#22160D] tracking-tight leading-[1.1]">
          About The Healing and Growth Journal
        </h1>
        <p className="text-lg sm:text-xl font-serif text-[#866746] italic">
          A place to heal, love, and grow.
        </p>
        <div className="max-w-2xl mx-auto text-[#4F3925] font-editorial text-lg sm:text-xl leading-relaxed space-y-4 pt-2">
          <p>
            Life can change in a moment. Sometimes through loss. Sometimes through
            heartbreak. Sometimes through disappointment, a difficult transition,
            a relationship that no longer feels the same, or simply the realization
            that the person you have become is not the person you once imagined you
            would be.
          </p>
          <p>
            And sometimes, nothing dramatic has happened at all. You simply know
            that something inside you needs attention.
          </p>
          <p className="font-medium text-[#22160D]">
            The Healing and Growth Journal was created for those moments.
          </p>
          <p className="text-base text-[#6A4F35]">
            It is a space for honest reflection, meaningful guidance, and thoughtful
            resources for people learning how to navigate difficult seasons,
            understand themselves more deeply, heal from what has hurt them, and
            grow into who they are becoming.
          </p>
          <p className="italic text-[#283E2C] font-serif text-xl pt-2">
            You do not have to have everything figured out to begin.
          </p>
        </div>
      </section>

      {/* 2. Why The Journal Began */}
      <section className="space-y-8 paper-card p-8 sm:p-12 bg-[#FAF7F2]">
        <div className="border-b border-[#EAE0D1] pb-6">
          <span className="text-xs uppercase tracking-widest text-[#866746] font-semibold">
            Origin Story
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#22160D] mt-1">
            Why The Journal Began
          </h2>
        </div>

        <div className="prose prose-stone max-w-none text-[#362618] font-editorial text-lg leading-relaxed space-y-6">
          <p className="text-xl font-serif text-[#22160D]">
            Hi, I’m Glory.
          </p>
          <p>
            I’m a counselling psychologist, teacher, writer, and the person behind
            <strong> The Healing and Growth Journal</strong>.
          </p>
          <p className="first-letter:text-5xl first-letter:font-serif first-letter:font-bold first-letter:float-left first-letter:mr-3 first-letter:text-[#283E2C]">
            On March 19, 2025, I lost my father — just two days before my convocation.
            I had imagined that season differently. There should have been celebration,
            photographs, family, laughter, and the joy of reaching a milestone I had
            worked so hard for.
          </p>
          <p>
            Instead, grief arrived. And grief changed me.
          </p>
          <p>
            It taught me that healing is rarely as straightforward as we imagine it
            to be. Sometimes you think you have healed until a voice, a memory, a
            familiar place, or someone else’s pain touches a wound you thought had
            already closed.
          </p>
          <p>
            I experienced this when a friend sent me a voice note crying about the
            loss of her own father. I found myself crying too. Not only for her, but
            for the parts of my own grief I had not finished meeting.
          </p>

          <blockquote className="my-8 pl-6 border-l-2 border-[#283E2C] italic text-xl sm:text-2xl text-[#283E2C] font-editorial bg-[#F4ECE0]/50 py-4 pr-4 rounded-r-sm">
            &ldquo;Healing is not always about moving on. Sometimes, it is about
            learning how to carry what changed you.&rdquo;
          </blockquote>

          <p>
            The Healing and Growth Journal grew from that understanding.
          </p>
          <p>
            But it also grew from something beyond my own grief — from sitting with
            other people in their pain. Their tears. Their fears. Their questions.
            The things they could not always say out loud.
          </p>
          <p>
            I began to see how much people need a place where they can be honest
            about what they are carrying without being rushed to &ldquo;get over it.&rdquo;
          </p>
          <p className="font-semibold text-[#22160D]">
            And that is what I wanted to create.
          </p>
        </div>
      </section>

      {/* 3. What We Believe */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-[#866746] font-semibold">
            Our Foundation
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#22160D]">
            What We Believe
          </h2>
          <p className="text-sm font-sans text-[#6A4F35]">
            At The Healing and Growth Journal, we believe that healing and growth are
            deeply connected.
          </p>
        </div>

        {/* Belief Statements Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            "You can heal from something and still have more growing to do.",
            "You can grow through an experience without pretending that it did not hurt.",
            "You can love someone and still need boundaries.",
            "You can miss someone and still learn to live without them.",
            "You can be grateful for your life and still admit that some parts of it are difficult.",
            "You can start again without having all the answers.",
          ].map((belief, i) => (
            <div
              key={i}
              className="paper-card p-6 flex items-start gap-3 bg-[#FAF7F2] hover:border-[#283E2C] transition-colors"
            >
              <CheckCircle2 className="w-5 h-5 text-[#283E2C] shrink-0 mt-0.5" />
              <p className="font-editorial text-base sm:text-lg text-[#22160D] leading-relaxed">
                {belief}
              </p>
            </div>
          ))}
        </div>

        {/* Philosophy Card */}
        <div className="p-8 bg-[#E5EDE6]/60 border border-[#CBDECE] rounded-sm space-y-4 font-editorial text-lg text-[#283E2C] leading-relaxed">
          <p className="font-serif text-xl sm:text-2xl text-[#1D2D20]">
            There is room for complexity here.
          </p>
          <p>
            We are not interested in telling people to simply &ldquo;stay positive&rdquo;
            when life hurts. There are moments when you need encouragement. There are
            moments when you need truth. There are moments when you need practical
            guidance.
          </p>
          <p className="italic text-xl text-[#1D2D20] font-serif pt-1">
            And there are moments when you simply need someone to say, &ldquo;What
            you are feeling deserves to be understood.&rdquo;
          </p>
          <p className="font-sans text-xs uppercase tracking-widest font-semibold pt-2 text-[#283E2C]">
            This Journal makes room for all of that.
          </p>
        </div>
      </section>

      {/* 4. What You'll Find Here */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs uppercase tracking-widest text-[#866746] font-semibold">
            The Content Library
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#22160D]">
            What You’ll Find Here
          </h2>
          <p className="text-sm font-sans text-[#6A4F35]">
            The Healing and Growth Journal explores the experiences that shape us and
            the questions that often stay with us long after everyone else has moved on.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="paper-card p-6 sm:p-8 space-y-3 bg-[#FAF7F2]">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#283E2C]">
              <Heart className="w-4 h-4" />
              <span>Healing</span>
            </div>
            <h3 className="text-xl font-serif text-[#22160D]">
              Honoring What Hurt
            </h3>
            <p className="text-sm font-sans text-[#4F3925] leading-relaxed">
              Grief and loss, emotional healing, disappointment, letting go,
              self-compassion, difficult seasons, and learning to live with what has
              changed.
            </p>
          </div>

          <div className="paper-card p-6 sm:p-8 space-y-3 bg-[#FAF7F2]">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#866746]">
              <Compass className="w-4 h-4" />
              <span>Growth</span>
            </div>
            <h3 className="text-xl font-serif text-[#22160D]">
              Stepping Forward Intentionally
            </h3>
            <p className="text-sm font-sans text-[#4F3925] leading-relaxed">
              Self-awareness, identity, confidence, purpose, personal development,
              becoming, and understanding the person you are growing into.
            </p>
          </div>

          <div className="paper-card p-6 sm:p-8 space-y-3 bg-[#FAF7F2]">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#BD7350]">
              <Sparkles className="w-4 h-4" />
              <span>Love & Relationships</span>
            </div>
            <h3 className="text-xl font-serif text-[#22160D]">
              Connections with Clarity
            </h3>
            <p className="text-sm font-sans text-[#4F3925] leading-relaxed">
              Love, heartbreak, friendship, boundaries, connection, communication,
              and the complicated ways relationships can shape us. Including our
              cherished Sunday Love Series.
            </p>
          </div>

          <div className="paper-card p-6 sm:p-8 space-y-3 bg-[#FAF7F2]">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#283E2C]">
              <Feather className="w-4 h-4" />
              <span>Reflection</span>
            </div>
            <h3 className="text-xl font-serif text-[#22160D]">
              Stillness in a Noisy World
            </h3>
            <p className="text-sm font-sans text-[#4F3925] leading-relaxed">
              Thoughtful observations, personal reflections, letters, poems,
              questions, and lessons that help us pause long enough to understand
              ourselves.
            </p>
          </div>

          <div className="paper-card p-6 sm:p-8 space-y-3 bg-[#FAF7F2] md:col-span-2">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#4F3925]">
              <BookOpen className="w-4 h-4" />
              <span>Practical Guidance</span>
            </div>
            <h3 className="text-xl font-serif text-[#22160D]">
              Actionable Tools & Resources
            </h3>
            <p className="text-sm font-sans text-[#4F3925] leading-relaxed">
              Resources, journal prompts, guides, and gentle tools designed to help
              you do more than simply read about healing — but actually begin
              working through what you are experiencing.
            </p>
          </div>
        </div>

        <div className="text-center font-editorial text-lg text-[#6A4F35] italic max-w-xl mx-auto space-y-1">
          <p>Some days, you may come here looking for words.</p>
          <p>Other days, you may come looking for an answer.</p>
          <p>Sometimes, you may simply need to know that someone else understands.</p>
          <p className="font-semibold text-[#283E2C] font-serif not-italic pt-2">
            There is space for all three.
          </p>
        </div>
      </section>

      {/* 5. Who Is Behind The Journal? */}
      <section className="space-y-8 paper-card p-8 sm:p-12 bg-[#FAF7F2]">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 border-b border-[#EAE0D1] pb-8">
          <img
            src="/images/glory-avatar.jpg"
            alt="Glory Ekanem, Counselling Psychologist & Writer"
            className="w-32 h-32 sm:w-44 sm:h-44 rounded-full border-4 border-[#EAE0D1] object-cover shadow-lg shrink-0"
          />
          <div className="space-y-2 text-center sm:text-left">
            <span className="text-xs uppercase tracking-widest text-[#866746] font-semibold">
              The Voice Behind The Words
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-[#22160D]">
              Who Is Behind The Journal?
            </h2>
            <p className="text-sm font-serif text-[#866746] italic">
              Glory Ekanem • Counselling Psychologist, Writer & Teacher
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-3 py-1 rounded-full text-xs bg-[#E5EDE6] text-[#283E2C] font-medium">
                440+ Community Readers
              </span>
              <span className="px-3 py-1 rounded-full text-xs bg-[#F4ECE0] text-[#4F3925] font-medium">
                Weekly Sunday Love Letters
              </span>
            </div>
          </div>
        </div>

        <div className="prose prose-stone max-w-none text-[#362618] font-editorial text-lg leading-relaxed space-y-6">
          <p>
            Hello, and welcome! I’m Glory Ekanem, the voice behind The Healing and
            Growth Journal, a space created for people who want to understand
            themselves better, love more intentionally, heal from life’s difficult
            seasons, and grow without losing who they are along the way.
          </p>
          <p>
            My background in counselling psychology, combined with my love for
            teaching, learning, and writing, has shaped the way I understand people
            and the experiences that make us who we are. I’m fascinated by human
            behaviour, emotions, relationships, and the little things that influence
            how we think, love, respond to life, and relate to one another.
          </p>
          <p>
            Beyond my professional interests, I’m someone who enjoys reading,
            writing, travelling, and watching movies. I love learning new things,
            exploring different perspectives, and discovering stories that offer a
            fresh way of looking at life. Whether through a book, a thoughtful
            conversation, a piece of writing, or a story on screen, I’m always drawn
            to things that help me understand people and the world a little better.
          </p>
          <p>
            Writing, in particular, holds a special place in my heart. It gives me a
            way to explore the things we don’t always find easy to talk about, put
            words to complicated feelings, and share reflections that might help
            someone see themselves or their experiences differently. It is also one
            of the ways I bring together my interest in psychology, my love for
            teaching, and my desire to make meaningful ideas accessible to everyday
            people.
          </p>

          <blockquote className="my-8 pl-6 border-l-2 border-[#283E2C] italic text-xl text-[#283E2C] font-editorial bg-[#F4ECE0]/50 py-3 pr-4 rounded-r-sm">
            &ldquo;But I don’t write from a place of having life completely figured out.
            I’m learning too.&rdquo;
          </blockquote>

          <p>
            My professional background informs how I approach healing, relationships,
            emotions, and personal growth, but I also understand that knowing
            something intellectually doesn’t always make living through it easy.
            There is a difference between understanding what healing looks like on
            paper and discovering what it asks of you in real life. Growth can be
            uncomfortable. Loving well takes intention. And becoming more
            self-aware sometimes means confronting things about ourselves we would
            rather avoid.
          </p>
          <p>
            That is part of why I created The Healing and Growth Journal.
          </p>
          <p>
            I wanted to build a space where psychology meets everyday life, where
            thoughtful reflections meet practical guidance, and where conversations
            about love, healing, and personal growth feel both meaningful and
            relatable. A space where you can learn without feeling judged, reflect
            without feeling pressured, and find encouragement without being made to
            feel that you should have everything figured out by now.
          </p>
          <p>
            Here, you’ll find reflective articles, poems, practical guides, journal
            prompts, and letters exploring love and relationships, emotional
            well-being, self-awareness, grief, personal development, and the many
            ways we can navigate life’s seasons with greater wisdom, compassion,
            and intention.
          </p>
          <p>
            My hope is that something you encounter here will meet you where you are.
            Perhaps it will help you understand a feeling you couldn’t quite explain,
            reconsider a belief you’ve carried for years, approach a relationship
            differently, or find the courage to take a small but meaningful step
            forward.
          </p>
          <p>
            You don’t have to arrive here with all the answers. You don’t have to
            pretend to be okay when you’re not, and you don’t have to become someone
            else to deserve a healthier, more fulfilling life.
          </p>
          <p>
            This is a space to heal, love, and grow, one reflection, one lesson, and
            one intentional step at a time.
          </p>
          <p>
            I’m glad you’re here. I hope you find something here that speaks to you,
            teaches you something new, or reminds you to give yourself and others a
            little more understanding.
          </p>

          <div className="pt-4 space-y-1 font-serif">
            <p className="text-sm italic text-[#866746]">With love,</p>
            <p className="text-xl font-bold text-[#22160D]">Glory Ekanem</p>
            <p className="text-xs uppercase tracking-widest text-[#866746]">
              Founder and Writer, The Healing and Growth Journal
            </p>
          </div>
        </div>
      </section>

      {/* 6. More Than Something You Read */}
      <section className="space-y-6 paper-card p-8 sm:p-12 bg-[#FAF7F2]">
        <div className="border-b border-[#EAE0D1] pb-4">
          <span className="text-xs uppercase tracking-widest text-[#866746] font-semibold">
            Our Vision
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#22160D] mt-1">
            More Than Something You Read
          </h2>
        </div>

        <div className="prose prose-stone max-w-none text-[#362618] font-editorial text-lg leading-relaxed space-y-4">
          <p>
            The Healing and Growth Journal is not simply a place to consume words.
            It is being built as a compassionate community and a growing collection
            of resources for people navigating real life.
          </p>
          <p>
            Here, you will find writing that helps you pause and reflect, practical
            resources that help you take action, and gentle tools that give you
            somewhere to begin.
          </p>
          <p>
            Over time, that will continue to grow — through journals, prompts,
            practical guides, books, courses, conversations, and other resources
            created to support healing and intentional growth.
          </p>
          <div className="p-6 bg-[#F4ECE0]/50 rounded-sm border-l-2 border-[#283E2C] space-y-2 my-6">
            <p className="font-serif text-xl text-[#22160D] italic">
              The goal is not to tell you who you should become.
            </p>
            <p className="font-editorial text-base text-[#4F3925]">
              It is to help you understand yourself well enough to make that journey
              consciously.
            </p>
          </div>
        </div>
      </section>

      {/* 7. If You Found Your Way Here */}
      <section className="space-y-8 bg-gradient-to-b from-[#FAF7F2] to-[#F4ECE0]/60 p-8 sm:p-12 rounded-sm border border-[#EAE0D1]">
        <div className="text-center space-y-2 max-w-2xl mx-auto border-b border-[#EAE0D1] pb-6">
          <span className="text-xs uppercase tracking-widest text-[#866746] font-semibold">
            A Gentle Welcome
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif text-[#22160D]">
            If You Found Your Way Here
          </h2>
        </div>

        <div className="max-w-2xl mx-auto font-editorial text-lg text-[#362618] leading-relaxed space-y-4">
          <p className="italic text-[#866746]">Maybe you are grieving.</p>
          <p className="italic text-[#866746]">
            Maybe you are trying to make sense of a relationship that changed you.
          </p>
          <p className="italic text-[#866746]">Maybe you are starting over.</p>
          <p className="italic text-[#866746]">
            Maybe you are tired of pretending that you are okay.
          </p>
          <p className="italic text-[#866746]">
            Maybe you are doing well, but you know there is still more of yourself
            you want to understand.
          </p>
          <p className="italic text-[#866746]">
            Or maybe you simply believe that life can be lived with greater
            intention, deeper self-awareness, and more compassion.
          </p>

          <p className="font-serif text-xl text-[#22160D] pt-4">
            Wherever you are, you are welcome here.
          </p>

          <p>
            You do not have to wait until you fall apart before you begin paying
            attention to yourself. You can begin now. You can ask the difficult
            question now. You can learn something new about yourself now. You can
            seek help when you need it. You can begin again.
          </p>

          <p className="font-medium text-[#22160D]">
            And you can grow without abandoning the person you have been.
          </p>

          <blockquote className="my-6 pl-6 border-l-2 border-[#283E2C] italic text-xl text-[#283E2C] font-editorial py-2">
            Because healing may not return you to who you were before.
            <br />
            Sometimes, healing introduces you to the person you are becoming.
          </blockquote>

          <div className="pt-4 space-y-1 font-serif text-center sm:text-left text-[#283E2C]">
            <p className="text-2xl font-bold">That is the heart of The Healing and Growth Journal.</p>
            <p className="text-lg italic">A place to heal.</p>
            <p className="text-lg italic">A place to love.</p>
            <p className="text-lg italic">A place to grow.</p>
            <p className="text-base pt-2 text-[#4F3925]">
              And a place to remember that you do not have to walk through every season alone.
            </p>
          </div>

          <div className="pt-6 border-t border-[#EAE0D1] space-y-1">
            <p className="text-xs uppercase tracking-widest text-[#866746] font-semibold">
              With all my love,
            </p>
            <p className="font-serif text-xl font-bold text-[#22160D]">
              The Healing and Growth Journal
            </p>
          </div>
        </div>
      </section>

      {/* Non-Clinical Guidance Note */}
      <div className="p-6 bg-[#E5EDE6]/60 border border-[#CBDECE] rounded-sm space-y-2">
        <div className="flex items-center gap-2.5 text-[#283E2C]">
          <ShieldCheck className="w-5 h-5 shrink-0" />
          <h3 className="font-serif text-base font-semibold">
            Our Approach to Guidance
          </h3>
        </div>
        <p className="text-xs font-sans text-[#283E2C] leading-relaxed">
          The Healing and Growth Journal is a companion for reflective self-support
          and community connection. While our writing is deeply intentional and
          informed by counselling psychology and lived experience, it is not
          clinical psychotherapy or psychiatric crisis care. If you are experiencing
          an acute mental health crisis, we warmly encourage seeking direct
          professional therapy or crisis support alongside your reflective practice.
        </p>
      </div>

      {/* Substack Call to Action */}
      <SubstackCta
        title="Walk With Glory Each Sunday"
        description="Subscribe to receive personal letters, behind-the-scenes thoughts, and new essays delivered warmly to your inbox."
      />
    </div>
  );
}
