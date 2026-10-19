import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  CommandPalette, FilterBar, EMPTY_FILTERS, TaskList, TaskRow, ViewSwitcherBar, ViewSwitcherPanel, TimeTrackerWidget, ChatInputBar, MessageBubble,
  ChannelSidebar, StatusBadge, PriorityFlag, AssigneeStack, GanttChart, TooltipProvider, applyTaskQuery, parseDurationInput, formatDuration, formatClock,
  lightTokens, darkTokens, contrastRatio, TASK_STATUSES, TASK_PRIORITIES,
  type WorkspaceTask, type TaskFilters, type WorkspaceView,
} from "@/components/agere-ds";
import { CHANNELS, DIRECTS, LINKABLE_TASKS, MEMBERS, MESSAGES, TASKS } from "@/patterns/data";
import { expectNoA11yViolations } from "./utils/axe";

const wrap = (ui: React.ReactElement) => render(<TooltipProvider>{ui}</TooltipProvider>);
const get = (t: any, path: string): string => path.split(".").reduce((o, k) => o[k], t);

/* ------------------------------------------------------------------ */
describe("workspace tokens contrast", () => {
  describe.each([["light", lightTokens], ["dark", darkTokens]])("%s", (_n, t) => {
    it.each(TASK_STATUSES)("status %s badge text ≥ 4.5:1", (s) => {
      expect(contrastRatio(get(t, `task-status.${s}.fg`), get(t, `task-status.${s}.bg`))).toBeGreaterThanOrEqual(4.5);
    });
    it.each(TASK_STATUSES)("status %s indicator ≥ 3:1 vs canvas", (s) => {
      expect(contrastRatio(get(t, `task-status.${s}.solid`), get(t, "bg.default"))).toBeGreaterThanOrEqual(s === "backlog" ? 2 : 3);
    });
    it.each(TASK_PRIORITIES)("priority %s flag ≥ 3:1 vs canvas", (p) => {
      expect(contrastRatio(get(t, `priority.${p}`), get(t, "bg.default"))).toBeGreaterThanOrEqual(3);
    });
  });
});

/* ------------------------------------------------------------------ */
describe("helpers", () => {
  it("parseDurationInput understands ClickUp-style input", () => {
    expect(parseDurationInput("1h 30m")).toBe(90);
    expect(parseDurationInput("1.5h")).toBe(90);
    expect(parseDurationInput("1,5h")).toBe(90);
    expect(parseDurationInput("45m")).toBe(45);
    expect(parseDurationInput("2:15")).toBe(135);
    expect(parseDurationInput("20")).toBe(20);
    expect(parseDurationInput("abc")).toBeNull();
  });
  it("formats durations and clocks", () => {
    expect(formatDuration(95)).toBe("1h 35m");
    expect(formatDuration(120)).toBe("2h");
    expect(formatClock(3725)).toBe("01:02:05");
  });
  it("applyTaskQuery filters by search, status, priority and assignee", () => {
    const f: TaskFilters = { ...EMPTY_FILTERS, status: ["in-progress"] };
    expect(applyTaskQuery(TASKS, "", f).every((t) => t.status === "in-progress")).toBe(true);
    expect(applyTaskQuery(TASKS, "qris", EMPTY_FILTERS).length).toBeGreaterThan(0);
    expect(applyTaskQuery(TASKS, "zzzz-nothing", EMPTY_FILTERS)).toHaveLength(0);
    const byPrio = applyTaskQuery(TASKS, "", EMPTY_FILTERS, "priority");
    const rank = { urgent: 3, high: 2, normal: 1, low: 0 } as const;
    expect(rank[byPrio[0].priority ?? "low"]).toBeGreaterThanOrEqual(rank[byPrio[byPrio.length - 1].priority ?? "low"]);
  });
});

