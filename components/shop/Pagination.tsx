import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  totalPages: number;
  searchParams: Record<string, string | string[] | undefined>;
}

function buildHref(
  searchParams: PaginationProps["searchParams"],
  page: number
) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (key === "page") continue;
    if (Array.isArray(value)) value.forEach((v) => params.append(key, v));
    else if (value) params.set(key, value);
  }
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `/shop?${qs}` : "/shop";
}

export function Pagination({ page, totalPages, searchParams }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1
  );

  return (
    <nav className="mt-12 flex items-center justify-center gap-2">
      <Link
        href={buildHref(searchParams, Math.max(1, page - 1))}
        aria-disabled={page === 1}
        className={cn(
          "glass rounded-full p-2.5 text-white/70 hover:text-white",
          page === 1 && "pointer-events-none opacity-30"
        )}
      >
        <ChevronLeft size={16} />
      </Link>

      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-2">
          {i > 0 && pages[i - 1] !== p - 1 && (
            <span className="text-white/30">…</span>
          )}
          <Link
            href={buildHref(searchParams, p)}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors",
              p === page
                ? "bg-gradient-to-r from-accent-purple to-accent-pink text-white"
                : "glass text-white/70 hover:text-white"
            )}
          >
            {p}
          </Link>
        </span>
      ))}

      <Link
        href={buildHref(searchParams, Math.min(totalPages, page + 1))}
        aria-disabled={page === totalPages}
        className={cn(
          "glass rounded-full p-2.5 text-white/70 hover:text-white",
          page === totalPages && "pointer-events-none opacity-30"
        )}
      >
        <ChevronRight size={16} />
      </Link>
    </nav>
  );
}
