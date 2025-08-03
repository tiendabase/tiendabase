"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSelector, useDispatch } from "react-redux"
import Link from "next/link"

import type { RootState } from "@/store"
import { toggleFavProduct } from "@/store/reducers/user"
import Navbar from "../componentes/navbar"
import ProductoItem from "../componentes/producto"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import {
    Heart,
    Search,
    Filter,
    Grid3X3,
    List,
    ArrowLeft,
    Share2,
    ShoppingCart,
    Trash2,
    SortAsc,
    Star,
    TrendingUp,
    Package,
    Gift,
} from "lucide-react"

import type { Imagen, Producto, Variante } from "@prisma/client"

type ProductoCompleto = Producto & { variantes: Variante[]; imagenes: Imagen[] }

const FavoritosPage = () => {
    const dispatch = useDispatch()
    const { favProducts } = useSelector((state: RootState) => state.user)

    const [productos, setProductos] = useState<ProductoCompleto[]>([])
    const [filteredProductos, setFilteredProductos] = useState<ProductoCompleto[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [sortBy, setSortBy] = useState("newest")
    const [layout, setLayout] = useState<"grid" | "list">("grid")
    const [selectedCategory, setSelectedCategory] = useState("all")

    // Fetch productos favoritos
    useEffect(() => {
        const fetchFavoriteProducts = async () => {
            if (favProducts.length === 0) {
                setIsLoading(false)
                return
            }

            try {
                setIsLoading(true)
                // Simular fetch de productos favoritos
                // En tu caso real, harías una llamada a la API con los IDs
                const response = await fetch("/api/producto/mostrar", { method: "GET" })
                const allProducts = await response.json()

                // Filtrar solo los productos favoritos
                const favoriteProducts = allProducts.filter((product: ProductoCompleto) => favProducts.includes(product.id))

                setProductos(favoriteProducts)
                setFilteredProductos(favoriteProducts)
            } catch (error) {
                console.error("Error fetching favorite products:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchFavoriteProducts()
    }, [favProducts])

    // Filtrar y ordenar productos
    useEffect(() => {
        let filtered = [...productos]

        // Filtrar por búsqueda
        if (searchQuery) {
            filtered = filtered.filter(
                (product) =>
                    product.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.subtitulo?.toLowerCase().includes(searchQuery.toLowerCase()),
            )
        }

        // Filtrar por categoría (simulado)
        if (selectedCategory !== "all") {
            // Aquí podrías filtrar por categoría real
            // filtered = filtered.filter(product => product.categoria === selectedCategory)
        }

        // Ordenar
        switch (sortBy) {
            case "price-low":
                filtered.sort((a, b) => {
                    const priceA = a.variantes[0]?.precio || 0
                    const priceB = b.variantes[0]?.precio || 0
                    return priceA - priceB
                })
                break
            case "price-high":
                filtered.sort((a, b) => {
                    const priceA = a.variantes[0]?.precio || 0
                    const priceB = b.variantes[0]?.precio || 0
                    return priceB - priceA
                })
                break
            case "name":
                filtered.sort((a, b) => a.titulo.localeCompare(b.titulo))
                break
            case "newest":
            default:
                filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                break
        }

        setFilteredProductos(filtered)
    }, [productos, searchQuery, sortBy, selectedCategory])

    const handleRemoveFromFavorites = (productId: string) => {
        dispatch(toggleFavProduct({ id: productId }))
    }

    const handleClearAllFavorites = () => {
        favProducts.forEach((id) => {
            dispatch(toggleFavProduct({ id }))
        })
    }

    // Skeleton loader
    const ProductSkeleton = () => (
        <div className="animate-pulse">
            <div className="aspect-square bg-muted rounded-lg mb-4"></div>
            <div className="h-4 bg-muted rounded mb-2"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
        </div>
    )

    // Estado vacío
    if (!isLoading && favProducts.length === 0) {
        return (
            <>
                <Navbar />
                <div className="min-h-screen bg-background pt-24">
                    <div className="container mx-auto px-4 py-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center max-w-md mx-auto"
                        >
                            <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
                                <Heart className="w-12 h-12 text-muted-foreground" />
                            </div>
                            <h1 className="text-2xl font-bold mb-4">No tienes favoritos aún</h1>
                            <p className="text-muted-foreground mb-8">
                                Explora nuestros productos y marca tus favoritos para encontrarlos fácilmente aquí.
                            </p>
                            <Button asChild size="lg">
                                <Link href="/productos">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Explorar Productos
                                </Link>
                            </Button>

                            {/* Productos sugeridos */}
                            <div className="mt-12">
                                <h3 className="text-lg font-semibold mb-6">Productos Populares</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {[1, 2, 3].map((i) => (
                                        <Card key={i} className="hover:shadow-md transition-shadow">
                                            <CardContent className="p-4">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-16 h-16 bg-muted rounded-lg"></div>
                                                    <div className="flex-1 text-left">
                                                        <h4 className="font-medium">Producto Sugerido {i}</h4>
                                                        <p className="text-primary font-semibold">$25.000</p>
                                                    </div>
                                                    <Button size="sm" variant="outline">
                                                        <Heart className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-background pt-24">
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h1 className=" font-bold flex items-center">
                                    <Heart className="w-8 h-8 mr-3 text-red-500 fill-current" />
                                    Mis Favoritos
                                </h1>

                            </div>


                            {favProducts.length > 0 && (

                                <Button variant="outline" size="sm" onClick={handleClearAllFavorites} className="text-red-600">
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Limpiar todo
                                </Button>
                            )}
                        </div>
                        <p className="text-muted-foreground">
                            {isLoading ? "Cargando..." : `${filteredProductos.length} de ${favProducts.length} productos`}
                        </p>
                        {/* Estadísticas rápidas */}
                        {!isLoading && productos.length > 0 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
                                <Card>
                                    <CardContent className="p-4 text-center">
                                        <div className="text-2xl font-bold text-primary">
                                            ${productos.reduce((total, p) => total + (p.variantes[0]?.precio || 0), 0).toLocaleString()}
                                        </div>
                                        <p className="text-sm text-muted-foreground">Valor total</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-4 text-center">
                                        <div className="text-2xl font-bold text-green-600">
                                            $
                                            {Math.round(
                                                productos.reduce((total, p) => total + (p.variantes[0]?.precio || 0), 0) * 0.15,
                                            ).toLocaleString()}
                                        </div>
                                        <p className="text-sm text-muted-foreground">Ahorros potenciales</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-4 text-center">
                                        <div className="text-2xl font-bold text-blue-600">
                                            {productos.filter((p) => p.descontable).length}
                                        </div>
                                        <p className="text-sm text-muted-foreground">En oferta</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardContent className="p-4 text-center">
                                        <div className="text-2xl font-bold text-purple-600">
                                            {productos.filter((p) => p.estado === "NUEVO").length}
                                        </div>
                                        <p className="text-sm text-muted-foreground">Nuevos</p>
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </motion.div>
                    {/* Grid de productos */}
                    <AnimatePresence>
                        {isLoading ? (
                            <div
                                className={`grid gap-6 ${layout === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
                                    }`}
                            >
                                {[...Array(8)].map((_, i) => (
                                    <ProductSkeleton key={i} />
                                ))}
                            </div>
                        ) : filteredProductos.length > 0 ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className={`grid gap-6 ${layout === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
                                    }`}
                            >
                                {filteredProductos.map((producto, index) => (
                                    <motion.div
                                        key={producto.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="relative  group"
                                    >
                                        <ProductoItem producto={producto} layout={layout} />

                                        
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                                <Search className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                                <h3 className="text-xl font-semibold mb-2">No se encontraron productos</h3>
                                <p className="text-muted-foreground mb-4">Intenta cambiar los filtros o el término de búsqueda</p>
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        setSearchQuery("")
                                        setSelectedCategory("all")
                                    }}
                                >
                                    Limpiar filtros
                                </Button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Productos recomendados */}
                    {!isLoading && filteredProductos.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="mt-16"
                        >
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <TrendingUp className="w-5 h-5 mr-2" />
                                        Te podría interesar
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground mb-4">
                                        Basado en tus productos favoritos, estos podrían gustarte:
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent">
                                                <div className="w-16 h-16 bg-muted rounded-lg"></div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium">Producto Recomendado {i}</h4>
                                                    <p className="text-sm text-muted-foreground">$35.000</p>
                                                    <div className="flex items-center mt-1">
                                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                        <span className="text-xs ml-1">4.8 (120)</span>
                                                    </div>
                                                </div>
                                                <Button size="sm" variant="outline">
                                                    <Heart className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </div>
            </div>
        </>
    )
}

export default FavoritosPage
