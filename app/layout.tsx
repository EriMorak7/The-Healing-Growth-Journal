import type { Metadata } from "next";
import "./globals.css";
import PublicShell from "@/components/PublicShell";
import { SITE_CONFIG } from "@/lib/constants";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.NEXTAUTH_URL ||
  "https://thehealingandgrowthjournal.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description:
    "An editorial sanctuary dedicated to emotional healing, self-discovery, grief support, and personal growth. Home of The Sunday Love Series.",
  keywords: [
    "healing journal",
    "grief support",
    "emotional healing",
    "self discovery",
    "journal prompts",
    "Sunday love series",
    "personal growth",
    "counselling psychology",
    "Glory Ekanem",
  ],
  authors: [{ name: SITE_CONFIG.author }],
  alternates: {
    types: {
      "application/rss+xml": `${siteUrl}/feed.xml`,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description:
      "A quiet, thoughtful space dedicated to emotional healing, self-discovery, grief support, and personal growth.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: SITE_CONFIG.name,
        url: siteUrl,
        logo: `${siteUrl}${SITE_CONFIG.logoUrl}`,
        sameAs: [SITE_CONFIG.substackUrl],
        description: SITE_CONFIG.vision,
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: SITE_CONFIG.name,
        description: SITE_CONFIG.tagline,
        publisher: {
          "@id": `${siteUrl}/#organization`,
        },
      },
    ],
  };

  return (
    <html
      lang="en"
      className="scroll-smooth"
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#22160D] antialiased selection:bg-[#CBDECE] selection:text-[#1A281E]">
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}
