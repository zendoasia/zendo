import { toast } from "sonner";
import {
  DurableObjectNamespace,
  DurableObjectStorage,
  Request as CloudflareRequest,
} from "@cloudflare/workers-types";
import type { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";

export interface ArticleWrapperProps {
  children: React.ReactNode;
  className?: string;
  style?: any;
}

export interface RateLimiterEnv {
  RATE_LIMITER: DurableObjectNamespace;
  TURNSTILE_SECRET_KEY: string;
  NEXT_ORIGIN: string;
}

export interface FooterLinkItem {
  name: string;
  path: string;
  items: {
    title: string;
    path: string;
  }[];
}

export interface FooterLink {
  title: FooterLinkItem;
}

export interface TurnstileResponse {
  success: boolean;
  challenge_ts: string;
  hostname: string;
  "error-codes"?: string[];
}

export interface RateLimiterState {
  storage: DurableObjectStorage;
  blockConcurrencyWhile: (cb: () => Promise<void>) => void;
}

export interface MobileMenuProps {
  setOpenAction: Dispatch<SetStateAction<boolean>>;
  setOpenSAction: Dispatch<SetStateAction<boolean>>;
  strippedOS: string | null;
  open?: boolean;
  onCloseComplete?: () => void;
}

export type NavItem = {
  label: string;
  icon: React.ElementType;
  path: string;
};

export type NavGroups = {
  [key: string]: NavItem[];
};

export interface SearchProps {
  setOpenAction: Dispatch<SetStateAction<boolean>>;
  setOpenSAction: Dispatch<SetStateAction<boolean>>;
  open?: boolean;
  openS?: boolean;
  onCloseComplete?: () => void;
}

export interface ToastStyle {
  container: string;
  hoverAndFocus: string;
  iconColor: string;
  icon?: React.JSX.Element;
  toastFunction:
    | typeof toast.success
    | typeof toast.error
    | typeof toast.warning
    | typeof toast;
}

export interface ContainerTextFlipProps {
  /** Array of words to cycle through in the animation */
  words?: string[];
  /** Time in milliseconds between word transitions */
  interval?: number;
  /** Additional CSS classes to apply to the container */
  className?: string;
  /** Additional CSS classes to apply to the text */
  textClassName?: string;
  /** Duration of the transition animation in milliseconds */
  animationDuration?: number;
}

export interface GlowingEffectProps {
  blur?: number;
  inactiveZone?: number;
  proximity?: number;
  spread?: number;
  variant?: "default" | "white";
  glow?: boolean;
  className?: string;
  disabled?: boolean;
  movementDuration?: number;
  borderWidth?: number;
}

export interface NavigatorUAData {
  platform: string;
}

export interface RateLimitCheckProps {
  request: CloudflareRequest;
  env: RateLimiterEnv;
}

export interface ToasterProps {
  type: "neutral" | "success" | "error" | "warning";
  message: string;
}

export type TagType = "div" | "section" | "article" | "main";

export const motionTags = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  main: motion.main,
};

export interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  as?: TagType;
}
