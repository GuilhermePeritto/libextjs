"use client"
import {
  BookOpen,
  ChevronDown,
  FileText,
  GalleryVerticalEnd,
  LogOut,
  Moon,
  Puzzle,
  Rocket,
  Search,
  Shield,
  Sun,
  User,
} from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
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
  useSidebar,
} from "@/components/ui/sidebar"

const navItems = [
  { title: "Introdução", url: "/", icon: BookOpen },
  { title: "Começando", url: "/getting-started", icon: Rocket },
  { title: "Componentes", url: "/components", icon: Puzzle },
  { title: "Documentação", url: "/documentation", icon: FileText },
  { title: "Referência da API", url: "/api-reference", icon: Search },
  { title: "Permissões", url: "/permissions", icon: Shield },
]

export default function AppSidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { state } = useSidebar()

  return (
    <Sidebar collapsible="icon" className="login-gradient text-white" style={{
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
        <form className={state === "collapsed" ? "hidden" : ""}>
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
                    <Link href={item.url}>
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="space-y-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className={`w-full justify-start ${state === "collapsed" ? "px-0" : "px-2"} text-white/80 hover:text-white hover:bg-white/10`}
            >
              <Avatar className="h-8 w-8 ">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User avatar" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <span className={state === "collapsed" ? "sr-only" : ""}>Usuário</span>
              <ChevronDown className={`ml-auto h-4 w-4 ${state === "collapsed" ? "hidden" : ""}`} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              localStorage.removeItem("user")
              window.location.reload()
            }}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Separator className="bg-white/20" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="w-full justify-start px-2 text-white/80 hover:text-white hover:bg-white/10"
        >
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          <span className={state === "collapsed" ? "sr-only" : "ml-2"}>
            {theme === "light" ? "Modo Escuro" : "Modo Claro"}
          </span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}