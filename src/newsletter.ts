import { element } from "./ui.ts";
import { showToast } from "./toasts.ts";
import { emailError, showFieldError } from "./validation.ts";

export function startNewsletterForm() {
  const form = element<HTMLFormElement>("newsletter-form");
  const email = element<HTMLInputElement>("newsletter-email");
  const success = element("newsletter-success");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    success.hidden = true;
    const message = emailError(email);
    showFieldError(email, message);

    if (message !== "") {
      email.focus();
      return;
    }

    success.textContent = "Thank you! Your email passed validation. This demo does not save subscriptions.";
    success.hidden = false;
    showToast("Thanks for trying the newsletter signup. No subscription was saved.");
    form.reset();
  });

  email.addEventListener("input", () => {
    success.hidden = true;
    if (email.getAttribute("aria-invalid") === "true") {
      showFieldError(email, emailError(email));
    }
  });
}
