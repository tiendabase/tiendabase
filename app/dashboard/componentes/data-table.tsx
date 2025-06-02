"use client"

import * as React from "react"
import Image from "next/image"
import {
    ColumnDef,
    ColumnFiltersState,
    Row,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import {
    CheckCircle2Icon,
    CheckCircleIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronsLeftIcon,
    ChevronsRightIcon,
    ColumnsIcon,
    Ellipsis,
    GripVerticalIcon,
    LoaderIcon,
    MoreVerticalIcon,
    PlusIcon,
    TrendingUpIcon,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Tabs,
    TabsContent
} from "@/components/ui/tabs"
import { useRouter } from "next/navigation"
import { Imagen, Producto, Variante } from "@prisma/client"

const columns: ColumnDef<Producto & { imagenes: Imagen[], variantes: Variante[] }>[] = [

    {
        accessorKey: "id",
        header: "Producto",
        cell: ({ row }) => (
            <div className="flex items-center gap-2">
                <div className="h-9 w-7 rounded overflow-hidden relative">
                    <Image layout="fill"
                        objectFit="cover"
                        src={row.original.imagenes.at(0)?.url!}
                        alt="Imagen producto" />
                </div>
                <span>
                    {row.original.titulo}
                </span>
            </div>
        )
    },
    {
        accessorKey: "variantes",
        header: "Variantes",
        cell: ({ row }) => (
            <div className="w-32">
                {row.original.variantes.length} variantes
            </div>
        ),
    },
    {
        accessorKey: "estado",
        header: "Estado",
        cell: ({ row }) => (
            <Badge
                variant="outline"
                className="flex gap-1 px-1.5 text-muted-foreground [&_svg]:size-3"
            >
                {row.original.estado ? (
                    <CheckCircle2Icon className="text-green-500 dark:text-green-400" />
                ) : (
                    <LoaderIcon />
                )}
                {row.original.estado ? "Activo" : "Inactivo"}
            </Badge>
        ),
    },



    {
        id: "actions",
        cell: () => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                    >
                        <Ellipsis className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Make a copy</DropdownMenuItem>
                    <DropdownMenuItem>Favorite</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
]


export function DataTable({
    data: initialData,
}: {
    data: (Producto & { imagenes: Imagen[], variantes: Variante[] })[]
}) {
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const router = useRouter();


    const table = useReactTable({
        data: initialData,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            pagination,
        },
        getRowId: (row) => row.id.toString(),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    })


    return (
        <div>

            <Table >
                <TableHeader className="sticky border-none top-0 z-10 ">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow className="border-none " key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead className="border-none bg-secondary p-4" key={header.id} colSpan={header.colSpan}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                )
                            })}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody >
                    {table.getRowModel().rows?.length ? (


                        table.getRowModel().rows.map((row) => (
                            <TableRow
                                onClick={() => router.push(`/dashboard/productos/${row.id}`)}
                                className="border-none"
                                key={row.original.id}
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell className="border-none px-4 py-2 " key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))

                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                className="h-24 text-center border-none"
                            >
                                Sin resultados
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <div className="flex items-center justify-between p-4 border-t">

                <div className="flex w-full items-center gap-8 lg:w-fit">
                    <div className=" items-center gap-2 flex">
                        <Label htmlFor="rows-per-page" className="text-sm font-medium">
                            Filas por página
                        </Label>
                        <Select
                            value={`${table.getState().pagination.pageSize}`}
                            onValueChange={(value) => {
                                table.setPageSize(Number(value))
                            }}
                        >
                            <SelectTrigger className="w-20" id="rows-per-page">
                                <SelectValue
                                    placeholder={table.getState().pagination.pageSize}
                                />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[10, 20, 30, 40, 50].map((pageSize) => (
                                    <SelectItem key={pageSize} value={`${pageSize}`}>
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex items-center justify-center text-sm font-medium">
                        Página {table.getState().pagination.pageIndex + 1} de{" "}
                        {table.getPageCount()}
                    </div>
                    <div className="ml-auto flex items-center gap-2 lg:ml-0">
                        <Button
                            variant="outline"
                            className="hidden h-8 w-8 p-0 lg:flex"
                            onClick={() => table.setPageIndex(0)}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <span className="sr-only">Go to first page</span>
                            <ChevronsLeftIcon />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            <ChevronLeftIcon className="size-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronRightIcon className="size-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                            disabled={!table.getCanNextPage()}
                        >
                            <ChevronsRightIcon className="size-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
