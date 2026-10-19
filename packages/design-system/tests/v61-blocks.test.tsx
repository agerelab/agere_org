import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { TooltipProvider } from "@/components/agere-ds";
import {
  ProductList, ProductOverview, ShoppingCart, ProductReviews, CheckoutPage,
  PricingSection, FaqSection, MarketingNavbar, LandingPage,
  LoginForm, RegisterForm, ForgotPasswordForm, TwoFactorForm, AuthFlow,
} from "@/blocks";
import { expectNoA11yViolations } from "./utils/axe";

const wrap = (ui: React.ReactElement) => render(<TooltipProvider>{ui}</TooltipProvider>);

describe("eCommerce blocks", () => {
  it("ProductList filters by category and stock, and announces the count", async () => {
    const user = userEvent.setup();
    const { container } = wrap(<ProductList />);
    expect(screen.getByText("6 of 6 products")).toBeInTheDocument();
    await user.click(screen.getByRole("checkbox", { name: "Kitchen" }));
    expect(screen.getByText("2 of 6 products")).toBeInTheDocument();
    await user.click(screen.getByRole("checkbox", { name: "Kitchen" }));
    await user.click(screen.getByRole("checkbox", { name: "In stock only" }));
    expect(screen.getByText("5 of 6 products")).toBeInTheDocument();
    expect(screen.getAllByRole("link").length).toBeGreaterThan(0);
    await expectNoA11yViolations(container);
  });
  it("ProductOverview: color and size are radio groups; quantity is bounded by stock", async () => {
    const user = userEvent.setup();
    const { container } = wrap(<ProductOverview />);
    expect(screen.getByRole("radiogroup", { name: "Color" })).toBeInTheDocument();
    expect(screen.getByRole("radiogroup", { name: "Size" })).toBeInTheDocument();
    const dec = screen.getByRole("button", { name: "Decrease quantity" });
    expect(dec).toBeDisabled();
    await user.click(screen.getByRole("button", { name: "Increase quantity" }));
    expect(within(screen.getByRole("group", { name: "Quantity" })).getByText("2")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Tirta Steel Bottle, Teal, front view/ })).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
  it("ShoppingCart opens a labelled sheet and removing a line updates the subtotal", async () => {
    const user = userEvent.setup();
    wrap(<ShoppingCart />);
    const trigger = screen.getByRole("button", { name: /^Cart/ });
    expect(trigger).toHaveAccessibleName("Cart, 3 items");
    await user.click(trigger);
    const sheet = await screen.findByRole("dialog", { name: "Your cart" });
    const before = within(sheet).getByText((_, el) => el?.tagName === "OUTPUT" && /Rp/.test(el.textContent ?? "")).textContent;
    await user.click(within(sheet).getByRole("button", { name: "Remove Grid Notebook A5" }));
    const after = within(sheet).getByText((_, el) => el?.tagName === "OUTPUT" && /Rp/.test(el.textContent ?? "")).textContent;
    expect(after).not.toBe(before);
    expect(within(sheet).getByText("2 items")).toBeInTheDocument();
  });
  it("ProductReviews exposes the rating in text", async () => {
    const { container } = wrap(<ProductReviews />);
    expect(screen.getByText(/out of 5 · 214 reviews/)).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
  it("CheckoutPage validates on submit and focuses the first invalid field", async () => {
    const user = userEvent.setup();
    const { container } = wrap(<CheckoutPage />);
    await user.click(screen.getByRole("button", { name: /^Pay Rp/ }));
    const email = screen.getByRole("textbox", { name: /Email/ });
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveFocus();
    expect(screen.getByText("Use an Indonesian mobile number, e.g. 0812 3456 7890.")).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: /City/ })).toHaveAttribute("aria-invalid", "true");
    await expectNoA11yViolations(container);
  });
});

