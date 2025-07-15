/**
 * components/modules/themeSanitizer.ts
 * ------------------------------------
 *
 * Sanitizes the theme of the app. This is used to ensure that the theme is consistent across the app.
 *
 * @license MIT - see LICENSE for more details
 * @copyright © 2025–present AARUSH MASTER and Zendo - see package.json for more details
 */

"use client";

import { useNormalizeTheme } from "@/hooks/useThemeNormalize";

export default function ThemeSanitizer() {
  useNormalizeTheme();
  return null;
}
