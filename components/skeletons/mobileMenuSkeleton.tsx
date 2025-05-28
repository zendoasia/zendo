import React from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function MobileMenuSkeleton() {
  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{ x: "-100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      aria-label="Mobile Menu"
      className={cn(
        "top-0 left-0 z-100 border-r border-b border-t border-[color:var(--jet)] rounded-right flex flex-col p-0 app-font overflow-hidden",
        "w-[85%] max-w-xs sm:w-[60%] md:w-[50%]",
        "will-change-transform transform-gpu backface-hidden"
      )}
    >
      <div className={cn("flex flex-col gap-3 px-[1.2rem] pt-4 pb-3")}>
        <Skeleton className={cn("h-4 w-2/3")} />
        <Skeleton className={cn("h-3 w-1/2")} />
      </div>

      <Separator className={cn("my-[0.5]")} />

      <div
        className={cn(
          "flex-1 overflow-y-auto px-[1.2rem] pt-[1.2rem] pb-[1.2rem] scroll-smooth no-scrollbar flex flex-col gap-4"
        )}
      >
        {[...Array(4)].map((_, i) => (
          <div key={i} className={cn("flex flex-col gap-2")}>
            <Skeleton className={cn("h-3 w-24")} />
            <Skeleton className={cn("h-9 w-full rounded-md")} />
            <Skeleton className={cn("h-9 w-5/6 rounded-md")} />
            <Skeleton className={cn("h-9 w-2/3 rounded-md")} />
          </div>
        ))}
      </div>

      <Separator className={cn("my-[0.5]")} />

      <div className={cn("pb-[3.5rem] bottom-0 z-100 px-[0.7rem] py-[0.7rem] flex flex-col gap-4")}>
        <Skeleton className={cn("h-9 w-full rounded-md")} />
        <Skeleton className={cn("h-9 w-full rounded-md")} />
        <div className={cn("flex justify-between")}>
          <Skeleton className={cn("h-9 w-[60%] rounded-md")} />
          <Skeleton className={cn("h-9 w-9 rounded-md")} />
        </div>
      </div>
    </motion.div>
  );
}
