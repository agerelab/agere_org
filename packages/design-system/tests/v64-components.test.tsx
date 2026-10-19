import * as React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Archive, Plus, Upload, Zap } from "lucide-react";

import {
  PageHeader, PageHeaderActions, PageHeaderBack, PageHeaderContent, PageHeaderDescription, PageHeaderLeading, PageHeaderMeta, PageHeaderTitle,
  SaveBar, RuleBuilder, RuleBuilderPreview, RuleBuilderRow, Badge, Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/agere-ds";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lightTokens, darkTokens } from "@/tokens";
import { contrastRatio } from "@/lib/theme";
import { expectNoA11yViolations } from "./utils/axe";

const wrap = (ui: React.ReactElement) => render(<TooltipProvider>{ui}</TooltipProvider>);
const setWidth = (w: number) => Object.defineProperty(window, "innerWidth", { configurable: true, writable: true, value: w });
afterEach(() => setWidth(1024));

function Header(props: Partial<React.ComponentProps<typeof PageHeaderActions>>) {
  return (
    <PageHeader>
      <PageHeaderLeading>EN</PageHeaderLeading>
      <PageHeaderContent>
        <PageHeaderBack href="#/space">Product & Tech</PageHeaderBack>
        <PageHeaderTitle badges={<Badge variant="success">On track</Badge>}>Engineering</PageHeaderTitle>
        <PageHeaderDescription>Client bugs and web features.</PageHeaderDescription>
        <PageHeaderMeta><span>9 projects</span></PageHeaderMeta>
      </PageHeaderContent>
      <PageHeaderActions
        primary={{ label: "New task", icon: <Plus />, onSelect: props.primary?.onSelect }}
        secondary={[{ label: "Share", onSelect: vi.fn() }]}
        menu={[{ label: "Archive project", icon: <Archive /> }, "separator", { label: "Move to trash", destructive: true }]}
        {...props}
      />
    </PageHeader>
  );
}

describe("PageHeader", () => {
  it("renders one labelled h1, back link, badges and description, with no a11y violations", async () => {
    const { container } = wrap(<Header />);
    expect(screen.getByRole("heading", { level: 1, name: "Engineering" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Product & Tech" })).toHaveAttribute("href", "#/space");
    expect(screen.getByText("On track")).toBeInTheDocument();
    expect(container.querySelector('[data-slot="page-header-leading"]')).toHaveAttribute("aria-hidden");
    await expectNoA11yViolations(container);
  });

  it("desktop: primary is default, secondary is outline, and the ⋯ menu never repeats a visible action", async () => {
    const user = userEvent.setup();
    const onNew = vi.fn();
    wrap(<Header primary={{ label: "New task", onSelect: onNew }} />);
    const primary = screen.getByRole("button", { name: "New task" });
    expect(primary).toHaveAttribute("data-variant", "default");
    await user.click(primary);
    expect(onNew).toHaveBeenCalledOnce();
    const share = screen.getByRole("button", { name: "Share" });
    expect(share).toHaveAttribute("data-variant", "outline");
    expect(share.className).toContain("max-md:hidden");
    await user.click(screen.getByRole("button", { name: "More actions" }));
    const items = within(await screen.findByRole("menu")).getAllByRole("menuitem").map((m) => m.textContent);
    expect(items).toEqual(["Archive project", "Move to trash"]);
  });

  it("below md: secondary actions move into ⋯ as the first items, followed by a separator", async () => {
    setWidth(390);
    const user = userEvent.setup();
    const onShare = vi.fn();
    wrap(<Header secondary={[{ label: "Share", onSelect: onShare }, { label: "Import", icon: <Upload /> }]} />);
    await user.click(screen.getByRole("button", { name: "More actions" }));
    const menu = await screen.findByRole("menu");
    expect(within(menu).getAllByRole("menuitem").map((m) => m.textContent)).toEqual(["Share", "Import", "Archive project", "Move to trash"]);
    expect(within(menu).getAllByRole("separator")).toHaveLength(2);
    await user.click(within(menu).getByRole("menuitem", { name: "Share" }));
    expect(onShare).toHaveBeenCalledOnce();
  });

  it("renders no ⋯ trigger on desktop when there is nothing to overflow", () => {
    wrap(<Header menu={undefined} />);
    expect(screen.queryByRole("button", { name: "More actions" })).toBeNull();
  });

  it("shows a ⋯ trigger below md when only secondary actions exist", async () => {
    setWidth(390);
    wrap(<Header menu={undefined} />);
    expect(await screen.findByRole("button", { name: "More actions" })).toBeInTheDocument();
  });

  it("renders href actions as links, in the header and in the menu", async () => {
    const user = userEvent.setup();
    wrap(<Header primary={{ label: "Open forms", href: "#/forms" }} menu={[{ label: "View audit", href: "#/audit" }]} />);
    expect(screen.getByRole("link", { name: "Open forms" })).toHaveAttribute("href", "#/forms");
    await user.click(screen.getByRole("button", { name: "More actions" }));
    expect(within(await screen.findByRole("menu")).getByRole("menuitem", { name: "View audit" })).toHaveAttribute("href", "#/audit");
  });

  it("marks destructive and disabled menu items", async () => {
    const user = userEvent.setup();
    wrap(<Header menu={[{ label: "Archive project", disabled: true }, { label: "Move to trash", destructive: true }]} />);
    await user.click(screen.getByRole("button", { name: "More actions" }));
    const menu = await screen.findByRole("menu");
    expect(within(menu).getByRole("menuitem", { name: "Archive project" })).toHaveAttribute("aria-disabled", "true");
    expect(within(menu).getByRole("menuitem", { name: "Move to trash" }).className).toContain("text-destructive");
  });
});

describe("SaveBar", () => {
  it("is a named region with a polite status; buttons are disabled while everything is saved", async () => {
    const { container } = wrap(<SaveBar state="saved" onSave={vi.fn()} onCancel={vi.fn()} />);
    const region = screen.getByRole("region", { name: "Save changes" });
    expect(within(region).getByText("All changes saved").closest("[aria-live]")).toHaveAttribute("aria-live", "polite");
    expect(screen.getByRole("button", { name: "Save changes" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    await expectNoA11yViolations(container);
  });

  it("dirty: enables Save and Cancel, shows the attention status, and calls back", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn(), onCancel = vi.fn();
    wrap(<SaveBar state="dirty" onSave={onSave} onCancel={onCancel} messages={{ dirty: "Perubahan belum disimpan" }} saveLabel="Simpan" cancelLabel="Batal" />);
    const status = screen.getByText("Perubahan belum disimpan");
    expect(status.className).toContain("text-attention-on-surface");
    await user.click(screen.getByRole("button", { name: "Simpan" }));
    await user.click(screen.getByRole("button", { name: "Batal" }));
    expect(onSave).toHaveBeenCalledOnce();
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("saving: Save is busy and Cancel is disabled; error: Save is enabled again", () => {
    const { rerender } = wrap(<SaveBar state="saving" onSave={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByRole("button", { name: /Save changes/ })).toHaveAttribute("aria-busy", "true");
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    rerender(<TooltipProvider><SaveBar state="error" onSave={vi.fn()} onCancel={vi.fn()} /></TooltipProvider>);
    expect(screen.getByText("Couldn’t save. Try again.").className).toContain("text-error-on-surface");
    expect(screen.getByRole("button", { name: "Save changes" })).toBeEnabled();
  });

  it("omits Cancel when there is no onCancel", () => {
    wrap(<SaveBar state="dirty" onSave={vi.fn()} />);
    expect(screen.queryByRole("button", { name: "Cancel" })).toBeNull();
  });
});

describe("RuleBuilder", () => {
  function Rule() {
    const [ev, setEv] = React.useState("request");
    return (
      <RuleBuilder preview={<RuleBuilderPreview icon={<Zap />}>When <b>{ev === "request" ? "a request arrives" : "a task is overdue"}</b>, run <b>/triage</b>.</RuleBuilderPreview>}>
        <RuleBuilderRow label="When">
          <Select value={ev} onValueChange={setEv}>
            <SelectTrigger aria-label="Event"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="request">A request arrives</SelectItem><SelectItem value="late">A task is overdue</SelectItem></SelectContent>
          </Select>
        </RuleBuilderRow>
        <RuleBuilderRow label="If" optional><span>Any priority</span></RuleBuilderRow>
      </RuleBuilder>
    );
  }
  it("labels each row as a group and reads the rule back in a status region", async () => {
    const { container } = wrap(<Rule />);
    expect(screen.getByRole("group", { name: "When" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "If (optional)" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("When a request arrives, run /triage.");
    await expectNoA11yViolations(container);
  });
  it("keeps the preview in sync with the controls", async () => {
    const user = userEvent.setup();
    wrap(<Rule />);
    await user.click(screen.getByRole("combobox", { name: "Event" }));
    await user.click(await screen.findByRole("option", { name: "A task is overdue" }));
    await act(async () => {});
    expect(screen.getByRole("status")).toHaveTextContent("When a task is overdue, run /triage.");
  });
});

describe("on-surface status tokens", () => {
  // v7: Geist's 900 step is solved to pass on the status tint AND on every neutral surface, so `fg` and `on-surface`
  // may share a value. The v6.4 intent — status text never fades to near-white on a neutral surface in dark mode — is
  // asserted directly here and by the saturation + WCAG + APCA gates in tokens.contrast.test.ts.
  it("exist for every status in both themes and stay readable and hued on neutral surfaces in dark mode", () => {
    for (const s of ["info", "success", "attention", "error", "special"] as const) {
      expect((lightTokens as any)[s]["on-surface"]).toMatch(/^#[0-9a-f]{6}$/i);
      const d = darkTokens as any;
      expect(contrastRatio(d[s]["on-surface"], d.bg.surface)).toBeGreaterThanOrEqual(4.5);
      expect(d[s]["on-surface"].toLowerCase()).not.toMatch(/^#(f[0-9a-f]){3}$/); // not near-white
    }
  });
});
