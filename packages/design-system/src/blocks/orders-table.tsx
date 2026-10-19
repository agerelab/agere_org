"use client";

import * as React from "react";
import {
  flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable,
  type ColumnDef, type ColumnFiltersState, type RowSelectionState, type SortingState, type VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, Columns3, Download, MoreHorizontal } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SearchInput } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { orders, usd, type Order } from "./data";
import { STATUS_BADGE } from "./widgets";

const columns: ColumnDef<Order>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? "indeterminate" : false}
        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        aria-label="Select all rows on this page"
      />
    ),
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(v) => row.toggleSelected(!!v)} aria-label={`Select ${row.original.id}`} />,
    enableSorting: false,
    enableHiding: false,
  },
  { accessorKey: "id", header: "Invoice", cell: ({ row }) => <span className="font-medium">{row.original.id}</span> },
  {
    accessorKey: "customer",
    header: ({ column }) => (
      <Button variant="ghost" size="sm" className="-ml-3 h-8" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} aria-label={`Sort by customer${column.getIsSorted() ? ` (${column.getIsSorted() === "asc" ? "ascending" : "descending"})` : ""}`}>
        Customer <ArrowUpDown aria-hidden />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="grid">
        <span className="font-medium">{row.original.customer}</span>
        <span className="text-xs text-muted-foreground">{row.original.email}</span>
      </div>
    ),
  },
  { accessorKey: "plan", header: "Plan", cell: ({ row }) => <Badge variant="outline">{row.original.plan}</Badge> },
  {
    accessorKey: "status",
    header: "Status",
    filterFn: (row, id, value: string) => value === "all" || row.getValue(id) === value,
    cell: ({ row }) => {
      const s = STATUS_BADGE[row.original.status];
      return <Badge variant={s.variant} dot>{s.label}</Badge>;
    },
  },
  { accessorKey: "date", header: "Date", cell: ({ row }) => new Date(row.original.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <div className="text-right">
        <Button variant="ghost" size="sm" className="-mr-3 h-8" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} aria-label="Sort by amount">
          Amount <ArrowUpDown aria-hidden />
        </Button>
      </div>
    ),
    cell: ({ row }) => <div className="text-right font-medium tabular-nums">{usd(row.original.amount, 2)}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8 data-[state=open]:bg-muted" aria-label={`Actions for ${row.original.id}`}>
            <MoreHorizontal aria-hidden />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onSelect={() => navigator.clipboard?.writeText(row.original.id).catch(() => undefined)}>Copy invoice ID</DropdownMenuItem>
          <DropdownMenuItem>View customer</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem destructive>Refund</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

/**
 * Block · Orders datatable (shadcnstudio "Datatable" / shadcn data-table guide).
 * Search · status filter · column visibility · sortable headers · row selection · pagination.
 * Built from the <Table> primitives + TanStack; for workspace-grade tables use <DataTable>.
 */
export function OrdersTable({ data = orders }: { data?: Order[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([{ id: "date", desc: true }]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters, columnVisibility, rowSelection, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: (row, _id, value: string) => `${row.original.customer} ${row.original.email} ${row.original.id}`.toLowerCase().includes(value.toLowerCase()),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 8 } },
  });

  const status = (table.getColumn("status")?.getFilterValue() as string) ?? "all";
  const selected = table.getFilteredSelectedRowModel().rows.length;
  const filtered = table.getFilteredRowModel().rows.length;

  return (
    <Card className="gap-0 py-0">
      <div className="flex flex-wrap items-center gap-2 border-b border-border p-4">
        <div className="w-full sm:max-w-xs">
        <SearchInput
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          onClear={() => setGlobalFilter("")}
          placeholder="Search customers or invoices…"
          aria-label="Search orders"
          className="h-8"
        />
        </div>
        <Select value={status} onValueChange={(v) => table.getColumn("status")?.setFilterValue(v === "all" ? undefined : v)}>
          <SelectTrigger size="md" className="h-8 w-36" aria-label="Filter by status"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm"><Columns3 aria-hidden /> Columns <ChevronDown aria-hidden /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table.getAllColumns().filter((c) => c.getCanHide()).map((c) => (
                <DropdownMenuCheckboxItem key={c.id} className="capitalize" checked={c.getIsVisible()} onCheckedChange={(v) => c.toggleVisibility(!!v)} onSelect={(e) => e.preventDefault()}>
                  {c.id}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm"><Download aria-hidden /> Export</Button>
        </div>
      </div>

      <Table aria-label="Orders" aria-rowcount={filtered}>
        <TableHeader className="bg-muted/50">
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id} className="hover:bg-transparent">
              {hg.headers.map((h) => (
                <TableHead
                  key={h.id}
                  className="first:pl-4 last:pr-4"
                  aria-sort={h.column.getIsSorted() ? (h.column.getIsSorted() === "asc" ? "ascending" : "descending") : undefined}
                >
                  {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="first:pl-4 last:pr-4">{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">No orders match your filters.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 text-sm">
        <p className="text-muted-foreground" aria-live="polite">{selected} of {filtered} row(s) selected.</p>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground tabular-nums">Page {table.getState().pagination.pageIndex + 1} of {Math.max(1, table.getPageCount())}</span>
          <Button variant="outline" size="icon" className="size-8" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} aria-label="Previous page">
            <ChevronLeft aria-hidden />
          </Button>
          <Button variant="outline" size="icon" className="size-8" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} aria-label="Next page">
            <ChevronRight aria-hidden />
          </Button>
        </div>
      </div>
    </Card>
  );
}
