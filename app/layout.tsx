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
          colorMutedForeground: "#a1a1aa",
          colorInput: "rgba(255, 255, 255, 0.05)",
          colorInputForeground: "#ffffff",
          fontFamily: "var(--font-inter), sans-serif",
          borderRadius: "1rem",
        },
        elements: {
          card: "glass-strong border border-white/10 shadow-2xl backdrop-blur-xl",
          formButtonPrimary:
            "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium shadow-md transition-all",
          footerActionLink: "text-purple-400 hover:text-pink-400 font-medium",
          formFieldInput:
            "glass border-white/10 text-white placeholder:text-white/30 focus:border-purple-500 focus:ring-1 focus:ring-purple-500",
          headerTitle: "font-heading text-white",
          headerSubtitle: "text-white/60",
          dividerLine: "bg-white/10",
          dividerText: "text-white/40",
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


