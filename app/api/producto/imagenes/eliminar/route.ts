import { supabase } from "@/lib/supabase";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { Imagen } from "@prisma/client";

export const POST = async (request: NextRequest) => {
    try {
        const { imagenes } = await request.json() as { imagenes: Imagen[] };
        console.log(imagenes)
        await supabase.storage.from("tienda").remove(imagenes.map((img) => img.url));
        await prisma.imagen.deleteMany({
            where: {
                url: {
                    in: imagenes.map((img) => img.url),
                },
            },
        });

        return Response.json({ success: true, message: "Imágenes eliminadas correctamente" });
    } catch (error) {
        console.error(error);
        return Response.json({ success: false, message: "Error eliminando imágenes" }, { status: 500 });
    }
};
