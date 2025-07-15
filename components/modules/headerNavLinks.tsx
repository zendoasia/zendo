/**
 * components/modules/headerNavLinks.tsx
 * ------------------------------------
 *
 * Renders the header nav links.
 *
 * @license MIT - see LICENSE for more details
 * @copyright © 2025–present AARUSH MASTER and Zendo - see package.json for more details
 */

import { Button } from "@/components/ui/button";
import Link from "next/link";

type HeaderNavLink = { label: string; path: string };

interface Props {
  links: HeaderNavLink[] | null;
}

export default function HeaderNavLinks({ links }: Props) {
  if (!Array.isArray(links) || links.length === 0) {
    return (
      <div className="text-destructive text-center p-4 text-balance leading-relaxed w-full">
        Could not fetch quick links. Please try again later or contact support.
      </div>
    );
  }

  return (
    <>
      {links.map(({ label, path }) => (
        <Button size="sm" key={label} className="text-unimportant" variant="link" asChild>
          <Link href={path}>
            <span className="inline-flex items-center gap-1">{label}</span>
          </Link>
        </Button>
      ))}
    </>
  );
}