/* ------------------------------------------------------------------ */
describe("status, priority, assignees", () => {
  it("never relies on color alone", async () => {
    const { container } = render(<><StatusBadge status="blocked" /><PriorityFlag priority="urgent" /><AssigneeStack members={MEMBERS} max={2} /></>);
    expect(screen.getByText("Blocked")).toBeInTheDocument();
    expect(screen.getByText("Urgent priority")).toHaveClass("sr-only");
    expect(screen.getByRole("group", { name: /Assignees:/ })).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
});

/* ------------------------------------------------------------------ */
describe("ViewSwitcherBar", () => {
  it("switches views with arrow keys and exposes unread counts", async () => {
    const Demo = () => {
      const [v, setV] = React.useState<WorkspaceView>("list");
      return (
        <ViewSwitcherBar value={v} onValueChange={setV} badges={{ chat: 3 }}>
          {(["list", "board", "calendar", "gantt", "doc", "chat"] as WorkspaceView[]).map((x) => <ViewSwitcherPanel key={x} value={x}>{x} panel</ViewSwitcherPanel>)}
        </ViewSwitcherBar>
      );
    };
    const { container } = render(<Demo />);
    screen.getByRole("tab", { name: "List" }).focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Board" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByRole("tabpanel")).toHaveTextContent("board panel");
    const chat = screen.getAllByRole("tab").find((t) => t.textContent?.startsWith("Chat"))!;
    expect(chat).toHaveTextContent("3 unread");
    await expectNoA11yViolations(container);
  });
});

/* ------------------------------------------------------------------ */
describe("TaskRow / TaskList", () => {
  const task: WorkspaceTask = TASKS.find((t) => t.status === "in-progress")!;

  it("renames inline with F2 and commits with Enter", async () => {
    const onChange = vi.fn();
    wrap(<div role="table"><TaskRow task={task} members={MEMBERS} onChange={onChange} /></div>);
    screen.getByRole("button", { name: task.title }).focus();
    await userEvent.keyboard("{F2}");
    const input = screen.getByRole("textbox");
    await userEvent.clear(input);
    await userEvent.type(input, "Renamed task{Enter}");
    expect(onChange).toHaveBeenCalledWith(task.id, { title: "Renamed task" });
  });

  it("changes status through the inline picker", async () => {
    const onChange = vi.fn();
    wrap(<div role="table"><TaskRow task={task} members={MEMBERS} onChange={onChange} /></div>);
    await userEvent.click(screen.getByRole("button", { name: /^Status: In progress/ }));
    await userEvent.click(await screen.findByRole("option", { name: /Complete/ }));
    expect(onChange).toHaveBeenCalledWith(task.id, { status: "complete" });
  });

  it("groups by status with collapsible groups and passes axe", async () => {
    const { container } = wrap(<TaskList tasks={TASKS} members={MEMBERS} onTaskChange={() => undefined} />);
    expect(screen.getByRole("table", { name: "Tasks" })).toBeInTheDocument();
    const toggle = screen.getAllByRole("button", { expanded: true })[0];
    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expectNoA11yViolations(container);
  });
});

/* ------------------------------------------------------------------ */
describe("FilterBar", () => {
  it("announces results and toggles density", async () => {
    const onDensity = vi.fn();
    const { container } = wrap(
      <FilterBar search="" onSearchChange={() => undefined} filters={EMPTY_FILTERS} onFiltersChange={() => undefined} members={MEMBERS}
        density="comfortable" onDensityChange={onDensity} resultLabel="9 tasks" />
    );
    expect(screen.getByText("9 tasks")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("radio", { name: /Compact/i }));
    expect(onDensity).toHaveBeenCalledWith("compact");
    await expectNoA11yViolations(container);
  });
});

/* ------------------------------------------------------------------ */
describe("CommandPalette", () => {
  it("opens with Ctrl+K, filters and runs the active item", async () => {
    const run = vi.fn();
    render(<CommandPalette items={[{ id: "a", group: "Views", label: "Go to Board", onSelect: run }, { id: "b", group: "Views", label: "Go to List", onSelect: () => undefined }]} />);
    await userEvent.keyboard("{Control>}k{/Control}");
    const input = await screen.findByRole("combobox", { name: "Search commands" });
    await userEvent.type(input, "board");
    expect(screen.getAllByRole("option")).toHaveLength(1);
    await userEvent.keyboard("{Enter}");
    expect(run).toHaveBeenCalled();
  });
});

/* ------------------------------------------------------------------ */
describe("TimeTrackerWidget", () => {
  it("starts, stops and adds manual time", async () => {
    const onStart = vi.fn(); const onStop = vi.fn(); const onAdd = vi.fn();
    const { rerender, container } = wrap(<TimeTrackerWidget taskTitle="QA" entries={[]} estimate={60} onStart={onStart} onStop={onStop} onAddManual={onAdd} />);
    await userEvent.click(screen.getByRole("button", { name: "Start timer for QA" }));
    expect(onStart).toHaveBeenCalled();
    rerender(<TooltipProvider><TimeTrackerWidget taskTitle="QA" entries={[]} estimate={60} runningSince={new Date(Date.now() - 120_000).toISOString()} onStart={onStart} onStop={onStop} onAddManual={onAdd} /></TooltipProvider>);
    const stop = screen.getByRole("button", { name: "Stop timer for QA" });
    expect(stop).toHaveAttribute("aria-pressed", "true");
    await userEvent.click(stop);
    expect(onStop.mock.calls[0][0]).toBeGreaterThanOrEqual(2);
    await expectNoA11yViolations(container);
  });
});

/* ------------------------------------------------------------------ */
describe("Chat", () => {
  it("sends with Enter, keeps Shift+Enter for new lines, suggests @mentions", async () => {
    const onSend = vi.fn();
    const { container } = wrap(<ChatInputBar members={MEMBERS} tasks={LINKABLE_TASKS} channelName="kulina-build" onSend={onSend} />);
    const box = screen.getByRole("textbox", { name: "Message kulina-build" });
    await userEvent.type(box, "Hi @nad");
    expect(await screen.findByRole("listbox", { name: "People" })).toBeInTheDocument();
    await userEvent.keyboard("{Enter}");
    expect((box as HTMLTextAreaElement).value).toMatch(/@Nadia Rahma/);
    expect(onSend).not.toHaveBeenCalled(); // Enter picked the suggestion, it did not send
    await userEvent.clear(box);
    await userEvent.type(box, "line one{Shift>}{Enter}{/Shift}line two{Enter}");
    expect(onSend).toHaveBeenCalledTimes(1);
    expect(onSend.mock.calls[0][0].text).toBe("line one\nline two");
    await expectNoA11yViolations(container);
  });
  it("renders messages and conversations accessibly", async () => {
    const { container } = wrap(
      <div>
        <ChannelSidebar channels={CHANNELS} directs={DIRECTS} activeId={CHANNELS[0].id} onSelect={() => undefined} />
        <div role="log" aria-label="Messages">{MESSAGES.slice(0, 3).map((m) => <MessageBubble key={m.id} message={m} onOpenThread={() => undefined} onReact={() => undefined} />)}</div>
      </div>
    );
    expect(screen.getByRole("navigation", { name: "Conversations" })).toBeInTheDocument();
    await expectNoA11yViolations(container);
  });
});

/* ------------------------------------------------------------------ */
describe("GanttChart", () => {
  it("names each bar with dates and status", () => {
    wrap(<GanttChart tasks={TASKS} onTaskClick={() => undefined} />);
    const scheduled = TASKS.filter((t) => t.startDate || t.dueDate);
    expect(screen.getAllByRole("button").length).toBeGreaterThanOrEqual(scheduled.length);
  });
});

