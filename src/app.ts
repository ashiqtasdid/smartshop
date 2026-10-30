import "./style.css";
import { element } from "./ui.ts";
import { startProducts } from "./products.ts";
import { displayCart, clearCart } from "./cart-ui.ts";
import { applyCoupon, removeCoupon } from "./coupons.ts";
import { addMoney } from "./balance.ts";
import { startNavigation } from "./navigation.ts";
import { startSliders } from "./sliders.ts";
import { startToasts } from "./toasts.ts";
import { startContactForm } from "./contact.ts";
import { startNewsletterForm } from "./newsletter.ts";
import { startOffers } from "./offers.ts";

// Connect the form and buttons.
element("coupon-form").addEventListener("submit", function (event) {
  event.preventDefault();
  applyCoupon();
});
element("clear-cart").addEventListener("click", clearCart);
element("add-money").addEventListener("click", addMoney);
element("remove-coupon").addEventListener("click", removeCoupon);

// Start the page.
element("cart-heading").tabIndex = -1;
element("year").textContent = String(new Date().getFullYear());
displayCart();
startToasts();
startProducts();
startNavigation();
startSliders();
startContactForm();
startNewsletterForm();
startOffers();
