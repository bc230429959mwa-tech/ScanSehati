declare module "sanitize-html" {
  export default function sanitizeHtml(
    dirty: string,
    options?: {
      allowedTags?: string[];
      allowedAttributes?: Record<string, string[]>;
    }
  ): string;
}
