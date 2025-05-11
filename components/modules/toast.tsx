"use client";

import { toast } from "sonner";
import { X } from "lucide-react";
import { FaCircleInfo } from "react-icons/fa6";
import React from "react";
import { ToastStyle } from "@/types";

export default function sendToast(type: string, message: string): void {
  const toastTypes = ["error", "success", "neutral", "warning"];
  if (!toastTypes.includes(type)) {
    console.error(
      `Failed to send toast. Toast type: "${type}" doesn't exist. Valid types: ${toastTypes.join(
        ", "
      )}`
    );
    return;
  }

  const toastStyles: Record<string, ToastStyle> = {
    error: {
      container:
        "relative inline-flex items-center gap-2 px-4 py-2.5 pr-10 rounded-[var(--radius)] border border-rose-500 bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-100 whitespace-nowrap",
      hoverAndFocus:
        "hover:bg-rose-200 dark:hover:bg-rose-800 focus:bg-rose-200 dark:focus:bg-rose-800",
      iconColor: "text-rose-600 dark:text-rose-300",
      toastFunction: toast.error,
    },
    success: {
      container:
        "relative inline-flex items-center gap-2 px-4 py-2.5 pr-10 rounded-[var(--radius)] border border-green-500 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 whitespace-nowrap",
      hoverAndFocus:
        "hover:bg-green-200 dark:hover:bg-green-800 focus:bg-green-200 dark:focus:bg-green-800",
      iconColor: "text-green-600 dark:text-green-300",
      toastFunction: toast.success,
    },
    warning: {
      container:
        "relative inline-flex items-center gap-2 px-4 py-2.5 pr-10 rounded-[var(--radius)] border border-orange-500 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100 whitespace-nowrap",
      hoverAndFocus:
        "hover:bg-orange-200 dark:hover:bg-orange-800 focus:bg-orange-200 dark:focus:bg-orange-800",
      iconColor: "text-orange-600 dark:text-orange-300",
      toastFunction: toast.warning,
    },
    neutral: {
      container:
        "relative inline-flex items-center gap-2 px-4 py-2.5 pr-10 rounded-[var(--radius)] border border-slate-400 bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-100 whitespace-nowrap",
      hoverAndFocus:
        "hover:bg-slate-200 dark:hover:bg-slate-800 focus:bg-slate-200 dark:focus:bg-slate-800",
      iconColor: "text-slate-600 dark:text-slate-300",
      icon: (
        <FaCircleInfo
          size="1.2rem"
          className="text-slate-600 dark:text-slate-400"
        />
      ),
      toastFunction: toast,
    },
  };

  const { container, hoverAndFocus, iconColor, icon, toastFunction } =
    toastStyles[type];

  const toastId = toastFunction(
    <div className="font-[family-name:var(--font-text)] flex items-center gap-2 w-full">
      {icon ?? null}
      <span className="text-md font-[weight:var(--default-font-weight)]">
        {message}
      </span>
    </div>,
    {
      unstyled: true,
      className: container,
      description: (
        <button
          onClick={() => toast.dismiss(toastId)}
          className={`absolute top-2 right-2 rounded-[var(--radius)] p-1 transition-colors duration-300 ${hoverAndFocus}`}
        >
          <X size="1.2rem" className={`${iconColor}`} />
        </button>
      ),
    }
  );
}
