// app/api/producto/editar/route.ts

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET!;

export const POST = async (req: NextRequest) => {
    const token = await getToken({ req, secret });
    if (!token?.sub) {
        return NextResponse.json({
            error: "No autorizado"
        }, { status: 401 });
    }

    try {
        const { id, titulo, subtitulo, descripcion, url } = await req.json();

        if (!id || !titulo?.trim()) {
            return NextResponse.json({
                error: "ID y título son obligatorios"
            }, { status: 400 });
        }

        const { id: productoId } = await prisma.producto.update({
            where: {
                id,
            },
            data: {
                titulo: titulo.trim(),
                subtitulo: subtitulo?.trim() || "",
                descripcion: descripcion?.trim() || "",
                url: url?.trim() || "",
            },
            select: { id: true }
        });

        return NextResponse.json({
            message: "Producto actualizada exitosamente",
            id: productoId
        });

    } catch (error: any) {
        console.error("[ERROR - editar publicación]:", error);

        if (error.code === 'P2025') {
            return NextResponse.json({
                error: "Producto no encontrada o sin permisos"
            }, { status: 404 });
        }

        return NextResponse.json({
            error: "Error al actualizar la publicación",
            message: "Error al actualizar la publicación"
        }, { status: 500 });
    }
};