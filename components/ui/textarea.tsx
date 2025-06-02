import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground placeholder:font-medium placeholder:text-sm selection:bg-primary text-sm bg-zinc-50 selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md  bg-transparent px-3 py-1 hover:!bg-card border dark:bg-input/30 border-input dark:border-none dark:inset-shadow-2xs shadow border-input dark:inset-shadow-zinc-700 transition-all  outline-none  disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 ",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 ",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
