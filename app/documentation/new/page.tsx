"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { usePermissions } from "@/hooks/use-permissions"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"

export default function NewDocumentation() {
  const router = useRouter()
  const { hasPermission } = usePermissions()
  const [novoManual, setNovoManual] = useState({
    titulo: "",
    tipo: "",
    conteudo: "",
    videoUrl: "",
    linkUrl: "",
    autor: "",
    destacado: false,
    tags: "",
  })

  const tipos = ["faq", "topic", "video", "link"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!hasPermission("documentation", "create")) {
      toast.error("Você não tem permissão para criar documentação")
      return
    }

    if (novoManual.titulo && novoManual.tipo && novoManual.conteudo) {
      console.log("Novo manual:", novoManual)
      toast.success("Manual adicionado com sucesso!")
      router.push("/documentation")
    } else {
      toast.error("Por favor, preencha todos os campos obrigatórios.")
    }
  }

  if (!hasPermission("documentation", "create")) {
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
      <h1 className="text-4xl font-bold mb-8">Adicionar Novo Manual</h1>
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Detalhes do Manual</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic" className="space-y-4">
              <TabsList>
                <TabsTrigger value="basic">Informações Básicas</TabsTrigger>
                <TabsTrigger value="content">Conteúdo</TabsTrigger>
                <TabsTrigger value="settings">Configurações</TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="titulo">Título</Label>
                    <Input
                      id="titulo"
                      value={novoManual.titulo}
                      onChange={(e) => setNovoManual({ ...novoManual, titulo: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo</Label>
                    <Select
                      value={novoManual.tipo}
                      onValueChange={(value) => setNovoManual({ ...novoManual, tipo: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {tipos.map((tipo) => (
                          <SelectItem key={tipo} value={tipo}>
                            {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="autor">Autor</Label>
                    <Input
                      id="autor"
                      value={novoManual.autor}
                      onChange={(e) => setNovoManual({ ...novoManual, autor: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                    <Input
                      id="tags"
                      value={novoManual.tags}
                      onChange={(e) => setNovoManual({ ...novoManual, tags: e.target.value })}
                      placeholder="ex: tutorial, iniciante, configuração"
                    />
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="content">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="conteudo">Conteúdo</Label>
                    <Textarea
                      id="conteudo"
                      value={novoManual.conteudo}
                      onChange={(e) => setNovoManual({ ...novoManual, conteudo: e.target.value })}
                      rows={15}
                    />
                  </div>
                  {novoManual.tipo === "video" && (
                    <div className="space-y-2">
                      <Label htmlFor="videoUrl">URL do Vídeo</Label>
                      <Input
                        id="videoUrl"
                        value={novoManual.videoUrl}
                        onChange={(e) => setNovoManual({ ...novoManual, videoUrl: e.target.value })}
                        placeholder="https://www.youtube.com/embed/..."
                      />
                    </div>
                  )}
                  {novoManual.tipo === "link" && (
                    <div className="space-y-2">
                      <Label htmlFor="linkUrl">URL do Link</Label>
                      <Input
                        id="linkUrl"
                        value={novoManual.linkUrl}
                        onChange={(e) => setNovoManual({ ...novoManual, linkUrl: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="settings">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Destacar Manual</Label>
                      <p className="text-sm text-muted-foreground">O manual aparecerá em destaque na listagem</p>
                    </div>
                    <Switch
                      checked={novoManual.destacado}
                      onCheckedChange={(checked) => setNovoManual({ ...novoManual, destacado: checked })}
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex justify-end gap-4">
              <Button variant="outline" onClick={() => router.back()}>
                Cancelar
              </Button>
              <Button onClick={handleSubmit}>Adicionar Manual</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

