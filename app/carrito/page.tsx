"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useSelector, useDispatch } from "react-redux"

import type { RootState } from "@/store"
import { removeProduct } from "@/store/reducers/cart"
import Navbar from "../componentes/navbar"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

import {
    ArrowLeft,
    ShoppingCart,
    Trash2,
    Gift,
    Truck,
    Shield,
    CreditCard,
    Tag,
    Clock,
    Star,
    CheckCircle,
    Percent,
    Package,
} from "lucide-react"
import CartItem from "./components/Item"
import Footer from "../componentes/footer"

const CheckoutPage = () => {
    const dispatch = useDispatch()
    const { cartItems } = useSelector((state: RootState) => state.cart)

    const [couponCode, setCouponCode] = useState("")
    const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null)
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)
    const [estimatedDelivery, setEstimatedDelivery] = useState("")
    const [savings, setSavings] = useState(0)

    // Calcular totales
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.count, 0)
    const shipping = subtotal > 50000 ? 0 : 2500
    const discount = appliedCoupon ? subtotal * 0.1 : 0 // 10% descuento
    const total = subtotal + shipping - discount

    // Progreso para envío gratis
    const freeShippingThreshold = 50000
    const progressToFreeShipping = Math.min((subtotal / freeShippingThreshold) * 100, 100)
    const remainingForFreeShipping = Math.max(freeShippingThreshold - subtotal, 0)

    useEffect(() => {
        // Calcular fecha estimada de entrega
        const deliveryDate = new Date()
        deliveryDate.setDate(deliveryDate.getDate() + (shipping === 0 ? 2 : 5))
        setEstimatedDelivery(
            deliveryDate.toLocaleDateString("es-AR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
            }),
        )

        // Calcular ahorros totales
        const totalSavings = cartItems.reduce((acc, item) => {
            // Simular precio original más alto
            const originalPrice = item.price * 1.3
            return acc + (originalPrice - item.price) * item.count
        }, 0)
        setSavings(totalSavings)
    }, [cartItems, shipping])

    const handleApplyCoupon = async () => {
        setIsApplyingCoupon(true)
        // Simular validación de cupón
        await new Promise((resolve) => setTimeout(resolve, 1000))

        if (couponCode.toLowerCase() === "descuento10") {
            setAppliedCoupon(couponCode)
            setCouponCode("")
        }
        setIsApplyingCoupon(false)
    }


    const recommendedProducts = [
        { id: 1, name: "Camiseta Básica", price: 12000, image: "/placeholder.svg?height=80&width=80" },
        { id: 2, name: "Jeans Clásicos", price: 28000, image: "/placeholder.svg?height=80&width=80" },
        { id: 3, name: "Zapatillas Deportivas", price: 45000, image: "/placeholder.svg?height=80&width=80" },
    ]

    if (cartItems.length === 0) {
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
                                <ShoppingCart className="w-12 h-12 text-muted-foreground" />
                            </div>
                            <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
                            <p className="text-muted-foreground mb-8">
                                ¡Descubre nuestros productos increíbles y comienza a llenar tu carrito!
                            </p>
                            <Button asChild size="lg">
                                <Link href="/productos">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Explorar Productos
                                </Link>
                            </Button>

                            {/* Productos recomendados */}
                            <div className="mt-12">
                                <h3 className="text-lg font-semibold mb-6">Productos Recomendados</h3>
                                <div className="grid grid-cols-1 gap-4">
                                    {recommendedProducts.map((product) => (
                                        <Card key={product.id} className="hover:shadow-md py-4 transition-shadow">
                                            <CardContent className="p-4">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-16 h-16 bg-muted rounded-lg"></div>
                                                    <div className="flex-1 text-left">
                                                        <h4 className="font-medium">{product.name}</h4>
                                                        <p className="text-primary font-semibold">${product.price.toLocaleString()}</p>
                                                    </div>
                                                    <Button size="sm">Agregar</Button>
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
                                <h1 className="text-3xl font-bold">Carrito de Compras</h1>
                                <p className="text-muted-foreground">
                                    {cartItems.length} {cartItems.length === 1 ? "producto" : "productos"} en tu carrito
                                </p>
                            </div>
                            <Badge variant="secondary" className="px-4 py-2">
                                <Package className="size-4" />
                                {cartItems.length} items
                            </Badge>
                        </div>

                        {/* Progreso para envío gratis */}
                        {shipping > 0 && (
                            <Alert className="mb-6">
                                <Truck className="h-4 w-4" />
                                <AlertDescription>
                                    <div className="space-y-2">
                                        <p>
                                            ¡Agrega <strong>${remainingForFreeShipping.toLocaleString()}</strong> más para obtener{" "}
                                            <strong>envío gratis</strong>!
                                        </p>
                                        <Progress value={progressToFreeShipping} className="h-2" />
                                    </div>
                                </AlertDescription>
                            </Alert>
                        )}

                        {shipping === 0 && (
                            <Alert className="mb-6 border-green-200 bg-green-50 dark:bg-green-950">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <AlertDescription className="text-green-800 dark:text-green-200">
                                    ¡Felicitaciones! Tienes <strong>envío gratis</strong> en este pedido.
                                </AlertDescription>
                            </Alert>
                        )}
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Lista de productos */}
                        <div className="lg:col-span-2 space-y-4">
                            <h3 className="font-semibold text-xl">
                                Productos en tu carrito
                            </h3>
                            <AnimatePresence>
                                {cartItems.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <CartItem
                                            id={item.id}
                                            product={item}
                                            count={item.count}
                                            onQuantityChange={() => { }}
                                            onRemove={() => { }}
                                        />
                                        {index < cartItems.length - 1 && <Separator className="my-4" />}
                                    </motion.div>
                                ))}
                            </AnimatePresence>



                            <Button variant="outline" asChild className="">
                                <Link href="/productos">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Continuar Comprando
                                </Link>
                            </Button>
                        </div>

                        {/* Resumen del pedido */}
                        <div className="space-y-6">
                            {/* Cupón de descuento */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                                <Card className="py-4">
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <Tag className="w-5 h-5 mr-2" />
                                            Código de Descuento
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        {!appliedCoupon ? (
                                            <div className="space-y-3">
                                                <div className="flex space-x-2">
                                                    <Input
                                                        placeholder="Ingresa tu código"
                                                        value={couponCode}
                                                        onChange={(e) => setCouponCode(e.target.value)}
                                                        className="flex-1"
                                                    />
                                                    <Button onClick={handleApplyCoupon} disabled={isApplyingCoupon || !couponCode}>
                                                        {isApplyingCoupon ? (
                                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                        ) : (
                                                            "Aplicar"
                                                        )}
                                                    </Button>
                                                </div>
                                                <p className="text-xs text-muted-foreground">
                                                    Prueba con: <code className="bg-muted px-1 rounded">DESCUENTO10</code>
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                                                <div className="flex items-center space-x-2">
                                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                                    <span className="text-sm font-medium">Cupón aplicado</span>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setAppliedCoupon(null)}
                                                    className="text-red-600"
                                                >
                                                    Quitar
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Resumen de precios */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                                <Card className="py-4">
                                    <CardHeader>
                                        <CardTitle>Resumen del Pedido</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-3">
                                            <div className="flex justify-between">
                                                <span>Subtotal ({cartItems.length} productos)</span>
                                                <span>${subtotal.toLocaleString()}</span>
                                            </div>

                                            <div className="flex justify-between">
                                                <span className="flex items-center">
                                                    <Truck className="w-4 h-4 mr-1" />
                                                    Envío
                                                </span>
                                                <span className={shipping === 0 ? "text-green-600 font-medium" : ""}>
                                                    {shipping === 0 ? "Gratis" : `$${shipping.toLocaleString()}`}
                                                </span>
                                            </div>

                                            {appliedCoupon && (
                                                <div className="flex justify-between text-green-600">
                                                    <span className="flex items-center">
                                                        <Percent className="w-4 h-4 mr-1" />
                                                        Descuento (10%)
                                                    </span>
                                                    <span>-${discount.toLocaleString()}</span>
                                                </div>
                                            )}

                                            {savings > 0 && (
                                                <div className="flex justify-between text-green-600">
                                                    <span className="flex items-center">
                                                        <Gift className="w-4 h-4 mr-1" />
                                                        Ahorros totales
                                                    </span>
                                                    <span>-${savings.toLocaleString()}</span>
                                                </div>
                                            )}
                                        </div>

                                        <Separator />

                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total</span>
                                            <span className="text-primary">${total.toLocaleString()}</span>
                                        </div>

                                        <div className="space-y-3 pt-4">
                                            <Button className="w-full" size="lg" asChild>
                                                <Link href="/carrito/checkout">
                                                    <CreditCard className="w-4 h-4 mr-2" />
                                                    Proceder al Pago
                                                </Link>
                                            </Button>

                                            <div className="text-center">
                                                <p className="text-sm text-muted-foreground flex items-center justify-center">
                                                    <Clock className="w-4 h-4 mr-1" />
                                                    Entrega estimada: {estimatedDelivery}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Garantías */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                                <Card>
                                    <CardContent className="py-4">
                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-3 text-sm">
                                                <Shield className="w-4 h-4 text-green-600" />
                                                <span>Compra 100% segura</span>
                                            </div>
                                            <div className="flex items-center space-x-3 text-sm">
                                                <Truck className="w-4 h-4 text-blue-600" />
                                                <span>Envío con seguimiento</span>
                                            </div>
                                            <div className="flex items-center space-x-3 text-sm">
                                                <Star className="w-4 h-4 text-yellow-600" />
                                                <span>Garantía de satisfacción</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>

                            {/* Productos recomendados */}
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                                <Card className="py-4">
                                    <CardHeader>
                                        <CardTitle className="text-lg">También te puede interesar</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {recommendedProducts.slice(0, 2).map((product) => (
                                            <div key={product.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent">
                                                <div className="w-12 h-12 bg-muted rounded-lg"></div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">{product.name}</p>
                                                    <p className="text-sm text-primary">${product.price.toLocaleString()}</p>
                                                </div>
                                                <Button size="sm" variant="outline">
                                                    +
                                                </Button>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default CheckoutPage
