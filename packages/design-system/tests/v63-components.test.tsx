import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Search } from "lucide-react";

import {
  Field, FieldControl, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet, FieldContent, FieldTitle,
  InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea,
  Item, ItemActions, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemSeparator, ItemTitle,
  Input, Checkbox, Switch, Button, RadioGroup, RadioGroupItem,
} from "@/components/agere-ds";
import { expectNoA11yViolations } from "./utils/axe";

describe("Field", () => {
  it("wires label, description and error to the control automatically", async () => {
    const { container, rerender } = render(
      <Field>
        <FieldLabel>Email</FieldLabel>
        <FieldControl><Input /></FieldControl>
        <FieldDescription>We never share it.</FieldDescription>
      </Field>
    );
    const input = screen.getByRole("textbox", { name: "Email" });
    expect(input).toHaveAccessibleDescription("We never share it.");
    expect(input).not.toHaveAttribute("aria-invalid");
    rerender(
      <Field invalid>
        <FieldLabel>Email</FieldLabel>
        <FieldControl><Input /></FieldControl>
        <FieldDescription>We never share it.</FieldDescription>
        <FieldError>Enter a valid email.</FieldError>
      </Field>
    );
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("We never share it. Enter a valid email.");
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid email.");
    await expectNoA11yViolations(container);
  });

  it("MERGES a caller's aria-describedby instead of replacing it (regression)", () => {
    render(
      <>
        <p id="extra">Used for receipts.</p>
        <Field invalid>
          <FieldLabel>Email</FieldLabel>
          <FieldControl aria-describedby="extra"><Input /></FieldControl>
          <FieldError>Enter a valid email.</FieldError>
        </Field>
      </>
    );
    const input = screen.getByRole("textbox", { name: "Email" });
    expect(input.getAttribute("aria-describedby")!.split(" ")).toEqual(expect.arrayContaining(["extra", expect.stringMatching(/-error$/)]));
    expect(input).toHaveAccessibleDescription("Used for receipts. Enter a valid email.");
  });

  it("keeps the control id tied to the label even if the caller passes one (regression)", () => {
    render(<Field id="email-field"><FieldLabel>Email</FieldLabel><FieldControl id="other"><Input /></FieldControl></Field>);
    expect(screen.getByRole("textbox", { name: "Email" })).toHaveAttribute("id", "email-field");
  });

  it("maps errors[] (react-hook-form / zod shape), de-duplicated", () => {
    render(<Field invalid><FieldLabel>Password</FieldLabel><FieldControl><Input type="password" /></FieldControl><FieldError errors={[{ message: "Too short" }, { message: "Too short" }, { message: "Add a number" }]} /></Field>);
    const items = screen.getByRole("alert").querySelectorAll("li");
    expect([...items].map((li) => li.textContent)).toEqual(["Too short", "Add a number"]);
  });

  it("FieldSet + FieldLegend group horizontal choice fields; passes axe", async () => {
    const { container } = render(
      <FieldSet>
        <FieldLegend>Notifications</FieldLegend>
        <FieldGroup>
          <Field orientation="horizontal"><FieldControl><Checkbox /></FieldControl><FieldLabel>Email me product updates</FieldLabel></Field>
          <Field orientation="horizontal">
            <FieldContent><FieldLabel>Weekly digest</FieldLabel><FieldDescription>Every Monday at 08:00.</FieldDescription></FieldContent>
            <FieldControl><Switch /></FieldControl>
          </Field>
        </FieldGroup>
      </FieldSet>
    );
    expect(screen.getByRole("group", { name: "Notifications" })).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: "Email me product updates" })).toBeInTheDocument();
    expect(screen.getByRole("switch", { name: "Weekly digest" })).toHaveAccessibleDescription("Every Monday at 08:00.");
    await expectNoA11yViolations(container);
  });

  it("choice cards: radios inside a wrapping FieldLabel are named via aria-labelledby → their FieldTitle", async () => {
    const { container } = render(
      <RadioGroup aria-label="Plan" defaultValue="pro">
        {["starter", "pro"].map((v) => (
          <FieldLabel key={v} htmlFor={`plan-${v}`}>
            {/* A <label> wrapping a Radix radio (a <button>) is not a reliable name across screen readers — point at the title. */}
            <Field orientation="horizontal"><FieldContent><FieldTitle id={`plan-${v}-t`}>{v}</FieldTitle></FieldContent><RadioGroupItem id={`plan-${v}`} value={v} aria-labelledby={`plan-${v}-t`} /></Field>
          </FieldLabel>
        ))}
      </RadioGroup>
    );
    expect(screen.getByRole("radio", { name: "pro" })).toBeChecked();
    await expectNoA11yViolations(container);
  });
});

