"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Heart,
  ShoppingBag,
  Menu,
  X,
  User,
  Home,
  LogOut,
  Package,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { useAuthUser } from "@/hooks/useAuthUser";
import { useClerk } from "@clerk/nextjs";
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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const openCart = useCartStore((s) => s.openCart);
  const itemCount = useCartStore((s) => s.itemCount());
  const { user } = useAuthUser();
  const { signOut } = useClerk();

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

  // Close user menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <header
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-500",
          scrolled ? "glass-strong py-3 shadow-lg" : "bg-transparent py-6"
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

            {/* Desktop User Menu / Auth Buttons */}
            {user ? (
              <div ref={userMenuRef} className="relative hidden md:block">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 p-1 pr-2.5 transition-all hover:bg-white/10 hover:border-white/25 focus:outline-none"
                  aria-expanded={userMenuOpen}
                  aria-label="User account menu"
                >
                  {user.imageUrl ? (
                    <Image
                      src={user.imageUrl}
                      alt={user.name || "User avatar"}
                      width={24}
                      height={24}
                      className="h-6 w-6 rounded-full object-cover ring-1 ring-white/20"
                      unoptimized
                    />
                  ) : (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 font-heading text-[11px] font-bold text-white shadow-sm">
                      {(user.name || user.email || "?").charAt(0).toUpperCase()}
                    </span>
                  )}
                  <ChevronDown
                    size={12}
                    className={cn(
                      "text-white/60 transition-transform duration-200",
                      userMenuOpen && "rotate-180 text-white"
                    )}
                  />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="glass-strong absolute right-0 mt-2.5 w-60 rounded-2xl border border-white/15 p-2 shadow-2xl backdrop-blur-xl"
                    >
                      {/* User Info Header */}
                      <div className="flex items-center gap-2.5 border-b border-white/10 px-3 py-2.5">
                        {user.imageUrl ? (
                          <Image
                            src={user.imageUrl}
                            alt={user.name || "User avatar"}
                            width={32}
                            height={32}
                            className="h-8 w-8 rounded-full object-cover ring-1 ring-white/20"
                            unoptimized
                          />
                        ) : (
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 font-heading text-xs font-bold text-white shadow-sm">
                            {(user.name || user.email || "?").charAt(0).toUpperCase()}
                          </span>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-heading text-xs font-bold text-white truncate">
                            {user.name || "Collector"}
                          </p>
                          <p className="text-[11px] text-white/50 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      {/* Menu Links */}
                      <div className="space-y-0.5 py-1.5">
                        <Link
                          href="/account"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          <User size={14} className="text-purple-400" />
                          <span>My Account</span>
                        </Link>
                        <Link
                          href="/account/orders"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          <Package size={14} className="text-blue-400" />
                          <span>My Orders</span>
                        </Link>
                        <Link
                          href="/account/wishlist"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                        >
                          <Heart size={14} className="text-pink-400" />
                          <span>Wishlist</span>
                        </Link>
                        {user.isAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-accent-purple transition-colors hover:bg-white/10 hover:text-accent-pink"
                          >
                            <ShieldCheck size={14} />
                            <span>Admin Panel</span>
                          </Link>
                        )}
                      </div>

                      {/* Log Out Action */}
                      <div className="border-t border-white/10 pt-1.5">
                        <button
                          type="button"
                          onClick={async () => {
                            setUserMenuOpen(false);
                            await signOut({ redirectUrl: "/" });
                          }}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-400 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
                        >
                          <LogOut size={14} />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/login"
                  aria-label="Sign In"
                  className="flex items-center"
                >
                  <span className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-xs font-heading font-medium text-white/90 backdrop-blur-sm transition-all hover:border-accent-purple/50 hover:bg-white/10 hover:text-white">
                    <User size={13} className="text-accent-purple" />
                    <span>Sign In</span>
                  </span>
                </Link>
                <Link
                  href="/sign-up"
                  aria-label="Sign Up"
                  className="flex items-center"
                >
                  <span className="flex items-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-3.5 py-1 text-xs font-heading font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-95">
                    <span>Sign Up</span>
                  </span>
                </Link>
              </div>
            )}

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

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="glass-strong mt-4 overflow-hidden border-t border-white/10 md:hidden"
            >
              <div className="flex flex-col gap-4 px-6 py-6">
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    setSearchOpen(true);
                  }}
                  className="flex items-center gap-2.5 rounded-2xl bg-white/5 px-4 py-2.5 font-heading text-sm text-white/70 text-left border border-white/10"
                >
                  <Search size={16} className="text-accent-purple" />
                  <span>Search anime gear...</span>
                </button>

                <Link
                  href="/"
                  className="flex items-center gap-2 font-heading font-semibold text-white/90"
                  onClick={() => setMobileOpen(false)}
                >
                  <Home size={18} className="text-accent-pink" />
                  <span>Home</span>
                </Link>

                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-heading text-white/80 transition-colors hover:text-white"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="flex items-center justify-between border-t border-white/10 pt-3">
                  <span className="font-heading text-xs text-white/60">
                    Theme Appearance
                  </span>
                  <ThemeToggle />
                </div>

                {/* Mobile Auth & User Profile Section */}
                <div className="border-t border-white/10 pt-4 space-y-3">
                  {user ? (
                    <>
                      <div className="flex items-center gap-3 rounded-2xl bg-white/5 p-3 border border-white/10">
                        {user.imageUrl ? (
                          <Image
                            src={user.imageUrl}
                            alt={user.name || "User avatar"}
                            width={36}
                            height={36}
                            className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-white/20"
                            unoptimized
                          />
                        ) : (
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 font-heading text-sm font-bold text-white shadow-sm">
                            {(user.name || user.email || "?").charAt(0).toUpperCase()}
                          </span>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="font-heading text-sm font-bold text-white truncate">
                            {user.name || "Collector"}
                          </p>
                          <p className="text-xs text-white/50 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1 pl-1">
                        <Link
                          href="/account"
                          className="flex items-center gap-2.5 py-2 font-heading text-sm text-white/80 hover:text-white"
                          onClick={() => setMobileOpen(false)}
                        >
                          <User size={16} className="text-purple-400" />
                          <span>My Account</span>
                        </Link>
                        <Link
                          href="/account/orders"
                          className="flex items-center gap-2.5 py-2 font-heading text-sm text-white/80 hover:text-white"
                          onClick={() => setMobileOpen(false)}
                        >
                          <Package size={16} className="text-blue-400" />
                          <span>My Orders</span>
                        </Link>
                        <Link
                          href="/account/wishlist"
                          className="flex items-center gap-2.5 py-2 font-heading text-sm text-white/80 hover:text-white"
                          onClick={() => setMobileOpen(false)}
                        >
                          <Heart size={16} className="text-pink-400" />
                          <span>Wishlist</span>
                        </Link>
                        {user.isAdmin && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-2.5 py-2 font-heading text-sm font-semibold text-accent-purple"
                            onClick={() => setMobileOpen(false)}
                          >
                            <ShieldCheck size={16} />
                            <span>Admin Panel</span>
                          </Link>
                        )}
                      </div>

                      {/* Prominent Mobile Log Out Button */}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={async () => {
                            setMobileOpen(false);
                            await signOut({ redirectUrl: "/" });
                          }}
                          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 py-2.5 font-heading text-xs font-semibold text-rose-400 transition-colors hover:bg-rose-500/20 active:scale-95"
                        >
                          <LogOut size={15} />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Link
                        href="/login"
                        className="flex items-center justify-center gap-2 rounded-2xl bg-white/10 py-3 font-heading text-sm font-semibold text-white transition-colors hover:bg-white/20"
                        onClick={() => setMobileOpen(false)}
                      >
                        <User size={15} className="text-accent-purple" />
                        <span>Sign In</span>
                      </Link>
                      <Link
                        href="/sign-up"
                        className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 py-3 font-heading text-sm font-semibold text-white transition-colors hover:opacity-95"
                        onClick={() => setMobileOpen(false)}
                      >
                        <span>Sign Up</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}


