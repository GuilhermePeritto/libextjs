"use client"

import type React from "react"

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { usePathname, useRouter } from "next/navigation"

export function AppBreadcrumb() {
  const pathname = usePathname()
  const router = useRouter()
  const pathSegments = pathname.split("/").filter(Boolean)

  const handleClick = (path: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    router.push(path)
  }

  return (
    <Breadcrumb className="flex-1 overflow-x-auto">
      <BreadcrumbItem>
        <BreadcrumbLink href="/" onClick={handleClick("/")}>
          Home
        </BreadcrumbLink>
        <BreadcrumbSeparator />
      </BreadcrumbItem>
      {pathSegments.map((segment, index) => (
        <BreadcrumbItem key={index}>
          <BreadcrumbSeparator />
          <BreadcrumbLink
            href={`/${pathSegments.slice(0, index + 1).join("/")}`}
            onClick={handleClick(`/${pathSegments.slice(0, index + 1).join("/")}`)}
          >
            {segment.charAt(0).toUpperCase() + segment.slice(1)}
          </BreadcrumbLink>
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  )
}

