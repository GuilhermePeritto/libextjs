"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { User } from "lucide-react"
import type React from "react"

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
  descricao: string
  componente: React.ReactNode;
  codigo: ComponentFile | ComponentFolder
  autor: string
  ultimaModificacao: string
  tamanho?: "normal" | "largo"
  pasta?: string
}

export const componentesIniciais: Componente[] = [
  {
    nome: "Botão Primário",
    descricao: "Um componente de botão versátil e personalizável.",
    componente: <Button>Clique-me</Button>,
    codigo: {
      name: "Button.jsx",
      content: `<Button>Clique-me</Button>`,
    },
    autor: "John Doe",
    ultimaModificacao: "2024-02-19",
  },
  {
    nome: "Cartão Simples",
    descricao: "Um componente para exibir conteúdo em uma caixa com estilo consistente.",
    componente:
      <Card>
        <CardContent>Este é o conteúdo do cartão.</CardContent>
      </Card>
    ,
    codigo: {
      name: "Card.jsx",
      content: `<Card>
  <CardContent>Este é o conteúdo do cartão.</CardContent>
</Card>`,
    },
    autor: "Jane Smith",
    ultimaModificacao: "2024-02-18",
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
      content: `<Card className="w-full max-w-sm">
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
      <Button type="submit" className="w-full">Entrar</Button>
    </form>
  </CardContent>
</Card>`,
    },
    pasta: "Formulários",
    autor: "Alice Johnson",
    ultimaModificacao: "2024-02-17",
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
      content: `<Card className="w-full max-w-sm">
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
</Card>`,
    },
    pasta: "Cards",
    autor: "Bob Wilson",
    ultimaModificacao: "2024-02-16",
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
      content: `import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export interface DataTableProps<T> {
  data: T[];
  columns: {
    header: string;
    accessor: keyof T;
  }[];
}

export function DataTable<T>({ data, columns }: DataTableProps<T>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column.accessor as string}>{column.header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row, index) => (
          <TableRow key={index}>
            {columns.map((column) => (
              <TableCell key={column.accessor as string}>{row[column.accessor] as React.ReactNode}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}`,
    },
    autor: "Jane Doe",
    ultimaModificacao: "2024-02-20",
    tamanho: "largo",
    pasta: "Components/DataTable",
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
      content: `import React, { useState, createContext, useContext } from 'react';

interface AuthContextType {
  user: string | null;
  login: (username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);

  const login = (username: string) => {
    setUser(username);
  };

  const logout = () => {
    setUser(null);
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

export const ComplexLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <MainContent />
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

export const MainContent: React.FC = () => {
  return (
    <main className="flex-1 p-4">
      <ContentArea />
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

export const Navigation: React.FC = () => {
  return (
    <nav>
      <ul className="flex space-x-4">
        <li><a href="#" className="hover:underline">Home</a></li>
        <li><a href="#" className="hover:underline">About</a></li>
        <li><a href="#" className="hover:underline">Contact</a></li>
      </ul>
    </nav>
  );
};`,
            },
            {
              name: "SidebarMenu.tsx",
              content: `import React from 'react';

export const SidebarMenu: React.FC = () => {
  return (
    <ul className="space-y-2">
      <li><a href="#" className="block hover:bg-gray-200 p-2 rounded">Dashboard</a></li>
      <li><a href="#" className="block hover:bg-gray-200 p-2 rounded">Profile</a></li>
      <li><a href="#" className="block hover:bg-gray-200 p-2 rounded">Settings</a></li>
    </ul>
  );
};`,
            },
            {
              name: "ContentArea.tsx",
              content: `import React from 'react';

export const ContentArea: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Welcome to Complex Layout</h1>
      <p className="mb-4">This is a demonstration of a complex layout with multiple nested components.</p>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">Panel 1</div>
        <div className="bg-white p-4 rounded shadow">Panel 2</div>
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
  },
]

