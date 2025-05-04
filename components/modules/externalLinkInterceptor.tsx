"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useEffect, useRef, useState } from "react";
import { MessageSquareWarning } from "lucide-react";

export default function ExternalLinkInterceptor() {
  const [showDialog, setShowDialog] = useState(false);
  const [linkHref, setLinkHref] = useState<string | null>(null);
  const linkElementRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const path = event.composedPath() as HTMLElement[];
      const anchor = path.find((el) => el instanceof HTMLAnchorElement) as
        | HTMLAnchorElement
        | undefined;

      if (!anchor) return;

      const href = anchor.getAttribute("href");

      if (
        !href ||
        href.startsWith("/") ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        anchor.hasAttribute("data-no-prompt")
      ) {
        return;
      }

      const linkOrigin = new URL(href, window.location.href).origin;
      if (linkOrigin === window.location.origin) return;

      // Intercept and prevent default
      event.preventDefault();
      event.stopPropagation();

      linkElementRef.current = anchor;
      setLinkHref(href);
      setShowDialog(true);
    };

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  const proceed = () => {
    if (linkElementRef.current && linkHref) {
      const target = linkElementRef.current.getAttribute("target") || "_self";
      const rel = linkElementRef.current.getAttribute("rel") || "";

      window.open(linkHref, target, rel);
      setShowDialog(false);
    }
  };

  return (
    <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
      <AlertDialogTrigger asChild></AlertDialogTrigger>
      <AlertDialogContent className="font-[family-name:var(--font-sans)] ">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[var(--danger)] flex items-center gap-2">
            <MessageSquareWarning className="h-5 w-5" />
            Leaving the site
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[color:var(--text-dark)] dark:text-[color:var(--text-light)]">
            <b>
              You are about to visit an external website. This site is not
              affiliated with or managed by us. Please continue at your own
              risk.
            </b>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={proceed}
            className="bg-[var(--danger)] text-[var(--text-light)] hover:bg-[var(--danger-bg)] hover:text-[var(--danger)]"
          >
            Proceed
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
