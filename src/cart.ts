import type { Product, CartItem } from "./types.ts";

export const BDT_PER_USD = 121;
export const STARTING_BALANCE = 5000;
export const DELIVERY_CHARGE = 60;
export const SHIPPING_COST = 40;


export function roundMoney(amount: number) {
  return Math.round(amount * 100) / 100;
}

export function productPrice(product: Product) {
  return roundMoney(product.price * BDT_PER_USD);
}

export function calculateTotals(items: CartItem[], couponApplied: boolean) {
  let subtotal = 0;

  for (const item of items) {
    subtotal += productPrice(item.product) * item.quantity;
  }

  subtotal = roundMoney(subtotal);

  // empty
  let delivery = 0;
  let shipping = 0;

  if (items.length > 0) {
    delivery = DELIVERY_CHARGE;
    shipping = SHIPPING_COST;
  }

  let discount = 0;

  if (couponApplied) {
    discount = roundMoney(subtotal * 0.1);
  }

  const total = roundMoney(subtotal - discount + delivery + shipping);

  return { subtotal, delivery, shipping, discount, total };
}

export function changeQuantity(items: CartItem[], product: Product, change: number) {
  const updatedCart: CartItem[] = [];
  let productFound = false;

  for (const item of items) {
    let quantity = item.quantity;

    if (!productFound && item.product.id === product.id) {
      quantity = quantity + change;
      productFound = true;
    }

    if (quantity > 0) {
      updatedCart.push({ product: item.product, quantity: quantity });
    }
  }

  // new product
  if (!productFound && change > 0) {
    updatedCart.push({ product: product, quantity: change });
  }

  return updatedCart;
}

export function canAfford(items: CartItem[], couponApplied: boolean, balance: number) {
  const totals = calculateTotals(items, couponApplied);
  return totals.total <= balance;
}
