"use client"

import type React from "react"

import AppSidebar from "@/components/app-sidebar"
import { AppBreadcrumb } from "@/components/breadcrumb"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ExtProvider } from "@/contexts/ext-context"
import { ThemeProvider } from "next-themes"
import { Inter } from "next/font/google"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Toaster } from "sonner"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem("user")
      if (user) {
        setIsAuthenticated(true)
        if (pathname === "/login") {
          router.replace("/")
        }
      } else if (pathname !== "/login") {
        router.replace("/login")
      }
    }

    checkAuth()
  }, [pathname, router])

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} antialiased overflow-hidden`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SidebarProvider>
            {isAuthenticated ? (
              <div className="flex h-screen w-screen">
                <AppSidebar />
                <SidebarInset className="flex-1 flex flex-col">
                  <header className="flex items-center h-16 px-4 border-b">
                    <div className="flex items-center">
                    <SidebarTrigger />
                    <AppBreadcrumb />
                    </div>
                  </header>
                  <ScrollArea className="flex-1 h-screen">
                    <ScrollBar />
                    <ExtProvider>
                    <main className="p-4">{children}</main>
                    </ExtProvider>
                  </ScrollArea>
                </SidebarInset>
              </div>
            ) : (
              children
            )}
          </SidebarProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

