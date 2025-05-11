import { toast } from "sonner";
import { DurableObjectNamespace, DurableObjectStorage, Request as CloudflareRequest } from '@cloudflare/workers-types';

export interface RateLimiterEnv {
  RATE_LIMITER: DurableObjectNamespace;
  TURNSTILE_SECRET_KEY: string;
  NEXT_ORIGIN: string;
}

export interface RateLimiterState {
  storage: DurableObjectStorage;
  blockConcurrencyWhile: (cb: () => Promise<void>) => void;
}

export interface MobileMenuProps {
  setOpenAction: (v: boolean) => void;
  setOpenSAction: (v: boolean) => void;
  strippedOS: string | null;
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
  setOpenSAction: (v: boolean) => void;
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
  request: CloudflareRequest; // Use the correct type from @cloudflare/workers-types
  env: RateLimiterEnv;
}