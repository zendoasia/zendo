/**
 * app/layout.tsx
 * --------------
 *
 * Implements the main layout for the app
 *
 * @license MIT - see LICENSE for more details
 * @copyright © 2025–present AARUSH MASTER and Zendo - see package.json for more details
 */

import type React from "react";
import type { Metadata } from "next";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import Footer from "@/components/main/footer";
import ExternalLinkInterceptor from "@/components/scripts/externalLinkInterceptor";
import {
  geistSans,
  geistMono,
  menlo,
  consolas,
  jetbrainsMono,
  ubuntu,
  inter,
  spaceGrotesk,
} from "@/lib/fonts";
import LightModeTipAlert from "@/components/lightModeTip";
import Header from "@/components/main/header";
import LogoBlack from "@/public/assets/LogoBlack.svg";
import LogoWhite from "@/public/assets/LogoWhite.svg";
import { cn } from "@/lib/utils";
import CookieConsent from "@/components/scripts/cookieConsent";
import GAnalyticsConsent from "@/components/scripts/GAnalyticsConsent";
import type { Viewport } from "next";
import CloudflareAnalytics from "@/components/scripts/cloudflareInsights";
import { OrganizationSchema, SiteSearchSchema } from "@/lib/setScheme";
import { generateMetadata } from "@/lib/generateBasicMetadata";
import { KeyboardShortcutsProvider } from "@/components/providers/keyboardShortcutProvider";
import { OSDetectionProvider } from "@/components/providers/osDetectionProvider";
import { Suspense } from "react";
import { getFooterLinks, getStatusUptime } from "@/lib/cache/footer-cacher";
import { getHeaderNavLinks } from "@/lib/cache/header-cacher";
import getGitHubStars from "@/lib/cache/gh-stars-caher";

