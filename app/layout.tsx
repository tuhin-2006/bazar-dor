import type { Metadata, Viewport } from "next";
import { Hind_Siliguri } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Toaster } from "@/components/ui/Toaster";
import "./globals.css";

const hind = Hind_Siliguri({
  subsets: ["bengali", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-hind",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? process.env.NEXT_PUBLIC_SITE_URL
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে",
    template: "%s | বাজার দর",
  },
  description:
    "বাংলাদেশের প্রতিদিনের নিত্যপণ্যের আজকের বাজারদর, দামের ওঠানামা এবং ১২টি বাজারের তুলনা এক জায়গায়।",
  keywords: [
    "বাজার দর",
    "আজকের বাজারদর",
    "নিত্যপণ্যের দাম",
    "BazarDor",
    "Bangladesh market prices",
  ],
  authors: [{ name: "BazarDor" }],
  openGraph: {
    title: "বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে",
    description:
      "নিত্যপণ্যের আজকের দাম, দাম বাড়া-কমার তালিকা এবং বাজারভিত্তিক তুলনা।",
    type: "website",
    locale: "bn_BD",
    siteName: "বাজার দর",
  },
  twitter: {
    card: "summary_large_image",
    title: "বাজার দর",
    description: "প্রয়োজনীয় পণ্যের দাম এক নজরে।",
  },
};

export const viewport: Viewport = {
  themeColor: "#123d2f",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="bn"
      data-scroll-behavior="smooth"
      className={hind.variable}
    >
      <body className="flex min-h-screen flex-col bg-paper text-ink antialiased">
        <a
          href="#main-content"
          className="sr-only z-[100] rounded-full bg-forest px-4 py-2 text-sm font-semibold text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          মূল কনটেন্টে যান
        </a>
        <Header />
        <main id="main-content" className="flex flex-1 flex-col">
          {children}
        </main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
