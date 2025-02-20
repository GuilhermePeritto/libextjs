"use client"

import { useState } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { usePermissions } from "@/hooks/use-permissions"

interface DocumentItem {
  type: "faq" | "topic" | "video" | "link"
  title: string
  content: string
  videoUrl?: string
  linkUrl?: string
  author: string
  lastModified: string
}

const documentItems: DocumentItem[] = [
  {
    type: "faq",
    title: "Como instalar?",
    content: "Para instalar, execute 'npm install @nossa-empresa/pacote'.",
    author: "John Doe",
    lastModified: "2024-02-19",
  },
  {
    type: "faq",
    title: "Como configurar?",
    content: "Crie um arquivo config.js na raiz do projeto com suas configurações.",
    author: "Jane Smith",
    lastModified: "2024-02-18",
  },
  {
    type: "topic",
    title: "Introdução",
    content: "Aprenda os conceitos básicos da nossa biblioteca.",
    author: "Alice Johnson",
    lastModified: "2024-02-17",
  },
  {
    type: "topic",
    title: "Componentes Avançados",
    content: "Explore os recursos avançados dos nossos componentes.",
    author: "Bob Wilson",
    lastModified: "2024-02-16",
  },
  {
    type: "video",
    title: "Tutorial de Instalação",
    content: "Veja como instalar nossa biblioteca passo a passo.",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    author: "Charlie Brown",
    lastModified: "2024-02-15",
  },
  {
    type: "link",
    title: "Documentação Oficial",
    content: "Acesse nossa documentação oficial para informações detalhadas.",
    linkUrl: "https://docs.example.com",
    author: "Diana Prince",
    lastModified: "2024-02-14",
  },
]

export default function Documentation() {
  const [filter, setFilter] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const { hasPermission } = usePermissions()

  const filteredItems = documentItems.filter(
    (item) =>
      (activeTab === "all" || item.type === activeTab) &&
      (item.title.toLowerCase().includes(filter.toLowerCase()) ||
        item.content.toLowerCase().includes(filter.toLowerCase())),
  )

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold">Documentação</h1>
        {hasPermission("documentation", "create") && (
          <Button asChild>
            <Link href="/documentation/new">Adicionar Manual</Link>
          </Button>
        )}
      </div>
      <div className="mb-6">
        <Input
          placeholder="Pesquisar na documentação..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="faq">FAQs</TabsTrigger>
          <TabsTrigger value="topic">Tópicos</TabsTrigger>
          <TabsTrigger value="video">Vídeos</TabsTrigger>
          <TabsTrigger value="link">Links</TabsTrigger>
        </TabsList>
      </Tabs>
      <ScrollArea className="h-[calc(100vh-250px)]">
        <Accordion type="single" collapsible className="w-full">
          {filteredItems.map((item, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger>
                <div className="flex flex-col items-start">
                  <span>{item.title}</span>
                  <span className="text-xs text-muted-foreground">
                    por {item.author} • Última modificação: {new Date(item.lastModified).toLocaleDateString()}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="pt-6">
                    <p>{item.content}</p>
                    {item.type === "video" && (
                      <div className="mt-4 aspect-video">
                        <iframe
                          width="100%"
                          height="100%"
                          src={item.videoUrl}
                          title={item.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    )}
                    {item.type === "link" && (
                      <div className="mt-4">
                        <Button asChild>
                          <Link href={item.linkUrl} target="_blank" rel="noopener noreferrer">
                            Acessar Link
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </div>
  )
}

