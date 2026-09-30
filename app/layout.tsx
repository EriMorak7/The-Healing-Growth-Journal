import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans, Lora } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_CONFIG } from "@/lib/constants";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-editorial",
  display: "swap",
});

export const metadata: Metadata = {
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
  ],
  authors: [{ name: SITE_CONFIG.author }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "http://localhost:3000",
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
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${jakarta.variable} ${lora.variable} scroll-smooth`}
    >
      <body className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#22160D] antialiased selection:bg-[#CBDECE] selection:text-[#1A281E]">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
