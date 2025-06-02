import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
const GET = async (request: NextRequest) => {
    const productos = await prisma.producto.findMany({
        include: {
            variantes: {
                orderBy: { id: "asc" }
            },
            imagenes: {orderBy:{orden:"desc"}}
        }
    });
    return Response.json(productos);
}

export { GET };