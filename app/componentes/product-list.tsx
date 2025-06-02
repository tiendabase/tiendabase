import { Producto } from "@prisma/client";

export default function ProductList({ products }: { products: Producto[] }) {
    return (
        <div className="product-list grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {products.map((product) => (
                <div key={product.id} className="product-item border rounded-lg p-4">
                    <img src={product.imagenes[0]} alt={product.titulo} className="w-full h-48 object-cover mb-2" />
                    <h3 className="text-lg font-semibold">{product.titulo}</h3>
                    <p className="text-gray-600">${product.precio}</p>
                    {product.descuento && (
                        <span className="text-red-500 line-through">${product.descuento}</span>
                    )}
                </div>
            ))}
        </div>
    );
}