"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { usePermissions } from "@/hooks/use-permissions"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { CodeTab } from "./tabs/code-tab"
import { ExamplesTab } from "./tabs/examples-tab"
import { MethodsTab } from "./tabs/methods-tab"
import { PreviewTab } from "./tabs/preview-tab"
import { PropertiesTab } from "./tabs/properties-tab"
import { UsageTab } from "./tabs/usage-tab"

interface FileNode {
  id: string
  name: string
  type: "file" | "folder"
  content?: string
  children?: FileNode[]
}

interface NovoComponente {
  nome: string
  descricao: string
  comoUsar: string
  componente: string
  codigo: FileNode[]
  autor: string
  ultimaModificacao: string
  tamanho: "pequeno" | "normal" | "largo" | "extralargo"
  metodos: { nome: string; parametros: string; retorno: string; descricao: string }[]
  propriedades: { nome: string; tipo: string; descricao: string; padrao?: string }[]
  exemplos: { titulo: string; codigo: string }[]
}

export default function NewComponent() {
  const router = useRouter()
  const { hasPermission } = usePermissions()
  const [novoComponente, setNovoComponente] = useState<NovoComponente>({
    nome: "",
    descricao: "",
    comoUsar: "",
    componente: "",
    codigo: [],
    autor: "",
    ultimaModificacao: new Date().toISOString(),
    tamanho: "normal",
    metodos: [{ nome: "", parametros: "", retorno: "", descricao: "" }],
    propriedades: [{ nome: "", tipo: "", descricao: "" }],
    exemplos: [{ titulo: "", codigo: "" }],
  })

  useEffect(() => {
    // Get the logged-in user's name from localStorage
    const user = localStorage.getItem("user")
    if (user) {
      const { name } = JSON.parse(user)
      setNovoComponente((prev) => ({ ...prev, autor: name }))
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!hasPermission("components", "create")) {
      toast.error("Você não tem permissão para criar componentes")
      return
    }

    if (novoComponente.nome && novoComponente.descricao && novoComponente.codigo) {
      const componenteJSON = JSON.stringify(novoComponente, null, 2)
      console.log("Novo componente:", componenteJSON)
      toast.success("Componente adicionado com sucesso!")
      router.push("/components")
    } else {
      toast.error("Por favor, preencha todos os campos obrigatórios.")
    }
  }

  if (!hasPermission("components", "create")) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Você não tem permissão para acessar esta página.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto pt-8 px-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 w-full">
            <div className="w-full">
              <CardTitle className="text-3xl mb-2">
                <Input
                  value={novoComponente.nome}
                  onChange={(e) => setNovoComponente({ ...novoComponente, nome: e.target.value })}
                  placeholder="Nome do Componente"
                  className="text-3xl font-bold w-full"
                />
              </CardTitle>
              <Textarea
                value={novoComponente.descricao}
                onChange={(e) => setNovoComponente({ ...novoComponente, descricao: e.target.value })}
                placeholder="Descrição do componente"
                className="text-muted-foreground w-full"
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="secondary" className="text-xs">
                {novoComponente.codigo.length > 0 ? "Múltiplos Arquivos" : "Arquivo Único"}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Autor:
                <Input
                  id="autor"
                  value={novoComponente.autor}
                  onChange={(e) => setNovoComponente({ ...novoComponente, autor: e.target.value })}
                  placeholder="Nome do autor"
                  className="w-32 ml-1 h-5 px-1"
                />
              </Badge>
              <Badge variant="outline" className="text-xs">
                Última modificação: {new Date(novoComponente.ultimaModificacao).toLocaleDateString()}
              </Badge>
            </div>
            <div className="flex items-center mt-4">
              <Select
                value={novoComponente.tamanho}
                onValueChange={(value) =>
                  setNovoComponente({
                    ...novoComponente,
                    tamanho: value as "pequeno" | "normal" | "largo" | "extralargo",
                  })
                }
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tamanho do componente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pequeno">Pequeno</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="largo">Largo</SelectItem>
                  <SelectItem value="extralargo">Extra Largo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="max-h-[calc(55vh) h-[calc(55vh) min-h-[calc(55vh)]">
          <Tabs defaultValue="code" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="preview">Visualização</TabsTrigger>
              <TabsTrigger value="code">Código</TabsTrigger>
              <TabsTrigger value="props">Propriedades</TabsTrigger>
              <TabsTrigger value="methods">Métodos</TabsTrigger>
              <TabsTrigger value="usage">Como Usar</TabsTrigger>
              <TabsTrigger value="examples">Exemplos</TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="h-full">
              <PreviewTab componentDefinition={novoComponente.componente} componentUsage={novoComponente.comoUsar} />
            </TabsContent>
            <TabsContent value="code" className="h-full">
              <CodeTab
                initialFiles={novoComponente.codigo}
                onFilesChange={(files) => setNovoComponente({ ...novoComponente, codigo: files })}
              />
            </TabsContent>
            <TabsContent value="props" className="h-full">
              <PropertiesTab
                properties={novoComponente.propriedades}
                onChange={(props) => setNovoComponente({ ...novoComponente, propriedades: props })}
              />
            </TabsContent>
            <TabsContent value="methods" className="h-full">
              <MethodsTab
                methods={novoComponente.metodos}
                onChange={(methods) => setNovoComponente({ ...novoComponente, metodos: methods })}
              />
            </TabsContent>
            <TabsContent value="usage" className="h-full">
              <UsageTab
                usage={novoComponente.comoUsar}
                onChange={(usage) => setNovoComponente({ ...novoComponente, comoUsar: usage })}
              />
            </TabsContent>
            <TabsContent value="examples" className="h-full">
              <ExamplesTab
                examples={novoComponente.exemplos}
                onChange={(examples) => setNovoComponente({ ...novoComponente, exemplos: examples })}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <div className="mt-6 flex justify-end gap-4">
        <Button variant="outline" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit}>Adicionar Componente</Button>
      </div>
    </div>
  )
}

