"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSelector } from "react-redux"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

import type { RootState } from "@/store"
import {
    Search,
    ShoppingCart,
    User,
    Menu,
    Heart,
    Shirt,
    Zap,
    Gift,
    Truck,
    X,
    TrendingUp,
    Star,
    Package,
} from "lucide-react"
import Image from "next/image"

const Navbar = () => {
    const pathname = usePathname()
    const { cartItems } = useSelector((state: RootState) => state.cart)
    const { favProducts } = useSelector((state: RootState) => state.user)

    const [isScrolled, setIsScrolled] = useState(false)
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const searchRef = useRef<HTMLInputElement>(null)

    // Detectar scroll para cambiar el estilo del navbar
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // Enfocar búsqueda cuando se abre
    useEffect(() => {
        if (isSearchOpen && searchRef.current) {
            searchRef.current.focus()
        }
    }, [isSearchOpen])

    const isHomePage = pathname === "/"

    const navLinks = [
        { href: "/productos", label: "Productos", icon: Shirt },
        { href: "/ofertas", label: "Ofertas", icon: Zap, badge: "HOT" },
        { href: "/nuevos", label: "Nuevos", icon: TrendingUp },

    ]

    const categories = [
        { name: "Camisetas", href: "/categoria/camisetas", count: 120 },
        { name: "Pantalones", href: "/categoria/pantalones", count: 85 },
        { name: "Vestidos", href: "/categoria/vestidos", count: 95 },
        { name: "Accesorios", href: "/categoria/accesorios", count: 200 },
        { name: "Zapatos", href: "/categoria/zapatos", count: 150 },
        { name: "Abrigos", href: "/categoria/abrigos", count: 60 },
    ]

    const searchSuggestions = [
        "Camisetas básicas",
        "Jeans slim fit",
        "Vestidos de verano",
        "Zapatillas deportivas",
        "Accesorios de moda",
    ]

    const recentProducts = [
        { id: 1, name: "Camiseta Premium", price: 15000, image: "/placeholder.svg?height=60&width=60" },
        { id: 2, name: "Jeans Slim Fit", price: 25000, image: "/placeholder.svg?height=60&width=60" },
        { id: 3, name: "Vestido Casual", price: 35000, image: "/placeholder.svg?height=60&width=60" },
    ]

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            // Redirigir a página de búsqueda
            console.log("Buscar:", searchQuery)
            setIsSearchOpen(false)
            setSearchQuery("")
        }
    }

    return (
        <>
            {/* Navbar principal */}
            <motion.header
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                className={`fixed top-0 w-screen mx-auto z-50 px-5 transition-all duration-300 ${isScrolled || !isHomePage
                    ? "bg-primary backdrop-blur-md shadow"
                    : "bg-transparent"
                    }`}
            >
                <div className="container mx-auto">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-2">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className={` font-bold ${isScrolled || !isHomePage ? "text-foreground" : "text-white"}`}
                            >
                                <Image
                                    className="aspect-square mt-1 w-20" src="/logo.png" alt="logo" width={100} height={100} />
                            </motion.div>
                        </Link>

                        {/* Navegación principal - Desktop */}
                        <nav className="hidden lg:flex items-center space-x-8">
                            {navLinks.map((link) => (
                                <div key={link.href} className="relative group">
                                    <Link
                                        href={link.href}
                                        className={`flex items-center space-x-1  py-2 rounded-lg transition-all duration-200 text-secondary`}
                                    >
                                        <span className="font-medium">{link.label}</span>
                                        {link.badge && <Badge variant="destructive" className="ml-1">{link.badge}</Badge>}
                                    </Link>

                                    {/* Mega menu para productos */}
                                    {link.href === "/productos" && (
                                        <div className="absolute top-full left-0 w-96 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 pt-2">
                                            <Card className="shadow-xl border-0">
                                                <CardContent className="p-6">
                                                    <h3 className="font-semibold mb-4">Categorías</h3>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {categories.map((category) => (
                                                            <Link
                                                                key={category.name}
                                                                href={category.href}
                                                                className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors"
                                                            >
                                                                <span className="text-sm">{category.name}</span>
                                                                <Badge variant="secondary" className="text-xs">
                                                                    {category.count}
                                                                </Badge>
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>

                        {/* Acciones del usuario */}
                        <div className="flex items-center space-x-2 mr-3">
                            {/* Búsqueda */}
                            <Button
                                variant="link"
                                size="icon"
                                onClick={() => setIsSearchOpen(true)}
                                className={`text-secondary`}
                            >
                                <Search className="w-5 h-5" />
                            </Button>

                            {/* Favoritos */}
                            <Button
                                variant="link"
                                size="icon"
                                className={"text-secondary relative"}
                                asChild
                            >
                                <Link href="/favoritos">
                                    <Heart className="w-5 h-5" />
                                    {favProducts.length > 0 && (
                                        <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                                            {favProducts.length}
                                        </Badge>
                                    )}
                                </Link>
                            </Button>

                            {/* Carrito */}
                            <div className="relative">
                                <Button
                                    variant="link"
                                    size="icon"
                                    className={"text-secondary"}
                                    asChild
                                >
                                    <Link href="/carrito">
                                        <ShoppingCart className="w-5 h-5" />
                                        {cartItems.length > 0 && (
                                            <Badge className="absolute -top-1 -right-1 w-5 h-5 ">
                                                {cartItems.length}
                                            </Badge>
                                        )}
                                    </Link>
                                </Button>


                            </div>


                            <Link href='/login'>
                                <Button
                                    variant="link"
                                    size="icon"
                                    className="text-secondary"
                                >
                                    <User className="w-5 h-5" />
                                </Button>
                            </Link>

                            {/* Menú móvil */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="link"
                                        size="icon"
                                        className={`lg:hidden text-secondary`}
                                    >
                                        <Menu className="w-5 h-5" />
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="right" className="text-md p-5" >
                                    <SheetHeader>
                                        <SheetTitle>Menú</SheetTitle>
                                        <SheetDescription>Navega por nuestra tienda</SheetDescription>
                                    </SheetHeader>
                                    <div className="mt-6 space-y-4">
                                        {navLinks.map((link) => (
                                            <Link
                                                key={link.href}
                                                href={link.href}
                                                className="flex items-center space-x-3 p-2  rounded-lg hover:bg-secondary transition-colors"
                                            >
                                                <link.icon className="size-4" />
                                                <span>{link.label}</span>
                                                {link.badge && <Badge className="ml-auto bg-red-500 text-white">{link.badge}</Badge>}
                                            </Link>
                                        ))}
                                        <Separator />
                                        <h3 className="font-semibold">Categorías</h3>
                                        {categories.slice(0, 4).map((category) => (
                                            <Link
                                                key={category.name}
                                                href={category.href}
                                                className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary transition-colors"
                                            >
                                                <span>{category.name}</span>
                                                <Badge variant="secondary">{category.count}</Badge>
                                            </Link>
                                        ))}
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </motion.header>

            {/* Modal de búsqueda */}
            <AnimatePresence>
                {isSearchOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-20"
                        onClick={() => setIsSearchOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className="w-full max-w-2xl mx-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Card className="shadow-2xl">
                                <CardContent >
                                    <form onSubmit={handleSearchSubmit} className="space-y-4">
                                        <div className="relative">
                                            <Input
                                                ref={searchRef}
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                placeholder="¿Qué estás buscando?"
                                            />
                                            <Button
                                                type="button"
                                                variant="link"
                                                size="icon"
                                                onClick={() => setIsSearchOpen(false)}
                                                className="absolute right-1 top-1/2 -translate-y-1/2"
                                            >
                                                <X className="w-5 h-5" />
                                            </Button>
                                        </div>

                                        {/* Sugerencias de búsqueda */}
                                        {searchQuery === "" && (
                                            <div className="space-y-4">
                                                <div>
                                                    <h3 className="font-semibold mb-3">Búsquedas populares</h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {searchSuggestions.map((suggestion) => (
                                                            <Button
                                                                key={suggestion}
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => setSearchQuery(suggestion)}
                                                                className="text-sm"
                                                            >
                                                                {suggestion}
                                                            </Button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <Separator />

                                                <div>
                                                    <h3 className="font-semibold mb-3">Productos recientes</h3>
                                                    <div className="space-y-3">
                                                        {recentProducts.map((product) => (
                                                            <div
                                                                key={product.id}
                                                                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent cursor-pointer"
                                                            >
                                                                <div className="w-12 h-12 bg-muted rounded-lg"></div>
                                                                <div className="flex-1">
                                                                    <p className="font-medium">{product.name}</p>
                                                                    <p className="text-sm text-muted-foreground">${product.price.toLocaleString()}</p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default Navbar
