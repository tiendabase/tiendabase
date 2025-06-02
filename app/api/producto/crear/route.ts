// app/api/tu-endpoint/route.ts
import { Producto, Variante } from "@prisma/client";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export const POST = async (request: NextRequest) => {
  try {
    // 1. Parsear el JSON del body
    const data = await request.json() as Producto & { variantes: Variante[] }
    const { variantes, ...datos } = data;

    // 2. Validar o procesar los datos
    // (aquí podrías hacer lógica como guardar en DB, etc.)
    const producto = await prisma?.producto.create({
      data: {
        ...datos, variantes: {
          createMany: { data: variantes.map(value => ({ ...value, precio: +value.precio })) }
        }
      },

    })
    // 3. Retornar éxito
    return Response.json({
      success: true,
      id: producto?.id,
      message: "Datos recibidos correctamente",
    }, { status: 200 });

  } catch (error: any) {
    // 4. Manejo de errores
    console.error("Error en el POST:", error);
    return Response.json({
      success: false,
      error: error?.message ?? "Error interno del servidor",
      message: "No se pudieron procesar los datos",
    }, { status: 500 });
  }
};
