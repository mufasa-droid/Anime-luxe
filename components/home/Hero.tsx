"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MagneticButton } from "@/components/ui/MagneticButton";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const glowX = useTransform(springX, [-0.5, 0.5], ["30%", "70%"]);
  const glowY = useTransform(springY, [-0.5, 0.5], ["30%", "70%"]);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-base-950"
    >
      {/* Mouse-reactive glow */}
      <motion.div
        style={{ left: glowX, top: glowY }}
        className="pointer-events-none absolute h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-purple/20 blur-[120px]"
      />

      {/* Floating gradient orbs */}
      <div className="absolute -left-20 top-20 h-72 w-72 animate-float rounded-full bg-accent-pink/20 blur-[100px]" />
      <div
        className="absolute -right-20 bottom-20 h-96 w-96 animate-float rounded-full bg-accent-blue/20 blur-[100px]"
        style={{ animationDelay: "2s" }}
      />

      {/* Grid overlay for cyber feel */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass mb-6 inline-block rounded-full px-4 py-1.5 text-xs font-medium tracking-widest text-white/70"
        >
          NEW SEASON DROP — LIMITED RUN
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-heading text-6xl font-bold leading-[1.05] tracking-tight text-white sm:text-7xl md:text-8xl"
        >
          WEAR YOUR
          <br />
          <span className="text-gradient">FAVORITE WORLD</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mx-auto mt-6 max-w-xl text-lg text-white/60"
        >
          Premium apparel, collectible figures, and jewelry inspired by the
          anime you live for. Crafted for collectors. Made to last.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <MagneticButton>Shop New Arrivals</MagneticButton>
          <MagneticButton variant="secondary">Explore Collections</MagneticButton>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.8, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40"
      >
        <div className="h-9 w-5 rounded-full border border-white/20 p-1">
          <div className="h-1.5 w-1.5 rounded-full bg-white/60" />
        </div>
      </motion.div>
    </section>
  );
}
