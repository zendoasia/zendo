// The component should always be loaded lazily on demand, as it is very heavy and uses complex UI and icons.

"use client";

import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/modules/modes";
import { Briefcase, Folder, Home, Info, Mail, Search } from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { BiSolidBellRing } from "react-icons/bi";
import { openExternalLinkManually } from "@/components/externalLinkInterceptor";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import type { NavGroups } from "@/types";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { MobileMenuProps } from "@/types";

export default function MobileMenu({
  setOpenAction,
  setOpenSAction,
  strippedOS,
  open = true, // Default to true for backward compatibility
  onCloseComplete,
}: MobileMenuProps) {
  const router = useRouter();
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!open && !isClosing) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        if (onCloseComplete) onCloseComplete();
        setIsClosing(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [open, isClosing, onCloseComplete]);

  const navItems: NavGroups = {
    links: [
      { label: "About", icon: Info, path: "/about" },
      { label: "Portfolio", icon: Briefcase, path: "/portfolio" },
      { label: "Projects", icon: Folder, path: "/projects" },
      { label: "Contact", icon: Mail, path: "/contact" },
    ],
  };

  const handleNavigate = (path: string) => {
    setOpenAction(false);
    setTimeout(() => router.push(path), 250);
  };

  const sectionKeys = Object.keys(navItems);

  return (
    <Sheet open={open} onOpenChange={setOpenAction}>
      <SheetContent
        aria-label="Mobile Menu"
        side="left"
        className={cn(
          "top-0 left-0 z-50 border-r border-b border-t border-[color:var(--jet)] rounded-r-lg p-0 app-font flex flex-col h-full",
          "w-[85%] max-w-xs sm:w-[60%] md:w-[50%]",
          "transition-all duration-300 ease-in-out transform"
        )}
      >
        <div className={cn("flex flex-col px-[1.2rem] pt-4 pb-3")}>
          <div className={cn("flex items-center gap-2")}>
            <BiSolidBellRing
              size="1.25rem"
              className={cn("text-emerald-700 dark:text-emerald-500")}
            />
            <SheetTitle className={cn("text-lg font-semibold app-font-space")}>
              Quick Access
            </SheetTitle>
          </div>
          <p className={cn("text-sm text-muted-foreground mt-1")}>
            Quick links and tools
          </p>
        </div>

        <Separator className={cn("my-[0.5]")} />

        <nav
          className={cn(
            "flex-1 overflow-y-auto px-[1.2rem] pt-[1.2rem] pb-[1.2rem] scroll-smooth no-scrollbar"
          )}
          aria-label="Primary Navigation and Inter-Links"
        >
          <Accordion type="multiple" defaultValue={sectionKeys}>
            {sectionKeys.map((sectionKey) => (
              <AccordionItem key={sectionKey} value={sectionKey}>
                <AccordionTrigger
                  className={cn(
                    "app-font-mono text-xs text-muted-foreground tracking-widest font-semibold px-1 py-[0.7rem] flex items-center hover:bg-emerald-100 dark:hover:bg-emerald-800 rounded-lg transition-all"
                  )}
                >
                  {sectionKey.toUpperCase()}
                </AccordionTrigger>
                <AccordionContent
                  className={cn("flex flex-col gap-[0.7rem] pt-[0.7rem]")}
                >
                  {navItems[sectionKey].map(({ label, icon: Icon, path }) => (
                    <Button
                      key={label}
                      size="lg"
                      variant="ghost"
                      className={cn(
                        "justify-start flex-row nav-btn overflow-hidden transition-all rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-800"
                      )}
                      onClick={() => handleNavigate(path)}
                    >
                      <Icon size="1.2rem" />
                      {label}
                    </Button>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </nav>

        <Separator className={cn("my-[0.5]")} />

        <section
          className={cn(
            "px-[0.7rem] pt-[1.5rem] py-[0.7rem] flex flex-col gap-4",
            "mt-auto pb-[2.5rem] sm:pb-[3rem] md:pb-[4rem]"
          )}
        >
          <Button
            variant="ghost"
            size="lg"
            onClick={() => setOpenSAction(true)}
            className={cn(
              "group items-center inline-flex justify-start gap-3 nav-btn overflow-hidden rounded-lg transition-all hover:bg-emerald-100 dark:hover:bg-emerald-800"
            )}
          >
            <Search size="1.2rem" />
            <span className={cn("text-sm")}>Search</span>
            <kbd
              className={cn(
                "ml-auto text-xs min-[864px]:inline-block app-font-code border app-border px-2 py-0.5 rounded-md text-muted-foreground"
              )}
            >
              {strippedOS === "mac" ? (
                <>{"\u2318"} K</>
              ) : strippedOS === "windows" ? (
                <>CTRL K</>
              ) : strippedOS === "phone" ? (
                <>PRESS</>
              ) : (
                <>REFRESH</>
              )}
            </kbd>
          </Button>

          <Button
            variant="ghost"
            size="lg"
            key="github-repository"
            data-no-prompt
            onClick={() => {
              setOpenAction(false);
              setTimeout(() => {
                openExternalLinkManually({
                  href: "https://github.com/aarush0101/zendo",
                  target: "_blank",
                });
              }, 650);
            }}
            className={cn(
              "nav-btn overflow-hidden rounded-lg transition-all hover:bg-emerald-100 dark:hover:bg-emerald-800"
            )}
          >
            <div className={cn("flex items-center justify-center")}>
              <span className={cn("sr-only")}>GitHub Repository</span>
              <SiGithub size="1.2rem" />
            </div>
          </Button>

          <div className={cn("flex justify-between")}>
            <ModeToggle />
            <Button
              key="home-page"
              data-no-prompt
              variant="ghost"
              size="icon"
              onClick={() => {
                setOpenAction(false);
                setTimeout(() => router.push("/"), 250);
              }}
              className={cn(
                "nav-btn overflow-hidden rounded-lg transition-all hover:bg-emerald-100 dark:hover:bg-emerald-800"
              )}
            >
              <div className={cn("flex items-center justify-center")}>
                <span className={cn("sr-only")}>Home page</span>
                <Home size="1.2rem" />
              </div>
            </Button>
          </div>
        </section>
      </SheetContent>
    </Sheet>
  );
}
