"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Trash } from "lucide-react"

interface Method {
  nome: string
  parametros: string
  retorno: string
  descricao: string
}

interface MethodsTabProps {
  methods: Method[]
  onChange: (methods: Method[]) => void
}

export function MethodsTab({ methods, onChange }: MethodsTabProps) {
  return (
    <Card className="max-h-[calc(47vh) h-[calc(47vh) min-h-[calc(47vh)]">
      <CardContent className="pt-6 flex flex-col justify-between">
        <h3 className="text-lg font-semibold mb-4">Métodos</h3>
        <ScrollArea className="h-[calc(30vh)]">
          <ScrollBar />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Parâmetros</TableHead>
                <TableHead>Retorno</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="overflow-y-auto">
              {methods.map((method, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Input
                      value={method.nome}
                      onChange={(e) => {
                        const newMethods = [...methods]
                        newMethods[index].nome = e.target.value
                        onChange(newMethods)
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={method.parametros}
                      onChange={(e) => {
                        const newMethods = [...methods]
                        newMethods[index].parametros = e.target.value
                        onChange(newMethods)
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={method.retorno}
                      onChange={(e) => {
                        const newMethods = [...methods]
                        newMethods[index].retorno = e.target.value
                        onChange(newMethods)
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={method.descricao}
                      onChange={(e) => {
                        const newMethods = [...methods]
                        newMethods[index].descricao = e.target.value
                        onChange(newMethods)
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newMethods = methods.filter((_, i) => i !== index)
                        onChange(newMethods)
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
          onClick={() => onChange([...methods, { nome: "", parametros: "", retorno: "", descricao: "" }])}
          className="mt-6"
        >
          <Plus className="h-4 w-4 mr-2" /> Adicionar Método
        </Button>
      </CardContent>
    </Card>
  )
}

