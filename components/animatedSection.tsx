"use client";

import React, { useRef } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { AnimatedSectionProps, motionTags } from "@/types";

export default function AnimatedSection({
  children,
  className = "",
  as = "div",
}: AnimatedSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  const MotionTag = motionTags[as];

  return (
    <MotionTag
      ref={ref}
      initial={{ opacity: 0, y: -40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={cn(className)}
    >
      {children}
    </MotionTag>
  );
}
