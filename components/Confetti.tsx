"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

interface ConfettiProps {
  occasion: string;
}

export default function Confetti({ occasion }: ConfettiProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (occasion === "birthday") {
        // Birthday: colorful burst
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#C8956C", "#D4707A", "#A8B5A0", "#FFD700", "#FF69B4"],
        });
      } else if (occasion === "valentine") {
        // Valentine: hearts-like (red/pink)
        const end = Date.now() + 2000;
        const frame = () => {
          confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ["#D4707A", "#FF69B4", "#FF1493"],
          });
          confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ["#D4707A", "#FF69B4", "#FF1493"],
          });
          if (Date.now() < end) requestAnimationFrame(frame);
        };
        frame();
      } else {
        
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
          colors: ["#C8956C", "#E8C9A8", "#D4707A"],
        });
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [occasion]);

  return null;
}