import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database for The Healing and Growth Journal...");

  // 1. Categories (The 4 Pillars)
  const categoriesData = [
    {
      name: "Healing",
      slug: "healing",
      description: "Grief, loss, emotional healing, letting go, and disappointment.",
      displayOrder: 1,
    },
    {
      name: "Growth",
      slug: "growth",
      description: "Self-discovery, confidence, identity, purpose, and becoming.",
      displayOrder: 2,
    },
    {
      name: "Relationships",
      slug: "relationships",
      description: "Love, heartbreak, friendship, boundaries, and connection.",
      displayOrder: 3,
    },
    {
      name: "Reflection",
      slug: "reflection",
      description: "Personal essays, letters, journal entries, and quiet observations about life.",
      displayOrder: 4,
    },
  ];

  const categories = {};
  for (const cat of categoriesData) {
    categories[cat.slug] = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }

  // 2. Tags
  const tagsList = [
    "Grief & Loss",
    "Emotional Healing",
    "Letting Go",
    "Becoming",
    "Heartbreak",
    "Boundaries",
    "Connection",
    "Personal Essays",
    "Letters",
    "Journal Entries",
  ];

  const tags = {};
  for (const name of tagsList) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    tags[slug] = await prisma.tag.upsert({
      where: { slug },
      update: { name },
      create: { name, slug },
    });
  }

  // 3. Series (The Sunday Love Series)
  const sundayLoveSeries = await prisma.series.upsert({
    where: { slug: "sunday-love-series" },
    update: {
      name: "The Sunday Love Series",
      description: "A recurring weekly sanctuary of love articles, tender letters, and contemplative poetry.",
    },
    create: {
      name: "The Sunday Love Series",
      slug: "sunday-love-series",
      description: "A recurring weekly sanctuary of love articles, tender letters, and contemplative poetry.",
    },
  });

  // 4. Pathways (The 6 Start Here journeys)
  const pathwaysData = [
    {
      name: "Start here if you are grieving",
      slug: "grieving",
      headline: "For when you are carrying a loss that feels impossible to put into words.",
      description: "Gentle reflections and prompt guides for when grief arrives unannounced and rewrites your days.",
      displayOrder: 1,
    },
    {
      name: "Start here if you are healing from heartbreak",
      slug: "heartbreak",
      headline: "For when love ended, but the memories and longing still linger.",
      description: "Compassionate pieces to help you process the ache without rushing yourself into pretending you are completely fine.",
      displayOrder: 2,
    },
    {
      name: "Start here if you are going through a difficult season",
      slug: "difficult-seasons",
      headline: "For the transitions, quiet uncertainties, and heavy chapters.",
      description: "Grounding thoughts for when the path forward is foggy and you need a gentle reminder to take one breath at a time.",
      displayOrder: 3,
    },
    {
      name: "Start here if you are starting over",
      slug: "starting-over",
      headline: "For rebuilding after disappointment, sudden change, or closed doors.",
      description: "Reflections on rebuilding your identity, rediscovering routines, and opening your heart to new possibilities.",
      displayOrder: 4,
    },
    {
      name: "Start here if you feel lost or disconnected from yourself",
      slug: "feeling-lost",
      headline: "For when you don't recognize the person looking back in the mirror.",
      description: "Guided spaces to pause, listen inwardly, and gently uncover what your heart and mind truly need right now.",
      displayOrder: 5,
    },
    {
      name: "Start here if you want to grow intentionally",
      slug: "intentional-growth",
      headline: "For deepening your self-awareness and living with mindful presence.",
      description: "Thoughtful prompts and personal essays centered on becoming the most honest, grounded version of yourself.",
      displayOrder: 6,
    },
  ];

  for (const pw of pathwaysData) {
    await prisma.pathway.upsert({
      where: { slug: pw.slug },
      update: pw,
      create: pw,
    });
  }

  // 5. Sample Editorial Articles
  const articlesData = [
    {
      title: "Learning How to Carry What Changed You",
      slug: "learning-how-to-carry-what-changed-you",
      excerpt: "Healing is not always about moving on or forgetting what happened. Sometimes, it is simply learning how to carry what changed you with grace and tenderness.",
      body: `There is an unspoken expectation that healing should look like leaving things behind cleanly—closing a door, turning a corner, never looking back. But anyone who has sat in deep grief knows that some moments divide life cleanly into 'before' and 'after.'\n\nWhen my father died on the 19th of March 2025, just two days before my convocation ceremony, the world kept moving, but everything within me stood still. The degree I was supposed to celebrate suddenly felt like a quiet echo in a very large room.\n\nIn the months that followed, I tried to figure out what recovery was supposed to look like. Was I supposed to pretend the ache didn't exist? Was I supposed to hurry up and find closure?\n\nWhat I learned through tears, quiet hours, and sitting with others in their sorrow is this: Healing is not always about moving on. Sometimes, it is about learning how to carry what changed you.\n\nYou do not have to discard who you were, and you do not have to rush the person you are becoming. It is enough to breathe, to write the honest truth down on paper, and to let today be today.`,
      featuredImage: "/images/journal-hands.jpg",
      readingTime: "5 min read",
      authorName: "Glory",
      isPublished: true,
      isFeatured: true,
      isSundayLove: false,
      categories: ["healing", "reflection"],
      tags: ["grief-loss", "emotional-healing", "personal-essays"],
    },
    {
      title: "I Write Because I Am Learning Too",
      slug: "i-write-because-i-am-learning-too",
      excerpt: "I don't write because I have everything figured out or because I stand on some distant shore of perfection. I write because I am in the middle of it all, learning too.",
      body: `One of the greatest myths of modern wellness is that advice is only valuable if the person speaking has already arrived at some serene, unshakeable state of peace.\n\nI want to make a quiet promise right here: this journal will never preach to you. It will never tell you that if you just light the right candle or repeat three affirmations in the mirror, grief will evaporate.\n\nI sit with questions just as you do. I wonder why good people leave before we are ready. I wonder how we balance ambitious dreams with tender hearts. I write not from an ivory tower, but from lived experience—from the desk beside the window where tea goes cold while the heart searches for language.\n\nIf you find yourself here today, take off the armor. You don't have to perform. We are learning together.`,
      featuredImage: "/images/window-tea.jpg",
      readingTime: "4 min read",
      authorName: "Glory",
      isPublished: true,
      isFeatured: true,
      isSundayLove: false,
      categories: ["reflection", "growth"],
      tags: ["becoming", "personal-essays", "journal-entries"],
    },
    {
      title: "To Hold Love Tenderly, Even When It Must Rest",
      slug: "to-hold-love-tenderly-even-when-it-must-rest",
      excerpt: "A Sunday letter on learning to love without clutching, and understanding that what was genuine never truly disappears.",
      body: `Good morning, dear reader.\n\nOn Sundays, the world feels slightly slower, as though giving us permission to exhale the worries gathered during the week.\n\nToday, I am thinking about how difficult it is to let love change shape. When a relationship shifts—whether through physical absence, changing seasons, or an ending we didn't choose—we often try to freeze it in memory so it doesn't hurt.\n\nLove, like water, cannot be held tightly in a closed fist without spilling through the fingers. It must be held with an open palm. To say: 'You mattered to me, you shaped me, and I release the need to control how this story unfolds.'\n\nMay this Sunday offer you a quiet moment to forgive yourself for holding on too long, and give you the courage to breathe gently into what comes next.`,
      featuredImage: "/images/sunday-letter.jpg",
      readingTime: "3 min read",
      authorName: "Glory",
      isPublished: true,
      isFeatured: true,
      isSundayLove: true,
      seriesSlug: "sunday-love-series",
      categories: ["relationships", "reflection"],
      tags: ["letters", "heartbreak", "boundaries"],
    },
    {
      title: "The Quiet Art of Starting Over",
      slug: "the-quiet-art-of-starting-over",
      excerpt: "Beginning again rarely comes with grand announcements. It begins with the decision to make a quiet cup of tea, open a fresh page, and step forward.",
      body: `When people speak of starting over, they often imagine packing bags, moving across an ocean, or radically reinventing their life overnight.\n\nIn reality, starting over is much quieter. It is waking up after heartbreak and deciding to make the bed anyway. It is looking at a blank journal page and writing down the one true sentence you were afraid to say yesterday.\n\nStarting over does not mean you failed the first time. It means life is inviting you to carry the wisdom of what you survived into a cleaner, more honest room.\n\nGive yourself permission to be a beginner again. There is no shame in a slow start.`,
      featuredImage: "/images/pathway-morning.jpg",
      readingTime: "4 min read",
      authorName: "Glory",
      isPublished: true,
      isFeatured: false,
      isSundayLove: false,
      categories: ["growth", "healing"],
      tags: ["becoming", "letting-go", "personal-essays"],
    },
  ];

  for (const art of articlesData) {
    const existing = await prisma.article.upsert({
      where: { slug: art.slug },
      update: {
        title: art.title,
        excerpt: art.excerpt,
        body: art.body,
        readingTime: art.readingTime,
        authorName: art.authorName,
        isPublished: art.isPublished,
        isFeatured: art.isFeatured,
        isSundayLove: art.isSundayLove,
        seriesId: art.isSundayLove ? sundayLoveSeries.id : null,
      },
      create: {
        title: art.title,
        slug: art.slug,
        excerpt: art.excerpt,
        body: art.body,
        readingTime: art.readingTime,
        authorName: art.authorName,
        isPublished: art.isPublished,
        isFeatured: art.isFeatured,
        isSundayLove: art.isSundayLove,
        seriesId: art.isSundayLove ? sundayLoveSeries.id : null,
      },
    });

    // Link Categories
    for (const catSlug of art.categories) {
      if (categories[catSlug]) {
        await prisma.articleCategory.upsert({
          where: {
            articleId_categoryId: {
              articleId: existing.id,
              categoryId: categories[catSlug].id,
            },
          },
          update: {},
          create: {
            articleId: existing.id,
            categoryId: categories[catSlug].id,
          },
        });
      }
    }

    // Link Tags
    for (const tagSlug of art.tags) {
      if (tags[tagSlug]) {
        await prisma.articleTag.upsert({
          where: {
            articleId_tagId: {
              articleId: existing.id,
              tagId: tags[tagSlug].id,
            },
          },
          update: {},
          create: {
            articleId: existing.id,
            tagId: tags[tagSlug].id,
          },
        });
      }
    }
  }

  // 6. 10 SEO Prompt Pages
  const seoPagesData = [
    {
      title: "Gentle Journal Prompts for When You're Grieving",
      slug: "gentle-journal-prompts-for-when-youre-grieving",
      question: "How do I process the weight of loss when everyday words fail?",
      intro: "Grief has its own weather. Some days the sun shines while the heart aches; other days the silence is so heavy it feels physical. Writing is not a cure for grief, but it offers a gentle sanctuary to lay your thoughts down without judgement.",
      body: "When you sit down with these prompts, remember there is no right or wrong answer. You do not need to construct eloquent sentences. Let your hand move, even if all you write is a single memory or an honest confession of how tired you feel.",
      prompts: JSON.stringify([
        "What is one memory of them that still brings warmth to your chest?",
        "What do you miss most about who you were when they were here?",
        "If you could have one more quiet conversation with them, what is the first thing you would tell them?",
        "What is one feeling you've been hiding from others so they don't worry about you?",
        "What is one way you can show gentle kindness to your body and mind today?",
      ]),
    },
    {
      title: "How Do I Start Over After a Breakup?",
      slug: "how-do-i-start-over-after-a-breakup",
      question: "How do I rebuild my routine, sense of self, and hope after love ends?",
      intro: "When a relationship concludes, we don't just mourn the person—we mourn the shared future, the private jokes, and the routines that gave our days structure.",
      body: "Rebuilding begins not with grand gestures, but with the quiet reclaiming of your own life: making tea just how you like it, rediscovering what you enjoy when no one is watching, and honoring the love you gave.",
      prompts: JSON.stringify([
        "What part of your identity did you put on hold during this relationship that you are ready to reclaim?",
        "What are three truths you learned about your capacity to love deeply?",
        "What does a peaceful evening look like for you right now?",
      ]),
    },
    {
      title: "Why Do I Feel Guilty After Someone Dies?",
      slug: "why-do-i-feel-guilty-after-someone-dies",
      question: "Why does guilt so often follow in the shadow of profound loss?",
      intro: "Survivor's guilt and lingering 'what-ifs' are some of the most agonizing, unspoken companions of grief. People wonder if they could have said something more, done something differently, or if laughing again somehow dishonors the dead.",
      body: "Guilt is often love with nowhere to go. It is our mind's attempt to rewrite an outcome we were powerless to prevent. Acknowledging guilt gently allows it to soften into memory.",
      prompts: JSON.stringify([
        "What is the specific 'what if' that your mind keeps returning to?",
        "If they were sitting beside you right now, would they want you carrying this burden?",
        "What would it feel like to forgive yourself for being human?",
      ]),
    },
    {
      title: "Journal Prompts for When You Feel Lost",
      slug: "journal-prompts-for-when-you-feel-lost",
      question: "What do I do when I feel adrift and disconnected from my purpose?",
      intro: "Feeling lost is not a moral failure; it is often the quiet signal that an old way of being has expired and a new one is waiting to take form.",
      body: "Take a deep breath. You do not need the ten-year plan today. You only need the next gentle step.",
      prompts: JSON.stringify([
        "What drained your energy most this past month?",
        "What is one small thing that made you feel like yourself recently?",
        "If you didn't have to prove anything to anyone, what would you choose to do this afternoon?",
      ]),
    },
    {
      title: "Journal Prompts for Starting Over",
      slug: "journal-prompts-for-starting-over",
      question: "How do I begin again after disappointment or an unexpected transition?",
      intro: "Starting again is an act of courageous softness. It is believing that the future still holds joy, even when the past was difficult.",
      body: "Use these prompts to lay the stones for your fresh foundation.",
      prompts: JSON.stringify([
        "What chapter of your life are you formally closing today?",
        "What lessons are you carrying forward into this new season?",
        "What is the promise you want to make to yourself for this next chapter?",
      ]),
    },
    {
      title: "How Do I Know If I Am Healing?",
      slug: "how-do-i-know-if-i-am-healing",
      question: "What are the subtle, quiet signs that recovery is taking root?",
      intro: "Healing rarely arrives with fireworks. It appears in the moments you notice you haven't cried all morning, or when a memory brings a bittersweet smile instead of panic.",
      body: "Learn to recognize the small triumphs of your healing journey.",
      prompts: JSON.stringify([
        "When was the last time you laughed without feeling guilty afterwards?",
        "How has your reaction to a recent trigger softened compared to months ago?",
        "In what ways are you more patient with your own emotions now?",
      ]),
    },
    {
      title: "Journal Prompts for Healing From Heartbreak",
      slug: "journal-prompts-for-healing-from-heartbreak",
      question: "How can I tend to my wounded heart without hardening against the world?",
      intro: "The goal of healing from heartbreak is not to become cold or detached; it is to remain open, gentle, and wise.",
      body: "Give yourself permission to grieve the ending while holding space for your own worth.",
      prompts: JSON.stringify([
        "What words do you still wish you could hear, and can you speak them to yourself today?",
        "What boundaries will protect your heart as it knits back together?",
        "What kind of love do you deserve to experience in the future?",
      ]),
    },
    {
      title: "What Do I Do When I Miss Someone I Cannot Have Back?",
      slug: "what-do-i-do-when-i-miss-someone-i-cannot-have-back",
      question: "How do I live with longing that has no earthly destination?",
      intro: "Longing can feel like an ache that has no cure. Learning to carry love without clinging to the past is one of the deepest spiritual practices of our lives.",
      body: "Honor the missing. It proves that what you experienced was real.",
      prompts: JSON.stringify([
        "Where in your body do you feel the missing most intensely?",
        "How can you channel that love into something creative, compassionate, or meaningful today?",
        "What would it mean to thank the memory and let it rest peacefully?",
      ]),
    },
    {
      title: "Journal Prompts for Self-Discovery",
      slug: "journal-prompts-for-self-discovery",
      question: "Who am I beneath the roles, expectations, and survival modes?",
      intro: "Self-discovery is the slow, delightful process of coming home to who you have always been.",
      body: "Meet yourself with curiosity rather than criticism.",
      prompts: JSON.stringify([
        "What values matter so much to you that you refuse to compromise them?",
        "What brought you pure joy as a child that you haven't done in years?",
        "Who are you when no one is watching or evaluating you?",
      ]),
    },
    {
      title: "What If I Don't Recognize Myself Anymore?",
      slug: "what-if-i-dont-recognize-myself-anymore",
      question: "How do I navigate the disorientation when profound change rewrites who I am?",
      intro: "Grief, trauma, and big transitions often shatter our previous sense of self. Feeling like a stranger in your own skin is a normal part of metamorphosis.",
      body: "You do not need to resurrect the person you were before the fire. You get to discover who survived.",
      prompts: JSON.stringify([
        "What old habit or expectation no longer fits the person you are now?",
        "What is something about your current self that is stronger or gentler than before?",
        "How can you offer yourself grace during this transition?",
      ]),
    },
  ];

  for (const sp of seoPagesData) {
    await prisma.seoPage.upsert({
      where: { slug: sp.slug },
      update: sp,
      create: sp,
    });
  }

  // 7. Products (Curated Digital Resources with placeholder specs & NGN prices)
  const productsData = [
    {
      name: "31-Day Gentle Healing Journal",
      slug: "31-day-gentle-healing-journal",
      tagline: "A gentle daily companion for navigating loss, recovery, and quiet restoration.",
      description: "A beautifully formatted 31-day digital printable journal designed to be used at your own pace. Contains curated prompts, reflective essays, daily breathing pauses, and spaces for honest journaling.",
      whoItsFor: "Anyone walking through a season of grief, heartbreak, or life change who needs structured but unhurried daily support.",
      whatsIncluded: "• 64-page high-resolution printable PDF\n• Interactive fillable digital PDF for iPad / tablets\n• 31 carefully ordered daily prompts\n• 4 weekly reflective reviews\n• Printable affirmation cards",
      price: 5000,
      currency: "NGN",
      mockupImage: "/images/mockup-journal.jpg",
      isPublished: true,
      isFeatured: true,
    },
    {
      name: "Journal Prompts for Difficult Seasons",
      slug: "journal-prompts-for-difficult-seasons",
      tagline: "Guided questions for readers who need language for what they are carrying.",
      description: "Over 60 intentional prompts organized into four thematic chapters: Grief & Absence, Transitions & Uncertainty, Self-Compassion, and Quiet Resilience.",
      whoItsFor: "Those in the thick of a hard chapter who struggle to find words when opening a blank journal.",
      whatsIncluded: "• Printable prompt cards (print at home)\n• Digital PDF guidebook\n• Chapter introductions and grounding exercises",
      price: 3500,
      currency: "NGN",
      mockupImage: "/images/mockup-prompts.jpg",
      isPublished: true,
      isFeatured: true,
    },
    {
      name: "Healing After Heartbreak Guide",
      slug: "healing-after-heartbreak-guide",
      tagline: "Practical and reflective support for navigating the aftermath of heartbreak.",
      description: "A comprehensive guide on untangling shared memories, establishing healthy emotional boundaries, and finding peace in solitary moments.",
      whoItsFor: "Anyone navigating the ending of a meaningful relationship or marriage.",
      whatsIncluded: "• 45-page deep-dive guide\n• Step-by-step emotional boundary workbook\n• Emergency 'Read When Longing Strikes' letter collection",
      price: 4500,
      currency: "NGN",
      mockupImage: "/images/mockup-heartbreak.jpg",
      isPublished: true,
      isFeatured: false,
    },
    {
      name: "The Starting Again Guide",
      slug: "the-starting-again-guide",
      tagline: "A resource for people rebuilding after change, disappointment, or sudden loss.",
      description: "A gentle roadmap for re-establishing routines, cultivating quiet confidence, and opening your heart to a fresh chapter.",
      whoItsFor: "People who have faced closed doors, unexpected career or personal resets, and want to build forward intentionally.",
      whatsIncluded: "• 50-page digital workbook\n• Values clarification matrix\n• Routine design template",
      price: 4000,
      currency: "NGN",
      mockupImage: "/images/mockup-starting-again.jpg",
      isPublished: true,
      isFeatured: false,
    },
    {
      name: "Self-Discovery Journal",
      slug: "self-discovery-journal",
      tagline: "Prompts designed to help readers understand themselves more deeply.",
      description: "Explore your core values, unlearn people-pleasing patterns, and discover the person you are becoming when fear isn't leading.",
      whoItsFor: "Anyone feeling disconnected from their true desires or wanting deeper self-intimacy.",
      whatsIncluded: "• 70-page guided journal\n• 5 self-reflection assessments\n• Fillable PDF format",
      price: 5000,
      currency: "NGN",
      mockupImage: "/images/mockup-self-discovery.jpg",
      isPublished: true,
      isFeatured: true,
    },
    {
      name: "Reflection Workbook",
      slug: "reflection-workbook",
      tagline: "Space to pause, process, learn, and move forward.",
      description: "A structured quarterly review companion to celebrate quiet growth, release lingering weights, and set soulful intentions.",
      whoItsFor: "Reflective individuals who appreciate seasonal pauses and intentional life design.",
      whatsIncluded: "• 36-page quarterly workbook\n• Year-in-review prompts\n• Printable templates",
      price: 3500,
      currency: "NGN",
      mockupImage: "/images/mockup-workbook.jpg",
      isPublished: true,
      isFeatured: false,
    },
  ];

  for (const prod of productsData) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: prod,
      create: prod,
    });
  }

  console.log("Seeding completed successfully! All categories, tags, series, pathways, articles, SEO topics, and products seeded.");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
