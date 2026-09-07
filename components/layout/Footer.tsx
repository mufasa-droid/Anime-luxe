import Link from "next/link";
import { Instagram, Twitter, Youtube } from "lucide-react";

const FOOTER_LINKS = {
  Shop: ["Hoodies", "Figures", "Jewelry", "Limited Editions", "Mystery Boxes"],
  Support: ["Shipping", "Returns", "FAQs", "Order Tracking", "Contact"],
  Company: ["About", "Blog", "Careers", "Press"],
};

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-base-900 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <h3 className="font-heading text-xl font-bold text-white">
              ANIME<span className="text-gradient">LUXE</span>
            </h3>
            <p className="mt-3 max-w-xs text-sm text-white/50">
              Premium anime merchandise crafted for collectors. Limited runs,
              real materials, no compromises.
            </p>
            <div className="mt-5 flex gap-4">
              <Instagram className="text-white/60 hover:text-white" size={18} />
              <Twitter className="text-white/60 hover:text-white" size={18} />
              <Youtube className="text-white/60 hover:text-white" size={18} />
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="font-heading text-sm font-semibold text-white">
                {heading}
              </h4>
              <ul className="mt-4 space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm text-white/50 hover:text-white"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/40 md:flex-row">
          <p>&copy; {new Date().getFullYear()} Anime Luxe. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
