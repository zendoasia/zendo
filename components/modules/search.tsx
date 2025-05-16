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
import { SearchProps } from "@/types";
import { useEffect } from "react";

const items = [
  { label: "Dashboard", value: "dashboard" },
  { label: "Settings", value: "settings" },
  { label: "Profile", value: "profile" },
  { label: "Logout", value: "logout" },
];

export default function SearchBar({
  setOpenSAction,
  openS = true, // Default to true for backward compatibility
  onCloseComplete,
}: SearchProps) {
  const [search, setSearch] = useState("");
  const [isClosing, setIsClosing] = useState(false);

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

  return (
    <CommandDialog open={openS} onOpenChange={setOpenSAction}>
      <CommandInput
        placeholder="Search pages..."
        value={search}
        onValueChange={setSearch}
        className="pl-10 pr-3 py-2"
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          {items
            .filter((item) =>
              item.label.toLowerCase().includes(search.toLowerCase())
            )
            .map((item) => (
              <CommandItem
                key={item.value}
                value={item.value}
                onSelect={() => setOpenSAction(false)}
              >
                {item.label}
              </CommandItem>
            ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
