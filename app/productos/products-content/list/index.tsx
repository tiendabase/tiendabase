import useSwr from "swr";
import ProductoItem from "@/app/componentes/producto";
import { Imagen, Producto, Variante } from "@prisma/client";
import { Loader } from "lucide-react";

const ProductsContent = () => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error } = useSwr<(Producto & { imagenes: Imagen[], variantes: Variante[] })[]>("/api/producto/mostrar", fetcher);

  if (error) return <div>Failed to load users</div>;
  return (
    <>
      {!data && <Loader className="animate-spin self-center mt-30 text-primary mx-auto" />}

      {data && (
        <section className="grid grid-cols-2 sm:grid-cols-2  gap-3 lg:grid-cols-3 xl:grid-cols-4">
          {data.map((item) => (
            <ProductoItem key={item.id} producto={item} />
          ))}
        </section>
      )}
    </>
  );
};

export default ProductsContent;
