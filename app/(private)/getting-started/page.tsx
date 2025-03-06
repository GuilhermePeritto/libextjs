import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Começando | Site de Documentação Minimalista",
  description: "Aprenda como começar com nossa documentação",
}

export default function Comecando() {
  return (
    <main className="max-w-3xl mx-auto py-5">
      <h1 className="text-4xl font-bold mb-6">Começando</h1>
      <p className="text-xl mb-4">
        Bem-vindo ao guia de introdução para o nosso site de documentação. Siga estes passos para configurar seu
        ambiente e começar a usar nossas ferramentas.
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">Instalação</h2>
      <p className="mb-4">Para instalar nosso pacote, execute o seguinte comando em seu terminal:</p>
      <pre className="bg-muted p-4 rounded-md mb-4">
        <code>npm install @nossa-empresa/pacote</code>
      </pre>
      <h2 className="text-2xl font-semibold mt-8 mb-4">Configuração</h2>
      <p className="mb-4">
        Após a instalação, você precisa configurar o arquivo de configuração. Crie um arquivo chamado{" "}
        <code>config.js</code> na raiz do seu projeto e adicione o seguinte conteúdo:
      </p>
      <pre className="bg-muted p-4 rounded-md mb-4">
        <code>{`module.exports = {
  apiKey: 'SUA_CHAVE_API',
  ambiente: 'producao'
}`}</code>
      </pre>
      <h2 className="text-2xl font-semibold mt-8 mb-4">Uso</h2>
      <p className="mb-4">Aqui está um exemplo básico de como usar nosso pacote em seu projeto:</p>
      <pre className="bg-muted p-4 rounded-md mb-4">
        <code>{`import { Cliente } from '@nossa-empresa/pacote';

const cliente = new Cliente();
const resultado = await cliente.fazerAlgo();
console.log(resultado);`}</code>
      </pre>
      <p className="mt-4">
        Para informações mais detalhadas, por favor, confira nossas seções de Componentes e Referência da API.
      </p>
    </main>
  )
}

