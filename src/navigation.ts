import { element } from "./ui.ts";

const links = element("main-nav").querySelectorAll("a");
const sections = ["home", "products", "about", "reviews", "contact"];

function updateActiveLink() {
  let activeSection = "home";
  const header = document.querySelector("header")!;
  const sectionLimit = header.offsetHeight + 130;

  for (const id of sections) {
    const sectionTop = element(id).getBoundingClientRect().top;
    if (sectionTop <= sectionLimit) {
      activeSection = id;
    }
  }

  const visibleBottom = window.scrollY + window.innerHeight;
  const pageBottom = document.documentElement.scrollHeight;
  if (visibleBottom >= pageBottom - 4) {
    activeSection = "contact";
  }
}

export function startNavigation() {
  window.addEventListener("scroll", updateActiveLink);
  window.addEventListener("resize", updateActiveLink);
  element("back-to-top").addEventListener("click", function () {
    window.scrollTo(0, 0);
  });
  updateActiveLink();
}
