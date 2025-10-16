// lib/sanitize.ts
import sanitizeHtml from "sanitize-html";

/**
 * Sanitize any user-supplied value (string, object, array)
 */
export function sanitizeInput(input: any): any {
  if (typeof input === "string") {
    return sanitizeHtml(input, { allowedTags: [], allowedAttributes: {} });
  }
  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }
  if (typeof input === "object" && input !== null) {
    const clean: Record<string, any> = {};
    for (const [key, value] of Object.entries(input)) {
      clean[key] = sanitizeInput(value);
    }
    return clean;
  }
  return input;
}
