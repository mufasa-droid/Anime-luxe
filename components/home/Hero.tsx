"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight, Star, Flame } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { formatCurrency } from "@/lib/utils";

interface HeroSlide {
  id: string;
  tabLabel: string;
  anime: string;
  tagline: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
  themeGradient: string;
  glowColor: string;
  accentClass: string;
  product: {
    title: string;
    category: string;
    price: number;
    rating: number;
    image: string;
    slug: string;
    badge: string;
  };
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: "naruto-pain",
    tabLabel: "Pain (Akatsuki)",
    anime: "Naruto",
    tagline: "NEW SEASON DROP — AKATSUKI PAIN",
    title: "KNOW PAIN,\nFEEL LUXURY",
    subtitle:
      "Heavyweight graphic apparel, shinobi aesthetic silhouettes, and collector drops forged in the rain.",
    ctaText: "Explore Pain Drop",
    ctaHref: "/product/pain-tee",
    themeGradient: "from-red-600 via-rose-500 to-amber-500",
    glowColor: "rgba(220, 38, 38, 0.25)",
    accentClass: "text-rose-400 border-rose-500/30 bg-rose-500/10",
    product: {
      title: "Nagato “Pain” Tee Shirt",
      category: "Heavyweight Cotton",
      price: 24435,
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80",
      slug: "pain-tee",
      badge: "Trending Drop",
    },
  },
  {
    id: "solo-leveling",
    tabLabel: "Solo Leveling",
    anime: "Solo Leveling",
    tagline: "SHADOW MONARCH COLLECTION",
    title: "ARISE AS THE\nMONARCH",
    subtitle:
      "Precision cut streetwear, obsidian windbreakers, and electric cyber apparel crafted for high-rank hunters.",
    ctaText: "Shop Solo Leveling",
    ctaHref: "/product/shadow-monarch-jacket",
    themeGradient: "from-cyan-400 via-blue-500 to-indigo-600",
    glowColor: "rgba(6, 182, 212, 0.25)",
    accentClass: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
    product: {
      title: "Shadow Monarch Jacket",
      category: "Obsidian Streetwear",
      price: 67500,
      rating: 5.0,
      image:
        "https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80",
      slug: "shadow-monarch-jacket",
      badge: "Monarch Vault",
    },
  },
  {
    id: "jujutsu",
    tabLabel: "Jujutsu Kaisen",
    anime: "Jujutsu Kaisen",
    tagline: "SPECIAL GRADE APPAREL",
    title: "UNLEASH YOUR\nCURSED ENERGY",
    subtitle:
      "Domain Expansion streetwear, luxury heavyweight tees, and talisman graphics engineered for modern sorcerers.",
    ctaText: "Shop Jujutsu Kaisen",
    ctaHref: "/product/jujutsu-kaisen-tee-shirt",
    themeGradient: "from-purple-500 via-violet-400 to-blue-500",
    glowColor: "rgba(168, 85, 247, 0.25)",
    accentClass: "text-purple-400 border-purple-500/30 bg-purple-500/10",
    product: {
      title: "Jujutsu Kaisen Tee Shirt",
      category: "Luxury Streetwear",
      price: 22050,
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80",
      slug: "jujutsu-kaisen-tee-shirt",
      badge: "Special Grade",
    },
  },
  {
    id: "attack-on-titan",
    tabLabel: "Attack on Titan",
    anime: "Attack on Titan",
    tagline: "SCOUT REGIMENT EXCLUSIVE",
    title: "DEDICATE YOUR\nHEART IN STYLE",
    subtitle:
      "Humanity's strongest silhouettes, vintage washed graphic tees, and military precision tailoring.",
    ctaText: "View Levi Drop",
    ctaHref: "/product/levi-ackermann",
    themeGradient: "from-emerald-500 via-teal-400 to-cyan-500",
    glowColor: "rgba(168, 85, 247, 0.25)",
    accentClass: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
    product: {
      title: "Levi Ackermann Aesthe Tee Shirt",
      category: "Vintage Wash Heavyweight",
      price: 23850,
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80",
      slug: "levi-ackermann",
      badge: "Scout Elite",
    },
  },
  {
    id: "naruto-ninja-way",
    tabLabel: "Ninja Way",
    anime: "Naruto",
    tagline: "SHINOBI LEGACY EDITION",
    title: "FORGE YOUR\nNINJA WAY",
    subtitle:
      "Signature heritage drops, premium spun cotton, and timeless iconography from the Hidden Leaf.",
    ctaText: "Shop Ninja Way",
    ctaHref: "/product/ninja-way-collection",
    themeGradient: "from-amber-400 via-orange-400 to-red-500",
    glowColor: "rgba(245, 158, 11, 0.25)",
    accentClass: "text-amber-300 border-amber-500/30 bg-amber-500/10",
    product: {
      title: "Ninja Way Tee Shirt",
      category: "Heritage Collection",
      price: 22500,
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
      slug: "ninja-way-collection",
      badge: "Best Seller",
    },
  },
];

