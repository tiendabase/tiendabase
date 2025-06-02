import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, error, errorText, startContent, type, ...props }: React.ComponentProps<"input"> & { errorText?: string, error?: boolean, startContent?: React.ReactElement }) {
  return (
    <>
      <div className={cn("flex items-center")}>
        {
          startContent ?
            <div className=" dark:bg-zinc-800 border-input dark:border-transparent dark:inset-shadow-2xs dark:inset-shadow-zinc-700 flex h-9  rounded-l-md border bg-transparent px-3 py-1 shadow dark:shadow dark:shadow-zinc-900  transition-all  outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent  file:font-medium text-sm flex items-center disabled:pointer-events-none disabled:cursor-not-allowed  ">
              {startContent}
            </div>
            : null
        }
        <input
          type={type}
          data-slot="input"
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground placeholder:font-medium hover:!bg-card selection:bg-primary bg-zinc-50 selection:text-primary-foreground dark:bg-input/30 border-input dark:border-transparent dark:inset-shadow-2xs dark:inset-shadow-zinc-700 flex h-9 w-full min-w-0  border px-3 py-1 shadow dark:shadow dark:shadow-zinc-900  transition-all  outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent  file:font-semibold text-sm disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 ",

            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            error && "dark:border !border-destructive",
            startContent ?"rounded-r-md":"rounded-md",
            className
          )}
          {...props}
        />


      </div>
      {errorText &&
        <small className="text-xs text-destructive">
          {errorText}
        </small>
      }
    </>
  )
}

export { Input }
