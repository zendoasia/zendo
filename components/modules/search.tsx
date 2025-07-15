/**
 * components/modules/search.tsx
 * -----------------------------
 *
 * Implements the search bar for the app
 *
 * @license MIT - see LICENSE for more details
 * @copyright © 2025–present AARUSH MASTER and Zendo - see package.json for more details
 */

"use client";

import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
  CommandSeparator,
} from "@/components/ui/command";
import { useMenuStore } from "@/store/menuStore";
import { createPortal } from "react-dom";
import React, { useCallback, useState, Fragment } from "react";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Suspense } from "react";
import type { SearchNavGroups, SearchNavItem } from "@/types";
import { use } from "react"; // React 19+ use API

// Fetch navItems for search from CDN
let searchNavPromise: Promise<SearchNavGroups> | null = null;
function getSearchNavPromise(): Promise<SearchNavGroups> {
  if (!searchNavPromise) {
    searchNavPromise = fetch(`/api/search`, {
      next: { revalidate: 86400 },
    })
      .then(async (res) => {
        if (!res.ok) return { error: true } as const;
        const json = await res.json();
        const data = json && typeof json === "object" && json.data ? json.data : null;
        if (!data || typeof data !== "object") return { error: true } as const;
        // Validate structure: all values should be arrays of items with label, path
        for (const section of Object.values(data)) {
          if (!Array.isArray(section)) return { error: true } as const;
          for (const item of section) {
            if (typeof item.label !== "string" || typeof item.path !== "string") {
              return { error: true } as const;
            }
          }
        }
        return data as Record<string, SearchNavItem[]>;
      })
      .catch(() => ({ error: true }) as const);
  }
  return searchNavPromise ?? Promise.resolve({ error: true } as const);
}
function useSearchNavItems(): SearchNavGroups {
  return use(getSearchNavPromise());
}

function SearchNavContent({ onNavigate }: { onNavigate: (_path: string) => void }) {
  const navItems = useSearchNavItems();
  if (!navItems || "error" in navItems) {
    // Always render the same fallback on both server and client
    return (
      <div className="text-destructive text-center p-4 leading-relaxed w-full">
        Could not fetch search links. Please try again later or contact support.
      </div>
    );
  }
  // Filter out empty groups
  const sectionEntries = Object.entries(navItems).filter(
    ([, items]) => Array.isArray(items) && items.length > 0
  );
  if (sectionEntries.length === 0) return null;
  return (
    <>
      <CommandSeparator />
      {sectionEntries.map(([sectionKey, items], index) => (
        <Fragment key={sectionKey}>
          <CommandGroup
            heading={
              <span className="text-balance leading-relaxed text-muted-foreground">
                {sectionKey.toUpperCase()}
              </span>
            }
          >
            {(items as SearchNavItem[]).map(({ label, path }) => (
              <CommandItem
                key={label}
                onSelect={() => onNavigate(path)}
                className={cn("flex items-center")}
              >
                {label}
              </CommandItem>
            ))}
          </CommandGroup>
          {index < sectionEntries.length - 1 && <CommandSeparator />}
        </Fragment>
      ))}
    </>
  );
}

const SearchBar = React.memo(function SearchBar() {
  const { open, setOpen, openS, setOpenS } = useMenuStore();
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleNavigate = useCallback(
    (path: string) => {
      if (open) setOpen(false);
      setOpenS(false);
      setTimeout(() => router.push(path), 250);
    },
    [open, setOpen, setOpenS, router]
  );

  const handleOpenChange = useCallback(
    (newOpen: boolean) => {
      setOpenS(newOpen);
    },
    [setOpenS]
  );

  return createPortal(
    <CommandDialog open={openS} onOpenChange={handleOpenChange}>
      <CommandInput
        placeholder="Find"
        value={search}
        onValueChange={setSearch}
        className={cn("!p-0")}
      />
      <Suspense
        fallback={
          <div className="flex items-center justify-center w-full p-4">
            <LoaderCircle className="animate-spin text-muted-foreground" size={24} />
          </div>
        }
      >
        <CommandList>
          <CommandEmpty>
            No results found for your query. Please check your query and try again.
          </CommandEmpty>
          <SearchNavContent onNavigate={handleNavigate} />
        </CommandList>
      </Suspense>
    </CommandDialog>,
    document.getElementById("portal-root") || document.body
  );
});

export default SearchBar;
