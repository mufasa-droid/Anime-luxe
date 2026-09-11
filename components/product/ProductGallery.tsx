"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { RotateCw, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomActive, setZoomActive] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [mode, setMode] = useState<"gallery" | "360">("gallery");
  const dragState = useRef<{ startX: number; startIndex: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const has360 = images.length > 1;

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (mode !== "gallery") return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin({ x, y });
  }

  function handle360PointerDown(e: React.PointerEvent<HTMLDivElement>) {
    dragState.current = { startX: e.clientX, startIndex: activeIndex };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }

  function handle360PointerMove(e: React.PointerEvent<HTMLDivElement>) {
    if (!dragState.current || mode !== "360") return;
    const delta = e.clientX - dragState.current.startX;
    // Every ~40px of drag advances one frame — with only a couple of
    // product photos this simulates rotation; swap in a real 8–24 frame
    // sprite sequence per product for a true 360° asset in production.
    const framesMoved = Math.round(delta / 40);
    const nextIndex =
      (((dragState.current.startIndex + framesMoved) % images.length) +
        images.length) %
      images.length;
    setActiveIndex(nextIndex);
  }

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => mode === "gallery" && setZoomActive(true)}
        onMouseLeave={() => setZoomActive(false)}
        onPointerDown={mode === "360" ? handle360PointerDown : undefined}
        onPointerMove={mode === "360" ? handle360PointerMove : undefined}
        className={cn(
          "glass relative aspect-square w-full overflow-hidden rounded-3xl",
          mode === "360" ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"
        )}
      >
        <Image
          src={images[activeIndex] ?? images[0] ?? ""}
          alt={`${title} — view ${activeIndex + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="pointer-events-none select-none object-cover transition-transform duration-200"
          style={
            zoomActive && mode === "gallery"
              ? {
                  transform: "scale(1.8)",
                  transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                }
              : undefined
          }
        />

        <div className="absolute right-3.5 top-3.5 sm:right-4 sm:top-4 flex gap-2">
          {has360 && (
            <button
              onClick={() => setMode((m) => (m === "360" ? "gallery" : "360"))}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur-sm transition-colors shadow-md",
                mode === "360"
                  ? "bg-accent-purple text-white"
                  : "bg-black/50 text-white/90 hover:bg-black/70 border border-white/15"
              )}
            >
              <RotateCw size={12} />
              <span>360°</span>
            </button>
          )}
          {mode === "gallery" && (
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-xs text-white/60 border border-white/10 backdrop-blur-sm">
              <ZoomIn size={12} />
              Hover to zoom
            </span>
          )}
        </div>

        {mode === "360" && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 backdrop-blur-md px-3.5 py-1 text-xs text-white/80 border border-white/15 shadow-lg">
            Drag to rotate
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3.5 sm:mt-4 flex gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar pb-1">
          {images.map((img, i) => (
            <button
              key={img + i}
              onClick={() => {
                setActiveIndex(i);
                setMode("gallery");
              }}
              className={cn(
                "relative h-16 w-16 sm:h-20 sm:w-20 shrink-0 overflow-hidden rounded-xl border transition-colors",
                i === activeIndex
                  ? "border-accent-purple ring-2 ring-accent-purple/30"
                  : "border-white/10 hover:border-white/30"
              )}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${i + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
