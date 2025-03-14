"use client"

import type React from "react"

import { ExtComponent } from "@/components/ext-component"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  componentesIniciais,
  type Componente,
  type ComponentFile,
  type ComponentFolder,
} from "@/data/componentes-iniciais"
import { Check, Copy, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

// Função auxiliar para renderizar o código
const renderCode = (item: ComponentFile | ComponentFolder): React.ReactNode => {
  if ("content" in item) {
    return (
      <div></div>
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

export default function ComponenteDetalhes({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [componente, setComponente] = useState<Componente | null>(null)
  const [copiado, setCopiado] = useState(false)

  useEffect(() => {
    const componenteEncontrado = componentesIniciais.find((c) => c.nome === decodeURIComponent(params.id))
    if (componenteEncontrado) {
      setComponente(componenteEncontrado)
    } else {
      router.push("/components")
    }
  }, [params.id, router])

  const copiarCodigo = () => {
    if (componente) {
      navigator.clipboard.writeText(JSON.stringify(componente.codigo, null, 2))
      setCopiado(true)
      toast.success("Código copiado!")
      setTimeout(() => setCopiado(false), 2000)
    }
  }

  if (!componente) {
    return <div>Carregando...</div>
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl">{componente.nome}</CardTitle>
              <p className="text-muted-foreground mt-2">{componente.descricao}</p>
            </div>
            {componente.pasta && (
              <Badge variant="outline" className="text-sm">
                {componente.pasta}
              </Badge>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge variant="secondary" className="text-xs">
              {typeof componente.codigo === "object" && "children" in componente.codigo
                ? "Múltiplos Arquivos"
                : "Arquivo Único"}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Autor: {componente.autor}
            </Badge>
            <Badge variant="outline" className="text-xs">
              Última modificação: {new Date(componente.ultimaModificacao).toLocaleDateString()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="preview">Visualização</TabsTrigger>
              <TabsTrigger value="code">Código</TabsTrigger>
              <TabsTrigger value="props">Propriedades</TabsTrigger>
              <TabsTrigger value="methods">Métodos</TabsTrigger>
              <TabsTrigger value="usage">Como Usar</TabsTrigger>
              <TabsTrigger value="examples">Exemplos</TabsTrigger>
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
                <ScrollArea className="h-[400px] w-full rounded-md border">
                  <div className="p-4">{renderCode(componente.codigo)}</div>
                </ScrollArea>
                <Button variant="outline" size="icon" className="absolute top-2 right-2" onClick={copiarCodigo}>
                  {copiado ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="props" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Propriedades</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Padrão</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {componente.propriedades?.map((prop, index) => (
                        <TableRow key={index}>
                          <TableCell>{prop.nome}</TableCell>
                          <TableCell>{prop.tipo}</TableCell>
                          <TableCell>{prop.descricao}</TableCell>
                          <TableCell>{prop.padrao || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="methods" className="mt-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Métodos</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>Parâmetros</TableHead>
                        <TableHead>Retorno</TableHead>
                        <TableHead>Descrição</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {componente.metodos?.map((metodo, index) => (
                        <TableRow key={index}>
                          <TableCell>{metodo.nome}</TableCell>
                          <TableCell>{metodo.parametros}</TableCell>
                          <TableCell>{metodo.retorno}</TableCell>
                          <TableCell>{metodo.descricao}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="usage" className="mt-4">
             <div></div>
            </TabsContent>
            <TabsContent value="examples" className="mt-4">
           <div></div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <div className="mt-8">
        <h3 className="text-2xl font-semibold mb-4">Recursos Adicionais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Documentação Completa</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Acesse a documentação completa deste componente para informações mais detalhadas.</p>
              <Button variant="outline" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  Ver Documentação <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Repositório no GitHub</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Explore o código-fonte e contribua para o desenvolvimento deste componente.</p>
              <Button variant="outline" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  Ver no GitHub <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

