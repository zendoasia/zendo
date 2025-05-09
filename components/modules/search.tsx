"use client";

import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from "@/components/ui/command";
import { useState } from "react";
import { Search} from "lucide-react";

const items = [
  { label: "Dashboard", value: "dashboard" },
  { label: "Settings", value: "settings" },
  { label: "Profile", value: "profile" },
  { label: "Logout", value: "logout" },
];

export default function SearchBar() {
  const [search, setSearch] = useState("");

  return (
    <div className="max-w-md mx-auto mt-10">
      <Command className="rounded-2xl border shadow-md bg-white dark:bg-gray-900">
        <div className="flex items-center px-3 pt-3 relative">
          <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-3.5" />
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
                <CommandItem key={item.value} value={item.value}>
                  {item.label}
                </CommandItem>
              ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  );
}
