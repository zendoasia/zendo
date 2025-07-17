/**
 * components/modules/ConstructStatusBadge.tsx
 * -------------------------------------------
 *
 * Server-safe badge that displays the construct status.
 *
 * @license MIT
 * @copyright © 2025–present AARUSH MASTER and Zendo
 */

import { LoaderCircle } from "lucide-react";
import { TbCircleCheckFilled } from "react-icons/tb";
import { MdBuildCircle } from "react-icons/md";
import { IoMdAlert } from "react-icons/io";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

type Props = {
  uptime: string | null;
};

const getStatusColor = (uptime: string | null) => {
  const normalized = uptime?.trim().toLowerCase();
  switch (normalized) {
    case "all systems operational":
      return "bg-[var(--betterstacks-green)]";
    case "degraded":
      return "bg-[var(--betterstacks-yellow)]";
    case "outage":
      return "bg-[var(--betterstacks-red)]";
    case "scheduled maintenance":
      return "bg-[var(--betterstacks-blue)]";
    default:
      return "bg-muted";
  }
};

const renderIcon = (uptime: string | null) => {
  const keyframes = `
    @keyframes pulse-ring {
      0% { transform: scale(0.8); opacity: 0.6; }
      70% { transform: scale(1.5); opacity: 0; }
      100% { transform: scale(1.5); opacity: 0; }
    }
  `;

  const baseRingStyle: React.CSSProperties = {
    width: "1.5rem",
    height: "1.5rem",
    borderRadius: "9999px",
    position: "absolute",
    opacity: 0.6,
    filter: "blur(1px)",
    animation: "pulse-ring 1.5s ease-out infinite",
    pointerEvents: "none",
    zIndex: 0,
  };

  const iconStyle: React.CSSProperties = {
    willChange: "transform",
    backfaceVisibility: "hidden",
    transform: "translateZ(0)",
  };

  const normalized = uptime?.trim().toLowerCase();
  const statusIconMap: Record<string, React.ReactNode> = {
    "all systems operational": (
      <div className="relative flex items-center justify-center w-6 h-6">
        <style>{keyframes}</style>
        <span style={{ ...baseRingStyle, border: "1px solid #22c55e" }} />
        <TbCircleCheckFilled
          size={20}
          className="relative z-10 text-[var(--betterstacks-green)]"
          style={iconStyle}
        />
      </div>
    ),
    degraded: (
      <div className="relative flex items-center justify-center w-6 h-6">
        <style>{keyframes}</style>
        <span style={{ ...baseRingStyle, border: "1px solid #eab308" }} />
        <IoMdAlert
          size={20}
          className="relative z-10 text-[var(--betterstacks-yellow)]"
          style={iconStyle}
        />
      </div>
    ),
    outage: (
      <div className="relative flex items-center justify-center w-6 h-6">
        <style>{keyframes}</style>
        <span style={{ ...baseRingStyle, border: "1px solid #ef4444" }} />
        <IoMdAlert
          size={20}
          className="relative z-10 text-[var(--betterstacks-red)]"
          style={iconStyle}
        />
      </div>
    ),
    "scheduled maintenance": (
      <div className="relative flex items-center justify-center w-6 h-6">
        <style>{keyframes}</style>
        <span style={{ ...baseRingStyle, border: "1px solid #3b82f6" }} />
        <MdBuildCircle
          size={20}
          className="relative z-10 text-[var(--betterstacks-blue)]"
          style={iconStyle}
        />
      </div>
    ),
  };

  return (
    statusIconMap[normalized || ""] ?? (
      <LoaderCircle className="animate-spin text-muted-foreground" size={20} />
    )
  );
};

export default function ConstructStatusBadge({ uptime }: Props) {
  const safeUptime = uptime?.trim() || "Unknown";

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn(
        "relative overflow-hidden transition-colors duration-300 ease-out",
        "before:absolute before:inset-0 before:bg-white before:opacity-0 before:transition-opacity before:duration-300",
        "hover:before:opacity-5",
        "shadow-md shadow-black/20 dark:shadow-white/20",
        "app-font-inter"
      )}
      asChild
    >
      <Link
        href={process.env.NEXT_PUBLIC_STATUS_PAGE_URL!}
        target="_blank"
        data-no-prompt
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-md text-black dark:text-white transition-colors duration-300",
          getStatusColor(safeUptime)
        )}
      >
        {renderIcon(safeUptime)}
        <span className="text-xs font-medium">
          <span className="font-bold text-black dark:text-white">{safeUptime}</span>
        </span>
      </Link>
    </Button>
  );
}