describe("Marketing blocks", () => {
  it("PricingSection switches between yearly and monthly prices", async () => {
    const user = userEvent.setup();
    wrap(<PricingSection />);
    expect(screen.getByText("Rp 392.000")).toBeInTheDocument(); // 490k × 0.8, yearly default
    await user.click(screen.getByRole("switch", { name: "Bill yearly" }));
    expect(screen.getByText("Rp 490.000")).toBeInTheDocument();
  });
  it("FaqSection is an accordion with one item open", async () => {
    wrap(<FaqSection />);
    expect(screen.getAllByRole("button", { expanded: true })).toHaveLength(1);
  });
  it("MarketingNavbar has a named main navigation and a mobile menu button", async () => {
    wrap(<MarketingNavbar />);
    expect(screen.getByRole("navigation", { name: "Main" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open menu" })).toBeInTheDocument();
  });
  it("LandingPage has one h1 and passes axe", async () => {
    const { container } = wrap(<LandingPage />);
    expect(container.querySelectorAll("h1")).toHaveLength(1);
    await expectNoA11yViolations(container);
  });
});

describe("Auth blocks", () => {
  it("LoginForm validates, focuses the email, and succeeds with valid input", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    const { container } = wrap(<LoginForm onSuccess={onSuccess} />);
    await user.click(screen.getByRole("button", { name: "Sign in" }));
    const email = screen.getByRole("textbox", { name: "Email" });
    expect(email).toHaveFocus();
    expect(screen.getByText("Enter your password.")).toBeInTheDocument();
    await user.type(email, "bubus@agere.id");
    await user.type(screen.getByLabelText("Password"), "hunter22Hunter");
    await user.click(screen.getByRole("button", { name: "Sign in" }));
    await vi.waitFor(() => expect(onSuccess).toHaveBeenCalled());
    await expectNoA11yViolations(container);
  });
  it("RegisterForm ticks password rules as they are met (announced in text)", async () => {
    const user = userEvent.setup();
    wrap(<RegisterForm />);
    await user.type(screen.getByLabelText("Password"), "Abcdefghij1");
    for (const rule of ["At least 10 characters", "Upper and lower case letters", "A number or symbol"]) {
      expect(screen.getByText(rule).closest("li")).toHaveTextContent("done");
    }
  });
  it("ForgotPasswordForm does not reveal whether the account exists and moves focus to the result", async () => {
    const user = userEvent.setup();
    wrap(<ForgotPasswordForm />);
    await user.type(screen.getByRole("textbox", { name: "Email" }), "nobody@example.com");
    await user.click(screen.getByRole("button", { name: "Send reset link" }));
    const h = screen.getByRole("heading", { name: "Check your email" });
    expect(h).toHaveFocus();
    expect(screen.getByText(/If an account exists for/)).toBeInTheDocument();
  });
  it("TwoFactorForm rejects a wrong code, clears it, and accepts the right one on completion", async () => {
    const user = userEvent.setup();
    const onVerified = vi.fn();
    const { container } = wrap(<TwoFactorForm code="246810" onVerified={onVerified} />);
    const input = screen.getByRole("textbox", { name: "6-digit code" });
    await user.click(input);
    await user.keyboard("111111");
    expect(screen.getByRole("alert")).toHaveTextContent("That code isn't right");
    expect(input).toHaveValue("");
    await user.keyboard("246810");
    expect(onVerified).toHaveBeenCalled();
    expect(screen.getByText(/Resend in/)).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
  it("AuthFlow navigates login → forgot → back", async () => {
    const user = userEvent.setup();
    wrap(<AuthFlow />);
    await user.click(screen.getByRole("button", { name: "Forgot password?" }));
    expect(screen.getByRole("heading", { name: "Reset your password" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Back to sign in" }));
    expect(screen.getByRole("heading", { name: "Welcome back" })).toBeInTheDocument();
  });
});

describe("Regressions found in the browser pass", () => {
  it("headings on bg-primary set their own color (global h1–h4 color would otherwise win)", async () => {
    const { CtaSection } = await import("@/blocks");
    render(<CtaSection />);
    expect(screen.getByRole("heading", { name: "Build your next venture with us" }).className).toContain("text-primary-foreground");
  });
  it("visually-hidden radios in swatch pickers use !sr-only so base size/position classes can't show them", () => {
    const { container } = wrap(<ProductOverview />);
    const radios = container.querySelectorAll('[role="radio"]');
    expect(radios.length).toBeGreaterThan(0);
    radios.forEach((r) => expect(r.className).toContain("!sr-only"));
  });
});
