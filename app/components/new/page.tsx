"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { usePermissions } from "@/hooks/use-permissions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Folder, File, Plus, Trash } from "lucide-react"

interface ComponentFile {
  name: string
  content: string
}

interface ComponentFolder {
  name: string
  children: (ComponentFile | ComponentFolder)[]
}

interface NovoComponente {
  nome: string
  descricao: string
  codigo: ComponentFile | ComponentFolder
  autor: string
  tamanho: "normal" | "largo"
  preview: boolean
  metodos: { nome: string; descricao: string }[]
  propriedades: { nome: string; tipo: string; descricao: string }[]
  exemplos: { titulo: string; codigo: string }[]
}

export default function NewComponent() {
  const router = useRouter()
  const { hasPermission } = usePermissions()
  const [novoComponente, setNovoComponente] = useState<NovoComponente>({
    nome: "",
    descricao: "",
    codigo: { name: "root", children: [] },
    autor: "",
    tamanho: "normal",
    preview: true,
    metodos: [],
    propriedades: [],
    exemplos: [],
  })

  const handleAddFile = (path: string[] = []) => {
    const newFile: ComponentFile = { name: "novo-arquivo.tsx", content: "" }
    setNovoComponente((prev) => {
      const newCodigo = { ...prev.codigo }
      let current: ComponentFolder = newCodigo as ComponentFolder
      for (const folder of path) {
        current = current.children.find(
          (c): c is ComponentFolder => "children" in c && c.name === folder,
        ) as ComponentFolder
      }
      current.children.push(newFile)
      return { ...prev, codigo: newCodigo }
    })
  }

  const handleAddFolder = (path: string[] = []) => {
    const newFolder: ComponentFolder = { name: "nova-pasta", children: [] }
    setNovoComponente((prev) => {
      const newCodigo = { ...prev.codigo }
      let current: ComponentFolder = newCodigo as ComponentFolder
      for (const folder of path) {
        current = current.children.find(
          (c): c is ComponentFolder => "children" in c && c.name === folder,
        ) as ComponentFolder
      }
      current.children.push(newFolder)
      return { ...prev, codigo: newCodigo }
    })
  }

  const handleUpdateFile = (path: string[], name: string, content: string) => {
    setNovoComponente((prev) => {
      const newCodigo = { ...prev.codigo }
      let current: ComponentFolder = newCodigo as ComponentFolder
      for (const folder of path.slice(0, -1)) {
        current = current.children.find(
          (c): c is ComponentFolder => "children" in c && c.name === folder,
        ) as ComponentFolder
      }
      const file = current.children.find(
        (c): c is ComponentFile => "content" in c && c.name === path[path.length - 1],
      ) as ComponentFile
      file.name = name
      file.content = content
      return { ...prev, codigo: newCodigo }
    })
  }

  const handleDeleteItem = (path: string[]) => {
    setNovoComponente((prev) => {
      const newCodigo = { ...prev.codigo }
      let current: ComponentFolder = newCodigo as ComponentFolder
      for (const folder of path.slice(0, -1)) {
        current = current.children.find(
          (c): c is ComponentFolder => "children" in c && c.name === folder,
        ) as ComponentFolder
      }
      current.children = current.children.filter((c) => c.name !== path[path.length - 1])
      return { ...prev, codigo: newCodigo }
    })
  }

  const renderFileTree = (item: ComponentFile | ComponentFolder, path: string[] = []): React.ReactNode => {
    if ("content" in item) {
      return (
        <div key={path.join("/")} className="flex items-center space-x-2 py-2">
          <File className="h-4 w-4" />
          <Input
            value={item.name}
            onChange={(e) => handleUpdateFile(path, e.target.value, item.content)}
            className="w-full"
          />
          <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(path)}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      )
    } else {
      return (
        <Accordion type="single" collapsible key={path.join("/")}>
          <AccordionItem value={item.name}>
            <AccordionTrigger className="py-2">
              <div className="flex items-center space-x-2">
                <Folder className="h-4 w-4" />
                <Input
                  value={item.name}
                  onChange={(e) => {
                    setNovoComponente((prev) => {
                      const newCodigo = { ...prev.codigo }
                      let current: ComponentFolder = newCodigo as ComponentFolder
                      for (const folder of path) {
                        current = current.children.find(
                          (c): c is ComponentFolder => "children" in c && c.name === folder,
                        ) as ComponentFolder
                      }
                      current.name = e.target.value
                      return { ...prev, codigo: newCodigo }
                    })
                  }}
                  className="w-full"
                />
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-4">
                {item.children.map((child, index) => renderFileTree(child, [...path, item.name]))}
                <div className="flex space-x-2 mt-2">
                  <Button variant="outline" size="sm" onClick={() => handleAddFile([...path, item.name])}>
                    <Plus className="h-4 w-4 mr-2" /> Adicionar Arquivo
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleAddFolder([...path, item.name])}>
                    <Plus className="h-4 w-4 mr-2" /> Adicionar Pasta
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!hasPermission("components", "create")) {
      toast.error("Você não tem permissão para criar componentes")
      return
    }

    if (novoComponente.nome && novoComponente.descricao && novoComponente.codigo) {
      console.log("Novo componente:", novoComponente)
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
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">Adicionar Novo Componente</h1>
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Componente</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList>
                <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
                <TabsTrigger value="code">Código</TabsTrigger>
                <TabsTrigger value="api">API</TabsTrigger>
                <TabsTrigger value="examples">Exemplos</TabsTrigger>
                <TabsTrigger value="settings">Configurações</TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome do Componente</Label>
                    <Input
                      id="nome"
                      value={novoComponente.nome}
                      onChange={(e) => setNovoComponente({ ...novoComponente, nome: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descricao">Descrição</Label>
                    <Textarea
                      id="descricao"
                      value={novoComponente.descricao}
                      onChange={(e) => setNovoComponente({ ...novoComponente, descricao: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="autor">Autor</Label>
                    <Input
                      id="autor"
                      value={novoComponente.autor}
                      onChange={(e) => setNovoComponente({ ...novoComponente, autor: e.target.value })}
                    />
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="code">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Estrutura do Componente</Label>
                    <Card>
                      <CardContent className="pt-6">
                        {renderFileTree(novoComponente.codigo)}
                        <div className="flex space-x-2 mt-4">
                          <Button variant="outline" onClick={() => handleAddFile()}>
                            <Plus className="h-4 w-4 mr-2" /> Adicionar Arquivo
                          </Button>
                          <Button variant="outline" onClick={() => handleAddFolder()}>
                            <Plus className="h-4 w-4 mr-2" /> Adicionar Pasta
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="api">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Métodos</Label>
                    {novoComponente.metodos.map((metodo, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          placeholder="Nome do método"
                          value={metodo.nome}
                          onChange={(e) => {
                            const newMetodos = [...novoComponente.metodos]
                            newMetodos[index].nome = e.target.value
                            setNovoComponente({ ...novoComponente, metodos: newMetodos })
                          }}
                        />
                        <Input
                          placeholder="Descrição"
                          value={metodo.descricao}
                          onChange={(e) => {
                            const newMetodos = [...novoComponente.metodos]
                            newMetodos[index].descricao = e.target.value
                            setNovoComponente({ ...novoComponente, metodos: newMetodos })
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const newMetodos = novoComponente.metodos.filter((_, i) => i !== index)
                            setNovoComponente({ ...novoComponente, metodos: newMetodos })
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() =>
                        setNovoComponente({
                          ...novoComponente,
                          metodos: [...novoComponente.metodos, { nome: "", descricao: "" }],
                        })
                      }
                    >
                      <Plus className="h-4 w-4 mr-2" /> Adicionar Método
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label>Propriedades</Label>
                    {novoComponente.propriedades.map((prop, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          placeholder="Nome da propriedade"
                          value={prop.nome}
                          onChange={(e) => {
                            const newProps = [...novoComponente.propriedades]
                            newProps[index].nome = e.target.value
                            setNovoComponente({ ...novoComponente, propriedades: newProps })
                          }}
                        />
                        <Input
                          placeholder="Tipo"
                          value={prop.tipo}
                          onChange={(e) => {
                            const newProps = [...novoComponente.propriedades]
                            newProps[index].tipo = e.target.value
                            setNovoComponente({ ...novoComponente, propriedades: newProps })
                          }}
                        />
                        <Input
                          placeholder="Descrição"
                          value={prop.descricao}
                          onChange={(e) => {
                            const newProps = [...novoComponente.propriedades]
                            newProps[index].descricao = e.target.value
                            setNovoComponente({ ...novoComponente, propriedades: newProps })
                          }}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const newProps = novoComponente.propriedades.filter((_, i) => i !== index)
                            setNovoComponente({ ...novoComponente, propriedades: newProps })
                          }}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() =>
                        setNovoComponente({
                          ...novoComponente,
                          propriedades: [...novoComponente.propriedades, { nome: "", tipo: "", descricao: "" }],
                        })
                      }
                    >
                      <Plus className="h-4 w-4 mr-2" /> Adicionar Propriedade
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="examples">
                <div className="space-y-4">
                  <Label>Exemplos de Uso</Label>
                  {novoComponente.exemplos.map((exemplo, index) => (
                    <div key={index} className="space-y-2">
                      <Input
                        placeholder="Título do exemplo"
                        value={exemplo.titulo}
                        onChange={(e) => {
                          const newExemplos = [...novoComponente.exemplos]
                          newExemplos[index].titulo = e.target.value
                          setNovoComponente({ ...novoComponente, exemplos: newExemplos })
                        }}
                      />
                      <Textarea
                        placeholder="Código do exemplo"
                        value={exemplo.codigo}
                        onChange={(e) => {
                          const newExemplos = [...novoComponente.exemplos]
                          newExemplos[index].codigo = e.target.value
                          setNovoComponente({ ...novoComponente, exemplos: newExemplos })
                        }}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newExemplos = novoComponente.exemplos.filter((_, i) => i !== index)
                          setNovoComponente({ ...novoComponente, exemplos: newExemplos })
                        }}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() =>
                      setNovoComponente({
                        ...novoComponente,
                        exemplos: [...novoComponente.exemplos, { titulo: "", codigo: "" }],
                      })
                    }
                  >
                    <Plus className="h-4 w-4 mr-2" /> Adicionar Exemplo
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="settings">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Tamanho do Card</Label>
                      <p className="text-sm text-muted-foreground">
                        Escolha se o componente ocupará mais espaço na visualização
                      </p>
                    </div>
                    <Select
                      value={novoComponente.tamanho}
                      onValueChange={(value) =>
                        setNovoComponente({ ...novoComponente, tamanho: value as "normal" | "largo" })
                      }
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Selecione o tamanho" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="largo">Largo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Preview ao Vivo</Label>
                      <p className="text-sm text-muted-foreground">Mostrar preview do componente em tempo real</p>
                    </div>
                    <Switch
                      checked={novoComponente.preview}
                      onCheckedChange={(checked) => setNovoComponente({ ...novoComponente, preview: checked })}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex justify-end gap-4">
              <Button variant="outline" onClick={() => router.back()}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>Adicionar Componente</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

