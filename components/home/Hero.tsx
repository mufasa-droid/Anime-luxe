"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, type PanInfo } from "framer-motion";
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight, Star, Flame, Pause, Play } from "lucide-react";
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
    id: "naruto-itachi",
    tabLabel: "Itachi (Uchiha)",
    anime: "Naruto",
    tagline: "NEW SEASON DROP — TSUKUYOMI GENJUTSU",
    title: "KNOW TSUKUYOMI,\nFEEL LUXURY",
    subtitle:
      "420GSM luxury heavyweight streetwear fleece, Akatsuki red cloud embroidery, and shinobi silhouette drops.",
    ctaText: "Explore Itachi Drop",
    ctaHref: "/product/itachi-blood-moon-crows-front-back-hoodie",
    themeGradient: "from-red-600 via-rose-500 to-amber-500",
    glowColor: "rgba(220, 38, 38, 0.25)",
    accentClass: "text-rose-400 border-rose-500/30 bg-rose-500/10",
    product: {
      title: "Itachi Blood Moon Crows Hoodie",
      category: "Heavyweight Fleece",
      price: 42000,
      rating: 5.0,
      image: "/images/products/itachi-blood-moon-crows-front-back-hoodie.jpeg",
      slug: "itachi-blood-moon-crows-front-back-hoodie",
      badge: "Trending Drop",
    },
  },
  {
    id: "solo-leveling",
    tabLabel: "Solo Leveling",
    anime: "Solo Leveling",
    tagline: "SHADOW MONARCH VAULT",
    title: "ARISE AS THE\nSHADOW MONARCH",
    subtitle:
      "Precision cut luxury streetwear, obsidian full-zip knitwear, and high-rank hunter drops engineered in Seoul.",
    ctaText: "Shop Solo Leveling",
    ctaHref: "/product/solo-leveling-arise-zip-jacket",
    themeGradient: "from-cyan-400 via-blue-500 to-indigo-600",
    glowColor: "rgba(6, 182, 212, 0.25)",
    accentClass: "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
    product: {
      title: "Shadow Monarch 'Arise' Jacket",
      category: "Obsidian Knitwear",
      price: 48000,
      rating: 5.0,
      image: "/images/products/solo-leveling-arise-zip-jacket.jpeg",
      slug: "solo-leveling-arise-zip-jacket",
      badge: "Monarch Vault",
    },
  },
  {
    id: "jujutsu",
    tabLabel: "Gojo Limitless",
    anime: "Jujutsu Kaisen",
    tagline: "SPECIAL GRADE APPAREL",
    title: "DOMAIN EXPANSION,\nLIMITLESS DRIP",
    subtitle:
      "420GSM varsity stripe heavyweight fleece, Gojo blindfold hand-signs, and talisman graphics engineered for modern sorcerers.",
    ctaText: "Shop Gojo Drop",
    ctaHref: "/product/gojo-satoru-limitless-varsity-hoodie",
    themeGradient: "from-purple-500 via-violet-400 to-blue-500",
    glowColor: "rgba(168, 85, 247, 0.25)",
    accentClass: "text-purple-400 border-purple-500/30 bg-purple-500/10",
    product: {
      title: "Satoru Gojo Limitless Hoodie",
      category: "Varsity Stripe Fleece",
      price: 40000,
      rating: 5.0,
      image: "/images/products/gojo-satoru-limitless-varsity-hoodie.jpeg",
      slug: "gojo-satoru-limitless-varsity-hoodie",
      badge: "Special Grade",
    },
  },
  {
    id: "hunter-x-hunter",
    tabLabel: "Killua (HxH)",
    anime: "Hunter x Hunter",
    tagline: "ASSASSIN STREET CULTURE",
    title: "ASSASSIN INSTINCT,\nSTREET CULTURE",
    subtitle:
      "Ultra-heavyweight 420GSM French terry, lightning god aesthetics, and exclusive Tokyo streetwear drops.",
    ctaText: "Shop Killua Drop",
    ctaHref: "/product/killua-zoldyck-slurp-heavyweight-hoodie",
    themeGradient: "from-emerald-400 via-teal-400 to-cyan-500",
    glowColor: "rgba(16, 185, 129, 0.25)",
    accentClass: "text-emerald-300 border-emerald-500/30 bg-emerald-500/10",
    product: {
      title: "Killua Zoldyck 'Sip' Hoodie",
      category: "French Terry Fleece",
      price: 38000,
      rating: 4.9,
      image: "/images/products/killua-zoldyck-slurp-heavyweight-hoodie.jpeg",
      slug: "killua-zoldyck-slurp-heavyweight-hoodie",
      badge: "Best Seller",
    },
  },
  {
    id: "attack-on-titan",
    tabLabel: "Scout Regiment",
    anime: "Attack on Titan",
    tagline: "SCOUT REGIMENT EXCLUSIVE",
    title: "DEDICATE HEART,\nFORGE FREEDOM",
    subtitle:
      "Humanity's strongest silhouettes, Wings of Freedom dual sleeve graphics, and military precision tailoring.",
    ctaText: "View Levi Drop",
    ctaHref: "/product/levi-ackerman-wings-of-freedom-hoodie",
    themeGradient: "from-amber-400 via-orange-400 to-red-500",
    glowColor: "rgba(245, 158, 11, 0.25)",
    accentClass: "text-amber-300 border-amber-500/30 bg-amber-500/10",
    product: {
      title: "Captain Levi Wings Hoodie",
      category: "Scout Elite Fleece",
      price: 42000,
      rating: 5.0,
      image: "/images/products/levi-ackerman-wings-of-freedom-hoodie.jpeg",
      slug: "levi-ackerman-wings-of-freedom-hoodie",
      badge: "Scout Elite",
    },
  },
];

