"use client";

import { useEffect, useState } from "react";
import { ModeToggle } from "@/components/modules/modes";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlignCenter, ArrowRightLeft, ArrowUp } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import LogoDark from "@/public/LogoDark.svg";
import LogoWhite from "@/public/LogoWhite.svg";
import Link from "next/link";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Header() {
  const router = useRouter();
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

      <div className="hidden md:flex items-center gap-3">
        <Link
          href="https://github.com/aarush0101"
          target="_blank"
          className="group w-10 h-10 rounded-2xl border border-dashed overflow-hidden 
         transition-colors duration-200 focus:ring-0 focus:outline-none"
        >
          <div className="flex items-center justify-center w-full h-full group-hover:bg-[color:var(--primary-hover)] group-focus:bg-[color:var(--primary-hover)] dark:group-hover:bg-[color:var(--primary-hover)] dark:group-focus:bg-[color:var(--primary-hover)]">
            <SiGithub className="w-6 h-6" />
          </div>
        </Link>

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
            className={`p-0 overflow-hidden rounded-2xl shadow-xl font-[family-name:var(--font-geist-sans)] 
      ${
        isDark
          ? "bg-[color:var(--night)] border-[color:var(--silver-2)]"
          : "bg-[color:var(--white-smoke)] border-[color:var(--jet)]"
      }`}
          >
            <div className="px-4 pt-4">
              <DialogTitle
                className="text-xl font-bold 
      text-[color:var(--text-dark)] dark:text-[color:var(--text-light)]"
              >
                Settings
              </DialogTitle>
            </div>

            <div className="flex flex-col divide-y divide-[color:var(--border)] mt-4">
              <div className="p-4 flex flex-col space-y-3">
                <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                  Links
                </h3>
                <div className="flex flex-col space-y-2">
                  {["About", "Portfolio", "Projects", "Contact"].map(
                    (label) => (
                      <button
                        key={label}
                        onClick={() => {
                          setOpen(false);
                          setTimeout(() => {
                            router.push(`/${label.toLowerCase()}`);
                          }, 950);
                        }}
                        className="text-left text-sm font-medium text-[color:var(--text-dark)] dark:text-[color:var(--text-light)] hover:text-[color:var(--accent)] transition-colors"
                      >
                        {label}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="flex justify-center space-x-4 p-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="group">
                        <ModeToggle />
                        <TooltipContent className="font-[family-name:var(--font-geist-sans)] text-xs">
                          Toggle Theme
                        </TooltipContent>
                      </div>
                    </TooltipTrigger>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                          setOpen(false);
                          setTimeout(() => {
                            router.push("https://github.com/aarush0101/zendo");
                          }, 950);
                        }}
                        className="group w-8 h-8 rounded-xl border border-dashed overflow-hidden flex items-center justify-center transition-colors hover:bg-[color:var(--primary-hover)] dark:hover:bg-[color:var(--primary-hover)] focus:bg-[color:var(--primary-hover)] dark:focus:bg-[color:var(--primary-hover)]"
                      >
                        <SiGithub className="w-5 h-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="font-[family-name:var(--font-geist-sans)] text-xs">
                      Visit Github Repo
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => {
                          setOpen(false);
                          setTimeout(() => {
                            router.push("/");
                          }, 950);
                        }}
                        className="group w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-[color:var(--primary-hover)] dark:hover:bg-[color:var(--primary-hover)] focus:bg-[color:var(--primary-hover)] dark:focus:bg-[color:var(--primary-hover)]"
                      >
                        <ArrowUp className="w-5 h-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent className="font-[family-name:var(--font-geist-sans)] text-xs">
                      Go Back Home
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
