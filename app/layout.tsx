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
  description: "Official website for all of Aarush Master's work.",
  keywords: ["portfolio", "aarush master", "personal website"],
  authors: [
    {
      name: "Aarush Master",
      url: "https://github.com/aarush0101",
    },
  ],
  category: "Programming and Technology",
  abstract: "Official website for all of Aarush Master's work.",
  classification: "Portfolio",
  generator: "Next.js",
  // manifest: "/manifest.json",
  // robots: "/robots.txt",
  verification: {
    google: "", // Verification
    yahoo: "",
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
