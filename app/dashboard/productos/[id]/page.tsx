"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { Loader } from "lucide-react";
import Client from "./client";
import { Producto } from "@prisma/client";
const Page = () => {
    const { id } = useParams() as { id: string };
    const [producto, setProducto] = useState<Producto | null>(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchProducto = async () => {
            try {
                const res = await fetch("/api/producto/obtener", {
                    method: "POST",
                    body: JSON.stringify({ id }),
                });

                if (!res.ok) {
                    throw new Error("No se pudo obtener la publicación");
                }

                const data = await res.json();
                setProducto(data);
            } catch (err) {
                setProducto(null);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProducto();
    }, [id]);

    if (loading) return <Loader className="animate-spin mx-auto mt-10" />;
    if (!producto) return notFound();

    return <Client Producto={producto as any} />;
}


export default Page;