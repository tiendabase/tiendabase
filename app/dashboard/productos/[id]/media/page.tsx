import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Client from "./client";

interface PageProps {
    params: {
        id?: string;
    };
}

export default async function Page({ params }: PageProps) {
    const p = await params;
    const id = p.id;

    // Validar que el id exista y sea un string válido
    if (!id || typeof id !== "string") return notFound();

    try {
        const producto = await prisma.producto.findUnique({
            where: { id },
            include: {
                imagenes: {
                    orderBy: {
                        orden: "asc"
                    }
                }
            },
        });

        if (!producto) return notFound();

        return <Client Producto={producto} />;
    } catch (error) {
        console.error("Error al obtener la publicación:", error);
        return notFound();
    }
}
