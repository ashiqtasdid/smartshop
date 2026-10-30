// T is the kind of HTML element expected.
export function element<T extends HTMLElement = HTMLElement>(id: string): T {
  const found = document.getElementById(id);
  if (!found) throw new Error("Missing element: " + id);
  return found as T;
}

export const money = new Intl.NumberFormat("en-BD", {
  style: "currency",
  currency: "BDT",
  currencyDisplay: "narrowSymbol",
});

export function setProductImage(image: HTMLImageElement, address: string) {
  image.addEventListener(
    "error",
    function () {
      image.src = import.meta.env.BASE_URL + "images/unavailable.svg";
    },
    { once: true },
  );
  try {
    const url = new URL(address);
    if (url.protocol === "https:") {
      image.src = url.href;
      return;
    }
  } catch {
    console.error("Invalid image address:", address);
  }
  image.src = import.meta.env.BASE_URL + "images/unavailable.svg";
}
