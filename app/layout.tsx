import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/components/layout/SmoothScrollProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ANIME LUXE — Premium Anime Merchandise",
    template: "%s | ANIME LUXE",
  },
  description:
    "Premium anime merchandise: hoodies, figures, jewelry, and limited editions from your favorite series. Crafted for collectors.",
  metadataBase: new URL("https://animeluxe.example.com"),
  openGraph: {
    title: "ANIME LUXE — Premium Anime Merchandise",
    description:
      "Premium anime merchandise crafted for collectors. Shop hoodies, figures, jewelry, and limited editions.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} font-body bg-base-950 antialiased`}
      >
        <SmoothScrollProvider>
          <Navbar />
          <CartDrawer />
          <main id="main-content">{children}</main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
