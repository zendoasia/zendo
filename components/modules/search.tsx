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

const items = [
  { label: "Dashboard", value: "dashboard" },
  { label: "Settings", value: "settings" },
  { label: "Profile", value: "profile" },
  { label: "Logout", value: "logout" },
];

interface Props {
  setOpenSAction: (v: boolean) => void;
}

export default function SearchBar({ setOpenSAction }: Props) {
  const [search, setSearch] = useState("");

  return (
    <CommandDialog open onOpenChange={(open) => !open && setOpenSAction(false)}>
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