export const metadata: Metadata = {
  ...generateMetadata({
    title: "Zendo - Start Using Today!",
    description: "For those who 'Dare to be different'. Checkout our latest services and products.",
    path: "/",
  }),
  keywords: [
    "productivity",
    "tech",
    "projects",
    "zendo",
    "zeal",
    "startup",
    "services",
    "products",
  ],
  authors: [
    {
      name: "Zendo Support",
      url: `mailto:support@${process.env.NEXT_PUBLIC_ORIGIN}`,
    },
    {
      name: "Zendo Admin",
      url: `mailto:admin@${process.env.NEXT_PUBLIC_ORIGIN}`,
    },
  ],
  assets: `https://${process.env.NEXT_PUBLIC_ORIGIN}/assets/`,
  category: "software",
  metadataBase: new URL(`https://${process.env.NEXT_PUBLIC_ORIGIN}/`),
  referrer: "origin-when-cross-origin",
  robots: "/robots.txt",
  manifest: "/manifest.webmanifest",
  pinterest: {
    richPin: true,
  },
  icons: [{ rel: "apple-touch-icon", url: "/assets/icons/apple/apple-icon-180.png" }],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Zendo",
    startupImage: [
      {
        url: "/assets/icons/apple/apple-splash-2048-2732.jpg",
        media:
          "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "/assets/icons/apple/apple-splash-2732-2048.jpg",
        media:
          "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
      },
      {
        url: "/assets/icons/apple/apple-splash-1668-2388.jpg",
        media:
          "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "/assets/icons/apple/apple-splash-2388-1668.jpg",
        media:
          "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
      },
      {
        url: "/assets/icons/apple/apple-splash-1536-2048.jpg",
        media:
          "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "/assets/icons/apple/apple-splash-2048-1536.jpg",
        media:
          "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
      },
      {
        url: "/assets/icons/apple/apple-splash-1640-2360.jpg",
        media:
          "(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "/assets/icons/apple/apple-splash-2360-1640.jpg",
        media:
          "(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
      },
      {
        url: "/assets/icons/apple/apple-splash-1668-2224.jpg",
        media:
          "(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "/assets/icons/apple/apple-splash-2224-1668.jpg",
        media:
          "(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
      },
      {
        url: "/assets/icons/apple/apple-splash-1620-2160.jpg",
        media:
          "(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "/assets/icons/apple/apple-splash-2160-1620.jpg",
        media:
          "(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
      },
      {
        url: "/assets/icons/apple/apple-splash-1488-2266.jpg",
        media:
          "(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "/assets/icons/apple/apple-splash-2266-1488.jpg",
        media:
          "(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
      },
      {
        url: "/assets/icons/apple/apple-splash-1320-2868.jpg",
        media:
          "(device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "/assets/icons/apple/apple-splash-2868-1320.jpg",
        media:
          "(device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
      },
      {
        url: "/assets/icons/apple/apple-splash-1206-2622.jpg",
        media:
          "(device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "/assets/icons/apple/apple-splash-2622-1206.jpg",
        media:
          "(device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
      },
      {
        url: "/assets/icons/apple/apple-splash-1290-2796.jpg",
        media:
          "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "/assets/icons/apple/apple-splash-2796-1290.jpg",
        media:
          "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
      },
      {
        url: "/assets/icons/apple/apple-splash-1179-2556.jpg",
        media:
          "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "/assets/icons/apple/apple-splash-2556-1179.jpg",
        media:
          "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
      },
      {
        url: "/assets/icons/apple/apple-splash-1170-2532.jpg",
        media:
          "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "/assets/icons/apple/apple-splash-2532-1170.jpg",
        media:
          "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
      },
      {
        url: "/assets/icons/apple/apple-splash-1284-2778.jpg",
        media:
          "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "/assets/icons/apple/apple-splash-2778-1284.jpg",
        media:
          "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
      },
      {
        url: "/assets/icons/apple/apple-splash-1125-2436.jpg",
        media:
          "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "/assets/icons/apple/apple-splash-2436-1125.jpg",
        media:
          "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
      },
      {
        url: "/assets/icons/apple/apple-splash-1242-2688.jpg",
        media:
          "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "/assets/icons/apple/apple-splash-2688-1242.jpg",
        media:
          "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
      },
      {
        url: "/assets/icons/apple/apple-splash-828-1792.jpg",
        media:
          "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "/assets/icons/apple/apple-splash-1792-828.jpg",
        media:
          "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
      },
      {
        url: "/assets/icons/apple/apple-splash-1242-2208.jpg",
        media:
          "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "/assets/icons/apple/apple-splash-2208-1242.jpg",
        media:
          "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
      },
      {
        url: "/assets/icons/apple/apple-splash-750-1334.jpg",
        media:
          "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "/assets/icons/apple/apple-splash-1334-750.jpg",
        media:
          "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
      },
      {
        url: "/assets/icons/apple/apple-splash-640-1136.jpg",
        media:
          "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "/assets/icons/apple/apple-splash-1136-640.jpg",
        media:
          "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
      },
    ],
  },
  verification: {
    yandex: "9607922371501871",
    google: "yOQ3jINn11q4_dw5H4k_DtCOFF-fzOLeJMk0_mt9SQc",
    other: {
      "msvalidate.01": "5f6aa8bb4a96ea6221109a3d49c5f1f8",
    },
    yahoo: "5f6aa8bb4a96ea6221109a3d49c5f1f8",
  },
  alternates: {
    canonical: `https://${process.env.NEXT_PUBLIC_ORIGIN}/`,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000409" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  colorScheme: "dark",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [footerSections, uptime, headerNavLinks, githubStars] = await Promise.all([
    getFooterLinks(),
    getStatusUptime(),
    getHeaderNavLinks(),
    getGitHubStars(),
  ]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href={LogoWhite.src}
          fetchPriority="high"
          as="image"
          type="image/svg+xml"
        />
        <link
          rel="preload"
          href={LogoBlack.src}
          fetchPriority="high"
          as="image"
          type="image/svg+xml"
        />
        <OrganizationSchema />
        <SiteSearchSchema />
      </head>
      <body
        className={cn(
          `scroll-smooth p-0 m-0 overflow-y-scroll box-border ${inter.variable} ${geistSans.variable} ${spaceGrotesk.variable} ${geistMono.variable} ${menlo.variable} ${ubuntu.variable} ${jetbrainsMono.variable} ${consolas.variable} antialiased`
        )}
      >
        {/* Dedicated portal root for overlays/menus */}
        <div id="portal-root" />
        <Suspense fallback={null}>
          <GAnalyticsConsent />
          <CookieConsent />
          <CloudflareAnalytics />
          <noscript>
            <style>
              {`
              #${process.env.NEXT_PUBLIC_APP_ID} {
                display: none !important;
              }
              #noscript-dialog {
                position: fixed;
                inset: 0;
                z-index: 99999;        
                background-color: rgba(0, 0, 0, 0.85);
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2rem;
                font-family: sans-serif;
                text-align: center;
              }
              #noscript-dialog > div {
                background: #111;
                padding: 2rem;
                max-width: 400px;
              }
            `}
            </style>
            <div id="noscript-dialog">
              <div>
                <h2 style={{ marginBottom: "1rem", fontSize: "1.25rem" }}>JavaScript Required</h2>
                <p>
                  This site needs JavaScript to function properly. Please enable it in your browser
                  settings. Or, upgrade to a new system and a modern browser to enjoy the full
                  experience.
                </p>
              </div>
            </div>
          </noscript>
          <div id={`${process.env.NEXT_PUBLIC_APP_ID}`}>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <OSDetectionProvider>
                <KeyboardShortcutsProvider>
                  <ExternalLinkInterceptor />
                  <Header links={headerNavLinks} githubStars={githubStars} />
                  <main
                    tabIndex={-1}
                    id="main"
                    className={cn("text-base outline-none app-font", "pt-[3.5rem]")}
                  >
                    {children}
                  </main>
                  <section className="text-base" aria-label="Notifications and Tips">
                    <LightModeTipAlert />
                    <Toaster
                      position="bottom-right"
                      theme="system"
                      visibleToasts={4}
                      richColors={true}
                      closeButton={true}
                    />
                  </section>
                  <Footer footerSections={footerSections} uptime={uptime} />
                </KeyboardShortcutsProvider>
              </OSDetectionProvider>
            </ThemeProvider>
          </div>
        </Suspense>
      </body>
    </html>
  );
}
