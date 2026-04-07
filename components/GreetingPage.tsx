"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Heart, Calendar } from "lucide-react";
import ShareButtons from "./ShareButtons";
import Confetti from "./Confetti";
import { getOccasionEmoji, getOccasionGradient } from "../lib/utils";

interface Greeting {
  id: string;
  slug?: string | null;
  recipient_name: string;
  sender_name: string;
  relationship: string;
  occasion: string;
  message: string;
  photo_url: string | null;
  created_at: string;
  view_count?: number;
}

export default function GreetingPage({ greeting }: { greeting: Greeting }) {
  const {
    id,
    slug,
    recipient_name,
    sender_name,
    occasion,
    message,
    photo_url,
    created_at,
  } = greeting;

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.18], [0, -60]);
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://dearly.icu";
  const shareUrl = `${baseUrl}/g/${slug ?? id}`;
  const emoji = getOccasionEmoji(occasion);
  const gradient = getOccasionGradient(occasion);

  const formattedDate = new Date(created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Split message into paragraphs for staggered reveal
  const paragraphs = message
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div
      ref={containerRef}
      className={`min-h-screen bg-gradient-to-br ${gradient} relative`}
    >
      <Confetti occasion={occasion} />

      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 h-[2px] bg-guardian-gold z-50 origin-left"
        style={{ width: progressWidth }}
      />

      {/* Hero Section — full viewport */}
      <motion.section
        style={{ opacity: heroOpacity, y: heroY }}
        className="sticky top-0 h-screen flex flex-col items-center justify-center text-center px-6 pointer-events-none"
      >
        {/* Ambient blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.15, 1], rotate: [0, 10, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-32 -left-32 w-96 h-96 bg-guardian-gold/8 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.1, 1, 1.1], rotate: [0, -8, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-32 -right-32 w-[28rem] h-[28rem] bg-guardian-rose/8 rounded-full blur-3xl"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, type: "spring", stiffness: 120 }}
          className="relative z-10"
        >
          <span className="text-7xl sm:text-8xl block mb-8 drop-shadow-lg">
            {emoji}
          </span>

          <p className="text-xs uppercase tracking-[0.3em] text-guardian-muted/60 mb-4 font-medium">
            A message crafted with love
          </p>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-guardian-deep leading-tight">
            For{" "}
            <span className="relative inline-block">
              <span className="relative z-10 text-guardian-gold">
                {recipient_name}
              </span>
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="absolute bottom-1 left-0 right-0 h-[6px] bg-guardian-gold/15 rounded-full origin-left"
              />
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-6 text-guardian-muted/50 text-sm tracking-wide"
          >
            Scroll to read ↓
          </motion.p>
        </motion.div>
      </motion.section>

      {/* Content — scrolls over hero */}
      <div className="relative z-10 mt-[-10vh]">
        <div className="max-w-2xl mx-auto px-6 pb-24 space-y-10">

          {/* Photo */}
          {photo_url && (
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="flex justify-center pt-8"
            >
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-br from-guardian-gold/20 via-guardian-rose/10 to-transparent rounded-[2rem] blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute -inset-[1px] bg-gradient-to-br from-guardian-gold/30 to-transparent rounded-[1.5rem]" />
                <img
                  src={photo_url}
                  alt={`Photo for ${recipient_name}`}
                  className="relative w-72 h-72 sm:w-80 sm:h-80 object-cover rounded-[1.4rem] shadow-2xl"
                />
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
                  className="absolute -top-4 -right-4 text-3xl"
                >
                  💛
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Message card */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="guardian-card relative overflow-hidden"
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-guardian-gold/60 to-transparent" />

            <div className="p-8 sm:p-12">
              {/* Opening quote mark */}
              <div className="text-7xl font-serif text-guardian-gold/20 leading-none -mb-4 select-none">
                "
              </div>

              {/* Paragraphs with staggered reveal */}
              <div className="space-y-5">
                {paragraphs.map((para, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-20px" }}
                    transition={{
                      duration: 0.7,
                      delay: i * 0.08,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="font-serif text-lg sm:text-xl leading-[1.85] text-guardian-deep/90"
                  >
                    {para}
                  </motion.p>
                ))}
              </div>

              {/* Closing quote mark */}
              <div className="text-7xl font-serif text-guardian-gold/20 leading-none text-right -mt-4 select-none">
                "
              </div>

              {/* Sender + date */}
              <div className="mt-8 pt-6 border-t border-guardian-goldLight/20 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <Heart
                    className="w-4 h-4 text-guardian-rose flex-shrink-0"
                    fill="currentColor"
                  />
                  <span className="font-medium text-guardian-deep/80 text-sm">
                    With love,{" "}
                    <span className="font-serif text-base text-guardian-deep">
                      {sender_name}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-guardian-muted/40">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-xs tracking-wide">{formattedDate}</span>
                </div>
              </div>
            </div>

            {/* Bottom accent */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-guardian-gold/30 to-transparent" />
          </motion.div>

          {/* Share section */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center space-y-6 pt-4"
          >
            <div className="flex items-center gap-3 justify-center">
              <div className="h-px w-12 bg-gradient-to-r from-transparent to-guardian-goldLight/40" />
              <span className="text-xs uppercase tracking-[0.25em] text-guardian-muted/50 font-medium">
                Share this greeting
              </span>
              <div className="h-px w-12 bg-gradient-to-l from-transparent to-guardian-goldLight/40" />
            </div>

            <ShareButtons
              url={shareUrl}
              recipientName={recipient_name}
              occasion={occasion}
            />
          </motion.div>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center pt-8"
          >
            <a
              href="/"
              className="inline-flex items-center gap-2 text-xs text-guardian-muted/30
                         hover:text-guardian-gold transition-colors duration-300 tracking-wide"
            >
              <Heart className="w-3 h-3" />
              Create your own greeting at Dearly
            </a>
          </motion.footer>
        </div>
      </div>
    </div>
  );
}