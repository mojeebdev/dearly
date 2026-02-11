"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  children: React.ReactNode;
}

export default function Button({
  loading,
  variant = "primary",
  children,
  className = "",
  ...props
}: ButtonProps) {
  const variants = {
    primary: "guardian-button",
    secondary:
      "px-8 py-3.5 bg-white/70 border border-guardian-goldLight/50 text-guardian-deep font-medium rounded-xl hover:bg-white/90 transition-all duration-300",
    ghost:
      "px-6 py-2.5 text-guardian-muted hover:text-guardian-deep hover:bg-guardian-goldLight/20 rounded-xl transition-all duration-300",
  };

  return (
    <motion.button
      whileHover={{ scale: loading ? 1 : 1.02 }}
      whileTap={{ scale: loading ? 1 : 0.98 }}
      className={`${variants[variant]} ${className} flex items-center justify-center gap-2`}
      disabled={loading || props.disabled}
      {...(props as any)}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </motion.button>
  );
}