import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/main/header";
import { Toaster } from "sonner";
import Footer from "@/components/main/footer";
import { geistSans, geistMono, menlo, consolas, jetbrainsMono, ubuntu } from "@/components/modules/fonts";


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
  referrer: "origin-when-cross-origin",
  openGraph: {
    title: "Zendo - Intuition",
    description: "The ultimate app for all of Aarush Master's work.",
    url: "https://zendo.pages.dev/",
    siteName: "Zendo",
  },
  robots: "/robots.txt",
  verification: {
    google: "-q79a7PlxvBy3gr5cMmDHsT3av2Axtzrq1Vb6dcmSWA",
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
        className={`${geistSans.variable} ${geistMono.variable} ${menlo.variable} ${ubuntu.variable} ${jetbrainsMono.variable} ${consolas.variable} antialiased`}
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
