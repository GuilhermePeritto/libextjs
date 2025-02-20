"use client"
import { GalleryVerticalEnd, Moon, Search, Sun, User } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navItems = [
  { title: "Introdução", url: "/" },
  { title: "Começando", url: "/getting-started" },
  { title: "Componentes", url: "/components" },
  { title: "Referência da API", url: "/api-reference" },
  { title: "Documentação", url: "/documentation" },
  { title: "Permissões", url: "/permissions" },
]

export default function AppSidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()

  return (
    <Sidebar className="login-gradient text-white" style={{
      background: "linear-gradient(to bottom,#6051e6 6%, #5966e7 25%, #4f81e9 55%, #499bea 69%, #43a5eb 83%, #3bbeec 99%)",
    }}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" className="text-white">
                <div className="bg-white/20 text-white flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Docs</span>
                  <span className="opacity-80">v1.0.0</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <form>
          <SidebarGroup className="py-0">
            <SidebarGroupContent className="relative">
              <Label htmlFor="search" className="sr-only">
                Pesquisar
              </Label>
              <Input
                id="search"
                placeholder="Pesquisar na documentação..."
                className="pl-8 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
              <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none text-white/60" />
            </SidebarGroupContent>
          </SidebarGroup>
        </form>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/80">Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    className={`text-white/90 hover:text-white hover:bg-white/10 ${
                      pathname === item.url ? "bg-white/20 text-white" : ""
                    }`}
                  >
                    <Link href={item.url}>{item.title}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="space-y-2">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="w-full justify-start px-2 text-white/80 hover:text-white hover:bg-white/10"
        >
          <Link href="/profile">
            <User className="h-4 w-4 mr-2" />
            Meu Perfil
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="w-full justify-start px-2 text-white/80 hover:text-white hover:bg-white/10"
        >
          {theme === "light" ? <Moon className="h-4 w-4 mr-2" /> : <Sun className="h-4 w-4 mr-2" />}
          {theme === "light" ? "Modo Escuro" : "Modo Claro"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}

