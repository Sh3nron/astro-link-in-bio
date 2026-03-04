/**
 * Sanitizes SVG inner content by removing potentially malicious tags and attributes.
 * This is a robust implementation designed to prevent XSS when using set:html with SVG paths,
 * specifically handling common bypasses like non-standard separators and encoded characters.
 */
export function sanitizeSvg(html: string): string {
  if (!html) return "";

  let sanitized = html;

  // 1. Remove script tags and their content
  // Handles <script>, <SCRIPT>, <script/src=...>, etc.
  // Note: we use [\s/>] to handle <script/> or <script >
  sanitized = sanitized.replace(/<script[\s/>][^>]*>([\s\S]*?)<\/script>/gim, "");
  sanitized = sanitized.replace(/<script[\s/>][^>]*\/>/gim, "");
  // Also handle cases without any separator if that's even possible in some parsers,
  // but <script> is the most common.
  sanitized = sanitized.replace(/<script>([\s\S]*?)<\/script>/gim, "");

  // 2. Remove event handlers (on*)
  // Handles cases like onclick=..., onmouseover=..., and also bypasses like <svg/onload=...>
  sanitized = sanitized.replace(/[\s/](on\w+)\s*=\s*(['"][^'"]*['"]|[^\s>]*)/gim, "");

  // 3. Remove javascript: URIs, including those with HTML entities or whitespace
  sanitized = sanitized.replace(/[\s/](href|xlink:href)\s*=\s*(['"]\s*(javascript|&#106;|&#x6a;)[^'"]*['"]|(javascript|&#106;|&#x6a;)[^\s>]*)/gim, "");

  // 4. Remove other dangerous tags
  const dangerousTags = [
    'iframe', 'object', 'embed', 'base', 'meta', 'link', 'style',
    'form', 'input', 'button', 'textarea', 'animate', 'set'
  ];

  dangerousTags.forEach(tag => {
    const reg = new RegExp(`<${tag}[\\s/>][^>]*>([\\s\\S]*?)<\\/${tag}>|<${tag}[\\s/>][^>]*\\/?>`, 'gim');
    sanitized = sanitized.replace(reg, "");
    const regSimple = new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`, 'gim');
    sanitized = sanitized.replace(regSimple, "");
  });

  return sanitized;
}
