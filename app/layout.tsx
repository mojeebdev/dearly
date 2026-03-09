import type { Metadata } from "next";
import "./global.css";
import { Heart } from "lucide-react";
import { Analytics } from "@vercel/analytics/next"
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Dearly",
  "url": "https://dearly.icu",
  "image": "https://dearly.icu/icon_dearly/apple-touch-icon.png",
  "description": "AI-powered platform generating deeply personal, heartfelt greeting pages for specific personas like entrepreneurs, students, and family heads.",
  "applicationCategory": "LifestyleApplication",
  "operatingSystem": "Web",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Free personalized greeting generation"
  },
  "keywords": "AI greetings, personalized letters, deeply personal messages"
};

export const metadata: Metadata = {
  title: "Dearly — Beautiful Personal Greetings",
  description: "'I see you.' AI-powered greeting web pages tailored to their unique personality. Heartfelt, instant, and free to try at Dearly.",
  metadataBase: new URL("https://dearly.icu"),
  icons: {
    icon: "/icon_dearly/favicon.ico",
    shortcut: "/icon_dearly/favicon.ico",
    apple: "/icon_dearly/apple-touch-icon.png",
  },
  keywords: [
    "AI greeting card generator",
    "Personalized digital greetings",
    "Dearly ICU",
    "Heartfelt AI letters",
    "Digital keepsakes for family",
    "Birthday wishes for tech entrepreneurs",
    "Sentimental messages for parents",
    "Motivation for gym goers",
    "Encouragement for stressed students",
    "Appreciation for 9-5 professionals",
    "Greetings for vegetarians and foodies",
    "Traditionalist birthday cards",
    "Alternatives to e-cards",
    "How to write a deep personal letter",
    "AI message writer for loved ones",
    "Bespoke greeting pages",
    "Thoughtful online gifts",
    "Generate emotional birthday messages",
    "Personalized anniversary notes",
    "Meaningful digital cards",
    "Write a letter to a foodie",
    "Gemini AI greeting generator",
    "Custom web page greetings",
    "How to say I see you conceptually",
    "Personal connection tools",
    "Unique digital letter templates",
    "Modern empathy tools",
    "Instant personalized poetry",
    "Relationship strengthening app",
    "Thoughtful messages for busy people"
  ],
  openGraph: {
    title: "Dearly — I See You ✨",
    description: "Personalized digital greetings that truly see the person you love.",
    url: "https://dearly.icu",
    siteName: "Dearly",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://dearly.icu/og-image.jpg", 
        width: 1200,
        height: 630,
        alt: "Dearly - AI Personalized Greetings",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        {/* INJECT SCHEMA FOR AI & SEARCH ENGINES */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="flex flex-col min-h-screen font-sans antialiased bg-guardian-cream text-guardian-deep">
        <main className="flex-grow">
          {children}
        </main>

        {/* --- BRANDING FOOTER --- */}
        <footer className="border-t border-guardian-goldLight/20 py-8 text-center text-sm text-guardian-muted/40">
        Made with <Heart className="w-3 h-3 inline text-guardian-rose" fill="currentColor" /> by{" "}
        <a 
          href="https://mojeeb.xyz" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-guardian-gold transition-colors font-medium"
        >
          Mojeeb
        </a> · {new Date().getFullYear()}
        <p className="text-sm text-guardian-muted/60">  dearly.icu — <em>I see you</em> ✨</p>
      </footer>
      <Analytics/>
      </body>
    </html>
  );
}
