"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import {
  Share2,
  Copy,
  Check,
  MessageCircle,
  QrCode,
  X,
} from "lucide-react";

interface ShareButtonsProps {
  url: string;
  recipientName: string;
  occasion: string;
}

export default function ShareButtons({
  url,
  recipientName,
  occasion,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const shareText = `I made something special for ${recipientName} ✨`;

  const copyLink = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareText + "\n" + url)}`,
      "_blank"
    );
  };

  const shareTwitter = () => {
    window.open(
      `https://x.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`,
      "_blank"
    );
  };

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `A Special Message for ${recipientName}`,
          text: shareText,
          url,
        });
      } catch {
        // User cancelled
      }
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-center gap-3">
        {/* Copy Link */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={copyLink}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                     bg-white/70 border border-guardian-goldLight/40
                     text-guardian-deep hover:bg-white/90 transition-all text-sm"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          {copied ? "Copied!" : "Copy Link"}
        </motion.button>

        {/* WhatsApp */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={shareWhatsApp}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                     bg-green-500 text-white hover:bg-green-600
                     transition-all text-sm"
        >
          <MessageCircle className="w-4 h-4" />
          WhatsApp
        </motion.button>

        {/* Twitter/X */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={shareTwitter}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                     bg-black text-white hover:bg-gray-800
                     transition-all text-sm"
        >
          <X className="w-4 h-4" />
          Post
        </motion.button>

        {/* QR Code */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowQR(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                     bg-white/70 border border-guardian-goldLight/40
                     text-guardian-deep hover:bg-white/90 transition-all text-sm"
        >
          <QrCode className="w-4 h-4" />
          QR
        </motion.button>

        {/* Native Share (mobile) */}
        {"share" in navigator && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={nativeShare}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                       guardian-button text-sm"
          >
            <Share2 className="w-4 h-4" />
            Share
          </motion.button>
        )}
      </div>

      {/* QR Modal */}
      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm
                       flex items-center justify-center p-4"
            onClick={() => setShowQR(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="guardian-card p-8 text-center max-w-xs"
            >
              <button
                onClick={() => setShowQR(false)}
                className="absolute top-3 right-3 p-1 hover:bg-guardian-goldLight/20 rounded-full"
              >
                <X className="w-4 h-4" />
              </button>
              <p className="text-sm text-guardian-muted mb-4">
                Scan to open the greeting
              </p>
              <div className="inline-block p-4 bg-white rounded-2xl">
                <QRCodeSVG
                  value={url}
                  size={180}
                  fgColor="#2C1810"
                  bgColor="#FFFFFF"
                />
              </div>
              <p className="text-xs text-guardian-muted/60 mt-4">
                For {recipientName}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}