"use client";

import { useEffect, useState } from "react";
import { ModeToggle } from "@/components/modules/modes";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlignCenter, ArrowRightLeft } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import LogoDark from "@/public/LogoDark.svg";
import LogoWhite from "@/public/LogoWhite.svg";
import Link from "next/link";

export default function Header() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark" || currentTheme === "system";
  const headerBg = isDark
    ? "bg-[color:var(--night)]/80"
    : "bg-[color:var(--white-smoke)]/60";
  const borderColor = isDark
    ? "border-[color:var(--jet)]"
    : "border-[color:var(--silver)]";

  return (
    <div
      className={`sticky top-0 z-50 flex items-center px-4 py-3 backdrop-blur-lg ${headerBg} shadow-lg ${borderColor} rounded-b-2xl font-[family-name:var(--font-geist-sans)]`}
    >
      <Link href="/" className="flex items-center">
        <Image
          src={isDark ? LogoWhite : LogoDark}
          alt="Zendo Logo"
          width={140}
          height={30}
          priority
          quality="1080"
          loading="eager"
        />
      </Link>

      <div className="hidden md:flex items-center gap-3 ml-6">
        {["About", "Portfolio", "Projects", "Contact"].map((label) => (
          <Link
            key={label}
            href={`/${label.toLowerCase()}`}
            className="font-[family-name:var(--font-geist-sans)] px-4 py-2 text-sm rounded-md border border-[color:var(--jet)] text-[color:var(--text-dark)] dark:text-[color:var(--text-light)] hover:bg-[color:var(--primary-hover)] focus:bg-[color:var(--primary-hover)] hover:text-[color:var(--text-light)] transition-colors duration-200"
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="flex-grow" />

      <div className="hidden md:flex items-center">
        <ModeToggle />
      </div>

      {/* Mobile Menu */}
      <div className="flex md:hidden items-center">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="border border-[color:var(--accent-hover)] dark:border-[color:var(--accent)] bg-transparent"
            >
              <AnimatePresence mode="wait" initial={false}>
                {open ? (
                  <motion.div
                    key="open"
                    initial={{ rotate: 90, opacity: 0.99 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0.99 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  >
                    <ArrowRightLeft className="h-5 w-5 text-[color:var(--accent-light)] dark:text-[color:var(--accent-subtle)]" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="closed"
                    initial={{ rotate: -90, opacity: 0.99 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0.99 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  >
                    <AlignCenter className="h-5 w-5 text-[color:var(--accent-light)] dark:text-[color:var(--accent-subtle)]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </DialogTrigger>
          <DialogContent
            className={`backdrop-blur-xs rounded-2xl p-6 shadow-2xl font-[family-name:var(--font-geist-sans)] 
              ${
                isDark
                  ? "bg-[color:var(--night)]/80 border-[color:var(--silver-2)]"
                  : "bg-[color:var(--white-smoke)]/60 border-[color:var(--jet)]"
              }
            `}
          >
            <DialogTitle
              className={`text-[20px] font-extrabold 
                ${
                  isDark
                    ? "text-[color:var(--text-light)]"
                    : "text-[color:var(--text-dark)]"
                }
              `}
            >
              Settings
            </DialogTitle>

            <DialogTitle
              className={`text-[16px] font-semibold font-[family-name:var(--font-geist-mono)] 
                text-[color:var(--text-dark)] dark:text-[color:var(--text-light)]
              `}
            >
              Links
            </DialogTitle>

            <div className="flex flex-col items-start space-y-4 font-[family-name:var(--font-geist-sans)] mt-2">
              {["About", "Portfolio", "Projects", "Contact"].map(
                (label) => (
                  <p
                    key={label}
                    className={`text-md cursor-pointer transition-colors duration-200
                      ${
                        isDark
                          ? "text-[color:var(--text-light)]"
                          : "text-[color:var(--text-dark)]"
                      }
                    `}
                  >
                    <Link
                      href={`/${label.toLowerCase()}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setOpen(false);
                        window.location.href = `/${label.toLowerCase()}`;
                      }}
                    >
                      {label}
                    </Link>
                  </p>
                )
              )}
            </div>

            <hr className={borderColor} />

            <DialogTitle
              className={`font-semibold mt-4 text-[16px] font-[family-name:var(--font-geist-mono)]
                text-[color:var(--light-dark)] dark:text-[color:var(--text-light)]
              `}
            >
              Help
            </DialogTitle>
            <div className="text-sm font-[family-name:var(--font-geist-sans)]">
              <div className="flex justify-between items-center mt-2">
                <span
                  className={`${
                    isDark
                      ? "text-[color:var(--silver)]"
                      : "text-[color:var(--eerie-black)]"
                  }`}
                >
                  Theme
                </span>
                <ModeToggle />
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
