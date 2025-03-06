"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface UsageTabProps {
  usage: string
  onChange: (usage: string) => void
}

export function UsageTab({ usage, onChange }: UsageTabProps) {
  return (
    <Card className="max-h-[calc(47vh) h-[calc(47vh) min-h-[calc(47vh)]">
      <CardContent className="h-full pt-6">
        <h3 className="text-lg font-semibold mb-4">Como Usar</h3>
        <Textarea
          value={usage}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Descreva como usar o componente"
          rows={16}
        />
      </CardContent>
    </Card>
  )
}

