import { element } from "./ui.ts";
import { showToast } from "./toasts.ts";
import { emailError, showFieldError } from "./validation.ts";
import type { FormField } from "./validation.ts";

function validateContactField(field: FormField) {
  const value = field.value.trim();
  let message = "";

  if (field.id === "contact-name") {
    if (value.length < 2 || value.length > 80) {
      message = "Enter a name between 2 and 80 characters.";
    }
  } else if (field.id === "contact-email") {
    message = emailError(field as HTMLInputElement);
  } else if (value.length < 10 || value.length > 1000) {
    message = "Enter a message between 10 and 1,000 characters.";
  }

  showFieldError(field, message);
  return message === "";
}

export function startContactForm() {
  const form = element<HTMLFormElement>("contact-form");
  const name = element<HTMLInputElement>("contact-name");
  const email = element<HTMLInputElement>("contact-email");
  const message = element<HTMLTextAreaElement>("contact-message");
  const fields = [name, email, message];
  const success = element("contact-success");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    success.hidden = true;
    let firstInvalid: FormField | undefined;

    for (const field of fields) {
      if (!validateContactField(field) && !firstInvalid) firstInvalid = field;
    }

    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    success.textContent = "Thank you, " + name.value.trim() + "! Your demo form was submitted. No message was sent.";
    success.hidden = false;
    showToast("Thank you for trying the contact form. This demo does not send messages.");
    form.reset();
  });

  for (const field of fields) {
    field.addEventListener("input", () => {
      success.hidden = true;
      if (field.getAttribute("aria-invalid") === "true") validateContactField(field);
    });
  }
}
