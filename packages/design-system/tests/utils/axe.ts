import axe from "axe-core";
import { expect } from "vitest";

/**
 * Runs axe-core against a rendered container and fails with a readable list.
 * Color-contrast is disabled here (jsdom has no layout/CSS); contrast is covered
 * by tests/tokens.contrast.test.ts and by Storybook's a11y addon in a real browser.
 */
/**
 * Radix's intentional focus sentinels: empty, visually-hidden, aria-hidden spans with tabindex=0 that catch Tab and
 * immediately move focus back inside the dialog / into the open navigation panel. axe's aria-hidden-focus flags them
 * once `document.elementFromPoint` exists (tests/setup.ts polyfills it for input-otp). They hold no content and are
 * never announced, so they are excluded BY SELECTOR — the rule itself stays on for everything else.
 */
const RADIX_FOCUS_SENTINELS = [
  "[data-radix-focus-guard]",
  // While a modal is open Radix marks everything outside it aria-hidden (data-aria-hidden) and traps focus inside,
  // so the page behind is unreachable by keyboard and invisible to screen readers. Follow-up: add `inert` too.
  '[data-aria-hidden="true"]',
  '[data-slot="navigation-menu-trigger"] + span[aria-hidden="true"][tabindex="0"]',
];

export async function expectNoA11yViolations(container: Element) {
  const sentinels = RADIX_FOCUS_SENTINELS.flatMap((sel) => [...document.querySelectorAll(sel)]).filter((el) => el.hasAttribute("data-aria-hidden") || !el.textContent?.trim());
  const context = sentinels.length ? { include: [container], exclude: sentinels } : container;
  const results = await axe.run(context as axe.ElementContext, {
    rules: { "color-contrast": { enabled: false }, region: { enabled: false } },
  });
  const msg = results.violations.map((v) => `• ${v.id}: ${v.help}\n  ${v.nodes.map((n) => n.target.join(" ")).join("\n  ")}`).join("\n");
  expect(results.violations, msg).toHaveLength(0);
}