export function Hero() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [dragDirection, setDragDirection] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const tabsScrollRef = useRef<HTMLDivElement>(null);

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

  const nextSlide = useCallback(() => {
    setDragDirection(1);
    setActiveIdx((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDragDirection(-1);
    setActiveIdx((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1));
  }, []);

  // Auto-play carousel every 6 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Scroll active tab into view on mobile
  useEffect(() => {
    const container = tabsScrollRef.current;
    if (!container) return;
    const activeBtn = container.children[activeIdx] as HTMLElement | undefined;
    if (activeBtn) {
      const scrollLeft =
        activeBtn.offsetLeft - container.offsetWidth / 2 + activeBtn.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, [activeIdx]);

  // Touch Swipe Handler for Mobile
  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const swipeThreshold = 40;
    if (info.offset.x < -swipeThreshold || info.velocity.x < -400) {
      nextSlide();
    } else if (info.offset.x > swipeThreshold || info.velocity.x > 400) {
      prevSlide();
    }
  };

  const slide: HeroSlide = HERO_SLIDES[activeIdx] ?? HERO_SLIDES[0]!;

  return (
    <section
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative flex min-h-[90vh] sm:min-h-screen items-center justify-center overflow-hidden bg-base-950 pt-20 pb-10 sm:pt-32 sm:pb-20"
    >
      {/* Dynamic Mouse-reactive atmospheric glow */}
      <motion.div
        style={{ left: glowX, top: glowY, backgroundColor: slide.glowColor }}
        className="pointer-events-none absolute h-[320px] w-[320px] sm:h-[650px] sm:w-[650px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[80px] sm:blur-[140px] transition-colors duration-1000 opacity-60 sm:opacity-100"
      />

      {/* Floating gradient orbs */}
      <div className="absolute -left-16 top-16 h-52 w-52 sm:h-72 sm:w-72 animate-float rounded-full bg-accent-pink/15 blur-[80px] sm:blur-[100px]" />
      <div
        className="absolute -right-16 bottom-16 h-64 w-64 sm:h-96 sm:w-96 animate-float rounded-full bg-accent-blue/15 blur-[80px] sm:blur-[100px]"
        style={{ animationDelay: "2s" }}
      />

      {/* Cyber Grid background */}
      <div
        className="absolute inset-0 opacity-[0.04] dark:opacity-[0.03] text-neutral-950 dark:text-white"
        style={{
          backgroundImage:
            "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 w-full">
        {/* Anime Universe Selector Tabs (Smooth horizontal swipe on mobile, wrap on desktop) */}
        <div className="mb-4 sm:mb-8 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div
            ref={tabsScrollRef}
            className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar scrollbar-hide py-1 sm:flex-wrap sm:justify-center"
          >
            {HERO_SLIDES.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  setDragDirection(idx > activeIdx ? 1 : -1);
                  setActiveIdx(idx);
                }}
                className={`shrink-0 rounded-full px-2.5 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-semibold tracking-wide transition-all ${
                  activeIdx === idx
                    ? "bg-accent-purple text-white shadow-glow scale-105"
                    : "glass text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                {s.tabLabel}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content Grid: Typography on Left, 3D Product Showcase on Right */}
        <div className="grid items-center gap-6 lg:gap-12 lg:grid-cols-12">
          {/* Left Column: Story & CTAs */}
          <div className="text-center lg:text-left lg:col-span-7 space-y-3.5 sm:space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.45 }}
                className="space-y-3.5 sm:space-y-6"
              >
                <div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-0.5 sm:px-3.5 sm:py-1 text-[10px] sm:text-xs font-semibold tracking-widest ${slide.accentClass}`}
                  >
                    <Sparkles size={11} className="shrink-0" />
                    <span className="truncate">{slide.tagline}</span>
                  </span>
                </div>

                <h1 className="font-heading text-2xl xs:text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.12] sm:leading-[1.08] tracking-tight text-white whitespace-pre-line break-words">
                  {slide.title.split("\n")[0]}
                  <br />
                  <span
                    className={`bg-gradient-to-r ${slide.themeGradient} bg-clip-text text-transparent`}
                  >
                    {slide.title.split("\n")[1]}
                  </span>
                </h1>

                <p className="max-w-xl text-xs sm:text-base md:text-lg text-white/75 mx-auto lg:mx-0 leading-relaxed">
                  {slide.subtitle}
                </p>

                {/* Call-to-action buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-1 sm:pt-2">
                  <Link href={slide.ctaHref} className="w-full sm:w-auto">
                    <MagneticButton className="w-full sm:w-auto !px-6 sm:!px-8 !py-3 sm:!py-3.5 text-center">
                      <span className="flex items-center justify-center gap-2">
                        <span>{slide.ctaText}</span>
                        <ArrowRight size={15} />
                      </span>
                    </MagneticButton>
                  </Link>

                  <Link href="/shop" className="w-full sm:w-auto">
                    <MagneticButton
                      variant="secondary"
                      className="w-full sm:w-auto !px-6 sm:!px-7 !py-3 sm:!py-3.5 text-center"
                    >
                      Explore Vault
                    </MagneticButton>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: Touch-Swipeable 3D Floating Merchandise Card */}
          <div className="flex justify-center lg:col-span-5 touch-pan-y">
            <div className="relative w-full max-w-[310px] xs:max-w-[340px] sm:max-w-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.id}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleDragEnd}
                  initial={{ opacity: 0, scale: 0.92, x: dragDirection * 50 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.92, x: -dragDirection * 50 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="glass-strong relative w-full cursor-grab active:cursor-grabbing rounded-3xl p-4 sm:p-5 border border-white/15 shadow-2xl backdrop-blur-xl"
                >
                  {/* Product Image Thumbnail */}
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-base-900 border border-white/10">
                    <Image
                      src={slide.product.image}
                      alt={slide.product.title}
                      fill
                      priority
                      sizes="(max-width: 640px) 280px, (max-width: 1024px) 340px, 380px"
                      className="object-cover transition-transform duration-700 hover:scale-105 pointer-events-none"
                    />
                    <span className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 rounded-full bg-black/75 backdrop-blur-md border border-white/20 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] font-bold text-white flex items-center gap-1">
                      <Flame size={11} className="text-accent-pink" />
                      <span className="text-white-always">{slide.product.badge}</span>
                    </span>
                  </div>

                  {/* Card Info */}
                  <div className="mt-3.5 sm:mt-4 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] sm:text-xs text-white/50 block truncate">
                        {slide.product.category}
                      </span>
                      <h4 className="font-heading text-xs sm:text-base font-bold text-white truncate">
                        {slide.product.title}
                      </h4>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-heading text-sm sm:text-lg font-bold text-white block">
                        {formatCurrency(slide.product.price)}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-amber-400 justify-end">
                        <Star size={11} className="fill-amber-400" />
                        <span>{slide.product.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Link Button */}
                  <Link
                    href={`/product/${slide.product.slug}`}
                    className="mt-3.5 sm:mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-white/10 py-2 sm:py-2.5 text-xs font-semibold text-white transition-all hover:bg-white/20 hover:shadow-glow active:scale-95"
                  >
                    <span>Inspect Drop</span>
                    <ArrowRight size={13} />
                  </Link>
                </motion.div>
              </AnimatePresence>

              {/* Mobile Quick Swipe Chevron Overlays */}
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous drop"
                className="absolute -left-3 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white/80 hover:text-white sm:hidden shadow-lg"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next drop"
                className="absolute -right-3 top-1/2 -translate-y-1/2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white/80 hover:text-white sm:hidden shadow-lg"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Navigation Bar (Progress indicators, Counter, and Controls) */}
        <div className="mt-8 sm:mt-12 flex items-center justify-between border-t border-white/10 pt-4 sm:pt-6">
          {/* Progress Indicators & Slide Counter */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <span className="font-mono text-xs font-bold text-white/70">
              0{activeIdx + 1} <span className="text-white/30">/ 0{HERO_SLIDES.length}</span>
            </span>
            <div className="flex items-center gap-1.5 sm:gap-2">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDragDirection(idx > activeIdx ? 1 : -1);
                    setActiveIdx(idx);
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeIdx === idx
                      ? "w-6 sm:w-8 bg-gradient-to-r " + slide.themeGradient
                      : "w-1.5 sm:w-2 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Autoplay Pause/Play & Arrow Controls */}
          <div className="hidden sm:flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setIsPaused((prev) => !prev)}
              aria-label={isPaused ? "Play carousel" : "Pause carousel"}
              title={isPaused ? "Play carousel" : "Pause carousel"}
              className="glass rounded-full p-2 text-white/60 hover:text-white transition-colors hover:bg-white/10"
            >
              {isPaused ? <Play size={14} /> : <Pause size={14} />}
            </button>
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="glass rounded-full p-2 sm:p-2.5 text-white/60 hover:text-white transition-colors hover:bg-white/10"
            >
              <ChevronLeft size={16} className="sm:h-4 sm:w-4" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="glass rounded-full p-2 sm:p-2.5 text-white/60 hover:text-white transition-colors hover:bg-white/10"
            >
              <ChevronRight size={16} className="sm:h-4 sm:w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

