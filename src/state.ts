import { STARTING_BALANCE } from "./cart.ts";

import type { AppState } from "./types.ts";

// Shared values for the cart, coupons, and balance.
export const state: AppState = {
  cart: [],
  couponApplied: false,
  balance: STARTING_BALANCE,
};
