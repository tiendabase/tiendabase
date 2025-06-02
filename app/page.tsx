"use client"

import type React from "react"

import Image from "next/image"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

import Hero from "./componentes/hero"
import Navbar from "./componentes/navbar"
import ProductoItem from "./componentes/producto"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

import {
  CreditCard,
  DollarSign,
  ShieldCheck,
  Truck,
  Star,
  Users,
  Package,
  ArrowRight,
  Mail,
  Instagram,
  Facebook,
  Twitter,
  TrendingUp,
  Award,
  Heart,
} from "lucide-react"

import type { Imagen, Producto, Variante } from "@prisma/client"
import Footer from "./componentes/footer"

// Componente de skeleton loader
const ProductSkeleton = () => (
  <div className="animate-pulse">
    <div className="aspect-square bg-muted rounded-lg mb-4"></div>
    <div className="h-4 bg-muted rounded mb-2"></div>
    <div className="h-4 bg-muted rounded w-3/4"></div>
  </div>
)

// Componente de estadísticas
const StatsSection = () => {
  const stats = [
    { icon: Users, label: "Clientes Felices", value: "50,000+", color: "text-blue-600" },
    { icon: Package, label: "Productos Vendidos", value: "200,000+", color: "text-green-600" },
    { icon: Award, label: "Años de Experiencia", value: "15+", color: "text-purple-600" },
    { icon: Star, label: "Calificación Promedio", value: "4.9/5", color: "text-yellow-600" },
  ]

  return (
    <section className="py-16 bg-gradient-to-r from-primary/5 to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-background shadow-lg mb-4`}
              >
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Componente de testimonios
const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "María González",
      rating: 5,
      comment: "Excelente calidad y envío súper rápido. Definitivamente volveré a comprar.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Carlos Rodríguez",
      rating: 5,
      comment: "La mejor tienda online que he encontrado. Productos únicos y precios justos.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Ana Martínez",
      rating: 5,
      comment: "Atención al cliente excepcional. Me ayudaron a elegir la talla perfecta.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
  ]

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Lo que dicen nuestros clientes</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Miles de clientes satisfechos confían en nosotros para sus compras de moda
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Image
                      src={testimonial.avatar || "/placeholder.svg"}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="rounded-full mr-4"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.comment}"</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Componente de newsletter
const NewsletterSection = () => {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // Simular suscripción
    setIsSubscribed(true)
    setTimeout(() => setIsSubscribed(false), 3000)
    setEmail("")
  }

  return (
    <section className="py-16 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-4">¡No te pierdas nuestras ofertas!</h2>
          <p className="text-primary-foreground/80 mb-8">
            Suscríbete a nuestro newsletter y recibe descuentos exclusivos, nuevos productos y tendencias de moda
          </p>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto justify-center">
            <Input
              type="email"
              placeholder="Tu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white text-foreground rounded-full"
              required
            />
            <Button type="submit" variant="secondary" className="whitespace-nowrap">
              {isSubscribed ? (
                <>
                  <Heart className="w-4 h-4 mr-2" />
                  ¡Suscrito!
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Suscribirse
                </>
              )}
            </Button>
          </form>

          {isSubscribed && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-primary-foreground/80"
            >
              ¡Gracias! Revisa tu email para confirmar la suscripción.
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  )
}

