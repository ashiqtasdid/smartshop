import { showToast } from "./toasts.ts";
import type { Product, CartItem } from "./types.ts";
import {
  calculateTotals,
  canAfford,
  changeQuantity,
  productPrice,
  roundMoney,
} from "./cart.ts";
import { state } from "./state.ts";
import { element, money, setProductImage } from "./ui.ts";

const cartItems = element("cart-items");

export function displayCart() {
  const totals = calculateTotals(state.cart, state.couponApplied);
  let itemCount = 0;
  cartItems.replaceChildren();
  for (const item of state.cart) {
    itemCount += item.quantity;
    cartItems.appendChild(createCartRow(item));
  }
  if (state.cart.length === 0) {
    cartItems.innerHTML =
      '<p class="py-3 text-sm leading-relaxed text-muted [&_strong]:mb-1 [&_strong]:block [&_strong]:font-medium [&_strong]:text-ink"><strong>Your cart is empty.</strong>Find something you like and add it here.</p>';
  }
  element("balance").textContent = money.format(state.balance);
  element("cart-count").textContent = String(itemCount);
  element("clear-cart").hidden = state.cart.length === 0;
  for (const name of ["subtotal", "delivery", "shipping", "total"] as const) {
    element(name).textContent = money.format(totals[name]);
  }
  element("discount").textContent = "−" + money.format(totals.discount);
  element("discount-label").textContent = "";
  if (state.couponApplied) element("discount-label").textContent = "(10%)";
  element("remaining").textContent =
    money.format(roundMoney(state.balance - totals.total)) +
    " left after this order";
  element("remove-coupon").hidden = !state.couponApplied;
}

function createCartRow(item: CartItem) {
  const product = item.product;
  const template = element<HTMLTemplateElement>("cart-item-template");
  const row = template.content.firstElementChild!.cloneNode(
    true,
  ) as HTMLElement;
  setProductImage(
    row.querySelector<HTMLImageElement>("[data-cart-image]")!,
    product.image,
  );
  row.querySelector<HTMLElement>("[data-cart-title]")!.textContent =
    product.title;
  row.querySelector<HTMLElement>("[data-cart-price]")!.textContent =
    money.format(roundMoney(productPrice(product) * item.quantity));
  row.querySelector<HTMLElement>("[data-cart-quantity]")!.textContent = String(
    item.quantity,
  );
  const decrease = row.querySelector<HTMLElement>("[data-cart-decrease]")!;
  const increase = row.querySelector<HTMLElement>("[data-cart-increase]")!;
  const remove = row.querySelector<HTMLElement>("[data-cart-remove]")!;
  decrease.setAttribute("aria-label", "Decrease quantity of " + product.title);
  increase.setAttribute("aria-label", "Increase quantity of " + product.title);
  remove.setAttribute("aria-label", "Remove " + product.title);
  decrease.addEventListener("click", function () {
    changeCartQuantity(product, -1);
  });
  increase.addEventListener("click", function () {
    changeCartQuantity(product, 1);
  });
  remove.addEventListener("click", function () {
    changeCartQuantity(product, -item.quantity);
    // do not scroll to cart heading
    element("cart-heading").focus({ preventScroll: true });
  });
  return row;
}

export function changeCartQuantity(product: Product, change: number) {
  const updatedCart = changeQuantity(state.cart, product, change);
  if (!canAfford(updatedCart, state.couponApplied, state.balance)) {
    const total = calculateTotals(updatedCart, state.couponApplied).total;
    const shortfall = roundMoney(total - state.balance);
    showToast(
      `You need ${money.format(shortfall)} more, including delivery and shipping. Use Add ৳1,000 in your cart.`,
    );
    return;
  }
  state.cart = updatedCart;
  displayCart();
  if (change > 0) showToast("Added to your cart.");
  else showToast("Cart updated.");
}

export function clearCart() {
  state.cart = [];
  displayCart();
  showToast("Cart cleared.");
  element("cart-heading").focus({ preventScroll: true });
}
