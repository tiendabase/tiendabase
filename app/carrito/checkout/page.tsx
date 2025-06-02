"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"

import type { RootState } from "@/store"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

import {
    ArrowLeft,
    CreditCard,
    Truck,
    Shield,
    Clock,
    MapPin,
    User,
    Lock,
    CheckCircle,
    AlertCircle,
    Package,
    Star,
    Zap,
} from "lucide-react"
import Navbar from "@/app/componentes/navbar"
import Image from "next/image"

interface FormData {
    email: string
    firstName: string
    lastName: string
    phone: string
    address: string
    city: string
    postalCode: string
    country: string
}

const CheckoutPage = () => {
    const router = useRouter()
    const { cartItems } = useSelector((state: RootState) => state.cart)

    const [currentStep, setCurrentStep] = useState(1)
    const [formData, setFormData] = useState<FormData>({
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
        country: "Argentina",
    })
    const [selectedPayment, setSelectedPayment] = useState("card")
    const [selectedShipping, setSelectedShipping] = useState("standard")
    const [isProcessing, setIsProcessing] = useState(false)
    const [errors, setErrors] = useState<Partial<FormData>>({})
    const [isGuest, setIsGuest] = useState(true)

    // Calcular totales
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.count, 0)
    const shippingCosts = {
        express: 2500,
        standard: 1200,
        pickup: 0,
    }
    const shipping = shippingCosts[selectedShipping as keyof typeof shippingCosts]
    const tax = subtotal * 0.21 // IVA 21%
    const total = subtotal + shipping + tax

    const steps = [
        { id: 1, title: "Información", icon: User },
        { id: 2, title: "Envío", icon: Truck },
        { id: 3, title: "Pago", icon: CreditCard },
        { id: 4, title: "Confirmación", icon: CheckCircle },
    ]

    const paymentMethods = [

        {
            id: "mercadopago",
            name: "Mercado Pago",
            icon: "/placeholder.svg?height=40&width=60&text=MP",
            description: "Paga con tu cuenta de Mercado Pago",
            discount: 5,
        },
        {
            id: "transfer",
            name: "Transferencia Bancaria",
            icon: "/placeholder.svg?height=40&width=60&text=BANK",
            description: "Transferencia directa",
            discount: 10,
        },
    ]

    const shippingOptions = [
        {
            id: "express",
            name: "Envío Express",
            price: 2500,
            time: "1-2 días hábiles",
            icon: Zap,
            description: "Entrega rápida con seguimiento",
        },
        {
            id: "standard",
            name: "Envío Estándar",
            price: 1200,
            time: "3-5 días hábiles",
            icon: Truck,
            description: "Envío regular con seguimiento",
            popular: true,
        },
        {
            id: "pickup",
            name: "Retiro en Tienda",
            price: 0,
            time: "Disponible hoy",
            icon: MapPin,
            description: "Retira en nuestro local",
        },
    ]

    useEffect(() => {
        if (cartItems.length === 0) {
            router.push("/carrito")
        }
    }, [cartItems, router])

    const validateForm = () => {
        const newErrors: Partial<FormData> = {}

        if (!formData.email) newErrors.email = "Email requerido"
        if (!formData.firstName) newErrors.firstName = "Nombre requerido"
        if (!formData.lastName) newErrors.lastName = "Apellido requerido"
        if (!formData.phone) newErrors.phone = "Teléfono requerido"
        if (!formData.address) newErrors.address = "Dirección requerida"
        if (!formData.city) newErrors.city = "Ciudad requerida"
        if (!formData.postalCode) newErrors.postalCode = "Código postal requerido"

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }))
        }
    }

    const handleNextStep = () => {
        if (currentStep === 1 && !validateForm()) return
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handlePreviousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleProcessPayment = async () => {
        setIsProcessing(true)
        // Simular procesamiento de pago
        await new Promise((resolve) => setTimeout(resolve, 3000))
        setIsProcessing(false)
        setCurrentStep(4)
    }

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        {/* Opciones de usuario */}
                        <Card>
                            <CardHeader className="mb-2">
                                <CardTitle className="flex items-center">
                                    <User className="w-5 h-5 mr-2" />
                                    Información de Contacto
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {isGuest && (
                                    <Alert >
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>
                                            ¿Ya tienes cuenta?{" "}
                                            <Button variant="link" className="p-0 h-auto text-md" onClick={() => setIsGuest(false)}>
                                                Inicia sesión
                                            </Button>{" "}
                                            para una experiencia más rápida.
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange("email", e.target.value)}
                                            className={errors.email ? "border-red-500" : ""}
                                            placeholder="tu@email.com"
                                        />
                                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Teléfono *</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => handleInputChange("phone", e.target.value)}
                                            className={errors.phone ? "border-red-500" : ""}
                                            placeholder="+54 11 1234-5678"
                                        />
                                        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Información de envío */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <MapPin className="w-5 h-5 mr-2" />
                                    Dirección de Envío
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">Nombre *</Label>
                                        <Input
                                            id="firstName"
                                            value={formData.firstName}
                                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                                            className={errors.firstName ? "border-red-500" : ""}
                                            placeholder="Juan"
                                        />
                                        {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Apellido *</Label>
                                        <Input
                                            id="lastName"
                                            value={formData.lastName}
                                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                                            className={errors.lastName ? "border-red-500" : ""}
                                            placeholder="Pérez"
                                        />
                                        {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="address">Dirección *</Label>
                                    <Input
                                        id="address"
                                        value={formData.address}
                                        onChange={(e) => handleInputChange("address", e.target.value)}
                                        className={errors.address ? "border-red-500" : ""}
                                        placeholder="Av. Corrientes 1234, Piso 5, Depto A"
                                    />
                                    {errors.address && <p className="text-sm text-red-500">{errors.address}</p>}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="city">Ciudad *</Label>
                                        <Input
                                            id="city"
                                            value={formData.city}
                                            onChange={(e) => handleInputChange("city", e.target.value)}
                                            className={errors.city ? "border-red-500" : ""}
                                            placeholder="Buenos Aires"
                                        />
                                        {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="postalCode">Código Postal *</Label>
                                        <Input
                                            id="postalCode"
                                            value={formData.postalCode}
                                            onChange={(e) => handleInputChange("postalCode", e.target.value)}
                                            className={errors.postalCode ? "border-red-500" : ""}
                                            placeholder="1000"
                                        />
                                        {errors.postalCode && <p className="text-sm text-red-500">{errors.postalCode}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="country">País</Label>
                                        <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Argentina">Argentina</SelectItem>
                                                <SelectItem value="Chile">Chile</SelectItem>
                                                <SelectItem value="Uruguay">Uruguay</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )

            case 2:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Truck className="w-5 h-5 mr-2" />
                                    Método de Envío
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping} className="space-y-4">
                                    {shippingOptions.map((option) => (
                                        <div key={option.id} className="relative">
                                            <div
                                                className={`flex items-center space-x-4 p-4 border rounded-lg cursor-pointer transition-all ${selectedShipping === option.id
                                                    ? "border-primary bg-primary/5"
                                                    : "border-border hover:border-primary/50"
                                                    }`}
                                            >
                                                <RadioGroupItem value={option.id} id={option.id} />
                                                <div className="flex items-center space-x-3 flex-1">
                                                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                                                        <option.icon className="w-6 h-6 text-primary" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2">
                                                            <Label htmlFor={option.id} className="font-semibold cursor-pointer">
                                                                {option.name}
                                                            </Label>
                                                            {option.popular && <Badge className="bg-green-500">Popular</Badge>}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">{option.description}</p>
                                                        <p className="text-sm font-medium text-primary">{option.time}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-lg">
                                                            {option.price === 0 ? "Gratis" : `$${option.price.toLocaleString()}`}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </CardContent>
                        </Card>
                    </motion.div>
                )

            case 3:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <Card>
                            <CardHeader className="mb-4">
                                <CardTitle className="flex items-center">
                                    <CreditCard className="w-5 h-5 mr-2" />
                                    Método de Pago
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <RadioGroup value={selectedPayment} onValueChange={setSelectedPayment} className="space-y-4">
                                    {paymentMethods.map((method) => (
                                        <div key={method.id} className="relative">
                                            <div
                                                className={`flex items-center space-x-4 p-4 border rounded-lg cursor-pointer transition-all ${selectedPayment === method.id
                                                    ? "border-primary bg-primary/5"
                                                    : "border-border hover:border-primary/50"
                                                    }`}
                                            >
                                                <RadioGroupItem value={method.id} id={method.id} />
                                                <div className="flex items-center space-x-3 flex-1">
                                                    <div className="w-16 h-10 bg-muted rounded flex items-center justify-center">
                                                        <div className="w-12 h-6 bg-gray-300 rounded text-xs flex items-center justify-center">
                                                            {method.name.slice(0, 4)}
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center space-x-2">
                                                            <Label htmlFor={method.id} className="font-semibold cursor-pointer">
                                                                {method.name}
                                                            </Label>
                                                          
                                                            {method.discount && <Badge className="bg-green-500">{method.discount}% OFF</Badge>}
                                                        </div>
                                                        <p className="text-sm text-muted-foreground">{method.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </RadioGroup>

                                {selectedPayment === "card" && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="mt-6 space-y-4"
                                    >
                                        <Separator />
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Número de Tarjeta</Label>
                                                <Input placeholder="1234 5678 9012 3456" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Nombre en la Tarjeta</Label>
                                                <Input placeholder="Juan Pérez" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Fecha de Vencimiento</Label>
                                                <Input placeholder="MM/AA" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>CVV</Label>
                                                <Input placeholder="123" type="password" />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent >
                                <div className="flex items-center gap-3">
                                    <Checkbox id="terms" />
                                    <Label htmlFor="terms" className="text-sm">
                                        <p>
                                            Acepto los{" "}
                                            <Link href="/terminos" className="text-primary hover:underline">
                                                términos y condiciones
                                            </Link>{" "}
                                            y la{" "}
                                            <Link href="/privacidad" className="text-primary hover:underline">
                                                política de privacidad
                                            </Link>
                                        </p>
                                    </Label>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )

            case 4:
                return (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center space-y-6"
                    >
                        <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold mb-2">¡Pedido Confirmado!</h2>
                            <p className="text-muted-foreground">
                                Tu pedido #12345 ha sido procesado exitosamente. Recibirás un email de confirmación en breve.
                            </p>
                        </div>
                        <div className="flex justify-center space-x-4">
                            <Button asChild>
                                <Link href="/pedidos">Ver Mis Pedidos</Link>
                            </Button>
                            <Button variant="outline" asChild>
                                <Link href="/productos">Seguir Comprando</Link>
                            </Button>
                        </div>
                    </motion.div>
                )

            default:
                return null
        }
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-background pt-24">
                <div className="container mx-auto px-4 py-8">
                    {/* Progress Steps */}
                    <div className="mb-8">
                        <div className="flex items-center justify-center space-x-8 mb-6">
                            {steps.map((step) => (
                                <div key={step.id} className="flex flex-col items-center">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-wrap transition-all ${currentStep >= step.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                            }`}
                                    >
                                        <step.icon className="w-5 h-5" />
                                    </div>
                                    <span
                                        className={`text-sm font-medium ${currentStep >= step.id ? "text-primary mt-2" : "text-muted-foreground"
                                            }`}
                                    >
                                        {step.title}
                                    </span>

                                </div>
                            ))}
                        </div>
                        <Progress value={(currentStep / steps.length) * 100} className="h-2" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Formulario principal */}
                        <div className="lg:col-span-2">
                            <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>

                            {/* Botones de navegación */}
                            {currentStep < 4 && (
                                <div className="flex justify-between mt-8">
                                    <Button variant="outline" onClick={handlePreviousStep} disabled={currentStep === 1}>
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Anterior
                                    </Button>

                                    {currentStep < 3 ? (
                                        <Button onClick={handleNextStep}>
                                            Siguiente
                                            <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                                        </Button>
                                    ) : (
                                        <Button onClick={handleProcessPayment} disabled={isProcessing} size="lg">
                                            {isProcessing ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                                    Procesando...
                                                </>
                                            ) : (
                                                <>
                                                    <Lock className="w-4 h-4 mr-2" />
                                                    Confirmar Pago
                                                </>
                                            )}
                                        </Button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Resumen del pedido */}
                        <div className="space-y-6">
                            <Card className="sticky top-24">
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Package className="w-5 h-5 mr-2" />
                                        Resumen del Pedido
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Productos */}
                                    <div className="space-y-3 max-h-60 my-3">
                                        {cartItems.map((item) => (
                                            <div key={item.id} className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-muted rounded-lg relative">
                                                    <Badge className="absolute -top-1 -right-1 z-5 w-5 h-5 p-0 flex items-center justify-center text-xs">
                                                        {item.count}
                                                    </Badge>
                                                    <Image className="object-cover rounded" src={item.thumb} alt="" fill />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                                                </div>
                                                <p className="text-sm font-semibold">${(item.price * item.count).toLocaleString()}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <Separator />

                                    {/* Cálculos */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Subtotal</span>
                                            <span>${subtotal.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>Envío</span>
                                            <span>{shipping === 0 ? "Gratis" : `$${shipping.toLocaleString()}`}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span>IVA (21%)</span>
                                            <span>${tax.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span className="text-primary">${total.toLocaleString()}</span>
                                    </div>

                                    {/* Garantías */}
                                    <div className="space-y-2 pt-4">
                                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                            <Shield className="w-4 h-4 text-green-600" />
                                            <span>Compra 100% segura</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                            <Clock className="w-4 h-4 text-blue-600" />
                                            <span>Entrega garantizada</span>
                                        </div>
                                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                            <Star className="w-4 h-4 text-yellow-600" />
                                            <span>Satisfacción garantizada</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CheckoutPage
