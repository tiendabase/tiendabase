import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
const secret = process.env.NEXTAUTH_SECRET;
const GET = async (req: NextRequest) => {
    const token = await getToken({ req, secret });
    if (token) {
        const productos = await prisma?.producto.findMany({
            include: { imagenes: { orderBy: { id: "asc" } }, variantes: true }
        });
        return Response.json(productos);
    }
    else
        return Response.json({ error: true }, { status: 401 })
}

export { GET };