"use client"

import type React from "react"

import AppSidebar from "@/components/app-sidebar"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
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
          {isAuthenticated ? (
            <SidebarProvider>
              <AppSidebar />
              <SidebarTrigger className="ml-3 mt-3" />
              <ScrollArea className="h-screen flex-1 px-8 pt-10">
                <ScrollBar />
                <main className="flex-1 px-8">
                  {children}
                </main>
              </ScrollArea>
            </SidebarProvider>
          ) : (
            children
          )}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

