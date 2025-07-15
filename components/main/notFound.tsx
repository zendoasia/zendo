/**
 * components/main/notFound.tsx
 * ----------------------------
 *
 * Implements the 404 page for the app
 *
 * @license MIT - see LICENSE for more details
 * @copyright © 2025–present AARUSH MASTER and Zendo - see package.json for more details
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CircleHelp, Home } from "lucide-react";
import Link from "next/link";
import lonelyGhost from "@/public/assets/lonelyGhost.svg";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ArticleWrapper from "@/components/articleWrapper";

export default function NotFoundPage() {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  return (
    <ArticleWrapper
      className={cn(
        "relative isolate w-full min-h-screen flex flex-col br:flex-row justify-center items-center gap-[8rem] px-4 py-8.5 text-center br:text-left"
      )}
    >
      <motion.div
        className={cn("flex justify-center items-center br:order-1")}
        animate={{ y: ["0%", "-10%", "0%"] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <div className={cn("relative w-full max-w-[400px] aspect-[1/1]")}>
          {!isImageLoaded && <Skeleton className={cn("w-full aspect-[1/1] rounded-xl")} />}
          <Image
            src={lonelyGhost}
            alt="Lonely Ghost"
            onLoad={() => setIsImageLoaded(true)}
            loading="lazy"
            className={cn(
              `object-contain w-full h-auto min-h-[150px] transition-opacity duration-500 ${
                isImageLoaded ? "opacity-100" : "opacity-0"
              }`
            )}
          />
        </div>
      </motion.div>

      <div className={cn("flex flex-col items-center br:items-start gap-[2rem] max-w-xl")}>
        <div className="flex items-center gap-[0.5rem]">
          <CircleHelp size="2rem" className="text-rose-600" />
          <h1
            className={cn(
              "text-xl font-[family-name:var(--font-space-grotesk)] font-extrabold",
              "bg-gradient-to-r from-rose-500 to-violet-600 bg-clip-text text-transparent"
            )}
            style={{
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "0 1px 6px rgba(236, 72, 153, 0.3)",
            }}
          >
            Houston, we have a problem.
          </h1>
        </div>
        <section
          className="text-lg leading-relaxed text-balance text-muted-foreground"
          style={{ lineHeight: 1.6 }}
        >
          Looks like you are lost. But don&apos;t worry, we&apos;ll help you find your way back
          home. Alternatively, the greatest discoveries start by first getting lost into the void.
        </section>

        <section className="flex justify-center">
          <Button size="lg" className={cn("text-md button-scaler")}>
            <Link href="/" className="flex items-center gap-2">
              <Home size="1.2rem" />
              Go Back Home
            </Link>
          </Button>
        </section>
      </div>
    </ArticleWrapper>
  );
}
