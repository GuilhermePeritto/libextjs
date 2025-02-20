import * as React from "react"
import { cn } from "@/lib/utils"

const Breadcrumb = React.forwardRef<HTMLOListElement, React.ComponentPropsWithoutRef<"ol">>(
  ({ className, ...props }, ref) => (
    <ol
      ref={ref}
      className={cn("mx-auto flex w-full max-w-screen-xl flex-row items-center space-x-2 px-4 py-2 md:px-8", className)}
      {...props}
    />
  ),
)
Breadcrumb.displayName = "Breadcrumb"

const BreadcrumbItem = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<"li">>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn("inline-flex items-center gap-1.5", className)} {...props} />
  ),
)
BreadcrumbItem.displayName = "BreadcrumbItem"

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, React.ComponentPropsWithoutRef<"a">>(
  ({ className, ...props }, ref) => (
    <a
      ref={ref}
      className={cn("text-sm font-medium text-muted-foreground hover:text-foreground", className)}
      {...props}
    />
  ),
)
BreadcrumbLink.displayName = "BreadcrumbLink"

const BreadcrumbSeparator = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("text-muted-foreground", className)} {...props} />,
)
BreadcrumbSeparator.displayName = "BreadcrumbSeparator"

export { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator }

