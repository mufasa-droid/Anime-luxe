"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Heart, ShoppingBag, Menu, X, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { useAuthUser } from "@/hooks/useAuthUser";
import { cn } from "@/lib/utils";
import { SearchModal } from "@/components/layout/SearchModal";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const NAV_LINKS = [
  { label: "Shop", href: "/shop" },
  { label: "Shop by Anime", href: "/anime" },
  { label: "Limited Editions", href: "/shop?filter=limited" },
  { label: "Mystery Boxes", href: "/shop?category=mystery-boxes" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const openCart = useCartStore((s) => s.openCart);
  const itemCount = useCartStore((s) => s.itemCount());
  const { user } = useAuthUser();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Keyboard shortcut: Cmd+K or Ctrl+K to open search
  useEffect(() => {
    function handleGlobalKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, []);

  return (
    <>
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <header
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-500",
          scrolled ? "glass-strong py-3" : "bg-transparent py-6"
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6">
          <Link
            href="/"
            className="font-heading text-xl font-bold tracking-tight text-white"
          >
            ANIME<span className="text-gradient">LUXE</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-heading text-sm font-medium text-white/70 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 md:gap-4">
            <button
              aria-label="Search products"
              onClick={() => setSearchOpen(true)}
              className="group flex items-center gap-2 text-white/80 transition-colors hover:text-white"
            >
              <Search size={20} className="transition-transform group-hover:scale-110" />
              <span className="hidden rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-white/40 lg:inline-block">
                ⌘K
              </span>
            </button>

            <ThemeToggle />

            <Link
              href={user ? "/account" : "/login"}
              aria-label={user ? "Account" : "Login"}
              className="flex items-center"
            >
              {user ? (
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-accent-purple to-accent-pink font-heading text-xs font-bold text-white shadow-sm shadow-accent-purple/30">
                  {(user.name || user.email || "?").charAt(0).toUpperCase()}
                </span>
              ) : (
                <span className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-heading font-medium text-white/90 backdrop-blur-sm transition-all hover:border-accent-purple/50 hover:bg-white/10 hover:text-white">
                  <User size={14} className="text-accent-purple" />
                  <span>Login</span>
                </span>
              )}
            </Link>
          <Link
            href="/account/wishlist"
            aria-label="Wishlist"
            className="text-white/80 transition-colors hover:text-white"
          >
            <Heart size={20} />
          </Link>
          <button
            aria-label="Open cart"
            onClick={openCart}
            className="relative text-white/80 transition-colors hover:text-white"
          >
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-accent-pink text-[10px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </button>
          <button
            className="text-white/80 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="glass-strong mt-4 overflow-hidden md:hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-6">
              <button
                type="button"
                onClick={() => {
                  setMobileOpen(false);
                  setSearchOpen(true);
                }}
                className="flex items-center gap-2.5 rounded-2xl bg-white/5 px-4 py-2.5 font-heading text-sm text-white/70 text-left"
              >
                <Search size={16} className="text-accent-purple" />
                <span>Search anime gear...</span>
              </button>
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-heading text-white/80"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center justify-between border-t border-white/10 pt-3">
                <span className="font-heading text-xs text-white/60">Theme Appearance</span>
                <ThemeToggle />
              </div>
              <Link
                href={user ? "/account" : "/login"}
                className="flex items-center gap-2 font-heading text-white/90"
                onClick={() => setMobileOpen(false)}
              >
                <User size={16} className="text-accent-purple" />
                <span>{user ? "My Account" : "Login / Sign In"}</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </header>
    </>
  );
}

