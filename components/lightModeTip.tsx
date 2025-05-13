"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { X } from "lucide-react";
import { FaCircleInfo } from "react-icons/fa6";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function LightModeTipAlert() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const seenTip = Cookies.get("seenTip");

    if (!seenTip && resolvedTheme === "light") {
      setShowAlert(true);
      Cookies.set("seenTip", "true", { expires: 365 });

      const autoDismiss = setTimeout(() => {
        setShowAlert(false);
      }, 6000);

      return () => clearTimeout(autoDismiss);
    }
  }, [mounted, resolvedTheme]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {showAlert && (
        <motion.div
          initial={{ y: "-100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed top-0 left-0 w-full z-[100] flex justify-center px-4 py-2"
        >
          <Alert className="max-w-xl w-full relative shadow-lg font-[family-name:var(--font-text)]">
            <FaCircleInfo
              size="1.2rem"
              className="text-slate-600 dark:text-slate-400"
            />
            <AlertTitle>Tip!</AlertTitle>
            <AlertDescription className="text-balance text-base">
              It is better to view the page in dark mode. Please switch to Dark
              Mode for a better experience.
            </AlertDescription>
            <Button
              onClick={() => setShowAlert(false)}
              size="icon"
              variant="ghost"
              className="border border-[color:var(--jet)] absolute top-2 right-2 text-muted-foreground hover:text-foreground"
            >
              <X size="1.2rem" aria-label="Dismiss Tip Alert" />
            </Button>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
