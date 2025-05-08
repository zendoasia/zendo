// Mobile menu is extracted into its own component to lazy load when needed, since its not needed on desktop.

"use client";

import { motion } from "framer-motion";
import { FocusTrap } from "focus-trap-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Settings, House, Search, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ModeToggle } from "@/components/modules/modes";

interface Props {
  setOpen: (v: boolean) => void;
  setOpenS: (v: boolean) => void;
  strippedOS: string | null;
}

export default function MobileMenu({ setOpen, setOpenS, strippedOS }: Props) {
  const router = useRouter();

  return (
    <motion.div
      key="mobile-menu"
      className="fixed inset-0 z-100 bg-[color:var(--background)] dark:bg-[color:var(--background)] text-[color:var(--text-dark)] dark:text-[color:var(--text-light)] overflow-y-auto p-6"
      initial={{ opacity: 0, y: "-100%" }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: "100%" }}
      transition={{ type: "tween", duration: 1, ease: "easeInOut" }}
    >
      <FocusTrap>
        <div className="flex flex-col gap-6">
          <div className="flex-1 overflow-y-auto">
            <div className="mt-6 space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Settings
                    size="2rem"
                    className="text-[color:var(--success)]"
                  />
                  Settings
                </h1>
                <Button
                  data-no-aria-hidden
                  onClick={() => {
                    setOpen(!open);
                  }}
                  variant="secondary"
                  size="icon"
                  className="md:hidden hover:bg-[color:var(--primary-hover)] border border-[color:var(--jet)] px-2 py-2 rounded-[radius:var(--radius)]"
                >
                  <X size="1.2rem" />
                </Button>
              </div>

              <hr className="border-[color:var(--jet)] opacity-40" />

              <section>
                <h3 className="text-lg uppercase tracking-wider text-muted-foreground font-bold">
                  Links
                </h3>
                <span className="flex flex-col space-y-2 mt-2">
                  {["About", "Portfolio", "Projects", "Contact"].map(
                    (label) => (
                      <button
                        key={label}
                        onClick={() => {
                          setOpen(false);
                          setTimeout(
                            () => router.push(`/${label.toLowerCase()}`),
                            500
                          );
                        }}
                        className="text-left text-md rounded-[radius:var(--radius)] font-[weight:var(--default-font-weight)] px-2 py-1"
                      >
                        {label}
                      </button>
                    )
                  )}
                </span>
              </section>

              <hr className="border-[color:var(--jet)] opacity-40" />

              <div className="flex justify-center gap-4 flex-wrap">
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
                        size="icon"
                        onClick={() => {
                          setOpen(false);
                          setTimeout(() => router.push("/"), 500);
                        }}
                        className="hover:bg-[color:var(--primary-hover)] focus:bg-[color:var(--primary-hover)] border border-[color:var(--jet)] px-4 py-2.5 rounded-[radius:var(--radius)] transition-colors duration-300"
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

              <div className="flex justify-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        onClick={() => setOpenS(true)}
                        className="ml-6 group flex items-center justify-center gap-3 rounded-[radius:var(--radius)] border border-[color:var(--jet)] bg-transparent px-4 py-2.5 transition-colors duration-300 hover:bg-[color:var(--primary-hover)] focus:bg-[color:var(--primary-hover)]"
                      >
                        <Search
                          size="1.2rem"
                          className="dark:text-white text-black flex-shrink-0"
                        />
                        <span className="flex items-center gap-2">
                          <span className="font-[weight:var(--default-font-weight)] text-sm dark:text-white text-black whitespace-nowrap">
                            Search...
                          </span>
                          <kbd className="text-xs font-[weight:var(--default-font-weight)] md:inline-block font-[family-name:var(--font-code)] border border-[color:var(--jet)] px-2 py-0.5 rounded-sm text-muted-foreground">
                            <span className="sr-only">
                              {strippedOS === "mac"
                                ? "Command key plus K"
                                : strippedOS === "windows"
                                ? "Control key plus K"
                                : strippedOS === "phone"
                                ? "Press to search"
                                : "Press to refresh"}
                            </span>
                            {strippedOS === "mac" ? (
                              <>{"\u2318"} K</>
                            ) : strippedOS === "windows" ? (
                              <>CTRL K</>
                            ) : strippedOS === "phone" ? (
                              <>PRESS</>
                            ) : !strippedOS ? (
                              <>REFRESH</>
                            ) : null}
                          </kbd>
                        </span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="text-sm">Search</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>
      </FocusTrap>
    </motion.div>
  );
}
