"use client";

import { motion } from "framer-motion";
import { Heart, Calendar, Sparkles } from "lucide-react";
import ShareButtons from "./ShareButtons";
import Confetti from "./Confetti";
import { getOccasionEmoji, getOccasionGradient } from "@/lib/utils";

interface Greeting {
  id: string;
  recipient_name: string;
  sender_name: string;
  relationship: string;
  occasion: string;
  message: string;
  photo_url: string | null;
  created_at: string;
}

export default function GreetingPage({ greeting }: { greeting: Greeting }) {
  const {
    id,
    recipient_name,
    sender_name,
    occasion,
    message,
    photo_url,
    created_at,
  } = greeting;

  const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/g/${id}`;
  const emoji = getOccasionEmoji(occasion);
  const gradient = getOccasionGradient(occasion);

  const formattedDate = new Date(created_at).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${gradient} relative overflow-hidden`}
    >
      {/* Confetti Effect */}
      <Confetti occasion={occasion} />

      {/* Floating decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ y: [-20, 20, -20] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-32 h-32 bg-guardian-gold/5 rounded-full blur-2xl"
        />
        <motion.div
          animate={{ y: [20, -20, 20] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-32 right-10 w-40 h-40 bg-guardian-rose/5 rounded-full blur-2xl"
        />
        <motion.div
          animate={{ y: [-15, 15, -15] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 w-24 h-24 bg-guardian-sage/5 rounded-full blur-2xl"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 py-16 sm:py-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="text-5xl sm:text-6xl block mb-6"
          >
            {emoji}
          </motion.span>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-guardian-deep leading-tight">
            A Special Message
            <br />
            <span className="text-guardian-gold">for {recipient_name}</span>
          </h1>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="w-24 h-0.5 bg-gradient-to-r from-transparent via-guardian-gold to-transparent mx-auto mt-6"
          />
        </motion.div>

        {/* Photo Section */}
        {photo_url && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mb-12 flex justify-center"
          >
            <div className="relative">
              <div className="absolute -inset-3 bg-gradient-to-br from-guardian-gold/20 to-guardian-rose/20 rounded-3xl blur-lg" />
              <img
                src={photo_url}
                alt={`Photo for ${recipient_name}`}
                className="relative w-64 h-64 sm:w-72 sm:h-72 object-cover rounded-2xl
                           shadow-2xl shadow-guardian-gold/10
                           border-4 border-white/80"
              />
              {/* Decorative corner hearts */}
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-3 -right-3 text-2xl"
              >
                💛
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Message Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="guardian-card p-8 sm:p-12 mb-12 animate-glow"
        >
          {/* Decorative quote mark */}
          <div className="text-6xl text-guardian-goldLight/40 font-serif leading-none mb-4">
            "
          </div>

          {/* The AI-generated message */}
          <div className="font-serif text-lg sm:text-xl leading-relaxed text-guardian-deep/90 whitespace-pre-line">
            {message}
          </div>

          {/* Closing quote */}
          <div className="text-6xl text-guardian-goldLight/40 font-serif leading-none text-right mt-4">
            "
          </div>

          {/* Sender attribution */}
          <div className="mt-8 pt-6 border-t border-guardian-goldLight/20 flex items-center justify-between">
            <div className="flex items-center gap-2 text-guardian-muted">
              <Heart className="w-4 h-4 text-guardian-rose" fill="currentColor" />
              <span className="text-sm font-medium">
                With love, {sender_name}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-guardian-muted/50">
              <Calendar className="w-3.5 h-3.5" />
              <span className="text-xs">{formattedDate}</span>
            </div>
          </div>
        </motion.div>

        {/* Share Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="text-center space-y-6"
        >
          <div className="flex items-center justify-center gap-2 text-guardian-muted">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">Share this greeting</span>
            <Sparkles className="w-4 h-4" />
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
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-20 text-center"
        >
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm text-guardian-muted/40
                       hover:text-guardian-gold transition-colors"
          >
            <Heart className="w-3.5 h-3.5" />
            Create your own greeting at Dearly
          </a>
        </motion.footer>
      </div>
    </div>
  );
}