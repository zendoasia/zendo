"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { X } from "lucide-react";
import { FaCircleInfo } from "react-icons/fa6";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useHandleThemeChange } from "@/hooks/useThemeChanger";

export default function LightModeTipAlert() {
  const { handleThemeChange, resolvedTheme, mounted } = useHandleThemeChange();

  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
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
          className="fixed top-4 left-1/2 -translate-x-1/2 w-full z-[105] flex justify-center px-4 py-2.5 pointer-events-auto touch-none"
        >
          <Alert className="max-w-xl w-full relative shadow-lg app-font flex items-start gap-3">
            <FaCircleInfo
              size="1.5rem"
              className="mt-1 text-slate-600 dark:text-slate-400 shrink-0"
            />
            <div className="flex flex-col">
              <AlertTitle className="text-lg text-shadow-md">Tip!</AlertTitle>
              <AlertDescription className="text-base">
                <span className="inline-flex flex-wrap items-center gap-1">
                  It is better to view the page in dark mode. Please switch to
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.currentTarget.blur();
                      handleThemeChange("dark");
                      setTimeout(() => setShowAlert(false), 1000);
                    }}
                  >
                    Dark Mode
                  </Button>
                  for a better experience.
                </span>
              </AlertDescription>
            </div>
            <Button
              onClick={() => setShowAlert(false)}
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2 nav-btn"
            >
              <X size="1.2rem" aria-label="Dismiss Tip Alert" />
            </Button>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