export function Hero() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
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

  // Auto-play carousel every 6 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const slide: HeroSlide = HERO_SLIDES[activeIdx] ?? HERO_SLIDES[0]!;

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-base-950 pt-28 pb-16"
    >
      {/* Dynamic Mouse-reactive atmospheric glow */}
      <motion.div
        style={{ left: glowX, top: glowY, backgroundColor: slide.glowColor }}
        className="pointer-events-none absolute h-[650px] w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[140px] transition-colors duration-1000"
      />

      {/* Floating gradient orbs */}
      <div className="absolute -left-20 top-20 h-72 w-72 animate-float rounded-full bg-accent-pink/15 blur-[100px]" />
      <div
        className="absolute -right-20 bottom-20 h-96 w-96 animate-float rounded-full bg-accent-blue/15 blur-[100px]"
        style={{ animationDelay: "2s" }}
      />

      {/* Cyber Grid background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 w-full">
        {/* Anime Universe Selector Tabs */}
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
          {HERO_SLIDES.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setActiveIdx(idx)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-all ${
                activeIdx === idx
                  ? "bg-accent-purple text-white shadow-glow scale-105"
                  : "glass text-white/70 hover:text-white hover:bg-white/10"
              }`}
            >
              {s.tabLabel}
            </button>
          ))}
        </div>

        {/* Main Content Grid: Typography on Left, 3D Product Showcase on Right */}
        <div className="grid items-center gap-12 lg:grid-cols-12">
          {/* Left Column: Story & CTAs */}
          <div className="text-center lg:text-left lg:col-span-7 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1 text-xs font-semibold tracking-widest ${slide.accentClass}`}
                >
                  <Sparkles size={12} />
                  {slide.tagline}
                </span>

                <h1 className="font-heading text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl whitespace-pre-line">
                  {slide.title.split("\n")[0]}
                  <br />
                  <span
                    className={`bg-gradient-to-r ${slide.themeGradient} bg-clip-text text-transparent`}
                  >
                    {slide.title.split("\n")[1]}
                  </span>
                </h1>

                <p className="max-w-xl text-base sm:text-lg text-white/70 mx-auto lg:mx-0">
                  {slide.subtitle}
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                  <Link href={slide.ctaHref}>
                    <MagneticButton className="!px-8 !py-3.5">
                      <span className="flex items-center gap-2">
                        <span>{slide.ctaText}</span>
                        <ArrowRight size={16} />
                      </span>
                    </MagneticButton>
                  </Link>

                  <Link href="/shop">
                    <MagneticButton variant="secondary" className="!px-7 !py-3.5">
                      Explore All Collections
                    </MagneticButton>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: 3D-Tilt Floating Merchandise Card */}
          <div className="flex justify-center lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotateY: -15 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="glass-strong relative w-full max-w-sm rounded-3xl p-5 border border-white/15 shadow-2xl"
              >
                {/* Product Image Thumbnail */}
                <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-base-900 border border-white/10">
                  <Image
                    src={slide.product.image}
                    alt={slide.product.title}
                    fill
                    priority
                    className="object-cover transition-transform duration-700 hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 rounded-full bg-black/75 backdrop-blur-md border border-white/20 px-3 py-1 text-[11px] font-bold text-white flex items-center gap-1">
                    <Flame size={12} className="text-accent-pink" />
                    <span className="text-white-always">{slide.product.badge}</span>
                  </span>
                </div>

                {/* Card Info */}
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-white/50">{slide.product.category}</span>
                    <h4 className="font-heading text-base font-bold text-white truncate max-w-[200px]">
                      {slide.product.title}
                    </h4>
                  </div>
                  <div className="text-right">
                    <span className="font-heading text-lg font-bold text-white">
                      {formatCurrency(slide.product.price)}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] text-amber-400 justify-end">
                      <Star size={11} className="fill-amber-400" />
                      <span>{slide.product.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Quick Link Button */}
                <Link
                  href={`/product/${slide.product.slug}`}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-white/10 py-2.5 text-xs font-semibold text-white transition-all hover:bg-white/20 hover:shadow-glow"
                >
                  <span>Inspect Drop</span>
                  <ArrowRight size={13} />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Carousel Navigation Arrows & Indicators */}
        <div className="mt-12 flex items-center justify-between border-t border-white/10 pt-6">
          <div className="flex items-center gap-2">
            {HERO_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeIdx === idx
                    ? "w-8 bg-gradient-to-r " + slide.themeGradient
                    : "w-2 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setActiveIdx((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))
              }
              aria-label="Previous slide"
              className="glass rounded-full p-2.5 text-white/60 hover:text-white transition-colors hover:bg-white/10"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setActiveIdx((prev) => (prev + 1) % HERO_SLIDES.length)}
              aria-label="Next slide"
              className="glass rounded-full p-2.5 text-white/60 hover:text-white transition-colors hover:bg-white/10"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
