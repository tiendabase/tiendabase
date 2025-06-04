import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-md text-sm font-bold  transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none   shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 dark:inset-shadow-orange-300/50   shadow-zinc-400 dark:shadow-zinc-900  dark:inset-shadow-xs aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "text-primary-foreground border border-primary/50 inset-shadow-sm inset-shadow-secondary/20 bg-gradient-to-b from-primary to-accent text-sm font-semibold shadow shadow-primary shadow-sm hover:from-primary/90 transition-all",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          " inset-shadow-xs  border inset-shadow-white dark:inset-shadow-zinc-900  inline-flex items-center gap-2 bg-gradient-to-b from-secondary to-white text-sm font-semibold hover:from-white  transition-all",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-primary/5 bg-background !inset-shadow-none ",
        link: "text-primary underline-offset-4 hover:underline hover:text-secondary/50",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
