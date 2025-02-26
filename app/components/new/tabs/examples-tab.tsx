"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash } from "lucide-react"

interface Example {
  titulo: string
  codigo: string
}

interface ExamplesTabProps {
  examples: Example[]
  onChange: (examples: Example[]) => void
}

export function ExamplesTab({ examples, onChange }: ExamplesTabProps) {
  return (
    <Card className="max-h-[calc(47vh) h-[calc(47vh) min-h-[calc(47vh)]">
      <CardContent className="h-full pt-6 flex flex-col justify-between">
        <h3 className="text-lg font-semibold mb-4">Exemplos</h3>
        <ScrollArea className="h-[calc(30vh)]">
        <ScrollBar />
        <Accordion type="single" collapsible className="w-full p-5">
          {examples.map((example, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger>
                <Input
                  value={example.titulo}
                  onChange={(e) => {
                    const newExamples = [...examples]
                    newExamples[index].titulo = e.target.value
                    onChange(newExamples)
                  }}
                  placeholder="Título do exemplo"
                />
              </AccordionTrigger>
              <AccordionContent>
                <Textarea
                  value={example.codigo}
                  onChange={(e) => {
                    const newExamples = [...examples]
                    newExamples[index].codigo = e.target.value
                    onChange(newExamples)
                  }}
                  placeholder="Código do exemplo"
                  rows={10}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const newExamples = examples.filter((_, i) => i !== index)
                    onChange(newExamples)
                  }}
                  className="mt-2"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        </ScrollArea>
        <Button variant="outline" onClick={() => onChange([...examples, { titulo: "", codigo: "" }])} className="mt-6">
          <Plus className="h-4 w-4 mr-2" /> Adicionar Exemplo
        </Button>
      </CardContent>
    </Card>
  )
}

