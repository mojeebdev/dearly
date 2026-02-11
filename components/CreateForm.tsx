"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Generation failed | Dearly");

      const { id } = await res.json();
      router.push(`/g/${id}`);
    } catch (err) {
      alert("Something went wrong. Please try again. | Dearly");
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
          placeholder="e.g., partner, best friend, mom, colleague"
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
          Takes about 5 seconds · Free · No sign-up required
        </p>
      </motion.div>
    </motion.form>
  );
}