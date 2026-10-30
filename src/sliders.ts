import type { Review } from "./types.ts";
import { element } from "./ui.ts";

const banners = [
  {
    title: "Backpacks",
    image: import.meta.env.BASE_URL + "images/bag.png",
    alt: "Navy canvas backpack",
  },
  {
    title: "Jackets",
    image: import.meta.env.BASE_URL + "images/jacket.png",
    alt: "Tan cotton jacket",
  },
  {
    title: "Shirts",
    image: import.meta.env.BASE_URL + "images/shirt.png",
    alt: "Two-tone long-sleeve shirt",
  },
];

let bannerIndex = 0;
let reviewIndex = 0;
let reviews: Review[] = [];
let bannerPaused = false;
let reviewsPaused = false;

function showBanner(index: number) {
  if (index >= banners.length) index = 0;
  if (index < 0) index = banners.length - 1;
  bannerIndex = index;

  const banner = banners[bannerIndex];
  element("banner-title").textContent = banner.title;
  element<HTMLImageElement>("banner-image").src = banner.image;
  element<HTMLImageElement>("banner-image").alt = banner.alt;
  element("banner-position").textContent =
    `${bannerIndex + 1} / ${banners.length}`;
}

// pause button
function updatePauseButton(id: string, paused: boolean) {
  const button = element(id);
  const action = paused ? "Play" : "Pause";
  button.textContent = action;
  const label = id === "banner-pause" ? "promotions" : "reviews";
  button.setAttribute("aria-label", action + " " + label);
}
// reviews
function showReview(index: number) {
  if (reviews.length === 0) return;
  if (index >= reviews.length) index = 0;
  if (index < 0) index = reviews.length - 1;
  reviewIndex = index;

  const review = reviews[reviewIndex];
  const card = element<HTMLTemplateElement>("review-template").content.cloneNode(true) as DocumentFragment;
  const rating = card.querySelector<HTMLElement>("[data-review-rating]")!;
  const date = card.querySelector<HTMLTimeElement>("[data-review-date]")!;

  rating.textContent = `${review.rating} / 5`;
  card.querySelector<HTMLElement>("[data-review-comment]")!.textContent =
    `“${review.comment}”`;
  card.querySelector<HTMLElement>("[data-review-name]")!.textContent = review.name;
  date.dateTime = review.date;
  date.textContent = new Date(review.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

  element("review-carousel").replaceChildren(card);
  element("review-position").textContent =
    `${reviewIndex + 1} / ${reviews.length}`;
}

function isReview(value: unknown): value is Review {
  if (!value || typeof value !== "object") return false;
  const review = value as Review;
  if (typeof review.name !== "string") return false;
  if (typeof review.comment !== "string") return false;
  if (typeof review.date !== "string") return false;
  if (!Number.isInteger(review.rating)) return false;
  if (review.rating < 1 || review.rating > 5) return false;
  return Number.isFinite(Date.parse(review.date));
}

async function loadReviews() {
  try {
    const response = await fetch(import.meta.env.BASE_URL + "reviews.json", {
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error("Review request failed");

    const data: unknown = await response.json();
    if (!Array.isArray(data) || data.length === 0)
      throw new Error("No reviews");
    const loadedReviews: Review[] = [];
    for (const review of data) {
      if (!isReview(review)) throw new Error("Invalid review");
      loadedReviews.push(review);
    }

    reviews = loadedReviews;
    showReview(0);
    setInterval(autoNextReview, 8000);
  } catch {
    element("review-carousel").textContent =
      "Reviews couldn’t load. Refresh the page to try again.";
    element<HTMLButtonElement>("review-prev").disabled = true;
    element<HTMLButtonElement>("review-next").disabled = true;
    element<HTMLButtonElement>("review-pause").disabled = true;
  }
}

// Check if we can autoplay
function canAutoPlay(section: HTMLElement, paused: boolean) {
  if (paused || document.hidden) return false;
  if (section.matches(":hover")) return false;
  if (section.contains(document.activeElement)) return false;
  return true;
}

function autoNextBanner() {
  if (canAutoPlay(element("banner"), bannerPaused)) showBanner(bannerIndex + 1);
}

function autoNextReview() {
  if (canAutoPlay(element("reviews"), reviewsPaused))
    showReview(reviewIndex + 1);
}

export function startSliders() {
  element("banner-next").addEventListener("click", () =>
    showBanner(bannerIndex + 1),
  );
  element("banner-prev").addEventListener("click", () =>
    showBanner(bannerIndex - 1),
  );
  element("banner-pause").addEventListener("click", () => {
    bannerPaused = !bannerPaused;
    updatePauseButton("banner-pause", bannerPaused);
  });
  element("review-next").addEventListener("click", () =>
    showReview(reviewIndex + 1),
  );
  element("review-prev").addEventListener("click", () =>
    showReview(reviewIndex - 1),
  );
  element("review-pause").addEventListener("click", () => {
    reviewsPaused = !reviewsPaused;
    updatePauseButton("review-pause", reviewsPaused);
  });

  showBanner(0);
  updatePauseButton("banner-pause", bannerPaused);
  updatePauseButton("review-pause", reviewsPaused);
  setInterval(autoNextBanner, 6500);
  loadReviews();
}