export default function Home() {
  const [productos, setProductos] = useState<(Producto & { variantes: Variante[]; imagenes: Imagen[] })[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/producto/mostrar", { method: "GET" })
      .then((res) => res.json())
      .then((data) => {
        setProductos(data)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  const beneficios = [
    {
      icon: Truck,
      title: "Envío Gratis",
      description: "En compras superiores a $50.000 enviamos gratis a todo el país",
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-100",
    },
    {
      icon: CreditCard,
      title: "Pagos Seguros",
      description: "Procesamos todos los pagos de forma segura con encriptación SSL",
      color: "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-100",
    },
    {
      icon: DollarSign,
      title: "Garantía de Devolución",
      description: "30 días para devolver tu producto si no estás completamente satisfecho",
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-100",
    },
    {
      icon: ShieldCheck,
      title: "Calidad Premium",
      description: "Productos cuidadosamente seleccionados con los mejores materiales",
      color: "bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-100",
    },
  ]

  const colecciones = [
    {
      title: "Nuevas Llegadas",
      subtitle: "¡Las últimas tendencias ya están aquí!",
      image: "/images/featured-1.jpg",
      badge: "Nuevo",
      badgeColor: "bg-green-500",
    },
    {
      title: "Camisetas Básicas",
      subtitle: "Comodidad y estilo para el día a día",
      image: "/images/featured-2.jpg",
      badge: "Bestseller",
      badgeColor: "bg-blue-500",
    },
    {
      title: "Ofertas de Invierno",
      subtitle: "Hasta 50% de descuento en ropa de abrigo",
      image: "/images/featured-3.jpg",
      badge: "50% OFF",
      badgeColor: "bg-red-500",
    },
  ]

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />

      {/* Estadísticas */}
      <StatsSection />

      {/* Productos Destacados */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <Badge className="mb-4" variant="secondary">
              <TrendingUp className="w-4 h-4 mr-2" />
              Productos Destacados
            </Badge>
            <h2 className="text-3xl font-bold mb-4">Los más vendidos</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Descubre los productos favoritos de nuestros clientes, seleccionados por su calidad y estilo únicos
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {isLoading
              ? [...Array(8)].map((_, i) => <ProductSkeleton key={i} />)
              : productos.slice(0, 8).map((producto, index) => (
                <motion.div
                  key={producto.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ProductoItem producto={producto} />
                </motion.div>
              ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" className="group">
              Ver todos los productos
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Colecciones Destacadas */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Colecciones Especiales</h2>
            <p className="text-muted-foreground">Explora nuestras colecciones cuidadosamente curadas</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {colecciones.map((coleccion, index) => (
              <motion.div
                key={coleccion.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <Card className="overflow-hidden h-80 relative">
                  <div className="absolute inset-0">
                    <Image
                      src={coleccion.image || "/placeholder.svg"}
                      alt={coleccion.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                  </div>

                  <CardContent className="relative h-full flex flex-col justify-between p-6 text-white">
                    <div>
                      <Badge className={`${coleccion.badgeColor} text-white mb-4`}>{coleccion.badge}</Badge>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold mb-2">{coleccion.title}</h3>
                      <p className="text-white/80 mb-4">{coleccion.subtitle}</p>
                      <Button
                        variant="secondary"
                        className="group-hover:bg-white group-hover:text-foreground transition-colors"
                      >
                        Explorar Colección
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <TestimonialsSection />

      {/* Por qué elegirnos */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">¿Por qué elegir E-Shop?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Nos comprometemos a brindarte la mejor experiencia de compra online con beneficios únicos
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {beneficios.map((beneficio, index) => (
              <motion.div
                key={beneficio.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="text-center h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${beneficio.color} mb-6`}
                    >
                      <beneficio.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold mb-3">{beneficio.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{beneficio.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <NewsletterSection />

      {/* Redes Sociales */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Síguenos en redes sociales</h2>
            <p className="text-muted-foreground mb-8">
              Mantente al día con las últimas tendencias y ofertas exclusivas
            </p>

            <div className="flex justify-center space-x-4">
              <Button variant="outline" size="icon" className="rounded-full">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button variant="outline" size="icon" className="rounded-full">
                <Twitter className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square relative rounded-lg overflow-hidden group cursor-pointer">
                <Image
                  src={`/placeholder.svg?height=200&width=200&text=Instagram+${i + 1}`}
                  alt={`Instagram post ${i + 1}`}
                  fill
                  className="object-cover transition-transform group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <Instagram className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
