import type { Metadata } from "next";
import localFont from "next/font/local";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const archetica = localFont({
  src: [
    { path: "./fonts/Archetica-Light.ttf", weight: "300", style: "normal" },
    { path: "./fonts/Archetica-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/Archetica-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/Archetica-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/Archetica-Bold.ttf", weight: "700", style: "normal" },
    { path: "./fonts/Archetica-ExtraBold.ttf", weight: "800", style: "normal" },
    { path: "./fonts/Archetica-Black.ttf", weight: "900", style: "normal" },
  ],
  variable: "--font-archetica",
  display: "swap",
  adjustFontFallback: false,
  declarations: [
    {
      prop: "unicode-range",
      value: "U+0000-0025, U+0027-002E, U+003A-003E, U+0041-005E, U+0060-FFFF",
    },
  ],
});

export const metadata: Metadata = {
  title: "Fawez | Home Care That Elevates The Human Spirit",
  description:
    "Experience personalized, reliable in-home care that brings comfort and peace of mind to you and your loved ones.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${archetica.variable} ${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
