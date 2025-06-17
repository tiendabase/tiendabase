import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Client from "../client";

const getProducto = async (id: string) => {
    return await prisma.producto.findUnique({
        where: { id },
        include: {
            imagenes: true,
            variantes: true
        }
    });
}
export default async function Page({ params }: any) {
    // await params antes de acceder a sus propiedades
    const resolvedParams = await params;
    const producto = await getProducto(resolvedParams.id);
    if (!producto) {
        return notFound();
    }
    return <Client Producto={producto} />;
}
