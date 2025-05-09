"use client";

import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"; 

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
    <Dialog open onOpenChange={(open) => !open && setOpenSAction(false)}>
      <DialogContent className="p-0 max-w-md">
        <DialogTitle>
          <VisuallyHidden>Search dialog</VisuallyHidden>
        </DialogTitle>

        <Command className="border-none shadow-none">
          <div className="px-4 pt-4">
            <CommandInput
              placeholder="Search pages..."
              value={search}
              onValueChange={setSearch}
              className="pl-10 pr-3 py-2"
            />
          </div>
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
        </Command>
      </DialogContent>
    </Dialog>
  );
}
