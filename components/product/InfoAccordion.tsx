"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItem {
  title: string;
  content: string;
}

const ITEMS: AccordionItem[] = [
  {
    title: "Shipping",
    content:
      "Orders ship within 1-2 business days. Standard shipping (5-8 business days) is free on orders over $75. Express shipping (2-3 business days) is available at checkout. Limited edition and mystery box items may have extended processing time due to numbered packaging.",
  },
  {
    title: "Returns",
    content:
      "We accept returns within 30 days of delivery for unworn, unwashed items with original tags attached. Limited edition and mystery box items are final sale. Start a return from your account dashboard or contact support for a prepaid label.",
  },
  {
    title: "Details & Care",
    content:
      "Materials and care instructions vary by product — see the size/fit notes above for garments. Figures and collectibles ship in protective packaging; we recommend keeping original packaging for long-term display and value retention.",
  },
];

export function InfoAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mt-8 border-t border-white/10">
      {ITEMS.map((item, i) => (
        <div key={item.title} className="border-b border-white/10">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="flex w-full items-center justify-between py-4 text-left font-heading text-sm font-medium text-white"
          >
            {item.title}
            <ChevronDown
              size={16}
              className={cn(
                "text-white/50 transition-transform",
                openIndex === i && "rotate-180"
              )}
            />
          </button>
          {openIndex === i && (
            <p className="pb-4 text-sm leading-relaxed text-white/60">
              {item.content}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
