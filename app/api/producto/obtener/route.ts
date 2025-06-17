import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const secret = process.env.NEXTAUTH_SECRET;

export const POST = async (req: NextRequest) => {
  try {
    const token = await getToken({ req, secret });

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const id = body?.id;

    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const producto = await prisma.producto.findUnique({
      where: { id },
      include: {
        imagenes: true
      }
    });

    if (!producto) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(producto);
  } catch (error) {
    console.error("Error en el endpoint /api/.../POST:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
