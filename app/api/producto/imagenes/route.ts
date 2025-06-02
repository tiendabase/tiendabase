// app/api/tu-endpoint/route.ts
import { supabase } from "@/lib/supabase";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const POST = async (request: NextRequest) => {
    try {
        const form = await request.formData();
        const files = form.getAll("imagenes") as File[];
        const productoId = form.get("productoId")?.toString();
        const imagenesData = await Promise.all(
            files.map(async (file, index) => {
                if (!(file instanceof Blob)) {
                    throw new Error("Archivo inválido o corrupto.");
                }
                const path = `productos/${productoId}/${Date.now()}_${file.name}`;
                const { error } = await supabase.storage.from("tienda").upload(path, file, {
                    cacheControl: "3600",
                    upsert: false,
                });
                if (error) {
                    throw new Error(`Error subiendo ${file.name}: ${error.message}`);
                }

                const { data: urlData } = supabase.storage.from("tienda").getPublicUrl(path);
                if (!urlData?.publicUrl) throw new Error("No se pudo obtener URL pública");

                return {
                    url: urlData.publicUrl,
                    orden: index,
                    productoId: productoId!,
                };
            })
        );
        // Guardar en la base de datos con Prisma
        await prisma?.imagen.createMany({
            data: imagenesData,
        });

        return Response.json({ success: true, message: "Imágenes recibidas" });
    } catch (error) {
        console.error(error);
        return Response.json({ success: false, message: "Error subiendo imágenes" }, { status: 500 });
    }
};
