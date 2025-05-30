import { JetBrains_Mono, Ubuntu, Geist, Geist_Mono, Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";

export const menlo = localFont({
  src: "../public/fonts/Menlo/Menlo-Regular.woff2",
  weight: "400",
  style: "normal",
  variable: "--font-menlo",
  display: "swap",
});

export const consolas = localFont({
  src: [
    {
      path: "../public/fonts/Consolas/Consolas.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Consolas/Consolas-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../public/fonts/Consolas/Consolas-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/Consolas/Consolas-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-consolas",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});
