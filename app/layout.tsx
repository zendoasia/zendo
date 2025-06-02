import type { Metadata } from "next";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import Footer from "@/components/main/footer";
import ExternalLinkInterceptor from "@/components/externalLinkInterceptor";
import {
  geistSans,
  geistMono,
  menlo,
  consolas,
  jetbrainsMono,
  ubuntu,
  spaceGrotesk,
} from "@/components/fonts";
import LightModeTipAlert from "@/components/lightModeTip";
import Header from "@/components/main/header";
import Head from "next/head";
import LogoBlack from "@/public/assets/LogoBlack.svg";
import LogoWhite from "@/public/assets/LogoWhite.svg";
import { cn } from "@/lib/utils";
import ThemeSanitizer from "@/components/modules/themeSanitizer";
import CookieConsent from "@/components/CookieConsent";
import GAnalyticsGTMConsent from "@/components/GAnalyticsGTMConsent";
import { Viewport } from "next";
import ServiceWorkerRegister from "@/components/serviceWorkerRegister";

export const metadata: Metadata = {
  title: "Zendo - Intuition",
  description:
    "Welcome to Zendo. This is a private website for covering my work, projects, and portfolio. Let's explore the world of technology together.",
  keywords: [
    "portfolio",
    "productivity",
    "technology",
    "aarush",
    "master",
    "projects",
    "zendo",
    "programming",
    "development",
    "design",
    "management",
  ],
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
  assets: "https://zendo.pages.dev/assets/",
  category: "Programming and Technology",
  metadataBase: new URL("https://zendo.pages.dev/"),
  referrer: "origin-when-cross-origin",
  openGraph: {
    title: "Zendo",
    description:
      "Welcome to Zendo. This is a private website for covering my work, projects, and portfolio. Let's explore the world of technology together.",
    url: "https://zendo.pages.dev/",
    siteName: "Zendo",
    determiner: "the",
  },
  robots: "/robots.txt",
  manifest: "/manifest.webmanifest",
  twitter: {
    card: "summary_large_image",
    title: "Zendo",
    description:
      "Welcome to Zendo. This is a private website for covering my work, projects, and portfolio. Let's explore the world of technology together.",
    creator: "@aarush01111",
  },
  pinterest: {
    richPin: true,
  },
  verification: {
    google: "-q79a7PlxvBy3gr5cMmDHsT3av2Axtzrq1Vb6dcmSWA",
    yandex: "a16a2e8a4fb0ad33",
    other: {
      "msvalidate.01": "969F0E11BC415787B2C7464A98FBDF02",
    },
  },
  icons: [{ rel: "apple-touch-icon", url: "assets/icons/apple/apple-icon-180.svg" }],
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Zendo",
    startupImage: [
      {
        url: "assets/icons/apple/apple-splash-2048-2732.jpg",
        media:
          "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "assets/icons/apple/apple-splash-2732-2048.jpg",
        media:
          "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
      },
      {
        url: "assets/icons/apple/apple-splash-1668-2388.jpg",
        media:
          "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "assets/icons/apple/apple-splash-2388-1668.jpg",
        media:
          "(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
      },
      {
        url: "assets/icons/apple/apple-splash-1536-2048.jpg",
        media:
          "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "assets/icons/apple/apple-splash-2048-1536.jpg",
        media:
          "(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
      },
      {
        url: "assets/icons/apple/apple-splash-1640-2360.jpg",
        media:
          "(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "assets/icons/apple/apple-splash-2360-1640.jpg",
        media:
          "(device-width: 820px) and (device-height: 1180px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
      },
      {
        url: "assets/icons/apple/apple-splash-1668-2224.jpg",
        media:
          "(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "assets/icons/apple/apple-splash-2224-1668.jpg",
        media:
          "(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
      },
      {
        url: "assets/icons/apple/apple-splash-1620-2160.jpg",
        media:
          "(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "assets/icons/apple/apple-splash-2160-1620.jpg",
        media:
          "(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
      },
      {
        url: "assets/icons/apple/apple-splash-1488-2266.jpg",
        media:
          "(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "assets/icons/apple/apple-splash-2266-1488.jpg",
        media:
          "(device-width: 744px) and (device-height: 1133px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
      },
      {
        url: "assets/icons/apple/apple-splash-1320-2868.jpg",
        media:
          "(device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "assets/icons/apple/apple-splash-2868-1320.jpg",
        media:
          "(device-width: 440px) and (device-height: 956px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
      },
      {
        url: "assets/icons/apple/apple-splash-1206-2622.jpg",
        media:
          "(device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "assets/icons/apple/apple-splash-2622-1206.jpg",
        media:
          "(device-width: 402px) and (device-height: 874px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
      },
      {
        url: "assets/icons/apple/apple-splash-1290-2796.jpg",
        media:
          "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "assets/icons/apple/apple-splash-2796-1290.jpg",
        media:
          "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
      },
      {
        url: "assets/icons/apple/apple-splash-1179-2556.jpg",
        media:
          "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "assets/icons/apple/apple-splash-2556-1179.jpg",
        media:
          "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
      },
      {
        url: "assets/icons/apple/apple-splash-1170-2532.jpg",
        media:
          "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "assets/icons/apple/apple-splash-2532-1170.jpg",
        media:
          "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
      },
      {
        url: "assets/icons/apple/apple-splash-1284-2778.jpg",
        media:
          "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "assets/icons/apple/apple-splash-2778-1284.jpg",
        media:
          "(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
      },
      {
        url: "assets/icons/apple/apple-splash-1125-2436.jpg",
        media:
          "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "assets/icons/apple/apple-splash-2436-1125.jpg",
        media:
          "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
      },
      {
        url: "assets/icons/apple/apple-splash-1242-2688.jpg",
        media:
          "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "assets/icons/apple/apple-splash-2688-1242.jpg",
        media:
          "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
      },
      {
        url: "assets/icons/apple/apple-splash-828-1792.jpg",
        media:
          "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "assets/icons/apple/apple-splash-1792-828.jpg",
        media:
          "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
      },
      {
        url: "assets/icons/apple/apple-splash-1242-2208.jpg",
        media:
          "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)",
      },
      {
        url: "assets/icons/apple/apple-splash-2208-1242.jpg",
        media:
          "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)",
      },
      {
        url: "assets/icons/apple/apple-splash-750-1334.jpg",
        media:
          "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "assets/icons/apple/apple-splash-1334-750.jpg",
        media:
          "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
      },
      {
        url: "assets/icons/apple/apple-splash-640-1136.jpg",
        media:
          "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)",
      },
      {
        url: "assets/icons/apple/apple-splash-1136-640.jpg",
        media:
          "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)",
      },
    ],
  },
};

