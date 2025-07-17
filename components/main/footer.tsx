/**
 * components/main/footer.tsx
 * --------------------------
 *
 * Server-safe footer component using latest React 19 / Next.js 15 patterns.
 * All external data is preloaded in layout.tsx and passed as props.
 *
 * @license MIT
 * @copyright © 2025–present AARUSH MASTER and Zendo
 */

import Link from "next/link";
import { ArrowUp, Copyright } from "lucide-react";
import { SiX, SiDiscord, SiGithub, SiGmail } from "@icons-pack/react-simple-icons";
import { cn } from "@/lib/utils";
import ConstructStatusBadge from "@/components/modules/constructStatusBadge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "../ui/button";

const ICON_LINKS = [
  { label: "Back to Top", icon: <ArrowUp size="1.2rem" />, href: "#top" },
  {
    label: "X Profile",
    icon: <SiX size="1.2rem" />,
    href: "https://x.com/aarush01111",
  },
  {
    label: "Email Contact",
    icon: <SiGmail size="1.2rem" />,
    href: "mailto:support@zendo.asia",
  },
  {
    label: "Discord Contact",
    icon: <SiDiscord size="1.2rem" />,
    href: "https://discord.com/users/906543610269401148",
  },
  {
    label: "GitHub Account",
    icon: <SiGithub size="1.2rem" />,
    href: "https://github.com/zendoasia",
  },
];

export type FooterSection = {
  name: string;
  path: string;
  items: { title: string; path: string }[];
};

export type FooterProps = {
  footerSections: FooterSection[] | null;
  uptime: string | null;
};
export default function Footer({ footerSections, uptime }: FooterProps) {
  const hasValidSections = Array.isArray(footerSections) && footerSections.length > 0;

  return (
    <footer
      className={cn(
        "relative z-[50] w-full py-2.5 app-font app-border rounded-top rounded-[var(--radius)] border-t"
      )}
    >
      <div className="w-full px-4 py-2.5">
        {!hasValidSections ? (
          <div className="text-center text-destructive text-balance p-4 leading-relaxed">
            Could not load footer links. Please try again later or contact support.
          </div>
        ) : (
          <div
            className={cn(
              "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-8 mb-10 z-[40] relative"
            )}
          >
            {footerSections.map((section) => (
              <div key={section.name} className="flex flex-col gap-2">
                <h3>
                  <Link
                    href={section.path}
                    className={cn(
                      "text-lg text-pretty hover:underline font-semibold app-font-inter"
                    )}
                  >
                    {section.name}
                  </Link>
                </h3>
                {section.items.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={cn(
                      "text-base text-muted-foreground button-scaler cursor-pointer hover:underline app-font"
                    )}
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 border-t pt-6 border-[var(--silver2)] dark:border-[var(--jet)]">
          <div className="flex flex-col gap-2 items-center sm:items-start text-center sm:text-left w-full sm:w-auto">
            <Link
              href="/legal"
              className="inline-flex items-center gap-1 text-lg text-muted-foreground"
            >
              <Copyright size="1.2rem" />
              2025 Zendo. All rights reserved.
            </Link>
            <p className="flex items-center gap-1 text-base app-font-inter text-muted-foreground">
              Built with
              <span className="inline-block align-middle mx-1 cursor-pointer">
                <svg
                  width="1.2rem"
                  height="1.2rem"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="drop-shadow"
                >
                  <path
                    d="M12.1 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54l-1.35 1.31z"
                    fill="url(#heart-gradient)"
                  />
                  <defs>
                    <linearGradient
                      id="heart-gradient"
                      x1="0"
                      y1="0"
                      x2="24"
                      y2="24"
                      gradientUnits="userSpaceOnUse"
                      gradientTransform="rotate(132 12 12)"
                    >
                      <stop offset="0%" stopColor="rgb(253, 54, 133)" />
                      <stop offset="100%" stopColor="rgb(254, 207, 215)" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
              by the Zendo Team.
            </p>
            <div className="w-full sm:w-auto flex justify-center">
              <ConstructStatusBadge uptime={uptime ?? "Unknown"} />
            </div>
          </div>

          <div className="w-full sm:w-auto flex justify-center sm:justify-end">
            <div className="flex flex-wrap gap-2">
              {ICON_LINKS.map(({ label, icon, href }) =>
                href.startsWith("http") ? (
                  <TooltipProvider key={label}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          key={label}
                          href={href}
                          target="_blank"
                          aria-label={label}
                          className={cn(
                            "inline-flex justify-center items-center rounded-md border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-10 w-10 transition-colors"
                          )}
                        >
                          {icon}
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>{label}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <TooltipProvider key={label}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          key={label}
                          href={href}
                          data-no-prompt
                          aria-label={label}
                          className={cn(
                            "inline-flex justify-center items-center rounded-md border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-10 w-10 transition-colors"
                          )}
                        >
                          {icon}
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>{label}</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
