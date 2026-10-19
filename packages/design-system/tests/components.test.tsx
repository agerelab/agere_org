import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Copy } from "lucide-react";

import {
  Button, IconButton, Input, PasswordInput, SearchInput, Checkbox, Label, Switch, Tabs, TabsList, TabsTrigger, TabsContent,
  Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, ConfirmDialog,
  FormField, FormControl, Breadcrumb, Pagination, getPageRange, Stepper, Alert, EmptyState, FileUploader, Badge, Avatar, AvatarGroup,
  TooltipProvider, SegmentedControl, Spinner, Progress, RadioGroup, RadioGroupItem,
} from "@/components/agere-ds";
import { expectNoA11yViolations } from "./utils/axe";

const wrap = (ui: React.ReactElement) => render(<TooltipProvider>{ui}</TooltipProvider>);

describe("Button", () => {
  it("defaults to type=button and fires onClick", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Save</Button>);
    const btn = screen.getByRole("button", { name: "Save" });
    expect(btn).toHaveAttribute("type", "button");
    await userEvent.click(btn);
    expect(onClick).toHaveBeenCalledOnce();
  });
  it("loading sets aria-busy and swallows clicks", async () => {
    const onClick = vi.fn();
    render(<Button loading onClick={onClick}>Saving…</Button>);
    const btn = screen.getByRole("button", { name: /Saving/ });
    expect(btn).toHaveAttribute("aria-busy", "true");
    await userEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });
  it("asChild renders the link and keeps classes", () => {
    render(<Button asChild variant="outline"><a href="/billing">Upgrade</a></Button>);
    const link = screen.getByRole("link", { name: "Upgrade" });
    expect(link).toHaveAttribute("data-variant", "outline");
    expect(link.className).toContain("rounded-md");
  });
  it("IconButton exposes its label as the accessible name", async () => {
    const { container } = wrap(<IconButton label="Copy link" icon={<Copy />} />);
    expect(screen.getByRole("button", { name: "Copy link" })).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
  it("variants have no axe violations", async () => {
    const { container } = render(<div>{(["default", "secondary", "outline", "ghost", "destructive", "destructive-outline", "link"] as const).map((v) => <Button key={v} variant={v}>{v}</Button>)}</div>);
    await expectNoA11yViolations(container);
  });
});

describe("Form field wiring", () => {
  it("links label, hint and error to the control", async () => {
    const { container } = render(
      <FormField label="Email" hint="Work email only" error="Enter a valid email" required>
        <FormControl><Input type="email" /></FormControl>
      </FormField>
    );
    const input = screen.getByLabelText(/Email/);
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-required", "true");
    expect(input).toHaveAccessibleDescription(/Work email only.*Enter a valid email/);
    await expectNoA11yViolations(container);
  });
  it("PasswordInput toggles visibility with aria-pressed", async () => {
    render(<><label htmlFor="pw">Password</label><PasswordInput id="pw" /></>);
    const input = screen.getByLabelText("Password");
    const toggle = screen.getByRole("button", { name: "Show password" });
    expect(input).toHaveAttribute("type", "password");
    await userEvent.click(toggle);
    expect(input).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: "Hide password" })).toHaveAttribute("aria-pressed", "true");
  });
  it("SearchInput clears", async () => {
    const onClear = vi.fn();
    render(<SearchInput aria-label="Search" value="abc" onChange={() => undefined} onClear={onClear} />);
    await userEvent.click(screen.getByRole("button", { name: "Clear search" }));
    expect(onClear).toHaveBeenCalled();
    expect(screen.getByRole("searchbox", { name: "Search" })).toBeInTheDocument();
  });
});

describe("Selection controls", () => {
  it("Checkbox and Switch toggle from the keyboard", async () => {
    const { container } = render(
      <div>
        <Checkbox id="c" /><Label htmlFor="c">Send reminders</Label>
        <Switch id="s" /><Label htmlFor="s">Require confirmation</Label>
      </div>
    );
    const cb = screen.getByRole("checkbox", { name: "Send reminders" });
    cb.focus(); await userEvent.keyboard(" ");
    expect(cb).toHaveAttribute("aria-checked", "true");
    const sw = screen.getByRole("switch", { name: "Require confirmation" });
    sw.focus(); await userEvent.keyboard(" ");
    expect(sw).toHaveAttribute("aria-checked", "true");
    await expectNoA11yViolations(container);
  });
  it("RadioGroup is one tab stop and moves focus with arrow keys", async () => {
    render(
      <RadioGroup defaultValue="a" aria-label="Plan">
        <RadioGroupItem value="a" aria-label="Free" /><RadioGroupItem value="b" aria-label="Team" />
      </RadioGroup>
    );
    screen.getByRole("radio", { name: "Free" }).focus();
    await userEvent.keyboard("{ArrowDown}");
    expect(screen.getByRole("radio", { name: "Team" })).toHaveFocus();
    expect(screen.getByRole("radiogroup", { name: "Plan" })).toBeInTheDocument();
  });
  it("SegmentedControl marks the pressed option", async () => {
    const Demo = () => { const [v, setV] = React.useState<"a" | "b">("a"); return <SegmentedControl aria-label="View" value={v} onValueChange={setV} options={[{ value: "a", label: "Board" }, { value: "b", label: "Table" }]} />; };
    render(<Demo />);
    await userEvent.click(screen.getByRole("radio", { name: "Table" }));
    expect(screen.getByRole("radio", { name: "Table" })).toHaveAttribute("aria-checked", "true");
  });
});

