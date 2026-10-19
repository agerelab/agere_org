import type { Meta, StoryObj } from "@storybook/react-vite";


import { byId } from "@/docs/registry";

/**
 * Every documented component, rendered from the same registry that powers the docs portal —
 * so Chromatic snapshots exactly what the documentation shows (light + dark).
 */
function RegistryDemo({ id, states }: { id: string; states?: boolean }) {
  const doc = byId(id)!;
  const C = (states ? doc.states : doc.demo) ?? doc.demo;
  return <div className="flex min-w-[320px] max-w-[1100px] flex-wrap items-center gap-3"><C /></div>;
}

const meta = { title: "Catalog", component: RegistryDemo, parameters: { layout: "padded" } } satisfies Meta<typeof RegistryDemo>;
export default meta;
type Story = StoryObj<typeof meta>;
const s = (id: string, states = false): Story => ({ args: { id, states }, name: byId(id)?.name + (states ? " — states" : "") });

export const Button = s("button");
export const ButtonStates = s("button", true);
export const ButtonGroup = s("button-group");
export const ButtonGroupStates = s("button-group", true);
export const Input = s("input");
export const InputStates = s("input", true);
export const Select = s("select");
export const Checkbox = s("checkbox");
export const Radio = s("radio");
export const Switch = s("switch");
export const Slider = s("slider");
export const FormLayout = s("form");
export const Badge = s("badge");
export const Avatar = s("avatar");
export const Spinner = s("spinner");
export const Iconography = s("icon");
export const Card = s("card");
export const AppCard = s("app-card");
export const Navbar = s("navbar");
export const Sidebar = s("sidebar");
export const Breadcrumb = s("breadcrumb");
export const Pagination = s("pagination");
export const Tabs = s("tabs");
export const SegmentedControl = s("segmented-control");
export const Stepper = s("stepper");
export const StepperVertical = s("stepper", true);
export const DropdownMenu = s("dropdown-menu");
export const Alert = s("alert");
export const Banner = s("alert", true);
export const Toast = s("toast");
export const Dialog = s("dialog");
export const TooltipPopover = s("tooltip-popover");
export const Skeleton = s("skeleton");
export const EmptyState = s("empty-state");
export const FileUploader = s("file-uploader");
export const DataTable = s("data-table");
export const DatabaseViews = { ...s("database-views"), parameters: { chromatic: { delay: 400 } } } satisfies Story;
export const FileExplorer = s("file-explorer");

/* ---- Workspace (ClickUp-class) ---- */
export const WorkspaceFields = s("task-fields");
export const WorkspaceFieldPickers = s("task-fields", true);
export const CommandPaletteAndSheet = s("command-palette");
export const ViewSwitcherBar = s("view-switcher-bar");
export const FilterBar = s("filter-bar");
export const TaskList = s("task-list");
export const KanbanCardWorkspace = s("kanban-card-clickup");
export const Gantt = s("gantt");
export const CalendarWeek = s("calendar-week");
export const TimeSlotPicker = s("calendar-week", true);
export const Chat = s("chat");
export const TimeTracker = s("time-tracker");
export const Finance = s("finance");
export const Docs = s("docs");
