import { displayCart } from "./cart-ui.ts";
import { state } from "./state.ts";
import { showToast } from "./toasts.ts";

export function addMoney() {
  state.balance += 1000;
  displayCart();
  showToast("Added 1000 BDT to your demo balance.");
}
