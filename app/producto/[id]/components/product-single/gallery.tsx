"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import type { Imagen } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Download, Share2, Maximize2 } from "lucide-react"

interface GalleryProps {
  imagenes: Imagen[]
}

const ProductGallery = ({ imagenes }: GalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const imageRef = useRef<HTMLDivElement>(null)

  // Filtrar y ordenar imágenes
  const sortedImages = imagenes.sort((a, b) => a.orden - b.orden)
  const mainImage = sortedImages[selectedIndex]

  // Navegación con teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault()
          goToPrevious()
          break
        case "ArrowRight":
          e.preventDefault()
          goToNext()
          break
        case "Escape":
          setIsLightboxOpen(false)
          break
        case "+":
        case "=":
          e.preventDefault()
          handleZoomIn()
          break
        case "-":
          e.preventDefault()
          handleZoomOut()
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isLightboxOpen, selectedIndex])

  const goToNext = () => {
    setSelectedIndex((prev) => (prev + 1) % sortedImages.length)
    resetZoom()
  }

  const goToPrevious = () => {
    setSelectedIndex((prev) => (prev - 1 + sortedImages.length) % sortedImages.length)
    resetZoom()
  }

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 1))
  }

  const resetZoom = () => {
    setZoomLevel(1)
    setRotation(0)
    setIsZoomed(false)
  }

  const handleRotate = () => {
    setRotation((prev) => prev + 90)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current || !isZoomed) return

    const rect = imageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setMousePosition({ x, y })
  }

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isZoomed) {
      setIsZoomed(false)
      setZoomLevel(1)
    } else {
      setIsZoomed(true)
      setZoomLevel(2)
      handleMouseMove(e)
    }
  }



  if (!sortedImages.length) {
    return (
      <div className="flex items-center justify-center h-96 bg-muted rounded-lg">
        <p className="text-muted-foreground">No hay imágenes disponibles</p>
      </div>
    )
  }

  return (
    <div className="space-y-4 w-full mx-auto md:w-full">
      {/* Imagen principal */}
      <div className="relative group">
        <div
          ref={imageRef}
          className="relative aspect-square overflow-hidden rounded-lg bg-muted cursor-zoom-in"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={handleImageClick}
        >
          <Image
            src={mainImage.url || "/placeholder.svg"}
            alt={mainImage.productoId || `Imagen ${selectedIndex + 1}`}
            fill
            className={`object-cover transition-transform duration-300 ${isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
              }`}
            style={{
              transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
              transformOrigin: isZoomed ? `${mousePosition.x}% ${mousePosition.y}%` : "center",
            }}
            priority={selectedIndex === 0}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Overlay con controles */}
          <div
            className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${isHovering ? "opacity-100" : "opacity-0"
              }`}
          >
            {/* Navegación */}
            {sortedImages.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    goToPrevious()
                  }}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation()
                    goToNext()
                  }}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}

            {/* Controles superiores */}
            <div className="absolute top-2 right-2 flex space-x-1">
              <Button
                variant="secondary"
                size="icon"
                className="opacity-80 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsLightboxOpen(true)
                }}
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
             
            </div>

            {/* Indicador de zoom */}
            {isZoomed && (
              <div className="absolute bottom-2 left-2">
                <Badge variant="secondary" className="opacity-80">
                  {Math.round(zoomLevel * 100)}%
                </Badge>
              </div>
            )}
          </div>

          {/* Indicador de imagen actual */}
          {sortedImages.length > 1 && (
            <div className="absolute bottom-2 right-2">
              <Badge variant="secondary" className="opacity-80">
                {selectedIndex + 1} / {sortedImages.length}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Thumbnails */}
      {sortedImages.length > 1 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-muted-foreground">Más vistas</h3>
            <div className="flex space-x-1">
              <Button variant="outline" size="sm" onClick={goToPrevious} disabled={selectedIndex === 0}>
                <ChevronLeft className="w-3 h-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNext}
                disabled={selectedIndex === sortedImages.length - 1}
              >
                <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-2">
            {sortedImages.map((imagen, index) => (
              <button
                key={imagen.id}
                className={`relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 transition-all duration-200 ${index === selectedIndex
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50"
                  }`}
                onClick={() => {
                  setSelectedIndex(index)
                  resetZoom()
                }}
              >
                <Image
                  src={imagen.url || "/placeholder.svg"}
                  alt={imagen.productoId || `Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
                {index === selectedIndex && <div className="absolute inset-0 bg-primary/10" />}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-7xl w-[98%] h-[90vh] p-0">
          <DialogHeader className="absolute top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm p-4">
            <DialogTitle className="flex items-center justify-between">
              <span className="text-xs">
                Vista completa - Imagen {selectedIndex + 1} de {sortedImages.length}
              </span>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoomLevel <= 1}>
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm font-mono">{Math.round(zoomLevel * 100)}%</span>
                <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoomLevel >= 3}>
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={handleRotate}>
                  <RotateCw className="w-4 h-4" />
                </Button>
                
                <Button variant="outline" size="sm" onClick={resetZoom}>
                  Reset
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="relative w-full h-full flex items-center justify-center bg-black/5">
            <div
              className="relative w-full h-full cursor-move"
              onMouseMove={handleMouseMove}
              onClick={handleImageClick}
            >
              <Image
                src={mainImage.url || "/placeholder.svg"}
                alt={mainImage.productoId || `Imagen ${selectedIndex + 1}`}
                fill
                className="object-contain"
                style={{
                  transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                  transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                }}
                sizes="100vw"
              />
            </div>

            {/* Navegación en lightbox */}
            {sortedImages.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2"
                  onClick={goToPrevious}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  onClick={goToNext}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>

          {/* Thumbnails en lightbox */}
          {sortedImages.length > 1 && (
            <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-4">
              <div className="flex justify-center space-x-2 overflow-x-auto">
                {sortedImages.map((imagen, index) => (
                  <button
                    key={imagen.id}
                    className={`relative flex-shrink-0 w-12 h-12 rounded overflow-hidden border-2 transition-all ${index === selectedIndex ? "border-primary" : "border-border hover:border-primary/50"
                      }`}
                    onClick={() => {
                      setSelectedIndex(index)
                      resetZoom()
                    }}
                  >
                    <Image
                      src={imagen.url || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </button>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ProductGallery
