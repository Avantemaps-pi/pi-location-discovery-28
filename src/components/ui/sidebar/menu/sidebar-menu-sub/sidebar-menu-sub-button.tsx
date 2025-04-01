
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"
import { sidebarMenuButtonVariants } from "../sidebar-menu-button"

const SidebarMenuSubButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean
    isActive?: boolean
  }
>(({ asChild = false, isActive = false, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      ref={ref}
      data-sidebar="menu-sub-button"
      data-active={isActive}
      className={cn(
        sidebarMenuButtonVariants({ size: "sm" }),
        "w-full font-normal text-sidebar-foreground",
        isActive && "font-medium text-sidebar-accent-foreground",
        className
      )}
      {...props}
    />
  )
})
SidebarMenuSubButton.displayName = "SidebarMenuSubButton"

export { SidebarMenuSubButton }
