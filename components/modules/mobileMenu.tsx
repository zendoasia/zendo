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

interface Props {
  setOpenAction: (v: boolean) => void;
  setOpenSAction: (v: boolean) => void;
  strippedOS: string | null;
}

export default function MobileMenu({
  setOpenAction,
  setOpenSAction,
  strippedOS,
}: Props) {
  const router = useRouter();

  const navItems = [
    { label: "About", icon: Info, path: "/about" },
    {
      label: "Portfolio",
      icon: Briefcase,
      path: "/portfolio",
    },
    { label: "Projects", icon: Folder, path: "/projects" },
    { label: "Contact", icon: Mail, path: "/contact" },
  ];

  const handleNavigate = (path: string) => {
    setOpenAction(false);
    setTimeout(() => router.push(path), 250);
  };

  return (
    <Sheet open onOpenChange={setOpenAction}>
      <SheetContent
        side="left"
        className="w-[280px] border-r border-b border-t border-dashed border-[color:var(--jet)] custom-rounded-right flex flex-col justify-between p-0"
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

          <nav className="flex flex-col gap-4">
            {navItems.map(({ label, icon: Icon, path }) => (
              <Button
                key={label}
                variant="ghost"
                className="justify-start gap-[1rem] hover:bg-[color:var(--primary-hover)] focus:bg-[color:var(--primary-hover)] dark:hover:bg-[color:var(--primary-hover)] dark:focus:bg-[color:var(--primary-hover)] transition-colors duration-300 px-2 py-2.5 rounded-[radius:var(--radius)] border border-[color:var(--jet)] overflow-hidden"
                onClick={() => handleNavigate(path)}
              >
                <Icon size="1.2rem" />
                {label}
              </Button>
            ))}
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
              {strippedOS === "mac"
                ? "⌘ K"
                : strippedOS === "windows"
                ? "CTRL K"
                : "PRESS"}
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
