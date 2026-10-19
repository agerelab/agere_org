# Third-party notices

Agere DS is © 2026 PT Agere Teknologi Indonesia under the MIT License. It includes or depends on the third-party work below, which keeps its own license. Every license listed is compatible with MIT redistribution; keep this file (and each package's own LICENSE, which ships inside `node_modules`) with any copy you distribute.

## shadcn/ui
The primitives in `src/components/ui/` follow and adapt source from shadcn/ui (https://ui.shadcn.com), and several blocks follow shadcnstudio-style layouts built only from those components.

```
MIT License

Copyright (c) 2023 shadcn

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Fonts
- **Inter** (Inter Variable, via `@fontsource-variable/inter`) — © The Inter Project Authors, SIL Open Font License 1.1. Embedded in the docs portal and the design-system artifact.
- **Geist** (Geist Bold, converted to outlines in the `agere/<product>` logos) — © Vercel, SIL Open Font License 1.1. The outlines are part of the agere product logos, which are not MIT-licensed (see `TRADEMARKS.md`).

## Icons
- **Lucide** (`lucide-react`) — © Lucide Contributors, ISC License (portions © Cole Bemis, MIT, from Feather).

## Runtime dependencies (bundled into the docs portal and the design-system bundle)

| Package | Version | License |
|---|---|---|
| `@dnd-kit/core` | 6.3.1 | MIT |
| `@dnd-kit/sortable` | 10.0.0 | MIT |
| `@dnd-kit/utilities` | 3.2.2 | MIT |
| `@fontsource-variable/inter` | 5.3.0 | OFL-1.1 |
| `@radix-ui/react-accordion` | 1.2.20 | MIT |
| `@radix-ui/react-alert-dialog` | 1.1.23 | MIT |
| `@radix-ui/react-avatar` | 1.2.6 | MIT |
| `@radix-ui/react-checkbox` | 1.3.11 | MIT |
| `@radix-ui/react-collapsible` | 1.1.20 | MIT |
| `@radix-ui/react-context-menu` | 2.3.7 | MIT |
| `@radix-ui/react-dialog` | 1.1.23 | MIT |
| `@radix-ui/react-dropdown-menu` | 2.1.24 | MIT |
| `@radix-ui/react-hover-card` | 1.1.23 | MIT |
| `@radix-ui/react-label` | 2.1.15 | MIT |
| `@radix-ui/react-menubar` | 1.1.24 | MIT |
| `@radix-ui/react-navigation-menu` | 1.2.22 | MIT |
| `@radix-ui/react-popover` | 1.1.23 | MIT |
| `@radix-ui/react-progress` | 1.1.16 | MIT |
| `@radix-ui/react-radio-group` | 1.4.7 | MIT |
| `@radix-ui/react-scroll-area` | 1.2.18 | MIT |
| `@radix-ui/react-select` | 2.3.7 | MIT |
| `@radix-ui/react-separator` | 1.1.15 | MIT |
| `@radix-ui/react-slider` | 1.4.7 | MIT |
| `@radix-ui/react-slot` | 1.3.3 | MIT |
| `@radix-ui/react-switch` | 1.3.7 | MIT |
| `@radix-ui/react-tabs` | 1.1.21 | MIT |
| `@radix-ui/react-toast` | 1.2.23 | MIT |
| `@radix-ui/react-toggle` | 1.1.18 | MIT |
| `@radix-ui/react-toggle-group` | 1.1.19 | MIT |
| `@radix-ui/react-tooltip` | 1.2.16 | MIT |
| `@radix-ui/react-visually-hidden` | 1.2.11 | MIT |
| `@tanstack/react-table` | 8.21.3 | MIT |
| `class-variance-authority` | 0.7.1 | Apache-2.0 |
| `clsx` | 2.1.1 | MIT |
| `cmdk` | 1.1.1 | MIT |
| `date-fns` | 4.4.0 | MIT |
| `embla-carousel-react` | 8.6.0 | MIT |
| `framer-motion` | 11.18.2 | MIT |
| `input-otp` | 1.5.0 | MIT |
| `lucide-react` | 0.468.0 | ISC |
| `react` | 19.3.0 | MIT |
| `react-day-picker` | 10.0.1 | MIT |
| `react-dom` | 19.3.0 | MIT |
| `react-resizable-panels` | 4.13.3 | MIT |
| `recharts` | 3.10.1 | MIT |
| `tailwind-merge` | 2.6.1 | MIT |
| `vaul` | 1.1.2 | MIT |

Development tools (Vite, Tailwind CSS, Storybook, Vitest, TypeScript, Style Dictionary, Playwright…) are used only to build and test, are not redistributed, and are listed with their licenses in `package-lock.json`.
