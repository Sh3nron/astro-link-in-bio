## 2024-05-23 - Persistent will-change on Animation Classes
**Learning:** Using `will-change: transform` on CSS classes that define entry animations (like `.animate-fade-in-up`) causes the browser to keep the layer promoted indefinitely after the animation completes, wasting memory for static content.
**Action:** Avoid `will-change` on one-time animation classes unless absolutely necessary. Rely on browser heuristics or remove the class/property via JS after animation ends if performance is critical.
