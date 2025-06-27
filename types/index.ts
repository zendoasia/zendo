import { toast } from "sonner";
import {
  DurableObjectNamespace,
  DurableObjectStorage,
  Request as CloudflareRequest,
} from "@cloudflare/workers-types";
import type { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";

/**
 * Props for a wrapper component around an article.
 */
export interface ArticleWrapperProps {
  children: React.ReactNode;
  className?: string;
  style?: any;
}

/**
 * Represents the event fired before a web application is installed.
 *
 * This event allows developers to prompt the user to install the app
 * and to respond to the user's choice.
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent}
 *
 * @extends Event
 *
 * @property prompt - Prompts the user to install the web application. Returns a promise that resolves when the prompt is shown.
 * @property userChoice - A promise that resolves to an object indicating whether the user accepted or dismissed the installation prompt.
 */
export interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * Props for the KoFiButton component.
 *
 * @property username - The kofi username to link to.
 * @property className - Optional additional CSS class names for styling the button.
 */
export interface KoFiButtonProps {
  username: string;
  className?: string;
}

/**
 * Represents an action that can be performed from a toast notification.
 *
 * @property label - The text label for the action button.
 * @property onClick - The callback function to execute when the action is triggered.
 */
export interface ToastAction {
  label: string;
  onClick: () => void;
}

/**
 * Props for configuring a toaster notification component.
 *
 * @property type - The type of the toast notification. Can be "error", "success", "neutral", or "warning".
 * @property message - The message to display in the toast notification.
 * @property action - (Optional) An action associated with the toast, such as a button or callback.
 */
export interface ToasterProps {
  type: "error" | "success" | "neutral" | "warning";
  message: string;
  action?: ToastAction;
}

/**
 * Represents the style and behavior configuration for a toast notification.
 *
 * @property container - CSS class name(s) for the toast container.
 * @property hoverAndFocus - CSS class name(s) applied on hover and focus states.
 * @property iconColor - CSS class or color value for the toast icon.
 * @property icon - Optional React node to render as the toast icon.
 * @property toastFunction - Function to display a toast with given content and options.
 *   @param content - The content to display inside the toast.
 *   @param options - Optional settings for the toast appearance and behavior.
 *     @property unstyled - If true, disables default styling.
 *     @property className - Additional CSS class name(s) for the toast.
 *     @property duration - Duration in milliseconds for which the toast is visible.
 *   @returns A string or number identifier for the toast instance.
 */
/**
 * A function that displays a toast notification.
 *
 * @param content - The content to display inside the toast, as a React node.
 * @param options - Optional configuration for the toast.
 * @param options.unstyled - If true, disables default styling for the toast.
 * @param options.className - Additional CSS class names to apply to the toast.
 * @param options.duration - Duration in milliseconds for which the toast is visible.
 * @returns A string or number identifier for the toast instance.
 */
export interface ToastStyle {
  container: string;
  hoverAndFocus: string;
  iconColor: string;
  icon?: React.ReactNode;
  toastFunction: (
    content: React.ReactNode,
    options?: { unstyled?: boolean; className?: string; duration?: number }
  ) => string | number;
}

/**
 * Props for the dynamic toast content component.
 *
 * @property message - The message to display in the toast.
 * @property icon - Optional icon to display alongside the message.
 * @property type - The type of toast (e.g., 'success', 'error', etc.).
 * @property onDismiss - Callback function invoked when the toast is dismissed.
 * @property iconColor - The color to apply to the icon.
 * @property hoverAndFocus - CSS class or style for hover and focus states.
 * @property action - Optional action button or element for the toast.
 */
export interface DynamicToastContentProps {
  message: string;
  icon?: React.ReactNode;
  type: string;
  onDismiss: () => void;
  iconColor: string;
  hoverAndFocus: string;
  action?: ToastAction;
}

/**
 * Props for the iOS Install Dialog component.
 *
 * @property open - Indicates whether the dialog is currently open.
 * @property onOpenChangeAction - Callback function invoked when the open state changes.
 *   Receives the new open state as a boolean argument.
 */
export interface IOSInstallDialogProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
}

/**
 * Represents the environment variables required for EdgeRequest.
 *
 * @property JWT_SHARED_SECRET - The shared secret used for JWT authentication. May be undefined if not set.
 * @property WORKER_URL - The URL of the worker service. May be undefined if not set.
 */
