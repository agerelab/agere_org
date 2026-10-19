import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Trash2 } from "lucide-react";

import {
  DataTable, DataTableColumnHeader, DataTableContent, DataTableFacetedFilter, DataTablePagination, DataTableSearch, DataTableToolbar, createSelectColumn,
} from "@/components/agere-ds/data-table";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button, IconButton } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";

type Status = "accepted" | "pending" | "cancelled" | "rescheduled";
interface Booking { id: string; attendee: string; email: string; event: string; date: string; status: Status; amount: number }

const NAMES = ["Nadia Rahma", "Galih Santoso", "Sekar Ayu", "Rizky Hakim", "Dewi Lestari", "Putra Wijaya", "Intan Permata", "Bayu Saputra", "Ayu Kartika", "Fajar Nugroho", "Laras Wening", "Arief Budiman"];
const EVENTS = ["Discovery call", "30 min meeting", "Product demo", "Investor sync", "User interview"];
const STATUSES: Status[] = ["accepted", "pending", "accepted", "cancelled", "rescheduled", "accepted"];
const META: Record<Status, { label: string; variant: "success" | "attention" | "error" | "info" }> = {
  accepted: { label: "Accepted", variant: "success" }, pending: { label: "Pending", variant: "attention" },
  cancelled: { label: "Cancelled", variant: "error" }, rescheduled: { label: "Rescheduled", variant: "info" },
};

export const BOOKINGS: Booking[] = Array.from({ length: 23 }, (_, i) => ({
  id: `b${i + 1}`,
  attendee: NAMES[i % NAMES.length],
  email: `${NAMES[i % NAMES.length].split(" ")[0].toLowerCase()}@contoh.id`,
  event: EVENTS[i % EVENTS.length],
  date: new Date(2026, 8, 1 + ((i * 3) % 28), 9 + (i % 8)).toISOString(),
  status: STATUSES[i % STATUSES.length],
  amount: [0, 150_000, 250_000, 0, 500_000][i % 5],
}));

const fmtDate = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
const fmtIDR = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });

const columns: ColumnDef<Booking, any>[] = [
  createSelectColumn<Booking>(),
  {
    accessorKey: "attendee", size: 240, meta: { label: "Attendee" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Attendee" />,
    cell: ({ row }) => (
      <span className="flex min-w-0 items-center gap-2.5">
        <Avatar name={row.original.attendee} size="sm" />
        <span className="grid min-w-0"><span className="truncate font-medium text-emphasis">{row.original.attendee}</span><span className="truncate text-xs text-subtle">{row.original.email}</span></span>
      </span>
    ),
  },
  { accessorKey: "event", size: 170, meta: { label: "Event" }, header: ({ column }) => <DataTableColumnHeader column={column} title="Event" /> },
  {
    accessorKey: "date", size: 160, meta: { label: "Date" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    cell: ({ getValue }) => <span className="tabular-nums">{fmtDate.format(new Date(getValue()))}</span>,
  },
  {
    accessorKey: "status", size: 140, filterFn: "arrIncludesSome", meta: { label: "Status" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ getValue }) => { const m = META[getValue() as Status]; return <Badge variant={m.variant} dot>{m.label}</Badge>; },
  },
  {
    accessorKey: "amount", size: 130, meta: { label: "Amount", align: "right" },
    header: ({ column }) => <DataTableColumnHeader column={column} title="Amount" className="ml-auto" />,
    cell: ({ getValue }) => (getValue() ? fmtIDR.format(getValue()) : <span className="text-muted">Free</span>),
  },
  {
    id: "actions", size: 56, enableSorting: false, enableResizing: false, meta: { label: "Actions" },
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => <IconButton size="sm" label={`Actions for ${row.original.attendee}`} icon={<MoreHorizontal />} tooltip={false} onClick={(e) => { e.stopPropagation(); toast(`Opened actions for ${row.original.attendee}`); }} />,
  },
];

export function TableDemo() {
  const [data, setData] = React.useState(BOOKINGS);
  return (
    <DataTable columns={columns} data={data} getRowId={(r) => r.id} pagination={{ pageSize: 5 }} className="w-full">
      <DataTableToolbar
        selectionActions={(ids) => (
          <Button variant="destructive-outline" size="sm" leadingIcon={<Trash2 />} onClick={() => { setData((d) => d.filter((b) => !ids.includes(b.id))); toast(`${ids.length} booking${ids.length > 1 ? "s" : ""} deleted`); }}>
            Delete {ids.length}
          </Button>
        )}
      >
        <DataTableSearch placeholder="Search bookings…" />
        <DataTableFacetedFilter columnId="status" title="Status" options={(Object.keys(META) as Status[]).map((s) => ({ value: s, label: META[s].label }))} />
      </DataTableToolbar>
      <DataTableContent caption="Bookings" />
      <DataTablePagination pageSizeOptions={[5, 10, 25]} />
    </DataTable>
  );
}
