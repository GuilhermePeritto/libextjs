"use client"


export interface ComponentFile {
  name: string
  content: string
}

export interface ComponentFolder {
  name: string
  children: (ComponentFile | ComponentFolder)[]
}

export interface Componente {
  nome: string
  descricao: string,
  comoUsar: string
  componente: string
  codigo: ComponentFile | ComponentFolder
  autor: string
  ultimaModificacao: string
  tamanho?: "pequeno" | "normal" | "largo" | "extralargo"
  pasta?: string
  propriedades?: { nome: string; tipo: string; descricao: string; padrao?: string }[]
  metodos?: { nome: string; parametros: string; retorno: string; descricao: string }[]
  exemplos?: { titulo: string; codigo: string }[]
}

export const componentesIniciais: Componente[] = [
  {
    nome: "Use button",
    descricao: "Botão personalizado com ícone de carregamento.",
    comoUsar: `{
                xtype: 'use-searchfield-usuario',
                fieldLabel: 'Usuário',
            }`,
    componente: `
    `,
    codigo: {
      name: "UseButton.js",
      content: `Ext.define('Use.button.Button', {
        extend: 'Ext.button.Button',
        alias: 'widget.use-button',
    
        perms: undefined,
    
        /**
         * @cfg {String}
         * Tamanho do botão, pode ser "medium", "small", "large".
         */
        scale: 'medium',
    
        /**
         * Se o parametro noDisable estiver como false, o componente será desabilitado na ação de visualizar, se true o componente continua ativo.
         */
        noDisable: false,
    
        loadingIconCls: 'icone-loader-buttons-16x16',
    
        initComponent: function () {
            var me = this;
    
            me.callParent();
    
            me.on('afterrender', function() {
                if (this.automatedTestId) {
                    if ( me.btnEl ) {
                        me.btnEl.dom.setAttribute(this.automatedTestIdName, this.automatedTestId);
                    }
                }
            });
    
            me.on({
                render: {
                    fn: me.onRenderButton,
                    scope: me
                }
            });
        },
    
        onRenderButton: function (_this) {
            var me = this;
            _this.getEl().on({
    
                //Colocado o evento keydown no Ext.dom.Element
                keydown: {
                    scope: me,
                    fn: me.onKeyDownButton
                }
    
            });
        },
    
        onKeyDownButton: function (e) {
            this.fireEvent('keydown', this, e);
        },
    
        config: {
            isLoading: false
        },
    
        setIsLoading: function(value) {
            var me = this;
    
            if(!me.rendered) return;
    
            if ( !me.defaultIconCls ) {
                me.defaultIconCls = me.iconCls;
            }
    
            me.callParent(arguments);
    
            me.setDisabled(value);
    
            me.removeCls('x-btn-disabled');
    
            me.setIconCls(value ? me.loadingIconCls : me.defaultIconCls);
        }
    });
        `
    },
    autor: "Useall Core",
    ultimaModificacao: "2024-02-19",
    tamanho: "pequeno",
    propriedades: [
      { nome: "scale", tipo: "string", descricao: "Tamanho do botão, pode ser 'medium', 'small', 'large'" },
      { nome: "noDisable", tipo: "boolean", descricao: "Se o parametro noDisable estiver como false, o componente será desabilitado na ação de visualizar, se true o componente continua ativo." },
      { nome: "loadingIconCls", tipo: "string", descricao: "Classe do ícone de carregamento" },
      { nome: "isLoading", tipo: "boolean", descricao: "Define se o botão está em estado de carregamento" },
    ],
    metodos: [
      {
        nome: "setIsLoading",
        parametros: "value: boolean",
        retorno: "void",
        descricao: "Define se o botão está em estado de carregamento",
      },
    ],
    exemplos: [
      {
        titulo: "Botão com Ícone de Carregamento",
        codigo: `{
          xtype: 'use-button',
          text: 'Teste dos guri',
          listeners: {
              click: ($btn) => {
                  Use.Msg.alert('Botão clicado!');
              }
          }
      }`,
      },
    ]
  }/* , {
    nome: "Botão Primário",
    descricao: "Um componente de botão versátil e personalizável.",
    componente: <Button>Clique-me</Button>,
    codigo: {
      name: "Button.jsx",
      content: `<Button variant="primary" size="md" onClick={() => console.log('Clicado!')}>
  Clique-me
</Button>`,
    },
    autor: "John Doe",
    ultimaModificacao: "2024-02-19",
    tamanho: "pequeno",
    propriedades: [
      { nome: "variant", tipo: "string", descricao: "Variante do botão", padrao: "default" },
      { nome: "size", tipo: "string", descricao: "Tamanho do botão", padrao: "md" },
      { nome: "disabled", tipo: "boolean", descricao: "Define se o botão está desabilitado", padrao: "false" },
      { nome: "loading", tipo: "boolean", descricao: "Exibe um indicador de carregamento", padrao: "false" },
      {
        nome: "fullWidth",
        tipo: "boolean",
        descricao: "Faz o botão ocupar toda a largura disponível",
        padrao: "false",
      },
    ],
    metodos: [
      {
        nome: "onClick",
        parametros: "event: React.MouseEvent<HTMLButtonElement>",
        retorno: "void",
        descricao: "Função chamada quando o botão é clicado",
      },
      {
        nome: "onFocus",
        parametros: "event: React.FocusEvent<HTMLButtonElement>",
        retorno: "void",
        descricao: "Função chamada quando o botão recebe foco",
      },
      {
        nome: "onBlur",
        parametros: "event: React.FocusEvent<HTMLButtonElement>",
        retorno: "void",
        descricao: "Função chamada quando o botão perde foco",
      },
      {
        nome: "onMouseEnter",
        parametros: "event: React.MouseEvent<HTMLButtonElement>",
        retorno: "void",
        descricao: "Função chamada quando o mouse entra na área do botão",
      },
      {
        nome: "onMouseLeave",
        parametros: "event: React.MouseEvent<HTMLButtonElement>",
        retorno: "void",
        descricao: "Função chamada quando o mouse sai da área do botão",
      },
    ],
    exemplos: [
      {
        titulo: "Botão Primário Padrão",
        codigo: `<Button variant="primary">Botão Primário</Button>`,
      },
      {
        titulo: "Botão Desabilitado",
        codigo: `<Button variant="primary" disabled>Botão Desabilitado</Button>`,
      },
    ],
  },
  {
    nome: "Cartão Simples",
    descricao: "Um componente para exibir conteúdo em uma caixa com estilo consistente.",
    componente: (
      <Card>
        <CardContent>Este é o conteúdo do cartão.</CardContent>
      </Card>
    ),
    codigo: {
      name: "Card.jsx",
      content: `<Card>
  <CardContent>Este é o conteúdo do cartão.</CardContent>
</Card>`,
    },
    autor: "Jane Smith",
    ultimaModificacao: "2024-02-18",
    tamanho: "normal",
    propriedades: [
      { nome: "className", tipo: "string", descricao: "Classes CSS adicionais para o cartão" },
      { nome: "shadow", tipo: "boolean", descricao: "Define se o cartão possui sombra", padrao: "false" },
      { nome: "borderRadius", tipo: "string", descricao: "Define o raio da borda do cartão", padrao: "md" },
      { nome: "backgroundColor", tipo: "string", descricao: "Define a cor de fundo do cartão", padrao: "white" },
      { nome: "borderWidth", tipo: "string", descricao: "Define a largura da borda do cartão", padrao: "1px" },
    ],
    metodos: [
      {
        nome: "onClick",
        parametros: "event: React.MouseEvent<HTMLDivElement>",
        retorno: "void",
        descricao: "Função chamada quando o cartão é clicado",
      },
      {
        nome: "onMouseEnter",
        parametros: "event: React.MouseEvent<HTMLDivElement>",
        retorno: "void",
        descricao: "Função chamada quando o mouse entra na área do cartão",
      },
      {
        nome: "onMouseLeave",
        parametros: "event: React.MouseEvent<HTMLDivElement>",
        retorno: "void",
        descricao: "Função chamada quando o mouse sai da área do cartão",
      },
      {
        nome: "onDoubleClick",
        parametros: "event: React.MouseEvent<HTMLDivElement>",
        retorno: "void",
        descricao: "Função chamada quando o cartão é clicado duas vezes",
      },
      {
        nome: "onContextMenu",
        parametros: "event: React.MouseEvent<HTMLDivElement>",
        retorno: "void",
        descricao: "Função chamada quando o menu de contexto é aberto no cartão",
      },
    ],
    exemplos: [
      {
        titulo: "Cartão com Título",
        codigo: `<Card>
  <CardHeader>
    <CardTitle>Título do Cartão</CardTitle>
  </CardHeader>
  <CardContent>
    Conteúdo do cartão aqui.
  </CardContent>
</Card>`,
      },
    ],
  },
  {
    nome: "Formulário de Login",
    descricao: "Um formulário de login completo com validação.",
    componente: (
      <Card className="w-full max-w-sm">
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email">Email</label>
              <Input id="email" type="email" placeholder="seu@email.com" required />
            </div>
            <div className="space-y-2">
              <label htmlFor="password">Senha</label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    ),
    codigo: {
      name: "LoginForm.jsx",
      content: `import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function LoginForm({ onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ email, password });
  };

  return (
    <Card className="w-full max-w-sm">
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email">Email</label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password">Senha</label>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">Entrar</Button>
        </form>
      </CardContent>
    </Card>
  );
}`,
    },
    pasta: "Formulários",
    autor: "Alice Johnson",
    ultimaModificacao: "2024-02-17",
    tamanho: "largo",
    propriedades: [
      { nome: "onSubmit", tipo: "function", descricao: "Função chamada ao submeter o formulário" },
      { nome: "emailPlaceholder", tipo: "string", descricao: "Placeholder do campo de email", padrao: "seu@email.com" },
      { nome: "passwordPlaceholder", tipo: "string", descricao: "Placeholder do campo de senha", padrao: "Senha" },
      { nome: "submitButtonText", tipo: "string", descricao: "Texto do botão de submit", padrao: "Entrar" },
      { nome: "errorMessage", tipo: "string", descricao: "Mensagem de erro a ser exibida", padrao: "" },
    ],
    metodos: [
      {
        nome: "handleSubmit",
        parametros: "event: React.FormEvent<HTMLFormElement>",
        retorno: "void",
        descricao: "Lida com a submissão do formulário",
      },
      {
        nome: "validateEmail",
        parametros: "email: string",
        retorno: "boolean",
        descricao: "Valida o formato do email",
      },
      {
        nome: "validatePassword",
        parametros: "password: string",
        retorno: "boolean",
        descricao: "Valida a força da senha",
      },
      {
        nome: "clearForm",
        parametros: "",
        retorno: "void",
        descricao: "Limpa os campos do formulário",
      },
      {
        nome: "displayError",
        parametros: "message: string",
        retorno: "void",
        descricao: "Exibe uma mensagem de erro",
      },
    ],
    exemplos: [
      {
        titulo: "Uso Básico do Formulário de Login",
        codigo: `<LoginForm onSubmit={(data) => console.log('Login submetido:', data)} />`,
      },
    ],
  },
  {
    nome: "Card de Usuário",
    descricao: "Card para exibir informações do usuário",
    componente: (
      <Card className="w-full max-w-sm">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">John Doe</h3>
              <p className="text-sm text-muted-foreground">Desenvolvedor Frontend</p>
            </div>
          </div>
        </CardContent>
      </Card>
    ),
    codigo: {
      name: "UserCard.jsx",
      content: `import { Card, CardContent } from '@/components/ui/card';
import { User } from 'lucide-react';

export function UserCard({ name, role, avatarUrl }) {
  return (
    <Card className="w-full max-w-sm">
      <CardContent className="pt-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            {avatarUrl ? (
              <img src={avatarUrl || "/placeholder.svg"} alt={name} className="w-10 h-10 rounded-full" />
            ) : (
              <User className="w-6 h-6 text-primary" />
            )}
          </div>
          <div>
            <h3 className="font-medium">{name}</h3>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}`,
    },
    pasta: "Cards",
    autor: "Bob Wilson",
    ultimaModificacao: "2024-02-16",
    tamanho: "normal",
    propriedades: [
      { nome: "name", tipo: "string", descricao: "Nome do usuário" },
      { nome: "role", tipo: "string", descricao: "Cargo ou função do usuário" },
      { nome: "avatarUrl", tipo: "string", descricao: "URL da imagem de avatar do usuário (opcional)" },
      { nome: "className", tipo: "string", descricao: "Classes CSS adicionais para o card", padrao: "" },
      { nome: "showStatus", tipo: "boolean", descricao: "Exibe o status do usuário", padrao: "false" },
    ],
    metodos: [
      {
        nome: "handleClick",
        parametros: "event: React.MouseEvent<HTMLDivElement>",
        retorno: "void",
        descricao: "Função chamada quando o card é clicado",
      },
      {
        nome: "handleMouseEnter",
        parametros: "event: React.MouseEvent<HTMLDivElement>",
        retorno: "void",
        descricao: "Função chamada quando o mouse entra na área do card",
      },
      {
        nome: "handleMouseLeave",
        parametros: "event: React.MouseEvent<HTMLDivElement>",
        retorno: "void",
        descricao: "Função chamada quando o mouse sai da área do card",
      },
      {
        nome: "formatName",
        parametros: "name: string",
        retorno: "string",
        descricao: "Formata o nome do usuário",
      },
      {
        nome: "getInitials",
        parametros: "name: string",
        retorno: "string",
        descricao: "Retorna as iniciais do nome do usuário",
      },
    ],
    exemplos: [
      {
        titulo: "Card de Usuário com Avatar",
        codigo: `<UserCard
  name="Jane Smith"
  role="Designer de UX"
  avatarUrl="https://exemplo.com/avatar.jpg"
/>`,
      },
      {
        titulo: "Card de Usuário sem Avatar",
        codigo: `<UserCard
  name="John Doe"
  role="Desenvolvedor Frontend"
/>`,
      },
    ],
  },
  {
    nome: "DataTable",
    descricao: "Uma tabela de dados avançada com ordenação, filtragem e paginação.",
    componente: (
      <div className="border rounded-md p-4">
        <h3 className="text-lg font-semibold mb-2">DataTable Component</h3>
        <p className="text-sm text-muted-foreground">Placeholder for DataTable component</p>
      </div>
    ),
    codigo: {
      name: "DataTable.tsx",
      content: `import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface DataTableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessor: keyof T;
  }[];
  itemsPerPage?: number;
}

export function DataTable<T>({ data, columns, itemsPerPage = 10 }: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [filter, setFilter] = useState('');

  const filteredData = data.filter((item) =>
    Object.values(item).some((value) =>
      String(value).toLowerCase().includes(filter.toLowerCase())
    )
  );

  const sortedData = sortColumn
    ? [...filteredData].sort((a, b) => {
        if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      })
    : filteredData;

  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (column: keyof T) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  return (
    <div>
      <Input
        placeholder="Filtrar..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-4"
      />
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead
                key={column.accessor as string}
                onClick={() => handleSort(column.accessor)}
                className="cursor-pointer"
              >
                {column.header}
                {sortColumn === column.accessor && (
                  <span>{sortDirection === 'asc' ? ' ▲' : ' ▼'}</span>
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.map((row, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column.accessor as string}>
                  {row[column.accessor] as React.ReactNode}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Anterior
        </Button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
}`,
    },
    autor: "Jane Doe",
    ultimaModificacao: "2024-02-20",
    tamanho: "extralargo",
    pasta: "Components/DataTable",
    propriedades: [
      { nome: "data", tipo: "T[]", descricao: "Array de objetos contendo os dados da tabela" },
      {
        nome: "columns",
        tipo: "{ header: string; accessor: keyof T; }[]",
        descricao: "Definições das colunas da tabela",
      },
      { nome: "itemsPerPage", tipo: "number", descricao: "Número de itens por página", padrao: "10" },
      { nome: "filterPlaceholder", tipo: "string", descricao: "Placeholder do campo de filtro", padrao: "Filtrar..." },
      { nome: "showPagination", tipo: "boolean", descricao: "Exibe a paginação", padrao: "true" },
    ],
    metodos: [
      {
        nome: "handleSort",
        parametros: "column: keyof T",
        retorno: "void",
        descricao: "Gerencia a ordenação da tabela quando uma coluna é clicada",
      },
      {
        nome: "handleFilter",
        parametros: "filterValue: string",
        retorno: "void",
        descricao: "Gerencia o filtro da tabela",
      },
      {
        nome: "goToPage",
        parametros: "pageNumber: number",
        retorno: "void",
        descricao: "Navega para uma página específica",
      },
      {
        nome: "nextPage",
        parametros: "",
        retorno: "void",
        descricao: "Navega para a próxima página",
      },
      {
        nome: "previousPage",
        parametros: "",
        retorno: "void",
        descricao: "Navega para a página anterior",
      },
    ],
    exemplos: [
      {
        titulo: "Uso Básico do DataTable",
        codigo: `const data = [
  { id: 1, name: 'John Doe', age: 30 },
  { id: 2, name: 'Jane Smith', age: 25 },
  // ... mais dados
];

const columns = [
  { header: 'ID', accessor: 'id' },
  { header: 'Nome', accessor: 'name' },
  { header: 'Idade', accessor: 'age' },
];

return <DataTable data={data} columns={columns} />;`,
      },
    ],
  },
  {
    nome: "AuthProvider",
    descricao: "Um provedor de autenticação para gerenciar o estado de autenticação do usuário.",
    componente: (
      <div className="border rounded-md p-4">
        <h3 className="text-lg font-semibold mb-2">AuthProvider Component</h3>
        <p className="text-sm text-muted-foreground">Placeholder for AuthProvider component</p>
      </div>
    ),
    codigo: {
      name: "AuthProvider.tsx",
      content: `import React, { useState, createContext, useContext, useEffect } from 'react';

interface AuthContextType {
  user: string | null;
  login: (username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    // Check for saved user in localStorage on initial load
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  const login = (username: string) => {
    setUser(username);
    localStorage.setItem('user', username);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};`,
    },
    autor: "John Smith",
    ultimaModificacao: "2024-02-21",
    tamanho: "normal",
    pasta: "Providers/AuthProvider",
    propriedades: [
      {
        nome: "children",
        tipo: "React.ReactNode",
        descricao: "Componentes filhos que terão acesso ao contexto de autenticação",
      },
      { nome: "storageKey", tipo: "string", descricao: "Chave para salvar o usuário no localStorage", padrao: "user" },
      { nome: "autoLogin", tipo: "boolean", descricao: "Realiza login automático ao carregar", padrao: "true" },
      { nome: "redirectOnLogin", tipo: "string", descricao: "URL para redirecionar após o login", padrao: "" },
      { nome: "redirectOnLogout", tipo: "string", descricao: "URL para redirecionar após o logout", padrao: "" },
    ],
    metodos: [
      {
        nome: "login",
        parametros: "username: string",
        retorno: "void",
        descricao: "Realiza o login do usuário e salva o estado no localStorage",
      },
      {
        nome: "logout",
        parametros: "",
        retorno: "void",
        descricao: "Realiza o logout do usuário e remove o estado do localStorage",
      },
      {
        nome: "checkAuth",
        parametros: "",
        retorno: "boolean",
        descricao: "Verifica se o usuário está autenticado",
      },
      {
        nome: "getUser",
        parametros: "",
        retorno: "string | null",
        descricao: "Retorna o nome do usuário autenticado",
      },
      {
        nome: "clearStorage",
        parametros: "",
        retorno: "void",
        descricao: "Limpa o localStorage",
      },
    ],
    exemplos: [
      {
        titulo: "Uso do AuthProvider",
        codigo: `import { AuthProvider } from './AuthProvider';

function App() {
  return (
    <AuthProvider>
      <YourApp />
    </AuthProvider>
  );
}`,
      },
      {
        titulo: "Uso do Hook useAuth",
        codigo: `import { useAuth } from './AuthProvider';

function LoginButton() {
  const { user, login, logout } = useAuth();

  return user ? (
    <button onClick={logout}>Logout</button>
  ) : (
    <button onClick={() => login('exampleUser')}>Login</button>
  );
}`,
      },
    ],
  },
  {
    nome: "ComplexLayout",
    descricao: "Um layout complexo com múltiplas pastas e componentes aninhados.",
    componente: (
      <div className="border rounded-md p-4">
        <h3 className="text-lg font-semibold mb-2">Complex Layout Component</h3>
        <p className="text-sm text-muted-foreground">Placeholder for Complex Layout component</p>
      </div>
    ),
    codigo: {
      name: "ComplexLayout",
      children: [
        {
          name: "index.tsx",
          content: `export { ComplexLayout } from './ComplexLayout';`,
        },
        {
          name: "ComplexLayout.tsx",
          content: `import React from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MainContent } from './components/MainContent';
import { Footer } from './components/Footer';

export const ComplexLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <MainContent>{children}</MainContent>
      </div>
      <Footer />
    </div>
  );
};`,
        },
        {
          name: "components",
          children: [
            {
              name: "Header.tsx",
              content: `import React from 'react';
import { Logo } from '../elements/Logo';
import { Navigation } from '../elements/Navigation';

export const Header: React.FC = () => {
  return (
    <header className="bg-primary text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Logo />
        <Navigation />
      </div>
    </header>
  );
};`,
            },
            {
              name: "Sidebar.tsx",
              content: `import React from 'react';
import { SidebarMenu } from '../elements/SidebarMenu';

export const Sidebar: React.FC = () => {
  return (
    <aside className="bg-gray-100 w-64 p-4">
      <SidebarMenu />
    </aside>
  );
};`,
            },
            {
              name: "MainContent.tsx",
              content: `import React from 'react';
import { ContentArea } from '../elements/ContentArea';

export const MainContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <main className="flex-1 p-4">
      <ContentArea>{children}</ContentArea>
    </main>
  );
};`,
            },
            {
              name: "Footer.tsx",
              content: `import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-200 p-4 text-center">
      <p>&copy; 2024 Complex Layout. All rights reserved.</p>
    </footer>
  );
};`,
            },
          ],
        },
        {
          name: "elements",
          children: [
            {
              name: "Logo.tsx",
              content: `import React from 'react';

export const Logo: React.FC = () => {
  return <div className="text-2xl font-bold">Complex Layout</div>;
};`,
            },
            {
              name: "Navigation.tsx",
              content: `import React from 'react';
import Link from 'next/link';

export const Navigation: React.FC = () => {
  return (
    <nav>
      <ul className="flex space-x-4">
        <li><Link href="/" className="hover:underline">Home</Link></li>
        <li><Link href="/about" className="hover:underline">About</a></li>
        <li><Link href="/contact" className="hover:underline">Contact</Link></li>
      </ul>
    </nav>
  );
};`,
            },
            {
              name: "SidebarMenu.tsx",
              content: `import React from 'react';
import Link from 'next/link';

export const SidebarMenu: React.FC = () => {
  return (
    <ul className="space-y-2">
      <li><Link href="/dashboard" className="block hover:bg-gray-200 p-2 rounded">Dashboard</Link></li>
      <li><Link href="/profile" className="block hover:bg-gray-200 p-2 rounded">Profile</Link></li>
      <li><Link href="/settings" className="block hover:bg-gray-200 p-2 rounded">Settings</Link></li>
    </ul>
  );
};`,
            },
            {
              name: "ContentArea.tsx",
              content: `import React from 'react';

export const ContentArea: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Welcome to Complex Layout</h1>
      <div className="prose max-w-none">
        {children}
      </div>
    </div>
  );
};`,
            },
          ],
        },
      ],
    },
    autor: "Alex Johnson",
    ultimaModificacao: "2024-02-22",
    tamanho: "largo",
    pasta: "Layouts/ComplexLayout",
    propriedades: [
      { nome: "children", tipo: "React.ReactNode", descricao: "Conteúdo principal a ser renderizado dentro do layout" },
      { nome: "headerHeight", tipo: "string", descricao: "Altura do cabeçalho", padrao: "64px" },
      { nome: "sidebarWidth", tipo: "string", descricao: "Largura da barra lateral", padrao: "256px" },
      { nome: "footerHeight", tipo: "string", descricao: "Altura do rodapé", padrao: "48px" },
      { nome: "backgroundColor", tipo: "string", descricao: "Cor de fundo do layout", padrao: "#f0f2f5" },
    ],
    metodos: [
      {
        nome: "toggleSidebar",
        parametros: "",
        retorno: "void",
        descricao: "Alterna a visibilidade da barra lateral",
      },
      {
        nome: "setHeaderContent",
        parametros: "content: React.ReactNode",
        retorno: "void",
        descricao: "Define o conteúdo do cabeçalho",
      },
      {
        nome: "setFooterContent",
        parametros: "content: React.ReactNode",
        retorno: "void",
        descricao: "Define o conteúdo do rodapé",
      },
      {
        nome: "setMainContentClassName",
        parametros: "className: string",
        retorno: "void",
        descricao: "Define classes CSS para a área de conteúdo principal",
      },
      {
        nome: "handleResize",
        parametros: "",
        retorno: "void",
        descricao: "Lida com o redimensionamento da janela",
      },
    ],
    exemplos: [
      {
        titulo: "Uso Básico do ComplexLayout",
        codigo: `import { ComplexLayout } from './layouts/ComplexLayout';

function HomePage() {
  return (
    <ComplexLayout>
      <h2>Bem-vindo à Página Inicial</h2>
      <p>Este é um exemplo de conteúdo dentro do ComplexLayout.</p>
    </ComplexLayout>
  );
}`,
      },
    ],
  }, */
]

export default componentesIniciais

