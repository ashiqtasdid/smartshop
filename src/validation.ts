import { element } from "./ui.ts";

export type FormField = HTMLInputElement | HTMLTextAreaElement;

export function showFieldError(field: FormField, message: string) {
  const error = element(field.id + "-error");
  error.textContent = message;
  error.hidden = message === "";
}

export function emailError(field: HTMLInputElement) {
  field.value = field.value.trim();
  if (field.value === "") return "Enter your email address.";
  if (!field.validity.valid) return "Enter a valid email address, such as you@example.com.";
  return "";
}
