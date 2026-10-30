import { showToast } from "./toasts.ts";
import { canAfford } from "./cart.ts";
import { displayCart } from "./cart-ui.ts";
import { state } from "./state.ts";
import { element } from "./ui.ts";

const couponInput = element<HTMLInputElement>("coupon");

export function applyCoupon() {
  const code = couponInput.value.trim().toUpperCase();
  const message = element("coupon-message");
  if (code !== "MEOW") {
    message.textContent = "Code not recognised. Try MEOW.";
    if (state.couponApplied)
      message.textContent = "Code not recognised. MEOW is still applied.";
    return;
  }
  state.couponApplied = true;
  couponInput.value = "MEOW";
  message.textContent = "MEOW applied. 10% off products.";
  displayCart();
  showToast("MEOW applied. 10% off products.");
}

export function removeCoupon() {
  if (!canAfford(state.cart, false, state.balance)) {
    showToast(
      "Removing this coupon would put the cart over your balance. Remove an item or add money first.",
    );
    return;
  }
  state.couponApplied = false;
  couponInput.value = "";
  element("coupon-message").textContent = "Try MEOW for 10% off.";
  displayCart();
  couponInput.focus();
  showToast("Coupon removed.");
}
