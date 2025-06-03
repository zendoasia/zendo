"use client";

import { Copyright, ArrowUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FooterLink } from "@/types";
import { cn } from "@/lib/utils";
import { openExternalLinkManually } from "@/components/externalLinkInterceptor";
import { SiWakatime, SiX, SiDiscord, SiGithub } from "@icons-pack/react-simple-icons";

export default function Footer() {
  const footerLinks: FooterLink[] = [
    {
      title: {
        name: "Projects",
        path: "/projects",
        items: [
          { title: "Pixelite", path: "/projects/pixelite" },
          { title: "SkinCraft", path: "/projects/skincraft" },
        ],
      },
    },
    {
      title: {
        name: "Contact",
        path: "/contact",
        items: [
          { title: "Submit a Security Issue", path: "/security/report" },
          { title: "Blogs", path: "/blogs" },
        ],
      },
    },
  ];

  return (
    <div className={cn("w-full relative app-border border-t rounded-top z-50")}>
      <GlowingEffect spread={30} glow={true} disabled={false} proximity={100} inactiveZone={0.01} />

      <footer
        className={cn("relative z-[60] w-full py-2.5 app-font app-border rounded-top border-t")}
      >
        <span
          aria-hidden={true}
          role="presentation"
          className={cn(
            "absolute bottom-0 left-0 w-48 h-48 rounded-full dark:bg-[color:var(--accent2)] bg-[color:var(--primary2)] blur-[100px] opacity-50 pointer-events-none"
          )}
        />
        <div className={cn("w-full px-4 py-2.5")}>
          <div
            key="section-keys"
            className={cn(
              "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-8 gap-8 mb-10 z-[40] relative"
            )}
          >
            {footerLinks.map((section) => (
              <div key={section.title.name} className={cn("flex flex-col gap-2")}>
                <h3>
                  <Link
                    key={section.title.name}
                    href={section.title.path}
                    className={cn("text-lg text-pretty hover:underline font-semibold app-font")}
                  >
                    {section.title.name}
                  </Link>
                </h3>
                {section.title.items.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={cn(
                      "text-base text-[color:var(--slate-700)] dark:text-[color:var(--slate-300)] hover:underline"
                    )}
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            ))}
          </div>

          <div
            className={cn(
              "flex flex-col sm:flex-row justify-between items-center gap-4 z-10 relative border-t pt-6 border-[color:var(--jet)]"
            )}
          >
            <div className={cn("text-center sm:text-left")}>
              <Link
                href="/ownership"
                className={cn(
                  "inline-flex items-center gap-1 text-lg text-[color:var(--slate-700)] dark:text-[color:var(--slate-300)]"
                )}
              >
                <Copyright size="1.2rem" />
                2025 Zendo. All rights reserved.
              </Link>
              <div
                className={cn(
                  "text-base text-[color:var(--slate-500)] dark:text-[color:var(--slate-500)]"
                )}
              >
                Built by Aarush Master.
              </div>
            </div>

            <span
              className={cn(
                "flex gap-2 px-2.5 justify-center sm:justify-end sm:ml-0 w-full sm:w-auto"
              )}
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" key="back-to-top-button" asChild>
                      <Link key="back-to-top-link" aria-label="Go back to top" href="#top">
                        <ArrowUp size="2rem" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className={cn("text-base")}>Back to Top</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      key="wakatime-button"
                      data-no-prompt
                      size="icon"
                      onClick={() => {
                        setTimeout(() => {
                          openExternalLinkManually({
                            href: "https://wakatime.com/@aarush0101",
                            target: "_blank",
                          });
                        }, 350);
                      }}
                    >
                      <span className="sr-only">Wakatime Profile</span>
                      <SiWakatime size="2rem" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className={cn("text-base")}>
                    Visit Wakatime Profile
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      key="twitter-button"
                      data-no-prompt
                      size="icon"
                      onClick={() => {
                        setTimeout(() => {
                          openExternalLinkManually({
                            href: "https://x.com/aarush01111",
                            target: "_blank",
                          });
                        }, 350);
                      }}
                    >
                      <span className="sr-only">Twitter Profile</span>
                      <SiX size="2rem" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className={cn("text-base")}>Visit Twitter Profile</TooltipContent>
                </Tooltip>
              </TooltipProvider>{" "}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      key="discord-button"
                      data-no-prompt
                      size="icon"
                      onClick={() => {
                        setTimeout(() => {
                          openExternalLinkManually({
                            href: "https://discord.com/users/906543610269401148",
                            target: "_blank",
                          });
                        }, 350);
                      }}
                    >
                      <span className="sr-only">Discord Profile</span>
                      <SiDiscord size="2rem" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className={cn("text-base")}>Visit Discord Profile</TooltipContent>
                </Tooltip>
              </TooltipProvider>{" "}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      key="github-button"
                      data-no-prompt
                      size="icon"
                      onClick={() => {
                        setTimeout(() => {
                          openExternalLinkManually({
                            href: "https://github.com/aarush0101",
                            target: "_blank",
                          });
                        }, 350);
                      }}
                    >
                      <span className="sr-only">GitHub Profile</span>
                      <SiGithub size="2rem" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className={cn("text-base")}>Visit GitHub Profile</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