export interface EdgeRequestEnv {
  JWT_SHARED_SECRET: string | undefined;
  WORKER_URL: string | undefined;
}

/**
 * Props for the SparklesHero component.
 */
export type SparklesHeroProps = {
  /** The text to display with sparkles effect */
  words: string;
  /** Optional id for the element */
  id?: string;
  /** Optional class name for the container */
  className?: string;
  /** Optional color for the particles */
  particleColor?: string;
  /** Optional class name for the text */
  textClassName?: string;
};

/**
 * Environment variables for the rate limiter.
 */
export interface RateLimiterEnv {
  RATE_LIMITER: DurableObjectNamespace;
  TURNSTILE_SECRET_KEY: string;
  NEXT_ORIGIN: string;
}

/**
 * Represents a group of footer links.
 */
export interface FooterLinkItem {
  /** Name of the link group */
  name: string;
  /** Path for the link group */
  path: string;
  /** Array of link items */
  items: {
    title: string;
    path: string;
  }[];
}

/**
 * Represents a footer link.
 */
export interface FooterLink {
  /** Title and items for the footer link */
  title: FooterLinkItem;
}

/**
 * Response from Turnstile verification.
 */
export interface TurnstileResponse {
  success: boolean;
  challenge_ts: string;
  hostname: string;
  "error-codes"?: string[];
}

/**
 * State object for the RateLimiter Durable Object.
 */
export interface RateLimiterState {
  storage: DurableObjectStorage;
  blockConcurrencyWhile: (cb: () => Promise<void>) => void;
}

/**
 * Props for the mobile menu component.
 */
export interface MobileMenuProps {
  setOpenAction: Dispatch<SetStateAction<boolean>>;
  setOpenSAction: Dispatch<SetStateAction<boolean>>;
  strippedOS: string | null;
  open?: boolean;
  onCloseComplete?: () => void;
}

/**
 * Represents a navigation item.
 */
export type NavItem = {
  /** Label for the navigation item */
  label: string;
  /** Icon component for the navigation item */
  icon: React.ElementType;
  /** Path for the navigation item */
  path: string;
};

/**
 * Represents groups of navigation items.
 */
export type NavGroups = {
  [key: string]: NavItem[];
};

/**
 * Props for the search component.
 */
export interface SearchProps {
  setOpenAction: Dispatch<SetStateAction<boolean>>;
  setOpenSAction: Dispatch<SetStateAction<boolean>>;
  open?: boolean;
  openS?: boolean;
  onCloseComplete?: () => void;
}

/**
 * Props for the ContainerTextFlip component.
 *
 * @property words - Array of words to cycle through in the animation.
 * @property interval - Time in milliseconds between word transitions.
 * @property className - Additional CSS classes to apply to the container.
 * @property textClassName - Additional CSS classes to apply to the text.
 * @property animationDuration - Duration of the transition animation in milliseconds.
 */
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

/**
 * Props for the GlowingEffect component.
 */
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

/**
 * User agent data for the navigator.
 */
export interface NavigatorUAData {
  platform: string;
}

/**
 * Props for checking rate limits.
 */
export interface RateLimitCheckProps {
  request: CloudflareRequest;
  env: RateLimiterEnv;
}

/**
 * Represents the categories of cookie consent and their enabled/disabled state.
 *
 * @property preferences - Indicates whether preference cookies are allowed.
 * @property analytics - Indicates whether analytics cookies are allowed.
 */
export type CookieConsentCategories = {
  preferences: boolean;
  analytics: boolean;
};

/**
 * Props for a fallback error page component.
 *
 * @property error - An optional error message to display. Can be a string or null.
 */
export interface FallbackErrorPageProps {
  error?: string | null;
}

/**
 * Props for a toaster notification.
 */
export interface ToasterProps {
  type: "neutral" | "success" | "error" | "warning";
  message: string;
}

/**
 * Allowed tag types for animated sections.
 */
export type TagType = "div" | "section" | "article" | "main";

/**
 * Mapping of tag types to framer-motion components.
 */
export const motionTags = {
  div: motion.div,
  section: motion.section,
  article: motion.article,
  main: motion.main,
};

/**
 * Props for the AnimatedSection component.
 */
export interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  as?: TagType;
}
