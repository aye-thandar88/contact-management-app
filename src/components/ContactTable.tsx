import React, { useMemo } from "react";
import {
  type ColumnDef,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  type RowData,
  getFilteredRowModel,
  type Column,
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useGetContactsQuery } from "../api/contactApi";
import type { Contact } from "../types/contact";
import Button from "./Button";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    filterVariant?: "text" | "select";
  }
}

type Props = {
  onEdit: (c: Contact) => void;
  onView: (id?: number) => void;
  onDelete: (id?: number) => void;
};

export default function ContactTable({ onEdit, onView, onDelete }: Props) {
  const { data: contacts, isLoading, isError, error } = useGetContactsQuery();

  const columns = useMemo<ColumnDef<Contact>[]>(
    () => [
      {
        accessorKey: "firstName",
        header: () => "First Name",
        sortingFn: "alphanumeric",
      },
      {
        accessorKey: "lastName",
        header: () => "Last Name",
        sortingFn: "alphanumeric",
      },
      {
        accessorKey: "email",
        header: () => "Email",
        sortingFn: "alphanumeric",
      },
      {
        accessorKey: "role",
        header: () => "Role",
        sortingFn: "alphanumeric",
        meta: {
          filterVariant: "select",
        },
      },
      {
        id: "actions",
        header: () => "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Button onClick={() => onView(row.original.id)}>View</Button>
            <Button onClick={() => onEdit(row.original)} variant="secondary">
              Edit
            </Button>
            <Button onClick={() => onDelete(row.original.id)} variant="danger">
              Delete
            </Button>
          </div>
        ),
      },
    ],
    [onEdit, onView, onDelete]
  );

  const table = useReactTable({
    data: contacts ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (isLoading) {
    return (
      <div className="p-4 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4  text-red-600 text-center">
        Server Error:{" "}
        {error && "status" in error ? `${error.status}` : "Unknown error"}
      </div>
    );
  }

  return (
    <div className="p-4 overflow-x-auto">
      <table className="min-w-full border border-gray-500 rounded-lg overflow-hidden shadow-sm">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((hg) => {
            return (
              <tr key={hg.id}>
                {hg.headers.map((h, i) => (
                  <th key={h.id} colSpan={h.colSpan} className="text-left p-2">
                    {h.isPlaceholder ? null : (
                      <>
                        <div
                          className={`flex items-center gap-1 ${
                            h.column.getCanSort()
                              ? "cursor-pointer select-none hover:text-blue-600"
                              : ""
                          }`}
                          onClick={h.column.getToggleSortingHandler()}
                          title={
                            h.column.getCanSort()
                              ? h.column.getNextSortingOrder() === "asc"
                                ? "Sort ascending"
                                : h.column.getNextSortingOrder() === "desc"
                                ? "Sort descending"
                                : "Clear sort"
                              : undefined
                          }
                        >
                          {flexRender(
                            h.column.columnDef.header,
                            h.getContext()
                          )}
                          {i !== hg.headers.length - 1 &&
                            ({
                              asc: " 🔼",
                              desc: " 🔽",
                            }[h.column.getIsSorted() as string] ?? (
                              <span className="text-gray-400">⬍</span>
                            ))}
                        </div>
                        {h.column.getCanFilter() ? (
                          <div className="mt-2">
                            <Filter column={h.column} />
                          </div>
                        ) : null}
                      </>
                    )}
                  </th>
                ))}
              </tr>
            );
          })}
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {table.getRowModel().rows.map((row) => {
            return (
              <tr
                key={row.id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td
                      key={cell.id}
                      className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="h-2" />
      {table.getRowModel().rows.length > 0 ? (
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <button
              className="border rounded p-1"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {"<<"}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {"<"}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {">"}
            </button>
            <button
              className="border rounded p-1"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              {">>"}
            </button>
            <span className="flex items-center gap-1">
              <div>Page</div>
              <strong>
                {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </strong>
            </span>
            <span className="flex items-center gap-1">
              | Go to page:
              <input
                type="number"
                min="1"
                max={table.getPageCount()}
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
                className="border p-1 rounded w-16"
              />
            </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
              }}
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
          <span className="flex items-center gap-1">
            <strong>{table.getPrePaginationRowModel().rows.length}</strong>
            <div>
              {table.getPrePaginationRowModel().rows.length > 1
                ? "Rows"
                : "Row"}
            </div>
          </span>
        </div>
      ) : (
        <div className="flex justify-center">No Data</div>
      )}
    </div>
  );
}

function Filter({ column }: { column: Column<any, unknown> }) {
  const columnFilterValue = column.getFilterValue();
  const { filterVariant } = column.columnDef.meta ?? {};

  return filterVariant === "select" ? (
    <select
      onChange={(e) => column.setFilterValue(e.target.value)}
      value={columnFilterValue?.toString()}
    >
      <option value="">All</option>
      <option value="Admin">Admin</option>
      <option value="User">User</option>
      <option value="Viewer">Viewer</option>
    </select>
  ) : (
    <DebouncedInput
      className="w-full px-2 border shadow rounded"
      onChange={(value) => column.setFilterValue(value)}
      placeholder={`Search...`}
      type="text"
      value={(columnFilterValue ?? "") as string}
    />
  );
}

function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = React.useState(initialValue);

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
