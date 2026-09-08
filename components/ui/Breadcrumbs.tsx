"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight, Home, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  backHref?: string;
  backLabel?: string;
  className?: string;
}

export function Breadcrumbs({
  items,
  backHref,
  backLabel = "Back",
  className,
}: BreadcrumbsProps) {
  const router = useRouter();

  function handleBack() {
    if (backHref) {
      router.push(backHref);
    } else {
      router.back();
    }
  }

  return (
    <div
      className={cn(
        "mb-6 flex flex-wrap items-center justify-between gap-4",
        className
      )}
    >
      {/* Breadcrumb Navigation Trail */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs">
        <Link
          href="/"
          className="flex items-center gap-1 text-neutral-500 hover:text-neutral-900 dark:text-white/60 dark:hover:text-white transition-colors p-1 rounded-md hover:bg-neutral-200/50 dark:hover:bg-white/5"
          title="Home"
        >
          <Home size={14} />
          <span className="sr-only sm:not-sr-only sm:inline-block">Home</span>
        </Link>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <div key={index} className="flex items-center gap-1.5">
              <ChevronRight size={13} className="text-neutral-400 dark:text-white/30 shrink-0" />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-neutral-500 hover:text-neutral-900 dark:text-white/60 dark:hover:text-white transition-colors truncate max-w-[160px] sm:max-w-none font-normal"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(
                    "font-medium truncate max-w-[200px] sm:max-w-none",
                    isLast
                      ? "text-neutral-900 dark:text-white font-semibold"
                      : "text-neutral-500 dark:text-white/60"
                  )}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </div>
          );
        })}
      </nav>

      {/* Back Button */}
      <button
        type="button"
        onClick={handleBack}
        className="glass group flex items-center gap-2 rounded-full border border-neutral-300 dark:border-white/10 px-3.5 py-1.5 text-xs font-semibold text-neutral-800 dark:text-white/80 hover:text-neutral-950 dark:hover:text-white hover:bg-neutral-200/70 dark:hover:bg-white/10 transition-all active:scale-95 shadow-sm"
      >
        <ArrowLeft
          size={14}
          className="transition-transform group-hover:-translate-x-0.5 text-neutral-700 dark:text-white/70"
        />
        <span>{backLabel}</span>
      </button>
    </div>
  );
}
