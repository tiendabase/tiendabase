"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel"

import {
    ArrowRight,
    ShieldCheck,
    Truck,
    UsersRound,
    Play,
    Star,
    Timer,
    Sparkles,
    TrendingUp,
    Gift,
    Zap,
} from "lucide-react"

const Hero = () => {
    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)
    const [count, setCount] = useState(0)
    const [timeLeft, setTimeLeft] = useState({
        hours: 23,
        minutes: 45,
        seconds: 30,
    })

    // Auto-play del carrusel
    useEffect(() => {
        if (!api) return

        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap() + 1)

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1)
        })

        // Auto-play cada 5 segundos
        const interval = setInterval(() => {
            api.scrollNext()
        }, 5000)

        return () => clearInterval(interval)
    }, [api])

    // Countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 }
                } else if (prev.minutes > 0) {
                    return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
                } else if (prev.hours > 0) {
                    return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
                }
                return prev
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    const slides = [
        {
            id: 1,
            image: "/images/slide-1.jpg",
            title: "Rebajas de Verano",
            subtitle: "Hasta 70% de descuento",
            description: "Descubre las últimas tendencias con precios increíbles",
            cta: "Comprar Ahora",
            ctaSecondary: "Ver Catálogo",
            offer: "70% OFF",
            gradient: "from-purple-900/80 via-blue-900/60 to-transparent",
        },
        {
            id: 2,
            image: "/images/slide-2.jpg",
            title: "Estilo Urbano",
            subtitle: "Convierte tu look en una declaración",
            description: "Prendas únicas para personalidades auténticas",
            cta: "Explorar",
            ctaSecondary: "Lookbook",
            offer: "Nuevo",
            gradient: "from-orange-900/80 via-red-900/60 to-transparent",
        },
    ]

    return (
        <section className="relative overflow-hidden">
            <Carousel className="w-full" opts={{ loop: true }}>
                <CarouselContent>
                    {slides.map((slide, index) => (
                        <CarouselItem key={slide.id}>
                            <div className="relative h-[500px] md:h-[700px] overflow-hidden">
                                {/* Imagen de fondo */}
                                <Image
                                    src={slide.image || "/placeholder.svg"}
                                    alt={slide.title}
                                    fill
                                    className="object-cover"
                                    priority={index === 0}
                                    sizes="100vw"
                                />

                                {/* Overlay con gradiente */}
                                <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />

                                {/* Partículas animadas */}
                                <div className="absolute inset-0">
                                    {[...Array(20)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            className="absolute w-1 h-1 bg-white/20 rounded-full"
                                            style={{
                                                left: `${Math.random() * 100}%`,
                                                top: `${Math.random() * 100}%`,
                                            }}
                                            animate={{
                                                y: [0, -20, 0],
                                                opacity: [0.2, 0.8, 0.2],
                                            }}
                                            transition={{
                                                duration: 3 + Math.random() * 2,
                                                repeat: Number.POSITIVE_INFINITY,
                                                delay: Math.random() * 2,
                                            }}
                                        />
                                    ))}
                                </div>

                                {/* Contenido principal */}
                                <div className="relative h-full flex items-center">
                                    <div className="container mx-auto px-6 md:px-12 lg:px-20">
                                        <div className="max-w-2xl">
                                        

                                            <motion.h1
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.3 }}
                                                className="text-white text2xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight"
                                            >
                                                {slide.title}
                                            </motion.h1>

                                            <motion.h2
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.4 }}
                                                className="text-white/90 text-xl md:text-2xl lg:text-3xl font-semibold mb-4"
                                            >
                                                {slide.subtitle}
                                            </motion.h2>

                                            <motion.p
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.5 }}
                                                className="text-white/80 md:text-lg mb-8 max-w-lg"
                                            >
                                                {slide.description}
                                            </motion.p>

                                            {/* Countdown Timer para ofertas */}
                                            {slide.id === 1 && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 30 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.6 }}
                                                    className="mb-8"
                                                >
                                                    <div className="flex items-center space-x-2 mb-4">
                                                        <Timer className="w-5 h-5 text-red-400" />
                                                        <span className="text-white/90 font-semibold">¡Oferta por tiempo limitado!</span>
                                                    </div>
                                                    <div className="flex space-x-4">
                                                        {Object.entries(timeLeft).map(([unit, value]) => (
                                                            <div key={unit} className="text-center">
                                                                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 min-w-[60px]">
                                                                    <div className="text-white text-2xl font-bold">
                                                                        {value.toString().padStart(2, "0")}
                                                                    </div>
                                                                </div>
                                                                <div className="text-white/70 text-xs mt-1 capitalize">{unit}</div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}

                                            {/* Botones de acción */}
                                            <motion.div
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.7 }}
                                                className="flex flex-col sm:flex-row gap-4"
                                            >
                                                <Link href="/productos">
                                                    <Button  className="group bg-white text-foreground hover:bg-white/90">
                                                        <ArrowRight className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                                                        {slide.cta}
                                                    </Button>
                                                </Link>
                                                <Link href="/catalogo">
                                                    <Button
                                                        variant="outline"
                                                        className="borde hover:bg-white hover:text-foreground"
                                                    >
                                                        <Play className="w-4 h-4 mr-2" />
                                                        {slide.ctaSecondary}
                                                    </Button>
                                                </Link>
                                            </motion.div>
                                        </div>
                                    </div>

                                    {/* Oferta destacada */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                        transition={{ delay: 0.8, type: "spring" }}
                                        className="absolute top-8 right-8 hidden lg:block"
                                    >
                                        <div className="bg-red-500 text-white rounded-full w-24 h-24 flex items-center justify-center transform rotate-12 shadow-2xl">
                                            <div className="text-center">
                                                <div className="text-sm font-bold">{slide.offer}</div>
                                                {slide.id === 1 && <div className="text-xs">DESCUENTO</div>}
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Controles de navegación */}
                <div className="absolute bottom-20 md:bottom-32 right-6 md:right-12 flex gap-4">
                    <CarouselPrevious className="relative inset-auto bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-foreground" />
                    <CarouselNext className="relative inset-auto bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white hover:text-foreground" />
                </div>

            </Carousel>


        </section>
    )
}

export default Hero
