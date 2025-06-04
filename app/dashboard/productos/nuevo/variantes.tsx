import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { generarVariantes } from "@/lib/utils";
import { Imagen, Producto, Variante } from "@prisma/client";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Control, Controller } from "react-hook-form";

interface Props {
    control: Control<Producto & { imagenes: Imagen[], variantes: Variante[] }>;
    tallas2: string[];
    tallas: string[];
    colores: { nombre: string, codigo: string }[]
}

const getColumns = (
    control: Control<Producto & { imagenes: Imagen[], variantes: Variante[] }>
): ColumnDef<Variante>[] => [
        {
            id: "estado",
            cell: ({ row }) => (
                <Controller
                    defaultValue={row.original.estado}
                    control={control}
                    name={`variantes.${row.index}.estado`}
                    render={({ field }) => (

                        <Checkbox
                            disabled={row.original.tipo == "POR_DEFECTO"}
                            checked={field.value}
                            onCheckedChange={(checked) => field.onChange(checked === true)}
                            aria-label="Cambiar estado"
                        />

                    )}
                />
            )
        },
        {
            accessorKey: "tipo",
            header: () => <div >Opción</div>,
            cell: ({ row }) => (
                <Controller defaultValue={row.original.tipo}
                    name={`variantes.${row.index}.tipo`} control={control} render={({ field }) => (
                        <div className={`${row.original.tipo == "POR_DEFECTO" ? "text-primary font-bold" : ""}`}>
                            <p className={`text-sm`}>
                                {field.value == "POR_DEFECTO" ? "Por defecto" : "Variante"}
                            </p>
                        </div>
                    )} />
            )

        },
        {
            accessorKey: "titulo",
            header: "Título",
            cell: ({ row }) => (
                <Controller
                    defaultValue={row.original.titulo}
                    control={control}
                    name={`variantes.${row.index}.titulo`}
                    render={({ field }) => (
                        <Input

                            className=" rounded-none !bg-transparent  hover:!bg-transparent focus-visible:ring-0 px-0  border-none !shadow-none !inset-shadow-none"
                            value={field.value}
                            onChange={field.onChange}
                            id={`variante-${row.index}-titulo`}
                        />
                    )}
                />
            ),
            enableHiding: false,
        },
        {
            accessorKey: "talla",
            header: "Talla",
            cell: ({ row }) => (<Controller
                defaultValue={row.original.titulo}
                control={control}
                name={`variantes.${row.index}.talla`}
                render={({ field }) => (
                    <div>{field.value || "-"}</div>
                )}
            />)
        },
        {
            accessorKey: "codigoHexColor",
            header: "Color",
            cell: ({ row }) => (<Controller
                defaultValue={row.original.titulo}
                control={control}
                name={`variantes.${row.index}.codigoHexColor`}
                render={({ field }) => (
                    <div>
                        {row.original.codigoHexColor ? <Card className="h-7 w-7 mx-auto rounded-sm py-0 border-none" style={{ background: `${field.value}` }} /> : "-"}
                    </div>
                )}
            />)
        },
        {
            accessorKey: "precio",
            header: "Precio",
            cell: ({ row }) => (
                <Controller
                    defaultValue={row.original.precio}
                    control={control}
                    name={`variantes.${row.index}.precio`}
                    render={({ field }) => (
                        <Input
                            className="rounded-none !bg-transparent  hover:!bg-transparent focus-visible:ring-0 px-0  border-none !shadow-none !inset-shadow-none"
                            {...field}
                            inputMode="numeric"
                            id={`variante-${row.index}-titulo`}
                        />
                    )}
                />
            ),
            enableHiding: false,
        },


    ];
export default function Variantes({ control,
    colores, tallas, tallas2
}: Props) {
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [rowSelection, setRowSelection] = useState({});
    const variantesGeneradas = useMemo(() => {
        return [{
            codigoHexColor: "",
            estado: true,
            id: "",
            precio: 0,
            productoId: "",
            talla: "",
            tipo: "POR_DEFECTO",
            titulo: "Por defecto"
        }, ...generarVariantes({ tallas, tallas2, colores })];
    }, [tallas, tallas2, colores]);
    const table = useReactTable({
        data: variantesGeneradas,
        columns: getColumns(control) as Variante[],
        state: {
            pagination
        },
        getRowId: (row) => row.id ? row.id.toString() : row.tipo === "POR_DEFECTO" ? "default" : Math.random().toString(),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel()
    })

    return (
        <>
            <Table className="" >
                <TableHeader className="sticky top-0 z-10 ">
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <TableHead key={header.id} colSpan={header.colSpan}>
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
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        <>
                            {table.getRowModel().rows.map((row, index) => (
                                <TableRow key={index}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </>
                    ) : (
                        <TableRow>
                            <TableCell
                                colSpan={getColumns(control).length}
                                className="h-24 text-center"
                            >
                                Sin variantes
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    )
}