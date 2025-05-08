"use client";

import { motion } from "framer-motion";
import { CircleHelp } from "lucide-react";
import Link from "next/link";
import lonelyGhost from "@/public/assets/lonelyGhost.svg";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="relative isolate font-[weight:var(--default-font-weight)] font-[family-name:var(--font-text)] w-full min-h-screen flex flex-col md:flex-row justify-center items-center gap-[8rem] px-4 py-8.5 text-center md:text-left">
      <motion.div
        className="flex justify-center items-center md:order-1"
        animate={{ y: ["0%", "-10%", "0%"] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <div className="relative w-full max-w-[400px] bg-transparent">
          <Image
            src={lonelyGhost}
            alt="Lonely Ghost"
            width={400}
            priority
            className="object-contain w-full h-auto"
          />
        </div>
      </motion.div>

      <div className="flex flex-col items-center md:items-start gap-[2rem] max-w-xl">
        <div className="flex items-center gap-3">
          <CircleHelp size="3rem" className="text-rose-600" />
          <h1 className="text-xl font-[family-name:var(--font-space-grotesk)] font-extrabold">
            Hey Buddy! Seems like you are lost?
          </h1>
        </div>
        <p className="text-lg">
          Time for some ramen! This page does not exist here, does it?
        </p>
        <Link
          href="/"
          className="px-4 py-2.5 text-md rounded-[radius:var(--radius)] border border-[color:var(--jet)] hover:bg-[color:var(--primary-hover)] focus:bg-[color:var(--primary-hover)] transition-colors duration-300"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
