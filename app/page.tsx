import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Introdução | Site de Documentação Minimalista",
  description: "Bem-vindo ao nosso site de documentação minimalista",
}

export default function Home() {
  return (
    <main className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-4xl font-bold">Bem-vindo à Nossa Documentação</h1>
      <p className="mb-4">
        Este é um lindo site de documentação minimalista construído com Next.js, Tailwind CSS e componentes shadcn/ui.
      </p>
      <h2 className="mb-4 mt-8 text-2xl font-semibold">Características</h2>
      <ul className="mb-4 list-inside list-disc space-y-1">
        <li>Design limpo e minimalista</li>
        <li>Suporte ao modo escuro</li>
        <li>Layout responsivo</li>
        <li>Navegação fácil com barra lateral shadcn</li>
        <li>Construído com Next.js App Router</li>
      </ul>
      <h2 className="mb-4 mt-8 text-2xl font-semibold">Começando</h2>
      <p className="mb-4">
        Para começar com nossa documentação, por favor, navegue pelas seções usando a barra lateral à esquerda. Aqui
        está uma visão geral rápida das seções disponíveis:
      </p>
      <ul className="mb-4 list-inside list-disc space-y-1">
        <li>
          <strong>Começando</strong>: Aprenda como instalar e configurar nossa biblioteca
        </li>
        <li>
          <strong>Componentes</strong>: Explore os componentes disponíveis e como usá-los
        </li>
        <li>
          <strong>Referência da API</strong>: Informações detalhadas sobre nossa API e seus métodos
        </li>
      </ul>
      <p className="mb-4">
        Se você tiver alguma dúvida ou precisar de mais assistência, não hesite em entrar em contato com nossa equipe de
        suporte.
      </p>
    </main>
  )
}

