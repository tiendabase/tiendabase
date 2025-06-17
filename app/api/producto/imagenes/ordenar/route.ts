import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { Imagen } from "@prisma/client";

export const POST = async (request: NextRequest) => {
    try {
        const { imagenes, publicacionId } = await request.json() as { imagenes: Imagen[], publicacionId: string };

        // Recorre cada imagen y actualiza su orden
        const updates = imagenes.map((img, idx) => {
            return prisma.imagen.update({
                where: { id: img.id },
                data: { orden: idx }
            });
        });

        await Promise.all(updates);

        return Response.json({ success: true, message: "Imágenes ordenadas exitosamente" });
    } catch (error) {
        console.error(error);
        return Response.json({ success: false, message: "Error ordenando imágenes" }, { status: 500 });
    }
};
