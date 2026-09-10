import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
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
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#ec4899",
          colorBackground: "#0d0f17",
          colorForeground: "#ffffff",
          colorMutedForeground: "#94a3b8",
          colorInput: "rgba(255, 255, 255, 0.05)",
          colorInputForeground: "#ffffff",
          fontFamily: "var(--font-inter), sans-serif",
          borderRadius: "1rem",
        },
        elements: {
          card: "glass-strong border border-white/10 shadow-2xl backdrop-blur-xl bg-[#0f111a]/95",
          formButtonPrimary:
            "bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 hover:opacity-95 text-white font-semibold shadow-lg shadow-pink-500/20 transition-all",
          socialButtonsBlockButton:
            "border border-white/15 bg-white/5 hover:bg-white/10 text-white font-medium transition-colors",
          socialButtonsBlockButtonText: "text-white font-medium",
          socialButtonsBlockButtonIcon: "text-white",
          footerActionText: "text-zinc-400 text-xs",
          footerActionLink: "text-pink-400 hover:text-pink-300 font-semibold text-xs",
          identityPreviewText: "text-white font-medium",
          identityPreviewEditButton: "text-pink-400 hover:text-pink-300",
          formFieldLabel: "text-zinc-300 text-xs font-medium",
          formFieldInput:
            "bg-white/[0.04] border-white/15 text-white placeholder:text-zinc-500 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all",
          headerTitle: "font-heading text-xl font-bold text-white tracking-tight",
          headerSubtitle: "text-zinc-400 text-xs",
          dividerLine: "bg-white/15",
          dividerText: "text-zinc-400 text-xs uppercase tracking-wider",
          footer: "border-t border-white/10 bg-transparent",
        },
      }}
    >
      <html lang="en" className="dark" suppressHydrationWarning>
        <head>
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(){try{const t=localStorage.getItem('anime-luxe-theme');if(t==='light'){document.documentElement.classList.remove('dark');document.documentElement.classList.add('light');}else if(t==='dark'){document.documentElement.classList.add('dark');document.documentElement.classList.remove('light');}}catch(e){}})();`,
            }}
          />
        </head>
        <body
          className={`${spaceGrotesk.variable} ${inter.variable} font-body bg-base-950 antialiased`}
        >
          <ThemeProvider>
            <SmoothScrollProvider>
              <Navbar />
              <CartDrawer />
              <main id="main-content">{children}</main>
              <Footer />
            </SmoothScrollProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}


