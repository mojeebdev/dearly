import { Heart, Sparkles, ArrowRight } from "lucide-react";
import CreateForm from "@/components/CreateForm";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-guardian-cream via-white to-guardian-cream">
      {/* Navbar */}
      <nav className="border-b border-guardian-goldLight/20 bg-white/50 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-guardian-rose" fill="currentColor" />
            <span className="font-serif text-xl font-bold text-guardian-deep">
              Dearly
            </span>
          </div>
          <span className="text-xs text-guardian-muted/50 hidden sm:block">
            AI-powered personal greetings
          </span>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-guardian-gold/10 text-guardian-gold text-sm mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          Free · No sign-up · 30 seconds
        </div>

        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-guardian-deep leading-tight mb-6">
          Create a greeting
          <br />
          <span className="text-guardian-gold">they'll never forget</span>
        </h1>

        <p className="text-lg text-guardian-muted max-w-xl mx-auto mb-4">
          Tell us about someone you love. Our AI crafts a beautiful, personal
          message on a stunning shareable page — just for them.
        </p>

        <div className="flex items-center justify-center gap-6 text-sm text-guardian-muted/60 mb-12">
          <span>🎂 Birthdays</span>
          <span>💕 Valentine's</span>
          <span>💍 Anniversaries</span>
          <span>✨ Any occasion</span>
        </div>
      </section>

      {/* Form Section */}
      <section className="max-w-5xl mx-auto px-6 pb-24">
        <div className="guardian-card p-8 sm:p-12">
          <CreateForm />
        </div>
      </section>
      
    </div>
  );
}