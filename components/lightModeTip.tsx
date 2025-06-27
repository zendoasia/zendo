"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { X } from "lucide-react";
import { FaCircleInfo } from "react-icons/fa6";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useHandleThemeChange } from "@/hooks/useThemeChanger";
import { cn } from "@/lib/utils";

export default function LightModeTipAlert() {
  const { handleThemeChange, resolvedTheme, mounted } = useHandleThemeChange();

  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const seenTip = Cookies.get("seenTip");

    if (!seenTip && resolvedTheme?.toLocaleLowerCase() === "light") {
      setShowAlert(true);
      Cookies.set("seenTip", "true", { expires: 365 });
      const autoDismiss = setTimeout(() => {}, 6000);

      return () => clearTimeout(autoDismiss);
    }
  }, [mounted, resolvedTheme]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {showAlert && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={cn(
            "fixed top-4 left-0 right-0 z-[105] flex justify-center items-center pointer-events-auto touch-auto py-4"
          )}
        >
          <Alert
            className={cn(
              "max-w-[90vw] mx-auto md:mx-0 w-full relative shadow-lg app-font flex items-start gap-3 pr-12"
            )}
          >
            <FaCircleInfo
              size="1.5rem"
              className={cn("mt-1 text-slate-600 dark:text-slate-400 shrink-0")}
            />
            <div className={cn("flex flex-col")}>
              <AlertTitle className={cn("text-lg text-shadow-md")}>Tip!</AlertTitle>
              <AlertDescription className={cn("text-base")}>
                <span className={cn("inline-flex flex-wrap items-center gap-1")}>
                  It is better to view the page in dark mode. Please switch to
                  <Button
                    className="px-1 pl-0.8 pr-0.8 py-[1rem] cursor-pointer"
                    size="sm"
                    onClick={(e) => {
                      e.currentTarget.blur();
                      handleThemeChange("dark");
                      setTimeout(() => setShowAlert(false), 1000);
                    }}
                  >
                    dark mode
                  </Button>{" "}
                  for a better experience.
                </span>
              </AlertDescription>
            </div>
            <Button
              onClick={() => setShowAlert(false)}
              size="icon"
              variant="destructive"
              className={cn("absolute top-2 right-2 cursor-pointer")}
            >
              <X size="1.2rem" aria-label="Dismiss Tip Alert" />
            </Button>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