describe("Tabs", () => {
  it("roving focus with arrow keys and correct roles", async () => {
    const { container } = render(
      <Tabs defaultValue="a" variant="underline">
        <TabsList aria-label="Bookings"><TabsTrigger value="a">Upcoming</TabsTrigger><TabsTrigger value="b" count={3}>Unconfirmed</TabsTrigger></TabsList>
        <TabsContent value="a">A</TabsContent><TabsContent value="b">B</TabsContent>
      </Tabs>
    );
    screen.getByRole("tab", { name: "Upcoming" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: /Unconfirmed/ })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("B");
    await expectNoA11yViolations(container);
  });
});

describe("Dialog", () => {
  it("opens, traps focus, closes with Escape and restores focus", async () => {
    render(
      <Dialog>
        <DialogTrigger asChild><Button>New event type</Button></DialogTrigger>
        <DialogContent>
          <DialogHeader><DialogTitle>Add a new event type</DialogTitle><DialogDescription>Create one.</DialogDescription></DialogHeader>
          <input aria-label="Title" />
          <DialogFooter><Button>Continue</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    );
    const trigger = screen.getByRole("button", { name: "New event type" });
    await userEvent.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "Add a new event type" });
    expect(dialog).toHaveAccessibleDescription("Create one.");
    await expectNoA11yViolations(document.body);
    await userEvent.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
  it("ConfirmDialog is an alertdialog with Cancel focused first", async () => {
    const onConfirm = vi.fn();
    render(<ConfirmDialog trigger={<Button>Delete</Button>} title="Delete event type?" description="This can’t be undone." confirmLabel="Delete event type" onConfirm={onConfirm} />);
    await userEvent.click(screen.getByRole("button", { name: "Delete" }));
    const dlg = screen.getByRole("alertdialog", { name: "Delete event type?" });
    expect(within(dlg).getByRole("button", { name: "Cancel" })).toHaveFocus();
    await userEvent.click(within(dlg).getByRole("button", { name: "Delete event type" }));
    expect(onConfirm).toHaveBeenCalled();
  });
});

describe("Navigation", () => {
  it("Breadcrumb marks current page and collapses", async () => {
    const { container } = render(<Breadcrumb items={[{ label: "A", href: "/a" }, { label: "B", href: "/b" }, { label: "C", href: "/c" }, { label: "D", href: "/d" }, { label: "E" }]} maxItems={3} />);
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
    expect(screen.getByText("E").closest("[aria-current]")).toHaveAttribute("aria-current", "page");
    expect(screen.queryByText("B")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /Show/ }));
    expect(screen.getByText("B")).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
  it("getPageRange inserts gaps", () => {
    expect(getPageRange(1, 5)).toEqual([1, 2, 3, 4, 5]);
    expect(getPageRange(10, 20)).toEqual([1, "gap", 9, 10, 11, "gap", 20]);
    expect(getPageRange(1, 20)).toEqual([1, 2, 3, 4, 5, "gap", 20]);
  });
  it("Pagination navigates and marks aria-current", async () => {
    const onChange = vi.fn();
    const { container } = render(<Pagination page={2} pageCount={5} onPageChange={onChange} />);
    expect(screen.getByRole("button", { name: "Page 2" })).toHaveAttribute("aria-current", "page");
    await userEvent.click(screen.getByRole("button", { name: "Next page" }));
    expect(onChange).toHaveBeenCalledWith(3);
    await expectNoA11yViolations(container);
  });
  it("Stepper exposes aria-current=step", () => {
    render(<Stepper steps={[{ id: "a", label: "Account" }, { id: "b", label: "Calendar" }]} current={1} />);
    expect(screen.getAllByRole("listitem")[1]).toHaveAttribute("aria-current", "step");
    expect(screen.getByText("(completed)")).toBeInTheDocument();
  });
});

describe("Feedback & data display", () => {
  it("error Alert uses role=alert; others role=status", () => {
    render(<><Alert variant="error" title="Sync failed" /><Alert variant="info" title="Connected" /></>);
    expect(screen.getByRole("alert")).toHaveTextContent("Sync failed");
    expect(screen.getByRole("status")).toHaveTextContent("Connected");
  });
  it("Spinner announces; Progress is labelled", async () => {
    const { container } = render(<><Spinner /><Progress value={40} aria-label="Uploading" /></>);
    expect(screen.getByRole("status")).toHaveTextContent("Loading…");
    expect(screen.getByRole("progressbar", { name: "Uploading" })).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
  it("Avatar and AvatarGroup have names; Badge renders text", async () => {
    const { container } = render(<><Avatar name="Nadia Rahma" status="online" /><AvatarGroup people={[{ id: "1", name: "A B" }, { id: "2", name: "C D" }, { id: "3", name: "E F" }]} max={2} /><Badge variant="success">Accepted</Badge></>);
    expect(screen.getByRole("img", { name: "Nadia Rahma (online)" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: /3 people/ })).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
  it("EmptyState renders heading + action", async () => {
    const { container } = render(<EmptyState title="No bookings yet" description="Share your link." actions={<Button>Share link</Button>} />);
    expect(screen.getByRole("heading", { name: "No bookings yet" })).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
  it("FileUploader validates type and size", async () => {
    const onAdd = vi.fn(); const onReject = vi.fn();
    const { container } = render(<FileUploader files={[]} onFilesAdded={onAdd} onReject={onReject} accept=".pdf" maxSize={1000} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const ok = new File(["x"], "a.pdf", { type: "application/pdf" });
    const big = new File(["x".repeat(2000)], "b.pdf", { type: "application/pdf" });
    const bad = new File(["x"], "c.png", { type: "image/png" });
    await userEvent.upload(input, [ok, big, bad], { applyAccept: false });
    expect(onAdd).toHaveBeenCalledWith([ok]);
    expect(onReject.mock.calls[0][0]).toHaveLength(2);
    expect(screen.getByRole("button", { name: /Upload files/ })).toBeInTheDocument();
  });
});
