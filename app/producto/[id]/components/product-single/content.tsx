"use client"

import { some } from "lodash"
import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"

import type { RootState } from "@/store"
import { addProduct } from "@/store/reducers/cart"
import { toggleFavProduct } from "@/store/reducers/user"
import type { ProductStoreType } from "@/types"

import type { Imagen, Producto, Variante } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Share2,
  Truck,
  Shield,
  Star,
  Eye,
  Zap,
  Gift,
  Clock,
  MapPin,
  CreditCard,
  Smartphone,
  TrendingUp,
  Users,
  MessageCircle,
  ChevronRight,
  Info,
  Package,
  Check,
  X,
} from "lucide-react"
import { Label } from "@/components/ui/label"

interface ProductViewProps {
  producto: Producto & {
    imagenes: Imagen[]
    variantes: Variante[]
  }
}

const ProductView = ({ producto }: ProductViewProps) => {
  console.log(producto)
  const dispatch = useDispatch()
  const [count, setCount] = useState<number>(1)

  const [itemSize, setItemSize] = useState<string>("")
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [viewCount, setViewCount] = useState(127)
  const [stockLevel, setStockLevel] = useState(8)

  const { favProducts } = useSelector((state: RootState) => state.user)
  const isFavourite = some(favProducts, (productoId) => productoId === producto.id)

  // Simular datos adicionales del producto
  const productStats = {
    rating: 4.6,
    reviews: 234,
    sold: 1250,
    views: viewCount,
    wishlist: 89,
  }

  const deliveryOptions = [
    { type: "express", time: "2-4 horas", price: 1500, icon: Zap },
    { type: "standard", time: "1-2 días", price: 800, icon: Truck },
    { type: "pickup", time: "Hoy", price: 0, icon: MapPin },
  ]

  useEffect(() => {
    // Simular incremento de vistas
    const timer = setTimeout(() => {
      setViewCount((prev) => prev + 1)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  const toggleFav = () => {
    dispatch(toggleFavProduct({ id: producto.id }))
  }

  const addToCart = async () => {
    setIsAddingToCart(true)

    // Simular delay de API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const productoToSave: ProductStoreType = {
      id: producto.id,
      name: producto.titulo,
      thumb: producto.imagenes?.[0]?.url || "",
      price: getSelectedPrice(),
      count,
      color: selectedVariant?.codigoHexColor!,
      size: itemSize,
    }

    dispatch(addProduct({ count, product: productoToSave }))
    setIsAddingToCart(false)
  }

  const getSelectedPrice = () => {
    const defaultVariant = producto.variantes.find((v) => v.tipo === "POR_DEFECTO")
    return defaultVariant?.precio || 0
  }

  const getDiscountPercentage = () => {
    if (!producto.descontable) return 0
    const originalPrice = getSelectedPrice()
    const discountedPrice = originalPrice * 0.8 // Ejemplo: 20% descuento
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
  }

  const shareProduct = async () => {
    if (navigator.share) {
      await navigator.share({
        title: producto.titulo,
        text: producto.subtitulo,
        url: window.location.href,
      })
    }
  }
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")

  const [isChecking, setIsChecking] = useState(false)

  // Filtrar variantes activas
  const activeVariants = producto.variantes.filter((v) => v.estado)

  // Encontrar la variante por defecto (sin talla ni color)
  const defaultVariant = activeVariants.find((v) => v.tipo === "POR_DEFECTO")
  const [selectedVariant, setSelectedVariant] = useState<Variante | null>(null)
  // Obtener tallas únicas (excluyendo la por defecto)
  const availableSizes = activeVariants
    .filter((v) => v.talla)
    .reduce((acc, v) => {
      if (!acc.find((item) => item.talla === v.talla)) {
        acc.push(v)
      }
      return acc
    }, [] as Variante[])
    .sort((a, b) => {
      const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL"]
      const aIndex = sizeOrder.indexOf(a.talla || "")
      const bIndex = sizeOrder.indexOf(b.talla || "")
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
      return (a.talla || "").localeCompare(b.talla || "")
    })

  // Obtener colores únicos (excluyendo la por defecto)
  const availableColors = activeVariants
    .filter((v) => v.codigoHexColor)
    .reduce((acc, v) => {
      if (!acc.find((item) => item.codigoHexColor === v.codigoHexColor)) {
        acc.push(v)
      }
      return acc
    }, [] as Variante[])

  // Función para consultar disponibilidad de variante
  const checkVariantAvailability = async (size?: string, color?: string) => {
    setIsChecking(true)

    // Simular consulta a API
    await new Promise((resolve) => setTimeout(resolve, 300))

    // Si no hay selecciones, usar la variante por defecto
    if (!size && !color) {
      setSelectedVariant(defaultVariant || null)
      setIsChecking(false)
      return
    }

    // Buscar variante que coincida exactamente con los criterios
    const variant = activeVariants.find((v) => {
      const sizeMatch = size ? v.talla === size : !v.talla
      const colorMatch = color ? v.codigoHexColor === color : !v.codigoHexColor
      return sizeMatch && colorMatch
    })

    setSelectedVariant(variant || null)
    setIsChecking(false)
  }

  // Inicializar con la variante por defecto
  useEffect(() => {
    if (defaultVariant) {
      setSelectedVariant(defaultVariant)
    }
  }, [])

  // Efecto para verificar disponibilidad cuando cambian las selecciones
  useEffect(() => {
    checkVariantAvailability(selectedSize || undefined, selectedColor || undefined)
  }, [selectedSize, selectedColor])

  const handleSizeChange = (value: string) => {
    setSelectedSize(value === "clear" ? "" : value)
  }

  const handleColorChange = (value: string) => {
    setSelectedColor(value === "clear" ? "" : value)
  }


  const hasSizes = availableSizes.length > 0
  const hasColors = availableColors.length > 0
  const hasSelections = selectedSize || selectedColor


  return (
    <div className="max-w-7xl mx-auto space-y-8 relative">
      {/* Header con breadcrumb y acciones rápidas */}
      <div className="flex items-center justify-between">
        <div className="flex items-center  text-sm text-muted-foreground">
          <span>Inicio</span>
          <ChevronRight className="w-4 h-4" />
          <span>Ropa</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground">{producto.titulo}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Columna izquierda - Información del producto */}
        <div className="space-y-6">
          {/* Badges y estado */}
          <div className="flex items-center space-x-4">
            {producto.descontable && (
              <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                -{getDiscountPercentage()}%
              </Badge>
            )}
            <Badge variant="secondary" className="flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>{viewCount} vistas</span>
            </Badge>
            <Button variant="ghost" className="absolute -top-2 right-0" onClick={shareProduct}>
              <Share2 className="size-4" />
            </Button>

          </div>

          {/* Título y rating */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{producto.titulo}</h1>
            <p className="text-muted-foreground text-lg">{producto.subtitulo}</p>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(productStats.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                  />
                ))}
                <span className="text-sm font-medium">{productStats.rating}</span>
              </div>
              <span className="text-sm text-muted-foreground">({productStats.reviews} reseñas)</span>
              <span className="text-sm text-muted-foreground">{productStats.sold} vendidos</span>
            </div>
          </div>

          {/* Precio */}
          <div className="space-y-2">
            {
              selectedVariant && (
                producto.descontable ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl font-bold text-primary">
                      ${(getSelectedPrice() * 0.8).toLocaleString()} ARS
                    </span>
                    <span className="text-xl text-muted-foreground line-through">
                      ${getSelectedPrice().toLocaleString()} ARS
                    </span>
                  </div>
                ) : (
                  <span className="text-3xl font-bold">{selectedVariant!.precio.toFixed(2)} ARS</span>
                )
              )
            }

            {/* Programa de puntos */}
            <div className="flex items-center space-x-2 text-sm">
              <Gift className="w-4 h-4 text-primary" />
              <span>Gana {Math.floor(getSelectedPrice() / 100)} puntos con esta compra</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Cantidad</h3>
            <div className="flex items-center space-x-4">
              <div className="flex items-center border rounded-full">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => setCount(Math.max(1, count - 1))}
                  disabled={count <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="px-4 font-semibold">{count}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => setCount(count + 1)}
                  disabled={count >= stockLevel}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="text-sm text-muted-foreground">Stock disponible: {stockLevel}</div>
            </div>
          </div>
          {/* Selector de Tallas */}
          {hasSizes && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="size-select">Talla</Label>
                {selectedSize && (
                  <Button variant="ghost" size="sm" onClick={() => setSelectedSize("")} className="h-6 px-2 text-xs">
                    <X className="w-3 h-3 mr-1" />
                    Limpiar
                  </Button>
                )}
              </div>
              <Select value={selectedSize} onValueChange={handleSizeChange}>
                <SelectTrigger className="w-full" id="size-select">
                  <SelectValue placeholder="Selecciona una talla" />
                </SelectTrigger>
                <SelectContent>
                  {selectedSize && (
                    <SelectItem value="clear" className="text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <X className="w-3 h-3" />
                        Limpiar selección
                      </div>
                    </SelectItem>
                  )}
                  {availableSizes.map((variant) => (
                    <SelectItem key={`size-${variant.id}`} value={variant.talla || ""}>
                      Talla {variant.talla}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Selector de Colores */}
          {hasColors && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="color-select">Color</Label>
                {selectedColor && (
                  <Button variant="ghost" size="sm" onClick={() => setSelectedColor("")} className="h-6 px-2 text-xs">
                    <X className="w-3 h-3 mr-1" />
                    Limpiar
                  </Button>
                )}
              </div>
              <Select value={selectedColor} onValueChange={handleColorChange}>
                <SelectTrigger id="color-select" className="w-full">
                  <SelectValue placeholder="Selecciona un color" />
                </SelectTrigger>
                <SelectContent>
                  {selectedColor && (
                    <SelectItem value="clear" className="text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <X className="w-3 h-3" />
                        Limpiar selección
                      </div>
                    </SelectItem>
                  )}
                  {availableColors.map((variant) => (
                    <SelectItem key={`color-${variant.id}`} value={variant.codigoHexColor || ""}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border border-gray-300"
                          style={{ backgroundColor: variant.codigoHexColor || undefined }}
                        />
                        <span>{variant.titulo}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Estado de verificación */}
          {isChecking && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Verificando disponibilidad...
              </div>
            </div>
          )}

          {/* Variante seleccionada */}
          {!isChecking && selectedVariant && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium text-green-800">{selectedVariant.titulo}</span>
                <Badge variant="default">{selectedVariant.precio.toFixed(2)} ARS</Badge>
              </div>
              <div className="text-sm text-green-700">
                {selectedSize && <p>Talla: {selectedSize}</p>}
                {selectedColor && (
                  <div className="flex items-center gap-2 mt-1">
                    <span>Color:</span>
                    <div
                      className="w-3 h-3 rounded-full border border-gray-300"
                      style={{ backgroundColor: selectedColor }}
                    />
                  </div>
                )}
                {!hasSelections && (
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    Opción por defecto
                  </Badge>
                )}
              </div>
            </div>
          )}


          {/* No disponible */}
          {!isChecking && hasSelections && !selectedVariant && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="space-y-2">
                <div className="text-sm text-red-800">
                  <div className="flex items-center gap-4">
                    {selectedSize && <span>Talla: {selectedSize}</span>}
                    {selectedColor && (
                      <div className="flex items-center gap-1">
                        <span>Color:</span>
                        <div
                          className="w-3 h-3 rounded-full border border-gray-300"
                          style={{ backgroundColor: selectedColor }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <Badge variant="destructive">✗ No disponible</Badge>
                <p className="text-xs text-red-600">Esta combinación no está disponible</p>
              </div>
            </div>
          )}


          <div>
            {/* Cantidad y acciones */}
            <div className="space-y-4">


              {/* Botones de acción */}
              <div className="flex space-x-3">
                <Button
                  onClick={addToCart}
                  disabled={isAddingToCart || (!selectedVariant && producto.variantes.length > 1)}
                  className="flex-1"
                  size="lg"
                >
                  {isAddingToCart ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Agregando...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Agregar al carrito
                    </>
                  )}
                </Button>

                <Button variant={isFavourite ? "default" : "outline"} size="lg" onClick={toggleFav}>
                  <Heart className={`w-4 h-4 ${isFavourite ? "fill-current" : ""}`} />
                </Button>
              </div>

              {/* Compra rápida */}
              <Button variant="outline" size="lg" className="w-full">
                <CreditCard className="w-4 h-4 mr-2" />
                Comprar ahora
              </Button>
            </div>
          </div>
        </div>

        {/* Columna derecha - Información adicional */}
        <div className="space-y-6">
          {/* Opciones de entrega */}
          <Card className="py-4">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Truck className="w-5 h-5" />
                <span>Opciones de entrega</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {deliveryOptions.map((option) => (
                <div
                  key={option.type}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-secondary cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <option.icon className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium capitalize">{option.type}</div>
                      <div className="text-sm text-muted-foreground">{option.time}</div>
                    </div>
                  </div>
                  <div className="font-semibold">{option.price === 0 ? "Gratis" : `$${option.price}`}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Garantías y beneficios */}
          <Card className="py-4">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>Garantías</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <Package className="w-4 h-4 text-green-600" />
                <span className="text-sm">Devolución gratuita en 30 días</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-4 h-4 text-blue-600" />
                <span className="text-sm">Garantía de calidad 1 año</span>
              </div>
              <div className="flex items-center space-x-3">
                <Smartphone className="w-4 h-4 text-purple-600" />
                <span className="text-sm">Soporte 24/7</span>
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas sociales */}
          <Card className="py-4">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Popularidad</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>En wishlists</span>
                  <span>{productStats.wishlist}</span>
                </div>
                <Progress value={(productStats.wishlist / 100) * 100} className="h-2" />
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>Viendo ahora</span>
                </div>
                <span className="font-semibold">12 personas</span>
              </div>

              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>¡Producto popular! Se vendieron 5 unidades en las últimas 24 horas.</AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Reseñas rápidas */}
          <Card className="py-4">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5" />
                <span>Reseñas recientes</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm font-medium">María G.</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  "Excelente calidad, muy cómodo y el color es exactamente como en las fotos."
                </p>
              </div>

              <Separator />

              <Button variant="outline" size="sm" className="w-full">
                Ver todas las reseñas ({productStats.reviews})
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs con información detallada */}
      <Tabs defaultValue="descripcion">
        <TabsList >
          <TabsTrigger value="descripcion">Descripción</TabsTrigger>
          <TabsTrigger value="reviews">Reseñas</TabsTrigger>
          <TabsTrigger value="care">Cuidados</TabsTrigger>
        </TabsList>



        <TabsContent value="descripcion" className="mt-6">
          <Card>
            <CardContent className="py-3">
              {
                producto.descripcion
              }
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">Reseñas detalladas</h3>
                <p className="text-muted-foreground">Las reseñas completas se cargarán aquí</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="care" className="mt-6">
          <Card>
            <CardContent className="py-6">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Lavado</h4>
                    <p className="text-muted-foreground">Lavar a máquina en agua fría (30°C máx.)</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Secado</h4>
                    <p className="text-muted-foreground">Secar al aire libre, evitar luz solar directa</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ProductView
