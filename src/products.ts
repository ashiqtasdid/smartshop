import type { Product } from "./types.ts";
import { productPrice } from "./cart.ts";
import { changeCartQuantity } from "./cart-ui.ts";
import { element, money, setProductImage } from "./ui.ts";

let products: Product[] = [];
let selectedCategory = "All";
const productGrid = element("product-grid");
const searchInput = element<HTMLInputElement>("search");
const priceSort = element<HTMLSelectElement>("price-sort");
const categoryFilters = element("category-filters");

// API data is unknown until these checks pass.
function isProduct(value: unknown): value is Product {
  if (!value || typeof value !== "object") return false;
  const product = value as Product;
  if (!Number.isInteger(product.id)) return false;
  if (typeof product.title !== "string") return false;
  if (typeof product.image !== "string") return false;
  if (product.category !== undefined && typeof product.category !== "string") return false;
  if (!Number.isFinite(product.price) || product.price < 0) return false;
  if (!product.rating) return false;
  if (
    !Number.isFinite(product.rating.rate) ||
    product.rating.rate < 0 ||
    product.rating.rate > 5
  )
    return false;
  if (!Number.isFinite(product.rating.count) || product.rating.count < 0)
    return false;
  return true;
}

async function loadProducts() {
  productGrid.setAttribute("aria-busy", "true");
  productGrid.innerHTML =
    '<p class="col-span-full bg-surface px-6 py-12 text-center">Loading products...</p>';
  element("product-count").textContent = "Loading products…";
  try {
    const response = await fetch("https://fakestoreapi.com/products", {
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) throw new Error("Product request failed");
    const data: unknown = await response.json();
    if (!Array.isArray(data) || data.length === 0)
      throw new Error("No products received");
    const loadedProducts: Product[] = [];
    for (const product of data) {
      if (!isProduct(product)) throw new Error("Invalid product data");
      loadedProducts.push(product);
    }
    products = loadedProducts;
    displayCategories();
    displayProducts();
  } catch {
    element("product-count").textContent = "Products unavailable";
    productGrid.innerHTML =
      '<div class="col-span-full bg-surface px-6 py-12 text-center"><p>We couldn’t load the products.</p><p class="mt-2 text-muted">Check your connection, then try again.</p><button id="retry-products" type="button" class="mt-5 min-h-11 rounded bg-ink px-5 py-3 text-sm font-medium text-white hover:bg-accent">Try again</button></div>';
    element("retry-products").addEventListener("click", loadProducts);
  } finally {
    productGrid.setAttribute("aria-busy", "false");
  }
}

function displayCategories() {
  const categories = ["All"];
  for (const product of products) {
    const category = product.category || "Other";
    if (!categories.includes(category)) categories.push(category);
  }

  categoryFilters.replaceChildren();
  for (const category of categories) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = category === "jewelery" ? "Jewelry" : category;
    button.dataset.category = category;
    button.className = "min-h-11 rounded bg-surface px-3 py-2 text-sm capitalize hover:bg-hover aria-pressed:bg-ink aria-pressed:text-white";
    button.setAttribute("aria-pressed", String(category === selectedCategory));
    button.addEventListener("click", () => {
      selectedCategory = category;
      updateCategoryButtons();
      displayProducts();
    });
    categoryFilters.appendChild(button);
  }
}

function updateCategoryButtons() {
  for (const button of categoryFilters.querySelectorAll("button")) {
    button.setAttribute("aria-pressed", String(button.dataset.category === selectedCategory));
  }
}

function displayProducts() {
  const search = searchInput.value.trim().toLowerCase();
  // Sort a copy so the original API order is kept for the default option.
  const sortedProducts = products.slice();
  if (priceSort.value === "low-to-high") {
    sortedProducts.sort((first, second) => first.price - second.price);
  } else if (priceSort.value === "high-to-low") {
    sortedProducts.sort((first, second) => second.price - first.price);
  }

  let count = 0;
  productGrid.replaceChildren();
  for (const product of sortedProducts) {
    if (!product.title.toLowerCase().includes(search)) continue;
    if (selectedCategory !== "All" && (product.category || "Other") !== selectedCategory) continue;
    productGrid.appendChild(createProductCard(product));
    count++;
  }
  element("product-count").textContent = count + " products";
  if (count === 0) {
    productGrid.innerHTML =
      '<div class="col-span-full bg-surface px-6 py-12 text-center"><p>No products found.</p><button id="reset-filters" type="button" class="mt-5 min-h-11 rounded bg-ink px-5 py-3 text-sm font-medium text-white hover:bg-accent">Clear search and filters</button></div>';
    element("reset-filters").addEventListener("click", resetFilters);
  }
}

function createProductCard(product: Product) {
  // Copy the HTML template
  const template = element<HTMLTemplateElement>("product-template");
  const card = template.content.firstElementChild!.cloneNode(true) as HTMLElement;
  const image = card.querySelector<HTMLImageElement>("[data-product-image]")!;
  setProductImage(image, product.image);
  image.alt = product.title;
  card.querySelector<HTMLElement>("[data-product-title]")!.textContent = product.title;
  card.querySelector<HTMLElement>("[data-product-title]")!.title = product.title;
  card.querySelector<HTMLElement>("[data-product-rating]")!.textContent =
    product.rating.rate.toFixed(1) + " / 5";
  card
    .querySelector<HTMLElement>("[data-product-rating]")!
    .setAttribute("aria-label", `Rated ${product.rating.rate} out of 5`);
  card.querySelector<HTMLElement>("[data-product-reviews]")!.textContent =
    `(${product.rating.count})`;
  card.querySelector<HTMLElement>("[data-product-price]")!.textContent = money.format(
    productPrice(product),
  );
  const addButton = card.querySelector<HTMLElement>("[data-product-add]")!;
  addButton.setAttribute("aria-label", "Add " + product.title + " to cart");
  addButton.addEventListener("click", function () {
    changeCartQuantity(product, 1);
  });
  return card;
}

function resetFilters() {
  searchInput.value = "";
  priceSort.value = "default";
  selectedCategory = "All";
  updateCategoryButtons();
  displayProducts();
  searchInput.focus();
}

export function startProducts() {
  searchInput.addEventListener("input", displayProducts);
  priceSort.addEventListener("change", displayProducts);
  loadProducts();
}
