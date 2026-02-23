## 2025-05-23 - Keyboard Accessibility in Glassmorphism
**Learning:** Glassmorphism designs often rely on subtle background blurs and transparencies, which can make default browser focus rings (often blue or black/white) difficult to see or aesthetically clashing.
**Action:** Always implement explicit `focus-visible` styles using high-contrast rings (or theme-aware colors) that sit *outside* or clearly *atop* the glass layers to ensure keyboard users can track their position without breaking the visual immersion.
