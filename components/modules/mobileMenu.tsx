"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/modules/modes";
import {
  Briefcase,
  CircleChevronDown,
  Folder,
  Home,
  Info,
  Mail,
  Search,
} from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { openExternalLinkManually } from "@/components/externalLinkInterceptor";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { NavGroups, MobileMenuProps } from "@/types";

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
  };

  const handleNavigate = (path: string) => {
    setOpenAction(false);
    setTimeout(() => router.push(path), 250);
  };
  const sectionKeys = Object.keys(navItems);

  return (
    <Sheet open onOpenChange={setOpenAction}>
      <SheetContent
        side="left"
        className="w-[280px] border-r border-b border-t border-dashed border-[color:var(--jet)] rounded-right flex flex-col justify-between p-0 font-[family-name:var(--font-text)]"
      >
        <div className="flex flex-col px-4 py-2.5 gap-6 flex-1">
          <SheetHeader className="flex flex-row gap-[0.5rem] items-center">
            <CircleChevronDown
              size="1.2rem"
              className="text-emerald-700 dark:text-emerald-500"
            />
            <SheetTitle className="text-xl font-bold">Menu</SheetTitle>
          </SheetHeader>

          <hr className="mx-auto w-[95%] border-t border-dashed border-[color:var(--jet)]" />

          <nav>
            <Accordion
              type="multiple"
              defaultValue={sectionKeys}
              className="w-full"
            >
              {sectionKeys.map((sectionKey) => (
                <AccordionItem key={sectionKey} value={sectionKey}>
                  <AccordionTrigger className="font-[family-name:var(--font-text-mono)] text-xs text-muted-foreground tracking-widest font-semibold px-2 py-1 flex items-center gap-2">
                    {sectionKey.toUpperCase()}
                  </AccordionTrigger>
                  <AccordionContent className="flex flex-col gap-2 px-2 pt-2">
                    {navItems[sectionKey].map(({ label, icon: Icon, path }) => (
                      <Button
                        key={label}
                        variant="ghost"
                        className="justify-start gap-4 hover:bg-[color:var(--primary-hover)] focus:bg-[color:var(--primary-hover)] dark:hover:bg-[color:var(--primary-hover)] dark:focus:bg-[color:var(--primary-hover)] transition-colors duration-300 px-2 py-2.5 rounded-[radius:var(--radius)] border border-[color:var(--jet)] overflow-hidden"
                        onClick={() => handleNavigate(path)}
                      >
                        <Icon size="2rem" />
                        {label}
                      </Button>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </nav>
        </div>

        <hr className="mx-auto w-[85%] border-t border-dashed border-[color:var(--jet)]" />

        <div className="flex flex-col gap-4 px-4 py-2.5">
          <Button
            onClick={() => {
              setOpenSAction(true);
            }}
            className="group flex items-center justify-start gap-3 bg-transparent hover:bg-[color:var(--primary-hover)] focus:bg-[color:var(--primary-hover)] dark:hover:bg-[color:var(--primary-hover)] dark:focus:bg-[color:var(--primary-hover)] transition-colors duration-300 rounded-[radius:var(--radius)] border border-[color:var(--jet)] overflow-hidden"
          >
            <Search size="1.2rem" className="dark:text-white text-black" />
            <span className="text-sm font-[weight:var(--default-font-weight)] dark:text-white text-black">
              Search...
            </span>
            <kbd className="ml-auto text-xs px-2 py-0.5 rounded-sm border border-[color:var(--jet)] text-muted-foreground font-[family-name:var(--font-code)]">
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
          </Button>
          <Button
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
            className="hover:bg-[color:var(--primary-hover)] focus:bg-[color:var(--primary-hover)] dark:hover:bg-[color:var(--primary-hover)] dark:focus:bg-[color:var(--primary-hover)] transition-colors duration-300 px-2 py-2.5 rounded-[radius:var(--radius)] border border-[color:var(--jet)] overflow-hidden"
          >
            <div className="flex items-center justify-center">
              <SiGithub size="1.2rem" />
            </div>
          </Button>

          <div className="flex justify-between">
            <span>
              <ModeToggle />
            </span>

            <span>
              <Button
                data-no-prompt
                variant="ghost"
                onClick={() => {
                  setOpenAction(false);
                  setTimeout(() => router.push("/"), 250);
                }}
                className="hover:bg-[color:var(--primary-hover)] focus:bg-[color:var(--primary-hover)] dark:hover:bg-[color:var(--primary-hover)] dark:focus:bg-[color:var(--primary-hover)] transition-colors duration-300 px-2 py-2.5 rounded-[radius:var(--radius)] border border-[color:var(--jet)] overflow-hidden"
              >
                <div className="flex items-center justify-center">
                  <Home size="1.2rem" />
                </div>
              </Button>
            </span>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
