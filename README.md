# SmartShop

A basic CSE-3532 class project using HTML, Tailwind CSS, TypeScript, and Vite.

## Run

Use Node.js 24 or newer:

```sh
npm install
npm run dev
```

Open the address printed in the terminal. Products need an internet connection.

There is no backend server, database, login, or payment service. Vite runs the project locally and builds static files. Products come directly from the public API.

## Files

- `index.html`: page layout and templates for products, cart items, and reviews.
- `src/app.ts`: entry point; connects controls and starts the page.
- `src/products.ts`: product loading, cards, search, and category filter buttons.
- `src/cart-ui.ts`: displays the cart and handles quantity changes.
- `src/coupons.ts`: applies and removes coupons.
- `src/balance.ts`: adds demo money to the balance.
- `src/navigation.ts`: active navigation links and Back to Top.
- `src/types.ts`: simple interfaces for products, cart items, reviews, and app state.
- `src/state.ts`: shared cart, coupon, and balance values.
- `src/ui.ts`: shared element, currency, and image helpers.
- `src/toasts.ts`: dismissible notifications with a timer that pauses on hover or focus.
- `src/contact.ts`: contact form validation and dynamic thank-you message.
- `src/newsletter.ts`: newsletter email validation and demo confirmation.
- `src/validation.ts`: shared field errors and email validation.
- `src/offers.ts`: applies the MEOW offer to the cart.
- `src/cart.ts`: price conversion, quantities, and total calculations.
- `src/sliders.ts`: automatic and manual banner/review slides.
- `src/style.css`: Tailwind import, theme colors, and shared HTML defaults. Layouts and components use Tailwind utility classes in the HTML and templates.
- `public/reviews.json`: fictional sample reviews.

## How it works

1. `loadProducts()` fetches products from Fake Store API.
2. `displayProducts()` copies the HTML template for each matching product.
3. Clicking Add prepares an updated cart.
4. `calculateTotals()` calculates its full cost.
5. `canAfford()` checks that cost against the balance before accepting the cart.
6. `displayCart()` updates the page without a reload.

In `changeQuantity()`, a loop builds a new cart, updates the matching product, and keeps only positive quantities. The original cart stays unchanged if an update is too expensive.

Bonus features include a validated contact form, About Us and creator information, a newsletter form, an accessible FAQ accordion, a special offer, product category filters, and toasts. The FAQ uses native `<details name="faq">` elements, so it needs no extra script.

Category filters come from API data and work together with product-name search. Products without a category appear under Other. Clearing the filters restores all products.

Contact validation requires a name of 2-80 characters, a valid email address, and a message of 10-1,000 characters. Errors appear beside the fields, and submission focuses the first invalid field. Valid submission displays a thank-you message using `textContent`.

The contact and newsletter forms are frontend demonstrations. They do not send messages, save email addresses, or create subscriptions. Success messages say this explicitly. No personal data is written to browser storage.

SmartShop was created entirely by Md. Ashiquzzaman Khan, student ID C243005. Role: Full Stack Developer.

The Special Offer button applies the MEOW coupon. Reusing the button does not stack discounts. Toasts close after five seconds, can be dismissed, pause while hovered or focused, and replace old messages instead of stacking.

The Sort products dropdown supports default API order, Price: Low to High, and Price: High to Low. It works with search and category filters. Checkout remains outside this project.

## Demo rules

- Starting balance: ৳5,000. Add Money adds ৳1,000.
- Balance, cart, and coupon reset on refresh. Nothing is saved in browser storage.
- API prices use a fixed sample conversion: US$1 = ৳121.
- Non-empty carts have a ৳60 delivery charge and ৳40 shipping cost.
- `MEOW` discounts the product subtotal by 10%, once.
- Empty carts have no fees. The final total cannot exceed the balance.
- Adding to the cart does not deduct money. There are no real orders or payments.

Example: ৳961.95 subtotal − ৳96.20 discount + ৳60 delivery + ৳40 shipping = **৳965.75**.

The contact email is a placeholder. Replace it with your contact details before submission.

## Check

```sh
npm run typecheck     # Check TypeScript types
npm run build         # Check types and build into dist/
npm run preview       # Preview the build
npm test              # Calculation tests
npm run test:browser  # Browser checks using installed Microsoft Edge
```

## GitHub Pages deployment

The workflow in `.github/workflows/deploy.yml` installs dependencies, checks
TypeScript, builds the app, and publishes `dist/` when a push reaches `main`.
Enable GitHub Pages with GitHub Actions as its source.

Vite uses relative asset paths so images, reviews, and the favicon work under
a repository path such as `/smartshop/` as well as during local development.

This checkout currently has no `tests/` directory. The test commands require
those test files; the deployment workflow runs type checking and the build.
