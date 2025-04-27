"use client";

import { toast } from "sonner";
import { X, Info } from "lucide-react";
import React from "react";

// Define the specific type for the toastStyles
interface ToastStyle {
  border: string;
  backgroundColor: string;
  color: string;
  hoverAndFocusBg: string;
  textColor: string;
  icon?: React.JSX.Element; // icon is optional
  toastFunction: typeof toast.success | typeof toast.error | typeof toast.warning | typeof toast;
}

export default function sendToast(type: string, message: string): void {
  const toastTypes = ["error", "success", "neutral", "warning"];
  if (!toastTypes.includes(type)) {
    console.error(
      `Failed to send toast. Toast type: ${type} doesn't exist. Please choose either of ${toastTypes.join(
        ", "
      )}`
    );
    return;
  }

  // Remove @ts-expect-error and use correct type inference
  const toastStyles: Record<string, ToastStyle> = {
    error: {
      border: "1px solid var(--danger)", 
      backgroundColor: "var(--danger-bg)", 
      color: "var(--danger)", 
      hoverAndFocusBg:
        "hover:bg-red-300 dark:hover:bg-red-700 focus:bg-red-300 dark:focus:bg-red-700", 
      textColor: "text-red-800 dark:text-red-950", 
      toastFunction: toast.error,
    },
    success: {
      border: "1px solid var(--success)", 
      backgroundColor: "var(--success-bg)", 
      color: "var(--success)", 
      hoverAndFocusBg:
        "hover:bg-green-300 dark:hover:bg-green-700 focus:bg-green-300 dark:focus:bg-green-700", 
      textColor: "text-green-800 dark:text-green-950", 
      toastFunction: toast.success,
    },
    warning: {
      border: "1px solid var(--warning)", 
      backgroundColor: "var(--warning-bg)", 
      color: "var(--warning)", 
      hoverAndFocusBg:
        "hover:bg-orange-300 dark:hover:bg-orange-700 focus:bg-orange-300 dark:focus:bg-orange-700", 
      textColor: "text-orange-800 dark:text-orange-950", 
      toastFunction: toast.warning,
    },
    neutral: {
      border: "1px solid var(--slate-400)", 
      backgroundColor: "var(--slate-100)", 
      color: "var(--slate-700)", 
      hoverAndFocusBg:
        "hover:bg-slate-300 dark:hover:bg-slate-700 focus:bg-slate-300 dark:focus:bg-slate-700", 
      textColor: "text-slate-700 dark:text-slate-900", 
      icon: <Info className="h-5 w-5 text-slate-900 dark:text-slate-900" />, 
      toastFunction: toast,
    },
  };

  const {
    border,
    backgroundColor,
    color,
    hoverAndFocusBg,
    textColor,
    icon,
    toastFunction,
  } = toastStyles[type];

  const toastId = toastFunction(
    <div className="flex items-center gap-2">
      {icon ? icon : null}
      <span>{message}</span>
    </div>,
    {
      style: { border, backgroundColor, color },
      description: (
        <button
          onClick={() => toast.dismiss(toastId)}
          className={`absolute top-1 right-1 rounded-md p-1 transition-colors ${hoverAndFocusBg}`}
        >

          <X className={`h-4 w-4 ${textColor}`} />
        </button>
      ),
    }
  );
}
