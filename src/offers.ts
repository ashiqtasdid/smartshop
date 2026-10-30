import { applyCoupon } from "./coupons.ts";
import { element } from "./ui.ts";

export function startOffers() {
  element("use-offer").addEventListener("click", () => {
    element<HTMLInputElement>("coupon").value = "MEOW";
    applyCoupon();
  });
}
