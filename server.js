const express = require('express');
const cors = require('cors'); // Opcional, se precisar de CORS
const app = express();
const port = 6969;

// Middleware para permitir CORS (opcional)
app.use(cors());

// URLs dos recursos ExtJS e temas
const useExtAllUrl = 'https://desenvuseall.useall.com.br/useallux/ext-all-7.8.0.js?d=010119000000';
const useExtCoreUrl = 'https://desenvuseall.useall.com.br/useallux/useall-core-7.8.1.js?d=010119000000';
const temaExtUrlAll = 'https://desenvsb2.useall.com.br/servicos/resources/App-all.css?d=010119000000';
const temaExtUrl_1 = 'https://desenvsb2.useall.com.br/servicos/resources/App-all_1.css';
const temaExtUrl_2 = 'https://desenvsb2.useall.com.br/servicos/resources/App-all_2.css';
const temaExtUrl_3 = 'https://desenvsb2.useall.com.br/servicos/resources/App-all_3.css';
const temaExtUrl_4 = 'https://desenvsb2.useall.com.br/servicos/resources/App-all_4.css';

// Função para gerar a página HTML com o componente ExtJS
function generateExtPage(componentDefinition, componentUsage) {
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

      <!-- Renderizar o componente ExtJS -->
      <script>
        Ext.onReady(function() {
          try {
            const componentConfig = ${componentUsage};
            const component = Ext.create(componentConfig);
            component.render(Ext.getBody());
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

// Rota para servir a página ExtJS
app.get('/ext-page', (req, res) => {
  const { componentDefinition, componentUsage } = req.query;

  if (!componentUsage) {
    return res.status(400).send('componentUsage é obrigatório');
  }

  const html = generateExtPage(decodeURIComponent(componentDefinition), decodeURIComponent(componentUsage));
  res.send(html);
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});