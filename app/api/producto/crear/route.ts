// app/api/tu-endpoint/route.ts
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { FormularioNuevoProducto } from "@/lib/utils"; // o donde tengas el tipo

export const POST = async (request: NextRequest) => {
  try {
    const data = await request.json() as FormularioNuevoProducto;

    const { variantes, descuento, tieneVariantes, colores, tallas, tallas2, ...productoDatos } = data;


    // Transformar variantes
    const variantesPreparadas = variantes.map((v) => ({
      titulo: v.titulo,
      precio: parseFloat(v.precio),
      estado: v.estado,
      tipo: v.tipo,
      codigoHexColor: v.codigoHexColor,
      talla: v.talla,
    }));

    const nuevoProducto = await prisma.producto.create({
      data: {
        ...productoDatos,
        descuento: parseFloat(descuento || "0"),
        variantes: {
          createMany: {
            data: variantesPreparadas,
          },
        },
      },
    });

    return Response.json({
      success: true,
      id: nuevoProducto.id,
      message: "Producto guardado correctamente",
    }, { status: 200 });

  } catch (error: any) {
    console.error("Error al guardar producto:", error);
    return Response.json({
      success: false,
      message: "Error al guardar producto",
      error: error?.message ?? "Error interno del servidor",
    }, { status: 500 });
  }
};
