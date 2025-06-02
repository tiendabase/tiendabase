"use client"

import type React from "react"

import { some } from "lodash"
import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"
import Image from "next/image"
import { useState } from "react"

import type { RootState } from "@/store"
import { toggleFavProduct } from "@/store/reducers/user"
import { addProduct } from "@/store/reducers/cart"
import type { ProductStoreType } from "@/types"

import type { Imagen, Producto, Variante } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Heart, ShoppingCart, Eye, Star, Truck, Palette, Ruler, TrendingUp, Clock, Package } from "lucide-react"

interface Props {
    producto: Producto & { variantes: Variante[]; imagenes: Imagen[] }
    showQuickView?: boolean
    showAddToCart?: boolean
    layout?: "grid" | "list"
}

const ProductoItem = ({ producto, showQuickView = true, showAddToCart = true, layout = "grid" }: Props) => {
    const dispatch = useDispatch()
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isHovered, setIsHovered] = useState(false)
    const [isAddingToCart, setIsAddingToCart] = useState(false)

    const { favProducts } = useSelector((state: RootState) => state.user)
    const isFavourite = some(favProducts, (productId) => productId === producto.id)

    // Datos calculados
    const sortedImages = producto.imagenes.sort((a, b) => a.orden - b.orden)
    const mainImage = sortedImages[currentImageIndex] || sortedImages[0]
    const defaultVariant = producto.variantes.find((v) => v.tipo === "POR_DEFECTO") || producto.variantes[0]
    const hasMultipleVariants = producto.variantes.length > 1
    const availableColors = producto.variantes.filter((v) => v.codigoHexColor).length
    const availableSizes = producto.variantes.filter((v) => v.talla).length

    // Calcular precio con descuento
    const originalPrice = defaultVariant?.precio || 0
    const discountedPrice = producto.descontable ? originalPrice * (1 - producto.descuento / 100) : originalPrice
    const savings = originalPrice - discountedPrice

    // Simular datos adicionales
    const productStats = {
        rating: 4.2 + Math.random() * 0.8,
        reviews: Math.floor(Math.random() * 200) + 50,
        sold: Math.floor(Math.random() * 500) + 100,
        stock: Math.floor(Math.random() * 20) + 5,
    }

    const toggleFav = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        dispatch(toggleFavProduct({ id: producto.id }))
    }

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsAddingToCart(true)

        // Simular delay de API
        await new Promise((resolve) => setTimeout(resolve, 800))

        const productoToSave: ProductStoreType = {
            id: producto.id,
            name: producto.titulo,
            thumb: mainImage?.url || "",
            price: discountedPrice,
            count: 1,
            color: defaultVariant?.codigoHexColor || "",
            size: defaultVariant?.talla || "",
        }

        dispatch(addProduct({ count: 1, product: productoToSave }))
        setIsAddingToCart(false)
    }

    const handleImageHover = () => {
        if (sortedImages.length > 1) {
            setCurrentImageIndex(1)
        }
    }

    const handleImageLeave = () => {
        setCurrentImageIndex(0)
    }

    const getBadges = () => {
        const badges = []

        if (producto.estado === "NUEVO") {
            badges.push(
                <Badge key="nuevo" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                    Nuevo
                </Badge>,
            )
        }

        if (producto.descontable && producto.descuento > 0) {
            badges.push(
                <Badge key="descuento" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                    -{Math.round(producto.descuento)}%
                </Badge>,
            )
        }

        if (productStats.sold > 300) {
            badges.push(
                <Badge
                    key="popular"
                    variant="secondary"
                    className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
                >
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Popular
                </Badge>,
            )
        }
        return badges
    }

    if (layout === "list") {
        return (
            <Card className="py-0 overflow-hidden hover:shadow-lg transition-all duration-300 ">
                <div className="flex">
                    <div className="relative w-48 h-48 flex-shrink-0">
                        <Link href={`/producto/${producto.url || producto.id}`}>
                            <Image
                                src={mainImage?.url || "/placeholder.svg?height=200&width=200"}
                                alt={producto.titulo}
                                fill
                                className="object-cover"
                                sizes="192px"
                            />
                        </Link>
                        <Button
                            onClick={toggleFav}
                            variant={isFavourite ? "default" : "secondary"}
                            size="icon"
                            className="absolute top-2 right-2 rounded-full"
                        >
                            <Heart className={`w-4 h-4 ${isFavourite ? "fill-current" : ""}`} />
                        </Button>
                    </div>

                    <CardContent className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex flex-wrap gap-1">{getBadges()}</div>
                        </div>

                        <Link href={`/producto/${producto.url || producto.id}`}>
                            <h3 className="text-lg font-semibold mb-2 hover:text-primary transition-colors">{producto.titulo}</h3>
                            {producto.subtitulo && <p className="text-muted-foreground text-sm mb-3">{producto.subtitulo}</p>}
                        </Link>

                        <div className="flex items-center space-x-2 mb-3">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-3 h-3 ${i < Math.floor(productStats.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-muted-foreground">({productStats.reviews})</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center space-x-2">
                                    <span className="text-xl font-bold">${discountedPrice.toLocaleString()}</span>
                                    {producto.descontable && (
                                        <span className="text-sm text-muted-foreground line-through">
                                            ${originalPrice.toLocaleString()}
                                        </span>
                                    )}
                                </div>
                                {savings > 0 && <p className="text-sm text-green-600">Ahorras ${savings.toLocaleString()}</p>}
                            </div>

                            <Button onClick={handleAddToCart} disabled={isAddingToCart}>
                                {isAddingToCart ? (
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <ShoppingCart className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </div>
            </Card>
        )
    }

    return (
        <Card
            className="group py-0 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="relative">
                {/* Imagen principal */}
                <div
                    className="relative aspect-square overflow-hidden"
                    onMouseEnter={handleImageHover}
                    onMouseLeave={handleImageLeave}
                >
                    <Link href={`/producto/${producto.url || producto.id}`}>
                        <Image
                            src={mainImage?.url || "/placeholder.svg?height=300&width=300"}
                            alt={producto.titulo}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </Link>

                    {/* Overlay con acciones */}
                    <div
                        className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        <div className="absolute top-2 right-2 flex flex-col space-y-2">
                            <Button
                                onClick={toggleFav}
                                variant={isFavourite ? "default" : "secondary"}
                                size="icon"
                                className="rounded-full shadow-lg"
                            >
                                <Heart className={`w-4 h-4 ${isFavourite ? "fill-current" : ""}`} />
                            </Button>


                        </div>

                        {/* Botón de agregar al carrito en hover */}
                        {showAddToCart && (
                            <div className="absolute bottom-4 left-4 right-4">
                                <Button
                                    onClick={handleAddToCart}
                                    disabled={isAddingToCart}
                                    className="w-full shadow-lg"
                                    variant="secondary"
                                >
                                    {isAddingToCart ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                                            Agregando...
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart className="w-4 h-4 mr-2" />
                                            Agregar al carrito
                                        </>
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col space-y-1">{getBadges()}</div>

                   
                </div>

                {/* Información del producto */}
                <CardContent className="p-4">
                    <Link href={`/producto/${producto.url || producto.id}`}>
                        <h3 className="font-semibold text-sm mb-1 line-clamp-2 hover:text-primary transition-colors">
                            {producto.titulo}
                        </h3>
                        {producto.subtitulo && (
                            <p className="text-xs text-muted-foreground mb-2 line-clamp-1">{producto.subtitulo}</p>
                        )}
                    </Link>

                    {/* Rating y reviews */}
                    <div className="flex items-center space-x-2 mb-2">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star
                                    key={i}
                                    className={`w-3 h-3 ${i < Math.floor(productStats.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-xs text-muted-foreground">({productStats.reviews})</span>
                    </div>

                    {/* Variantes disponibles */}
                    {hasMultipleVariants && (
                        <div className="flex items-center space-x-3 mb-2 text-xs text-muted-foreground">
                            {availableColors > 0 && (
                                <div className="flex items-center space-x-1">
                                    <Palette className="w-3 h-3" />
                                    <span>{availableColors} colores</span>
                                </div>
                            )}
                            {availableSizes > 0 && (
                                <div className="flex items-center space-x-1">
                                    <Ruler className="w-3 h-3" />
                                    <span>{availableSizes} tallas</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Precio */}
                    <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                            <span className="font-bold text-lg">${discountedPrice.toLocaleString()}</span>
                            {producto.descontable && (
                                <span className="text-sm text-muted-foreground line-through">${originalPrice.toLocaleString()}</span>
                            )}
                        </div>

                        {savings > 0 && <p className="text-xs text-green-600 font-medium">Ahorras ${savings.toLocaleString()}</p>}

                        {/* Envío gratis */}
                        {discountedPrice > 50000 && (
                            <div className="flex items-center space-x-1 text-xs text-green-600">
                                <Truck className="w-3 h-3" />
                                <span>Envío gratis</span>
                            </div>
                        )}
                    </div>

                  
                </CardContent>
            </div>
        </Card>
    )
}

export default ProductoItem
