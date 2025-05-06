"use client";

import { useEffect, useState, useMemo } from "react";
import { ModeToggle } from "@/components/modules/modes";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlignJustify, X, House, Search, Settings } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import LogoDark from "@/public/assets/LogoDark.svg";
import Logo from "@/public/assets/Logo.svg";
import Link from "next/link";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { useRouter } from "next/navigation";
import { openExternalLinkManually } from "@/components/modules/externalLinkInterceptor";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { detectOS } from "@/lib/utils";

export default function Header() {
  const os = useMemo(() => detectOS(), []);
  const strippedOS = useMemo(() => {
    function stripOS() {
      if (os === "MacOS") return "mac";
      if (os === "Windows") return "windows";
      if (os === "Linux") return "windows";
      if (os === "Android") return "phone";
      if (os === "iOS") return "phone";
      return "windows";
    }
  
    return stripOS();
  }, [os]);
  
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

  return (
    <header
      className={`sticky top-0 overflow-visible z-50 flex items-center px-4 py-3
      backdrop-blur-md border-l border-r border-b border-dashed dark:border-[color:var(--jet)] border-[color:var(--silver2)]
      bg-opacity-10 rounded-b-3xl 
      -lg font-[family-name:var(--font-text)]`}
    >
      <Link href="/" className="flex items-center">
        <div className="relative w-[140px] aspect-[140/30]">
          <Image
            src={isDark ? LogoDark : Logo}
            alt="Zendo Logo"
            fill
            priority
            quality={100}
            loading="eager"
            className="object-contain"
          />
        </div>
      </Link>

      <div className="hidden md:flex items-center gap-[0.5rem] ml-6">
        {["About", "Portfolio", "Projects", "Contact"].map((label) => (
          <Link
            key={label}
            href={`/${label.toLowerCase()}`}
            className="px-4 py-2 text-sm rounded-md border border-[color:var(--jet)] text-[color:var(--text-dark)] dark:text-[color:var(--text-light)] hover:bg-[color:var(--primary-hover)] focus:bg-[color:var(--primary-hover)] hover:text-[color:var(--text-light)] transition-colors duration-300"
          >
            {label}
          </Link>
        ))}
      </div>

      <div className="flex-grow" />

      <div className="hidden md:flex items-center gap-[0.5rem]">
        <Button
          className="ml-6 group inline-flex items-center justify-center gap-3 rounded-md border border-[color:var(--jet)] bg-transparent px-4 py-2 transition-colors duration-300 
             text-[color:var(--text-dark)] dark:text-[color:var(--text-light)] 
             hover:bg-[color:var(--primary-hover)] focus:bg-[color:var(--primary-hover)] 
             hover:text-[color:var(--text-light)] focus:text-[color:var(--text-light)]"
        >
          <Search
            size="1.2rem"
            className="transition-colors duration-300 group-hover:text-[color:var(--text-light)]"
          />
          <span className="flex items-center gap-2">
            <span className="font-semibold text-sm">Find</span>
            {strippedOS === "mac" ? (
              <span className="hidden md:inline-block text-sm font-[family-name:var(--font-code)] border border-[color:var(--jet)] px-2 py-0.5 rounded text-muted-foreground">
                &#x2318;+K
              </span>
            ) : strippedOS === "windows" ? (
              <span className="hidden md:inline-block text-sm font-[family-name:var(--font-code)] border border-[color:var(--jet)] px-2 py-0.5 rounded text-muted-foreground">
                CTRL+K
              </span>
            ) : null}
          </span>
        </Button>

        <Link
          href="https://github.com/aarush0101/zendo"
          target="_blank"
          className="hover:bg-[color:var(--primary-hover)] focus:bg-[color:var(--primary-hover)] dark:hover:bg-[color:var(--primary-hover)] dark:focus:bg-[color:var(--primary-hover)] transition-colors duration-300 px-2 py-2 rounded-md border border-[color:var(--jet)] overflow-hidden"
        >
          <div className="flex items-center justify-center">
            <SiGithub size="1.2rem" />
          </div>
        </Link>

        <ModeToggle />
      </div>
      <div className="flex md:hidden items-center">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-[color:var(--primary-hover)] focus:bg-[color:var(--primary-hover)] dark:hover:bg-[color:var(--primary-hover)] dark:focus:bg-[color:var(--primary-hover)] transition-colors duration-300 px-2 py-2 rounded-md border border-[color:var(--jet)] overflow-hidden"
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
                    <X size="1.2rem" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="closed"
                    initial={{ rotate: -90, opacity: 0.99 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0.99 }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  >
                    <AlignJustify size="1.2rem" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[70vw] md:w-[50vw] h-[45vh] overflow-y-auto px-4 py-4 overflow-hidden rounded-md font-[family-name:var(--font-text)]">
            <div>
              <DialogTitle className="flex flex-row items-center gap-2 text-lg font-semibold">
                <Settings size="2rem" className="text-[color:var(--success)]" />
                Settings
              </DialogTitle>
            </div>
            <hr className="border-[color:var(--jet)] opacity-40" />
            <div className="flex flex-col space-y-2">
              <div>
                <h3 className="text-lg uppercase tracking-wider text-muted-foreground font-semibold">
                  Links
                </h3>
                <br />
                <span className="flex flex-col space-y-2">
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
                        className="text-left  text-sm font-medium hover:bg-[color:var(--primary-hover)] px-1 py-1 rounded-md"
                      >
                        {label}
                      </button>
                    )
                  )}
                </span>
              </div>
              <br />
              <hr className="border-[color:var(--jet)] opacity-40" />
              <div className="flex justify-center space-x-2 p-[0.5rem]">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="group">
                        <ModeToggle />
                        <TooltipContent className="text-sm">
                          Toggle Theme
                        </TooltipContent>
                      </div>
                    </TooltipTrigger>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setOpen(false);
                          setTimeout(() => {
                            openExternalLinkManually(
                              "https://github.com/aarush0101/zendo"
                            );
                          }, 950);
                        }}
                        className="hover:bg-[color:var(--primary-hover)] focus:bg-[color:var(--primary-hover)] dark:hover:bg-[color:var(--primary-hover)] dark:focus:bg-[color:var(--primary-hover)] transition-colors duration-300 px-4 py-4.5 rounded-md border border-[color:var(--jet)] overflow-hidden"
                      >
                        <SiGithub size="1.2rem" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="text-sm">
                      Visit Github Repository
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setOpen(false);
                          setTimeout(() => {
                            router.push("/");
                          }, 950);
                        }}
                        className="hover:bg-[color:var(--primary-hover)] focus:bg-[color:var(--primary-hover)] dark:hover:bg-[color:var(--primary-hover)] dark:focus:bg-[color:var(--primary-hover)] transition-colors duration-300 px-4 py-4.5 rounded-md border border-[color:var(--jet)] overflow-hidden"
                      >
                        <House size="1.2rem" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="text-sm">
                      Go Back Home
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex justify-center mt-0.5">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="group inline-flex items-center justify-center gap-3 rounded-md border border-[color:var(--jet)] bg-transparent px-4 py-2 -lg transition-colors duration-300 
                        text-[color:var(--text-dark)] dark:text-[color:var(--text-light)] 
                        hover:bg-[color:var(--primary-hover)] focus:bg-[color:var(--primary-hover)] 
                        hover:text-[color:var(--text-light)] focus:text-[color:var(--text-light)]"
                      >
                        <Search
                          size="1.2rem"
                          className="transition-colors duration-300 group-hover:text-[color:var(--text-light)]"
                        />
                        <span className="flex items-center gap-2">
                          <span className="font-semibold text-sm">Find</span>
                          {strippedOS === "mac" ? (
                            <span className="hidden md:inline-block text-sm font-[family-name:var(--font-code)] border border-[color:var(--jet)] px-2 py-0.5 rounded text-muted-foreground">
                              &#x2318;+K
                            </span>
                          ) : strippedOS === "windows" ? (
                            <span className="hidden md:inline-block text-sm font-[family-name:var(--font-code)] border border-[color:var(--jet)] px-2 py-0.5 rounded text-muted-foreground">
                              CTRL+K
                            </span>
                          ) : null}
                        </span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="text-sm">Search</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
