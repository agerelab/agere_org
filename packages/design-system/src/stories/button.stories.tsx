import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChevronDown, Download, Plus, Trash2 } from "lucide-react";
import { fn } from "storybook/test";

import { Button, ButtonGroup } from "@/components/ui/button";

const meta = {
  title: "Atoms/Button",
  component: Button,
  args: { children: "Save changes", onClick: fn() },
  argTypes: {
    variant: { control: "select", options: ["default", "secondary", "outline", "ghost", "destructive", "destructive-outline", "link"] },
    size: { control: "select", options: ["xs", "sm", "md", "lg"] },
  },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { variant: "default", leadingIcon: <Plus /> } };
export const Secondary: Story = { args: { variant: "secondary", children: "Secondary" } };
export const Outline: Story = { args: { variant: "outline", children: "Cancel" } };
export const Ghost: Story = { args: { variant: "ghost", children: "Edit" } };
export const Destructive: Story = { args: { variant: "destructive", leadingIcon: <Trash2 />, children: "Delete" } };
export const DestructiveOutline: Story = { args: { variant: "destructive-outline", leadingIcon: <Trash2 />, children: "Remove" } };
export const LeadingAndTrailingIcons: Story = { args: { variant: "outline", leadingIcon: <Download />, trailingIcon: <ChevronDown />, children: "Download" } };
export const Group: Story = {
  render: (args) => (
    <ButtonGroup aria-label="Range" variant="outline" size={args.size}>
      <Button>Day</Button><Button>Week</Button><Button>Month</Button>
    </ButtonGroup>
  ),
};
export const Loading: Story = { args: { loading: true, children: "Saving…" } };
export const Disabled: Story = { args: { disabled: true } };
export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-3">
      {(["xs", "sm", "md", "lg"] as const).map((s) => <Button key={s} {...args} size={s}>{s.toUpperCase()}</Button>)}
    </div>
  ),
};
