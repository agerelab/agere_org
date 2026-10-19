import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => cleanup());

// jsdom gaps used by Radix
class RO { observe() {} unobserve() {} disconnect() {} }
(globalThis as any).ResizeObserver ??= RO;
Element.prototype.scrollIntoView ??= function () {};
Element.prototype.hasPointerCapture ??= () => false;
Element.prototype.releasePointerCapture ??= () => {};
window.matchMedia ??= ((q: string) => ({ matches: false, media: q, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, onchange: null, dispatchEvent: () => false })) as any;
// jsdom gaps used by input-otp (password-manager badge detection) and vaul (drag to dismiss)
document.elementFromPoint ??= () => null;
Element.prototype.setPointerCapture ??= () => {};
// jsdom gap used by embla-carousel (slides-in-view tracking)
class IO { constructor(_cb: unknown, _o?: unknown) {} observe() {} unobserve() {} disconnect() {} takeRecords() { return []; } root = null; rootMargin = ""; thresholds = []; }
(globalThis as any).IntersectionObserver ??= IO;
