"use client"
import { Button } from "@/components/ui/button";
import { DataTable } from "../componentes/data-table";
import { useRouter } from "next/navigation";
import { Filter, ListFilter, PlusIcon, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Imagen, Producto, Variante } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function Productos() {
    const [productos, setProductos] = useState<(Producto & { variantes: Variante[], imagenes: Imagen[] })[]>([]);
    useEffect(() => {
        fetch("/api/producto/listar", { method: "GET" }).then(res => {
            return res.json()
        }).then(setProductos)
    }, []);
    const router = useRouter();
    return (
        <Card className="py-0">
            <div className="py-3 px-6 flex items-center justify-between border-b">
                <h3 className="font-bold">
                    Productos
                </h3>
                <div className="flex gap-2">
                    <Button onClick={() => {
                        router.push('/dashboard/productos/nuevo')
                    }} size="sm">
                        <PlusIcon className="size-4" />
                        <span >Añadir producto</span>
                    </Button>
                </div>
            </div>
            <div className="py-3 border-b px-6 flex items-center justify-between">
                <Button variant="outline" size="sm">
                    Añadir filtro
                </Button>
                <div className="flex gap-2">
                    <Input startContent={<Search className="size-4" />} placeholder="Buscar" />
                    <Button size="icon" variant="outline">
                        <ListFilter className="size-4" />
                    </Button>
                </div>
            </div>
            <DataTable data={productos} />
        </Card>
    )
}