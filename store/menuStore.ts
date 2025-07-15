/**
 * store/menuStore.ts
 * -------------------
 *
 * Implements the menu store for the app
 *
 * @license MIT - see LICENSE for more details
 * @copyright © 2025–present AARUSH MASTER and Zendo - see package.json for more details
 */

import { create } from "zustand";

interface MenuStoreState {
  open: boolean;
  openS: boolean;
  strippedOS: string;
  setOpen: (open: boolean) => void;
  setOpenS: (openS: boolean) => void;
  setStrippedOS: (os: string) => void;
}

export const useMenuStore = create<MenuStoreState>((set) => ({
  open: false,
  openS: false,
  strippedOS: "",
  setOpen: (open) => set({ open }),
  setOpenS: (openS) => set({ openS }),
  setStrippedOS: (os) => set({ strippedOS: os }),
}));
