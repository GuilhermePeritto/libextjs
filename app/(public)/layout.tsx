"use client"

import { Toaster } from "sonner"
import "./globals.css"

export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <html lang="pt-BR" suppressHydrationWarning>
        <body>
          <main>{children}</main>
          <Toaster/>
        </body>
      </html>
    )
  }