"use client";

import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import { useState } from "react";
import { useEffect } from "react";
import { Info, Bot } from "lucide-react";
import { NavGroups, SearchProps } from "@/types";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export default function SearchBar({
  setOpenAction,
  setOpenSAction,
  openS = true, // Default to true for backward compatibility
  open,
  onCloseComplete,
}: SearchProps) {
  const [search, setSearch] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const router = useRouter();

  const navItems: NavGroups = {
    links: [{ label: "About", icon: Info, path: "/about" }],
    projects: [{ label: "Pixelite", icon: Bot, path: "/projects/pixelite" }],
  };

  const sectionKeys = Object.keys(navItems);
  useEffect(() => {
    if (!openS && !isClosing) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        if (onCloseComplete) onCloseComplete();
        setIsClosing(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [openS, isClosing, onCloseComplete]);

  const handleNavigate = (path: string) => {
    if (open) setOpenAction(false);
    setOpenSAction(false);
    setTimeout(() => router.push(path), 250);
  };

  return (
    <CommandDialog open={openS} onOpenChange={setOpenSAction}>
      <CommandInput
        placeholder="Search all across my work"
        value={search}
        onValueChange={setSearch}
        className={cn("p-2")}
      />
      <CommandList className={cn("pb-2 pt-2")}>
        <CommandEmpty>
          No results found for your query. Please check your query and try again.
        </CommandEmpty>
        {sectionKeys.map((sectionKey, index) => (
          <div key={sectionKey}>
            <CommandGroup
              heading={
                <span
                  className={cn("!app-font-mono !text-xs !font-semibold text-muted-foreground")}
                >
                  {sectionKey.toUpperCase()}
                </span>
              }
            >
              {navItems[sectionKey].map(({ label, icon: Icon, path }) => (
                <CommandItem
                  key={label}
                  onSelect={() => handleNavigate(path)}
                  className={cn("flex items-center gap-2")}
                >
                  <Icon size="1.2rem" />
                  {label}
                </CommandItem>
              ))}
            </CommandGroup>

            {/* Add separator unless it's the last group */}
            {index < sectionKeys.length - 1 && <Separator className={cn("my-1")} />}
          </div>
        ))}
      </CommandList>
    </CommandDialog>
  );
}
