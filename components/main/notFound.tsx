"use client";

import { motion } from "framer-motion";
import { ShieldQuestion } from "lucide-react";
import Link from "next/link";
import lonelyGhost from "@/public/assets/lonelyGhost.svg";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="relative w-full min-h-screen flex flex-col justify-center items-center px-4 py-8 text-center">
      <motion.div
        className="flex justify-center items-center mb-8"
        animate={{ y: ["0%", "-10%", "0%"] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
      >
        <Image
          src={lonelyGhost}
          alt="Lonely Ghost"
          priority={false}
          width={0}
          height={0}
          className="w-[60vw] md:w-[30vw] aspect-[3/4] max-w-[80%] rounded-full object-contain"
          loading="lazy"
        />
      </motion.div>

      <div className="flex flex-col items-center gap-2 font-[family-name:var(--font-sans)] text-[color:var(--text-dark)] dark:text-[color:var(--text-light)]">
        <ShieldQuestion className="w-10 h-10 text-[color:var(--danger)]" />
        <h1 className="text-3xl sm:text-4xl font-extrabold">
          Hey! Seems like you are lost?
        </h1>
      </div>

      <p className="text-lg mt-6">
        Sorry visitor, but we believe the page you are currently looking for
        does not exist or has been moved.
      </p>

      <Link
        href="/"
        className="mt-8 px-6 py-3 text-md rounded-2xl hover:bg-[color:var(--primary-hover)] focus:bg-[color:var(--primary-hover)] hover:text-[color:var(--text-light)] transition-colors duration-200 border border-[color:var(--jet)] shadow-lg"
      >
        Go Back Home
      </Link>
    </div>
  );
}
