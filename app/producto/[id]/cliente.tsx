
"use client";
import { useState } from "react";

// types

import { Imagen, Producto, Variante } from "@prisma/client";
import Breadcrumb from "./components/breadcrumb";
import Gallery from "./components/product-single/gallery";
import Content from "./components/product-single/content";
import useSwr from "swr";
import ProductoItem from "@/app/componentes/producto";
import { Button } from "@/components/ui/button";




const Cliente = ({ producto }: { producto: Producto & { imagenes: Imagen[], variantes: Variante[] } }) => {

    const fetcher = (url: string) => fetch(url).then((res) => res.json());
    const { data } = useSwr<(Producto & { imagenes: Imagen[], variantes: Variante[] })[]>("/api/producto/mostrar", fetcher);

    return (
        <div className="mt-25 mb-10 px-5 sm:px-30 md:px-10 lg:px-25 xl:px-60">

            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-10 lg:gap-20">

                <Gallery imagenes={producto.imagenes} />

                <Content producto={producto} />
            </div>

            <div className="my-10 flex  items-center justify-between">
                <h3 className="text-2xl">
                    Más productos para tí
                </h3>
                <Button className="rounded-full" variant="outline">
                    Mostrar más
                </Button>
            </div>
            {data && (
                <section className="grid grid-cols-2 md:grid-cols-3  gap-3 lg:grid-cols-4">
                    {data.map((item) => (
                        <ProductoItem key={item.id} producto={item} />
                    ))}
                </section>
            )}
        </div>
    );
};

export default Cliente;
