"use client"

import { ExtComponent } from "@/components/ext-component"
import { Card, CardContent } from "@/components/ui/card"

interface PreviewTabProps {
  componentDefinition: string
  componentUsage: string
}

export function PreviewTab({ componentDefinition, componentUsage }: PreviewTabProps) {
  return (
    <Card className="max-h-[calc(47vh) h-[calc(47vh) min-h-[calc(47vh)]">
      <CardContent className="h-full pt-6">
        <ExtComponent componentDefinition={componentDefinition} componentUsage={componentUsage} />
      </CardContent>
    </Card>
  )
}

