"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Sparkles,
  User,
  Users,
  Palette,
  PartyPopper,
} from "lucide-react";
import Button from "./ui/Button";
import PhotoUpload from "./PhotoUpload";

const occasions = [
  { value: "birthday", label: "Birthday", emoji: "🎂" },
  { value: "valentine", label: "Valentine's Day", emoji: "💕" },
  { value: "anniversary", label: "Anniversary", emoji: "💍" },
  { value: "appreciation", label: "Appreciation", emoji: "🌟" },
  { value: "friendship", label: "Friendship", emoji: "🤝" },
  { value: "other", label: "Just Because", emoji: "✨" },
];

const tones = [
  { value: "dearly", label: "Dearly", desc: "Warm & sincere" },
  { value: "romantic", label: "Romantic", desc: "Poetic & tender" },
  { value: "funny", label: "Funny", desc: "Witty & playful" },
  { value: "inspirational", label: "Inspirational", desc: "Uplifting" },
];

export default function CreateForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [customOccasion, setCustomOccasion] = useState("");
  const [form, setForm] = useState({
    recipientName: "",
    senderName: "",
    relationship: "",
    occasion: "birthday",
    traits: "",
    hobbies: "",
    tone: "dearly",
    photoUrl: "",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const isCustomOccasion = form.occasion === "other";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    
    const finalOccasion =
      isCustomOccasion && customOccasion.trim()
        ? customOccasion.trim()
        : form.occasion;

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, occasion: finalOccasion }),
      });

      if (!res.ok) throw new Error("Dearly, Generation failed");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("Dearly, Connection failed");

      const decoder = new TextDecoder();
      let buffer = "";
      let finalSlug = "";
      let finalId = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Accumulate all chunks into a buffer
        buffer += decoder.decode(value, { stream: true });

        // Look for our clearly-marked metadata line anywhere in the buffer
        const metaIndex = buffer.indexOf("__META__");
        if (metaIndex !== -1) {
          try {
            const metaJson = buffer.slice(metaIndex + "__META__".length);
            const meta = JSON.parse(metaJson);
            finalSlug = meta.slug || "";
            finalId = meta.id || "";
          } catch {
           
          }
        }
      }

      
      const metaIndex = buffer.indexOf("__META__");
      if (metaIndex !== -1 && !finalSlug && !finalId) {
        try {
          const metaJson = buffer.slice(metaIndex + "__META__".length);
          const meta = JSON.parse(metaJson);
          finalSlug = meta.slug || "";
          finalId = meta.id || "";
        } catch {
          console.error("Final meta parse failed. Buffer tail:", buffer.slice(metaIndex));
        }
      }

      const destination = finalSlug || finalId;
      if (destination) {
        router.push(`/g/${destination}`);
      } else {
        throw new Error("Dearly, Missing redirect destination");
      }
    } catch (err) {
      console.error(err);
      alert("Dearly, Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const stagger = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      variants={stagger}
      initial="hidden"
      animate="show"
      className="max-w-2xl mx-auto space-y-8"
    >
      {/* Occasion Selection */}
      <motion.div variants={item} className="space-y-3">
        <label className="block text-sm font-medium text-guardian-muted">
          <PartyPopper className="w-4 h-4 inline mr-1.5" />
          What's the occasion?
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {occasions.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => update("occasion", o.value)}
              className={`p-3 rounded-xl text-center transition-all duration-300 text-sm
                ${
                  form.occasion === o.value
                    ? "bg-guardian-gold/20 border-2 border-guardian-gold shadow-md"
                    : "bg-white/50 border-2 border-transparent hover:border-guardian-goldLight/50"
                }`}
            >
              <span className="text-2xl block mb-1">{o.emoji}</span>
              <span className="text-xs font-medium">{o.label}</span>
            </button>
          ))}
        </div>

        {/* Custom occasion input — appears when Just Because is selected */}
        <AnimatePresence>
          {isCustomOccasion && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <input
                type="text"
                placeholder="What's the occasion? e.g., promotion, new home, just love them..."
                value={customOccasion}
                onChange={(e) => setCustomOccasion(e.target.value)}
                className="guardian-input mt-2"
                autoFocus
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Names Row */}
      <motion.div variants={item} className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-guardian-muted">
            <Heart className="w-4 h-4 inline mr-1.5" />
            Their name *
          </label>
          <input
            required
            type="text"
            placeholder="e.g., Sarah"
            value={form.recipientName}
            onChange={(e) => update("recipientName", e.target.value)}
            className="guardian-input"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-guardian-muted">
            <User className="w-4 h-4 inline mr-1.5" />
            Your name *
          </label>
          <input
            required
            type="text"
            placeholder="e.g., Alex"
            value={form.senderName}
            onChange={(e) => update("senderName", e.target.value)}
            className="guardian-input"
          />
        </div>
      </motion.div>

      {/* Relationship */}
      <motion.div variants={item} className="space-y-2">
        <label className="block text-sm font-medium text-guardian-muted">
          <Users className="w-4 h-4 inline mr-1.5" />
          Your relationship
        </label>
        <input
          type="text"
          placeholder="e.g., sibling, partner, best friend, mom, colleague"
          value={form.relationship}
          onChange={(e) => update("relationship", e.target.value)}
          className="guardian-input"
        />
      </motion.div>

      {/* Traits */}
      <motion.div variants={item} className="space-y-2">
        <label className="block text-sm font-medium text-guardian-muted">
          <Sparkles className="w-4 h-4 inline mr-1.5" />
          What makes them special? *
        </label>
        <textarea
          required
          rows={3}
          placeholder="e.g., She lights up every room, always knows the right thing to say, fiercely loyal..."
          value={form.traits}
          onChange={(e) => update("traits", e.target.value)}
          className="guardian-input resize-none"
        />
      </motion.div>

      {/* Hobbies */}
      <motion.div variants={item} className="space-y-2">
        <label className="block text-sm font-medium text-guardian-muted">
          <Palette className="w-4 h-4 inline mr-1.5" />
          Their hobbies & interests
        </label>
        <input
          type="text"
          placeholder="e.g., painting, hiking, cooking Italian food, reading sci-fi"
          value={form.hobbies}
          onChange={(e) => update("hobbies", e.target.value)}
          className="guardian-input"
        />
      </motion.div>

      {/* Tone Selection */}
      <motion.div variants={item} className="space-y-3">
        <label className="block text-sm font-medium text-guardian-muted">
          Message tone
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {tones.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => update("tone", t.value)}
              className={`p-3 rounded-xl text-center transition-all duration-300
                ${
                  form.tone === t.value
                    ? "bg-guardian-gold/20 border-2 border-guardian-gold"
                    : "bg-white/50 border-2 border-transparent hover:border-guardian-goldLight/50"
                }`}
            >
              <span className="text-sm font-medium block">{t.label}</span>
              <span className="text-xs text-guardian-muted">{t.desc}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Photo Upload */}
      <motion.div variants={item}>
        <PhotoUpload
          onUpload={(url) => update("photoUrl", url)}
          currentUrl={form.photoUrl}
        />
      </motion.div>

      {/* Submit */}
      <motion.div variants={item} className="pt-4">
        <Button type="submit" loading={loading} className="w-full text-lg py-4">
          {loading ? "Crafting your message..." : "✨ Create Greeting"}
        </Button>
        <p className="text-center text-xs text-guardian-muted/50 mt-3">
          Takes about 30 seconds · Free · No sign-up required
        </p>
      </motion.div>
    </motion.form>
  );
}