export const viewport: Viewport = {
  maximumScale: 1,
  width: "device-width",
  userScalable: false,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <link rel="preload" href={LogoWhite.src} as="image" type="image/svg+xml" />
        <link rel="preload" href={LogoBlack.src} as="image" type="image/svg+xml" />
      </Head>
      <GAnalyticsGTMConsent />
      <body
        className={cn(
          `scroll-smooth w-full p-0 m-0 overflow-x-clip ${geistSans.variable} ${spaceGrotesk.variable} ${geistMono.variable} ${menlo.variable} ${ubuntu.variable} ${jetbrainsMono.variable} ${consolas.variable} antialiased`
        )}
      >
        <ServiceWorkerRegister />
        <CookieConsent />
        <noscript>
          <style>
            {`
            #c301e48c-ae4c-4061-b1f9-d4f64d85d4dc {
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
        <div id="c301e48c-ae4c-4061-b1f9-d4f64d85d4dc">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <ThemeSanitizer />
            <ExternalLinkInterceptor />
            <Header />
            <main
              tabIndex={-1}
              id="main"
              className={cn("text-base outline-none app-font", "pt-[3.5rem]")}
            >
              {children}
            </main>
            <section className="text-base" aria-label="Notifications and Tips">
              <LightModeTipAlert />
              <Toaster position="bottom-right" richColors={true} />
            </section>
            <Footer />
          </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