describe("InputGroup", () => {
  it("one frame around input + addons; the addon text is not the input's name; the button is its own control", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { container } = render(
      <InputGroup>
        <InputGroupAddon><Search aria-hidden /></InputGroupAddon>
        <InputGroupInput aria-label="Search docs" />
        <InputGroupAddon align="inline-end"><InputGroupText>12 results</InputGroupText><InputGroupButton onClick={onClick} aria-label="Clear">×</InputGroupButton></InputGroupAddon>
      </InputGroup>
    );
    const input = screen.getByRole("textbox", { name: "Search docs" });
    expect(input).toHaveAttribute("data-slot", "input-group-control");
    await user.click(screen.getByText("12 results"));
    expect(input).toHaveFocus(); // clicking an addon focuses the field (mouse convenience)
    await user.click(screen.getByRole("button", { name: "Clear" }));
    expect(onClick).toHaveBeenCalled();
    expect(screen.getByRole("button", { name: "Clear" })).toHaveAttribute("type", "button"); // never submits a form by accident
    await expectNoA11yViolations(container);
  });
  it("a caller's onClick on the addon still runs (regression) and can opt out with preventDefault", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn((e: React.MouseEvent) => e.preventDefault());
    render(<InputGroup><InputGroupAddon onClick={onClick}><InputGroupText>https://</InputGroupText></InputGroupAddon><InputGroupInput aria-label="URL" /></InputGroup>);
    await user.click(screen.getByText("https://"));
    expect(onClick).toHaveBeenCalled();
    expect(screen.getByRole("textbox", { name: "URL" })).not.toHaveFocus();
  });
  it("block-end addon under a textarea (toolbar pattern)", () => {
    render(<InputGroup><InputGroupTextarea aria-label="Message" /><InputGroupAddon align="block-end"><InputGroupButton aria-label="Send">Send</InputGroupButton></InputGroupAddon></InputGroup>);
    expect(screen.getByRole("textbox", { name: "Message" }).tagName).toBe("TEXTAREA");
    expect(screen.getByRole("button", { name: "Send" }).closest("[data-align]")).toHaveAttribute("data-align", "block-end");
  });
});

describe("Item", () => {
  it("ItemGroup is a list and every Item is a listitem (fixes shadcn's missing role)", async () => {
    const { container } = render(
      <ItemGroup aria-label="Team">
        <Item variant="outline"><ItemMedia variant="icon">NP</ItemMedia><ItemContent><ItemTitle>Nadia Putri</ItemTitle><ItemDescription>Owner</ItemDescription></ItemContent><ItemActions><Button size="sm" variant="outline">Manage</Button></ItemActions></Item>
        <ItemSeparator />
        <Item asChild><a href="/raka"><ItemContent><ItemTitle>Raka Pratama</ItemTitle></ItemContent></a></Item>
      </ItemGroup>
    );
    const list = screen.getByRole("list", { name: "Team" });
    expect(list.querySelectorAll(':scope > [role="listitem"]')).toHaveLength(2);
    expect(screen.getByRole("link", { name: "Raka Pratama" })).toBeInTheDocument(); // asChild keeps the link's own role
    await expectNoA11yViolations(container);
  });
  it("outside a group an Item has no list role", () => {
    render(<Item data-testid="solo"><ItemContent><ItemTitle>Solo</ItemTitle></ItemContent></Item>);
    expect(screen.getByTestId("solo")).not.toHaveAttribute("role");
  });
});
