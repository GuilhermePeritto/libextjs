"use client"

import { ComponentsPaginationFooter } from "@/components/components-pagination-footer"
import { ExtComponent } from "@/components/ext-component"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Toggle } from "@/components/ui/toggle"
import {
  componentesIniciais,
  type ComponentFile,
  type ComponentFolder,
  type Componente,
} from "@/data/componentes-iniciais"
import { usePermissions } from "@/hooks/use-permissions"
import { Check, Copy, File, Filter, Folder, Grid, List, Plus, Search } from "lucide-react"
import Link from "next/link"
import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { toast } from "sonner"

// Função auxiliar para renderizar a estrutura de pastas
const renderFileTree = (item: ComponentFile | ComponentFolder, path = ""): React.ReactNode => {
  if ("content" in item) {
    return (
      <div key={path + item.name} className="flex items-center space-x-2">
        <File className="h-4 w-4" />
        <span>{item.name}</span>
      </div>
    )
  } else {
    return (
      <Accordion type="single" collapsible key={path + item.name}>
        <AccordionItem value={path + item.name}>
          <AccordionTrigger className="py-1">
            <div className="flex items-center space-x-2">
              <Folder className="h-4 w-4" />
              <span>{item.name}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pl-4">{item.children.map((child) => renderFileTree(child, path + item.name + "/"))}</div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    )
  }
}

// Função auxiliar para renderizar o código
const renderCode = (item: ComponentFile | ComponentFolder): React.ReactNode => {
  if ("content" in item) {
    return (
      <SyntaxHighlighter
        language="tsx"
        style={oneDark}
        customStyle={{ background: "transparent", fontSize: "14px", lineHeight: "1.5" }}
        codeTagProps={{ style: { background: "transparent" } }}
      >
        {item.content}
      </SyntaxHighlighter>
    )
  } else {
    return (
      <div>
        {item.children.map((child) => (
          <div key={child.name}>
            <h4 className="text-sm font-semibold mt-4 mb-2">{child.name}</h4>
            {renderCode(child)}
          </div>
        ))}
      </div>
    )
  }
}

export default function Componentes() {
  const [modoVisualizacao, setModoVisualizacao] = useState<"grade" | "lista">("grade")
  const [copiado, setCopiado] = useState<string | null>(null)
  const [componentes] = useState<Componente[]>(componentesIniciais)
  const { hasPermission } = usePermissions()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(6)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const categories = useMemo(() => {
    const uniqueCategories = new Set(componentes.map((componente) => componente.pasta).filter(Boolean))
    return Array.from(uniqueCategories)
  }, [componentes])

  const filteredComponents = useMemo(() => {
    return componentes.filter((componente) => {
      const searchFields = [componente.nome, componente.descricao, componente.pasta, componente.autor].map((field) =>
        (field || "").toLowerCase(),
      )

      const searchTerms = searchQuery.toLowerCase().split(" ")
      const matchesSearch = searchTerms.every((term) => searchFields.some((field) => field.includes(term)))
      const matchesCategory = selectedCategory ? componente.pasta === selectedCategory : true

      return matchesSearch && matchesCategory
    })
  }, [componentes, searchQuery, selectedCategory])

  const totalPages = Math.ceil(filteredComponents.length / itemsPerPage)
  const paginatedComponents = filteredComponents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const copiarCodigo = (codigo: string, nome: string) => {
    navigator.clipboard.writeText(codigo)
    setCopiado(nome)
    toast.success("Código copiado!")
    setTimeout(() => setCopiado(null), 2000)
  }

  // Reset page when search or category changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory])

  return (
    <div className="container mx-auto py-8 px-4 pb-24">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold">Componentes</h1>
        <div className="flex space-x-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, descrição, pasta ou autor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-10 px-0">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filtrar por categoria</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setSelectedCategory(null)}>Todas as categorias</DropdownMenuItem>
              {categories.map((category) => (
                <DropdownMenuItem key={category} onSelect={() => setSelectedCategory(category as any)}>
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Toggle
            pressed={modoVisualizacao === "grade"}
            onPressedChange={() => setModoVisualizacao(modoVisualizacao === "grade" ? "lista" : "grade")}
          >
            {modoVisualizacao === "grade" ? <Grid className="h-4 w-4" /> : <List className="h-4 w-4" />}
          </Toggle>
          {hasPermission("components", "create") && (
            <Button asChild>
              <Link href="/components/new">
                <Plus className="h-4 w-4 mr-2" />
                Novo Componente
              </Link>
            </Button>
          )}
        </div>
      </div>

      {(searchQuery || selectedCategory) && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredComponents.length} resultado(s) encontrado(s)
            {selectedCategory && ` na categoria "${selectedCategory}"`}
          </p>
        </div>
      )}

      <div className="space-y-8">
        <div
          className={`grid gap-6 ${modoVisualizacao === "grade" ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
            }`}
        >
          {paginatedComponents.map((componente, index) => (
            <Card
              key={index}
              className={`flex flex-col h-full ${componente.tamanho === "largo" ? "lg:col-span-2 xl:col-span-3" : ""}`}
            >
              <CardContent className="flex-grow p-6">
                <Link
                  href={`/components/${encodeURIComponent(componente.nome)}`}
                  className="block transition-transform hover:scale-105"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">{componente.nome}</h3>
                      <p className="text-sm text-muted-foreground">{componente.descricao}</p>
                    </div>
                    {componente.pasta && (
                      <Badge variant="outline" className="text-xs">
                        {componente.pasta}
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="text-xs">
                      {typeof componente.codigo === "object" && "children" in componente.codigo
                        ? "Múltiplos Arquivos"
                        : "Arquivo Único"}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {componente.autor}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {new Date(componente.ultimaModificacao).toLocaleDateString()}
                    </Badge>
                  </div>
                </Link>
                <Tabs defaultValue="preview" className="w-full h-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="preview">Visualização</TabsTrigger>
                    <TabsTrigger value="code">Código</TabsTrigger>
                    <TabsTrigger value="structure">Estrutura</TabsTrigger>
                  </TabsList>
                  <TabsContent value="preview" className="mt-4">
                    <div className="min-h-[300px] p-4 flex items-center justify-center border rounded-md">
                      <ExtComponent
                        componentDefinition={componente.componente?.toString()}
                        componentUsage={componente.comoUsar}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="code" className="mt-4">
                    <div className="relative">
                      <ScrollArea className="h-[300px] rounded-md border">
                        <div className="p-4">{renderCode(componente.codigo)}</div>
                      </ScrollArea>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={(e) => {
                          e.stopPropagation()
                          copiarCodigo(JSON.stringify(componente.codigo, null, 2), componente.nome)
                        }}
                      >
                        {copiado === componente.nome ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </TabsContent>
                  <TabsContent value="structure" className="mt-4">
                    <ScrollArea className="h-[300px] w-full rounded-md border">
                      <div className="p-4">{renderFileTree(componente.codigo)}</div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ))}
        </div>

        <ComponentsPaginationFooter
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
          totalItems={filteredComponents.length}
        />
      </div>
    </div>
  )
}

