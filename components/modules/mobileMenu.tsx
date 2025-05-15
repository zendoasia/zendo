"use client";

import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/modules/modes";
import {
  Briefcase,
  Folder,
  Home,
  Info,
  Mail,
  Search,
} from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { TiThMenuOutline } from "react-icons/ti";
import { openExternalLinkManually } from "@/components/externalLinkInterceptor";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { NavGroups, MobileMenuProps } from "@/types";
import { cn } from "@/lib/utils";

export default function MobileMenu({
  setOpenAction,
  setOpenSAction,
  strippedOS,
}: MobileMenuProps) {
  const router = useRouter();

  const navItems: NavGroups = {
    links: [
      { label: "About", icon: Info, path: "/about" },
      { label: "Portfolio", icon: Briefcase, path: "/portfolio" },
      { label: "Projects", icon: Folder, path: "/projects" },
      { label: "Contact", icon: Mail, path: "/contact" },
    ],
    linksfe: [
      { label: "About", icon: Info, path: "/about" },
      { label: "Portfolio", icon: Briefcase, path: "/portfolio" },
      { label: "Projects", icon: Folder, path: "/projects" },
      { label: "Contact", icon: Mail, path: "/contact" },
    ],
    linkefs: [
      { label: "About", icon: Info, path: "/about" },
      { label: "Portfolio", icon: Briefcase, path: "/portfolio" },
      { label: "Projects", icon: Folder, path: "/projects" },
      { label: "Contact", icon: Mail, path: "/contact" },
    ],
    liefnks: [
      { label: "About", icon: Info, path: "/about" },
      { label: "Portfolio", icon: Briefcase, path: "/portfolio" },
      { label: "Projects", icon: Folder, path: "/projects" },
      { label: "Contact", icon: Mail, path: "/contact" },
    ],
    linkfes: [
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
    <Sheet open onOpenChange={setOpenAction}>
      <SheetContent
        aria-label="Mobile Menu"
        side="left"
        className={cn(
          "top-0 left-0 z-50 w-[50%] max-[373px]:w-[270px] border-r border-b border-t border-[color:var(--jet)] rounded-right flex flex-col p-0 app-font overflow-hidden"
        )}
      >
        <div className="flex items-center gap-2 px-4 py-2.5">
          <TiThMenuOutline
            size="2rem"
            className="text-emerald-700 dark:text-emerald-500"
          />
          <SheetTitle className="text-xl font-extrabold">Menu</SheetTitle>
        </div>

        <hr className="mx-auto w-[100%] border-t border-[color:var(--jet)]" />

        <nav
          className="flex-1 overflow-y-auto px-[1.2rem] pt-[1.2rem] pb-[1.2rem] scroll-smooth no-scrollbar"
          aria-label="Primary Navigation and Inter-Links"
        >
          <Accordion type="multiple" defaultValue={sectionKeys}>
            {sectionKeys.map((sectionKey) => (
              <AccordionItem key={sectionKey} value={sectionKey}>
                <AccordionTrigger className="app-font-mono text-xs text-muted-foreground tracking-widest font-semibold px-1 py-[0.7rem] flex items-center">
                  {sectionKey.toUpperCase()}
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-[0.7rem] pt-[0.7rem]">
                  {navItems[sectionKey].map(({ label, icon: Icon, path }) => (
                    <Button
                      key={label}
                      size="lg"
                      variant="ghost"
                      className="justify-start flex-row nav-btn overflow-hidden"
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

        <hr className="mx-auto w-[100%] border-t border-[color:var(--jet)]" />

        <section className="sticky pb-[3.5rem] bottom-0 z-100 px-[0.7rem] py-[0.7rem] flex flex-col gap-4">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => setOpenSAction(true)}
            className="group items-center inline-flex justify-start gap-3 nav-btn overflow-hidden"
          >
            <Search size="1.2rem" />
            <span className="text-sm">Search</span>
            <kbd className="ml-auto text-xs min-[864px]:inline-block app-font-code border app-border px-2 py-0.5 rounded-md text-muted-foreground">
              {strippedOS === "mac" ? (
                <>\u2318 K</>
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
            className="nav-btn overflow-hidden"
          >
            <div className="flex items-center justify-center">
              <span className="sr-only">GitHub Repository</span>
              <SiGithub size="1.2rem" />
            </div>
          </Button>

          <div className="flex justify-between">
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
              className="nav-btn overflow-hidden"
            >
              <div className="flex items-center justify-center">
                <span className="sr-only">Home page</span>
                <Home size="1.2rem" />
              </div>
            </Button>
          </div>
        </section>
      </SheetContent>
    </Sheet>
  );
}
