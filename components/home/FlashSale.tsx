"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { Zap } from "lucide-react";

function getTimeLeft(target: number) {
  const diff = Math.max(0, target - Date.now());
  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function FlashSale() {
  const [target] = useState(() => Date.now() + 1000 * 60 * 60 * 6);
  const [time, setTime] = useState(() => getTimeLeft(target));

  useEffect(() => {
    const interval = setInterval(() => setTime(getTimeLeft(target)), 1000);
    return () => clearInterval(interval);
  }, [target]);

  return (
    <section className="px-4 sm:px-6 py-10 sm:py-20">
      <div className="glass-strong relative mx-auto max-w-7xl overflow-hidden rounded-2xl sm:rounded-3xl px-4 py-8 sm:px-8 sm:py-14 text-center border border-white/15 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-red/10 via-accent-purple/10 to-accent-pink/10" />
        <div className="relative">
          <span className="mb-3 sm:mb-4 inline-flex items-center gap-1.5 rounded-full bg-accent-red/20 px-3.5 py-1 text-[11px] sm:text-xs font-bold tracking-widest text-accent-red border border-accent-red/30">
            <Zap size={12} className="fill-accent-red" />
            FLASH SALE
          </span>
          <h2 className="font-heading text-2xl xs:text-3xl font-bold text-white sm:text-4xl md:text-5xl tracking-tight">
            Up to 40% Off Select Drops
          </h2>
          <div className="mt-6 sm:mt-8 flex items-center justify-center gap-2.5 sm:gap-4">
            {[
              { label: "Hours", value: time.hours },
              { label: "Minutes", value: time.minutes },
              { label: "Seconds", value: time.seconds },
            ].map((unit) => (
              <div key={unit.label} className="glass min-w-[64px] sm:min-w-[80px] rounded-xl sm:rounded-2xl px-2.5 py-2 sm:px-4 sm:py-3 border border-white/10">
                <div className="font-heading text-xl sm:text-3xl font-bold text-white">
                  {String(unit.value).padStart(2, "0")}
                </div>
                <div className="text-[10px] sm:text-xs uppercase tracking-wider text-white/50 mt-0.5">
                  {unit.label}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 sm:mt-8">
            <Link href="/shop?discount=true" className="inline-block w-full sm:w-auto">
              <MagneticButton variant="primary" className="w-full sm:w-auto !py-3 !px-8">
                Shop the Sale
              </MagneticButton>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
