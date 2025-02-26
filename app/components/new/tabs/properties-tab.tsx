"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash } from "lucide-react"

interface Property {
  nome: string
  tipo: string
  descricao: string
  padrao?: string
}

interface PropertiesTabProps {
  properties: Property[]
  onChange: (properties: Property[]) => void
}

export function PropertiesTab({ properties, onChange }: PropertiesTabProps) {
  return (
    <Card className="max-h-[calc(47vh) h-[calc(47vh) min-h-[calc(47vh)]">
      <CardContent className="pt-6 flex flex-col justify-between">
        <h3 className="text-lg font-semibold mb-4">Propriedades</h3>
        <ScrollArea className="h-[calc(30vh)]">
          <ScrollBar />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Padrão</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((prop, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input
                      value={prop.nome}
                      onChange={(e) => {
                        const newProps = [...properties]
                        newProps[index].nome = e.target.value
                        onChange(newProps)
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={prop.tipo}
                      onChange={(e) => {
                        const newProps = [...properties]
                        newProps[index].tipo = e.target.value
                        onChange(newProps)
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={prop.descricao}
                      onChange={(e) => {
                        const newProps = [...properties]
                        newProps[index].descricao = e.target.value
                        onChange(newProps)
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={prop.padrao}
                      onChange={(e) => {
                        const newProps = [...properties]
                        newProps[index].padrao = e.target.value
                        onChange(newProps)
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newProps = properties.filter((_, i) => i !== index)
                        onChange(newProps)
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
        <Button
          variant="outline"
          onClick={() => onChange([...properties, { nome: "", tipo: "", descricao: "", padrao: "" }])}
          className="mt-6"
        >
          <Plus className="h-4 w-4 mr-2" /> Adicionar Propriedade
        </Button>
      </CardContent>
    </Card>
  )
}

