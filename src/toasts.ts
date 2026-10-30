import { element } from "./ui.ts";

let toastTimer: ReturnType<typeof setTimeout> | undefined;

function hideToast() {
  clearTimeout(toastTimer);
  element("notification").hidden = true;
}

function startTimer() {
  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, 5000);
}

export function showToast(message: string) {
  const toast = element("notification");
  element("toast-message").textContent = message;
  toast.hidden = false;
  clearTimeout(toastTimer);

  // Give someone time to read or dismiss a toast they are interacting with.
  if (!toast.matches(":hover") && !toast.contains(document.activeElement)) {
    startTimer();
  }
}

export function startToasts() {
  const toast = element("notification");
  element("dismiss-toast").addEventListener("click", hideToast);
  toast.addEventListener("mouseenter", () => clearTimeout(toastTimer));
  toast.addEventListener("mouseleave", () => {
    if (!toast.contains(document.activeElement)) startTimer();
  });
  toast.addEventListener("focusin", () => clearTimeout(toastTimer));
  toast.addEventListener("focusout", (event) => {
    if (!toast.contains(event.relatedTarget as Node | null) && !toast.matches(":hover")) {
      startTimer();
    }
  });
}
