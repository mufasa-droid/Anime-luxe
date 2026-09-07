"use client";

import { useEffect, useState } from "react";
import { MagneticButton } from "@/components/ui/MagneticButton";

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
    <section className="px-6 py-20">
      <div className="glass-strong relative mx-auto max-w-7xl overflow-hidden rounded-3xl px-8 py-14 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-accent-red/10 via-accent-purple/10 to-accent-pink/10" />
        <div className="relative">
          <span className="mb-4 inline-block rounded-full bg-accent-red/20 px-4 py-1 text-xs font-bold tracking-widest text-accent-red">
            FLASH SALE
          </span>
          <h2 className="font-heading text-4xl font-bold text-white sm:text-5xl">
            Up to 40% Off Select Drops
          </h2>
          <div className="mt-8 flex items-center justify-center gap-4">
            {[
              { label: "Hours", value: time.hours },
              { label: "Minutes", value: time.minutes },
              { label: "Seconds", value: time.seconds },
            ].map((unit) => (
              <div key={unit.label} className="glass min-w-[80px] rounded-2xl px-4 py-3">
                <div className="font-heading text-3xl font-bold text-white">
                  {String(unit.value).padStart(2, "0")}
                </div>
                <div className="text-xs uppercase tracking-wider text-white/50">
                  {unit.label}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <MagneticButton variant="primary">Shop the Sale</MagneticButton>
          </div>
        </div>
      </div>
    </section>
  );
}
