// URLs dos recursos ExtJS e temas
const useExtAllUrl = 'https://desenvuseall.useall.com.br/useallux/ext-all-7.8.0.js?d=010119000000';
const useExtCoreUrl = 'https://desenvuseall.useall.com.br/useallux/useall-core-7.8.1.js?d=010119000000';
const temaExtUrlAll = 'https://desenvsb2.useall.com.br/servicos/resources/App-all.css?d=010119000000';
const temaExtUrl_1 = 'https://desenvsb2.useall.com.br/servicos/resources/App-all_1.css';
const temaExtUrl_2 = 'https://desenvsb2.useall.com.br/servicos/resources/App-all_2.css';
const temaExtUrl_3 = 'https://desenvsb2.useall.com.br/servicos/resources/App-all_3.css';
const temaExtUrl_4 = 'https://desenvsb2.useall.com.br/servicos/resources/App-all_4.css';

// Função para gerar a página HTML com o componente ExtJS
export function generateExtPage(componentDefinition: string, componentUsage: string): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>ExtJS Component</title>

      <!-- Carregar temas -->
      <link rel="stylesheet" href="${temaExtUrlAll}">
      <link rel="stylesheet" href="${temaExtUrl_1}">
      <link rel="stylesheet" href="${temaExtUrl_2}">
      <link rel="stylesheet" href="${temaExtUrl_3}">
      <link rel="stylesheet" href="${temaExtUrl_4}">

      <!-- Configuração do Use e RequireJS ANTES de carregar o core -->
      <script>
        window.requirejs = window.requirejs || function () {
          console.warn("RequireJS foi chamado, mas não existe. Retornando um mock.");
          return {};
        };

        window.UseConfig = window.UseConfig || function () {
          console.warn("UseConfig foi chamado, mas não existe. Retornando um mock.");
          return {
            loadCssPaths: function (paths) {
              console.log("Mock de loadCssPaths chamado com:", paths);
            }
          };
        };

        window.Use = window.Use || {};

        // Configuração do Use.config com Proxy ANTES de carregar o core
        Use.config = new Proxy({}, {
          get: (target, prop) => {
            if (!(prop in target)) {
              console.warn(\`Interceptado: use.config.\${prop} não existe. Retornando string vazia.\`);
              target[prop] = ""; // Retorna uma string vazia para evitar erro no .split()
            }
            return target[prop];
          }
        });

        // Definir a propriedade centralUrl no Use.config
        Use.config.centralUrl = "https://desenvuseall.useall.com.br";
      </script>

      <!-- Carregar ExtJS e Use Core -->
      <script src="${useExtAllUrl}"></script>
      <script src="${useExtCoreUrl}"></script>

      <!-- Definir o componente (se houver definição) -->
      <script>
        ${componentDefinition || ''}
      </script>

      <!-- Estilos para centralizar o componente -->
      <style>
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f0f0f0; /* Cor de fundo opcional */
        }

        #extjs-container {
          width: 100%; /* Largura do contêiner do componente */
          height: 100%; /* Altura do contêiner do componente */
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: white; /* Cor de fundo do contêiner */
        }
      </style>

      <!-- Renderizar o componente ExtJS -->
      <script>
        Ext.onReady(function() {
          try {
            const componentConfig = ${componentUsage};
            const component = Ext.create(componentConfig);

            // Criar um contêiner para centralizar o componente
            const container = Ext.create('Ext.container.Container', {
              id: 'extjs-container',
              layout: 'vbox', // Layout para ajustar o componente ao contêiner
              renderTo: Ext.getBody(),
              items: [component] // Adicionar o componente ao contêiner
            });
          } catch (error) {
            console.error("Erro ao criar o componente ExtJS:", error);
          }
        });
      </script>
    </head>
    <body>
    </body>
    </html>
  `;
}