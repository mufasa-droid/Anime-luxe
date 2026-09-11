import Link from "next/link";
import { Instagram, Twitter, Youtube } from "lucide-react";

const FOOTER_LINKS = {
  Shop: ["Hoodies", "Figures", "Jewelry", "Limited Editions", "Mystery Boxes"],
  Support: ["Shipping", "Returns", "FAQs", "Order Tracking", "Contact"],
  Company: ["About", "Blog", "Careers", "Press"],
};

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-base-900 px-4 sm:px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          <div className="col-span-2">
            <h3 className="font-heading text-lg sm:text-xl font-bold text-white">
              ANIME<span className="text-gradient">LUXE</span>
            </h3>
            <p className="mt-2.5 max-w-xs text-xs sm:text-sm text-white/50 leading-relaxed">
              Premium anime merchandise crafted for collectors. Limited runs,
              real materials, no compromises.
            </p>
            <div className="mt-4 flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Twitter size={16} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Youtube size={16} />
              </a>
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="font-heading text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                {heading}
              </h4>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="/shop"
                      className="text-xs sm:text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 sm:mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/40 md:flex-row">
          <p>&copy; {new Date().getFullYear()} Anime Luxe. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/shop" className="hover:text-white/70 transition-colors">Privacy Policy</Link>
            <Link href="/shop" className="hover:text-white/70 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
