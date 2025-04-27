import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/main/header";
import { Toaster } from "sonner";
import Footer from "@/components/main/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zendo - Intuition",
  description: "The ultimate app for all of Aarush Master's work.",
  keywords: ["portfolio", "productivity", "technology", "aarush", "master"],
  authors: [
    {
      name: "Aarush Master",
      url: "https://github.com/aarush0101",
    },
    {
      name: "Aarush Master",
      url: "mailto:aarush01111@gmail.com",
    },
  ],
  category: "Programming and Technology",
  abstract: "The ultimate app for all of Aarush Master's work.",
  classification: "Portfolio",
  appleWebApp: true,
  applicationName: "Zendo",
  metadataBase: new URL("https://zendo.pages.dev/"),
  icons: {
    apple: "/icons/apple-touch-icon.png",
    icon: "/icons/web-app-manifest-512x512.png",
  },
  referrer: "origin-when-cross-origin",
  other: {
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
  openGraph: {
    title: "Zendo - Intuition",
    description: "The ultimate app for all of Aarush Master's work.",
    url: "https://zendo.pages.dev/",
    siteName: "Zendo",
    images: [
      {
        url: "/icons/web-app-manifest-512x512.png",
        width: 512,
        height: 512,
        alt: "Zendo - Intuition",
        type: "image/png",
      },
    ],
  },
  generator: "Next.js",
  manifest: "/manifest.webmanifest",
  robots: "/robots.txt",
  verification: {
    google: "sCNAeUd-znC_4Q-2E_M-8chZMuQMLKqwy6fYGgblAuo",
    other: {
      "msvalidate.01": "969F0E11BC415787B2C7464A98FBDF02",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header>
            <Header />
          </header>
          <main>{children}</main>
          <aside>
            <span className="flex justify-end gap-10 bottom-0">
              <Toaster />
            </span>
          </aside>
          <footer>
            <Footer />
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
