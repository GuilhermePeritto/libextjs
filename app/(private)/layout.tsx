"use client"

import type React from "react"

import AppSidebar from "@/components/app-sidebar"
import { AppBreadcrumb } from "@/components/breadcrumb"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeProvider } from "next-themes"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} antialiased overflow-hidden`} >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SidebarProvider>
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
                    <main className="p-4">{children}</main>
                </ScrollArea>
              </SidebarInset>
            </div>
          </SidebarProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

