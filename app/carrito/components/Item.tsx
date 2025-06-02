"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { useDispatch } from "react-redux"

import { setCount, removeProduct } from "@/store/reducers/cart"
import type { ProductStoreType } from "@/types"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Trash2, Heart } from "lucide-react"

interface CartItemProps {
  id: string
  product: ProductStoreType
  count: number
  onQuantityChange: (newCount: number) => void
  onRemove: () => void
}

const CartItem = ({ id, product, count, onQuantityChange, onRemove }: CartItemProps) => {
  const dispatch = useDispatch()
  const [isRemoving, setIsRemoving] = useState(false)

  const handleUpdateCount = (newCount: number) => {
    if (newCount < 1) return
    dispatch(setCount({ product, count: newCount }))
  }

  const handleRemove = async () => {
    setIsRemoving(true)
    // Pequeña animación antes de remover
    setTimeout(() => {
      dispatch(removeProduct(product))
    }, 200)
  }

  const itemTotal = product.price * count

  return (
    <motion.div
      layout
      className={`flex items-center space-x-4 p-4 rounded-lg border transition-all ${isRemoving ? "opacity-50 scale-95" : "hover:shadow-md"
        }`}
    >
      {/* Imagen del producto */}
      <div className="relative w-20 h-20 flex-shrink-0">
        <Image
          src={product.thumb || "/placeholder.svg?height=80&width=80"}
          alt={product.name}
          fill
          className="object-cover rounded-lg"
          sizes="80px"
        />
        {product.color && (
          <div
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: product.color }}
          />
        )}
      </div>

      {/* Información del producto */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-sm md:text-base line-clamp-2">{product.name}</h3>
        <div className="flex items-center space-x-2 mt-1">
          {product.size && (
            <Badge variant="secondary" className="text-xs">
              {product.size}
            </Badge>
          )}
          {product.color && (
            <Badge variant="outline" className="text-xs">
              Color
            </Badge>
          )}
        </div>
        <div className="flex items-center justify-between mt-2">
          <p className="text-lg font-bold text-primary">${product.price.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Total: ${itemTotal.toLocaleString()}</p>
        </div>
      </div>

      {/* Controles de cantidad */}
      <div className="flex flex-col items-center space-y-3">
        <div className="flex items-center space-x-1 border rounded-full">
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-full"
            onClick={() => handleUpdateCount(count - 1)}
            disabled={count <= 1}
          >
            <Minus className="w-3 h-3" />
          </Button>
          <span className="w-8 text-center font-semibold">{count}</span>
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 rounded-full"
            onClick={() => handleUpdateCount(count + 1)}
          >
            <Plus className="w-3 h-3" />
          </Button>
        </div>

        {/* Acciones */}
        <div className="flex space-x-1">
         
          <Button
            variant="ghost"
            size="icon"
            className="w-8 h-8 text-muted-foreground hover:text-red-600"
            onClick={handleRemove}
            disabled={isRemoving}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

export default CartItem
