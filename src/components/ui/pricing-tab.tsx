
import * as React from "react"
import { cn } from "@/lib/utils"

interface TabProps {
  text: string
  selected: boolean
  setSelected: (value: string) => void
  discount?: boolean
  discountAmount?: string
}

export function Tab({ text, selected, setSelected, discount = false, discountAmount = "25%" }: TabProps) {
  return (
    <button
      onClick={() => setSelected(text)}
      className={cn(
        "relative flex h-10 items-center justify-center rounded-full px-6 text-sm font-medium transition",
        selected
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {text}
      {discount && selected && (
        <span className="absolute -right-12 flex h-6 items-center justify-center rounded-full bg-green-600 px-2 text-[10px] font-medium text-white shadow-sm">
          Save {discountAmount}
        </span>
      )}
    </button>
  )
}
