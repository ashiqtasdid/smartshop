import { element } from "./ui.ts";

const mainNav = element("main-nav");

function updateActiveLink() {
  let activeSection = "home";
  const headerHeight = document
    .querySelector("header")!
    .getBoundingClientRect().height;
  for (const id of ["home", "products", "about", "reviews", "contact"]) {
    if (element(id).getBoundingClientRect().top <= headerHeight + 130)
      activeSection = id;
  }
  if (
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight - 4
  )
    activeSection = "contact";
  for (const link of mainNav.querySelectorAll("a")) {
    const selected = link.hash === "#" + activeSection;
    link.classList.toggle("font-bold", selected);
    if (selected) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  }
}

export function startNavigation() {
  window.addEventListener("scroll", updateActiveLink, { passive: true });
  window.addEventListener("resize", updateActiveLink);
  element("back-to-top").addEventListener("click", function () {
    window.scrollTo(0, 0);
  });
  updateActiveLink();
}
