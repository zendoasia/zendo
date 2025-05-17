import React from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function SearchSkeleton() {
  return (
    <div className="fixed inset-0 z-105 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: -10 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={cn(
          "w-full max-w-lg rounded-lg border border-border bg-background shadow-xl",
          "will-change-transform transform-gpu backface-hidden"
        )}
      >
        <div className="flex items-center px-4 py-3 border-b border-border gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-4 flex-1 rounded" />
          <Skeleton className="h-4 w-4 rounded" />
        </div>

        <div className="p-2 space-y-2">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-muted/30 transition-colors"
            >
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-3 w-24 rounded" />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
