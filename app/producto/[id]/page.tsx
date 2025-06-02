import { notFound } from "next/navigation"
import Cliente from "./cliente";
import Navbar from "@/app/componentes/navbar";
import Footer from "@/app/componentes/footer";
const getProducto = async (id: string) => {
    return await prisma?.producto.findFirst({
        where: {
            OR: [{ id }, { url: id }]
        },
        include: {
            imagenes: { orderBy: { orden: "asc" } },
            variantes: true
        }
    })
}
export async function generateMetadata(
    { params }: any) {
    const producto = await getProducto((await params).id);
    if (!producto)
        return notFound();
    return {
        title: producto?.titulo,
        description: producto?.subtitulo,
    }
}

export default async function Producto({ params }: any) {

    const producto = await getProducto((await params).id)
    console.log(producto)
    return <>
        <Navbar />
        <Cliente producto={producto as any} />
        <Footer />
    </>
}