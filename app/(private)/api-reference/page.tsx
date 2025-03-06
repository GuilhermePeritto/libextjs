import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Referência da API | Site de Documentação Minimalista",
  description: "Referência detalhada da API para nossa biblioteca",
}

export default function ReferenciaAPI() {
  return (
    <main className="max-w-3xl mx-auto py-8">
      <h1 className="text-4xl font-bold mb-6">Referência da API</h1>
      <p className="text-xl mb-4">
        Esta seção fornece uma referência detalhada para a API de nossa biblioteca. Você encontrará informações sobre
        métodos disponíveis, seus parâmetros e valores de retorno.
      </p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">Cliente</h2>
      <p className="mb-4">A classe principal para interagir com nossa API.</p>
      <h3 className="text-xl font-semibold mt-6 mb-2">Construtor</h3>
      <pre className="bg-muted p-4 rounded-md mb-4">
        <code>{`new Cliente(config: ConfigCliente)`}</code>
      </pre>
      <p className="mb-4">Cria uma nova instância da classe Cliente.</p>
      <h4 className="text-lg font-semibold mt-4 mb-2">Parâmetros</h4>
      <ul className="list-disc list-inside mb-4">
        <li>
          <code>config</code>: Um objeto contendo a configuração do cliente
        </li>
      </ul>
      <h3 className="text-xl font-semibold mt-6 mb-2">Métodos</h3>
      <h4 className="text-lg font-semibold mt-4 mb-2">fazerAlgo()</h4>
      <pre className="bg-muted p-4 rounded-md mb-4">
        <code>{`async fazerAlgo(): Promise<Resultado>`}</code>
      </pre>
      <p className="mb-4">Realiza uma ação e retorna um resultado.</p>
      <h4 className="text-lg font-semibold mt-4 mb-2">Retorna</h4>
      <p className="mb-4">Uma Promise que resolve para um objeto Resultado.</p>
      <h2 className="text-2xl font-semibold mt-8 mb-4">Tipos</h2>
      <h3 className="text-xl font-semibold mt-6 mb-2">ConfigCliente</h3>
      <pre className="bg-muted p-4 rounded-md mb-4">
        <code>{`interface ConfigCliente {
  chaveApi: string;
  ambiente: 'producao' | 'desenvolvimento';
}`}</code>
      </pre>
      <h3 className="text-xl font-semibold mt-6 mb-2">Resultado</h3>
      <pre className="bg-muted p-4 rounded-md mb-4">
        <code>{`interface Resultado {
  id: string;
  dados: any;
  timestamp: number;
}`}</code>
      </pre>
      <p className="mt-4">
        Para informações mais detalhadas sobre componentes específicos e suas props, por favor, consulte a seção
        Componentes.
      </p>
    </main>
  )
}

