"use client"

import { ComponentsPaginationFooter } from "@/components/components-pagination-footer";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { usePermissions } from "@/hooks/use-permissions";
import { Toggle } from "@radix-ui/react-toggle";
import { Filter, Grid, List, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface Componente {
  id: string;
  nome: string;
  descricao: string;
  comoUsar: string;
  componente: any;
  autor: string;
  ultimaModificacao: string;
  tamanho?: "pequeno" | "normal" | "largo" | "extralargo";
  pasta?: string;
}

export default function Componentes() {
  const router = useRouter();
  const { hasPermission } = usePermissions();
  const [componentes, setComponentes] = useState<Componente[]>([]);
  const [modoVisualizacao, setModoVisualizacao] = useState<"grade" | "lista">("grade");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Buscar componentes da API
  useEffect(() => {
    const fetchComponentes = async () => {
      try {
        const response = await fetch("/api/components");
        if (!response.ok) {
          throw new Error("Erro ao buscar componentes");
        }
        const data = await response.json();
        setComponentes(data);
      } catch (error) {
        toast.error("Erro ao carregar componentes");
      } finally {
        setLoading(false);
      }
    };

    fetchComponentes();
  }, []);

  // Filtragem e paginação
  const categories = useMemo(() => {
    const uniqueCategories = new Set(componentes.map((componente) => componente.pasta).filter(Boolean));
    return Array.from(uniqueCategories);
  }, [componentes]);

  const filteredComponents = useMemo(() => {
    return componentes.filter((componente) => {
      const searchFields = [componente.nome, componente.descricao, componente.pasta, componente.autor].map((field) =>
        (field || "").toLowerCase(),
      );

      const searchTerms = searchQuery.toLowerCase().split(" ");
      const matchesSearch = searchTerms.every((term) => searchFields.some((field) => field.includes(term)));
      const matchesCategory = selectedCategory ? componente.pasta === selectedCategory : true;

      return matchesSearch && matchesCategory;
    });
  }, [componentes, searchQuery, selectedCategory]);

  const totalPages = Math.ceil(filteredComponents.length / itemsPerPage);
  const paginatedComponents = filteredComponents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Resetar página ao mudar filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4 pb-24">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold">Componentes</h1>
        <div className="flex space-x-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-80">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, descrição, pasta ou autor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-10 px-0">
                <Filter className="h-4 w-4" />
                <span className="sr-only">Filtrar por categoria</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => setSelectedCategory(null)}>Todas as categorias</DropdownMenuItem>
              {categories.map((category) => (
                <DropdownMenuItem key={category} onSelect={() => setSelectedCategory(category)}>
                  {category}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Toggle
            pressed={modoVisualizacao === "grade"}
            onPressedChange={() => setModoVisualizacao(modoVisualizacao === "grade" ? "lista" : "grade")}
          >
            {modoVisualizacao === "grade" ? <Grid className="h-4 w-4" /> : <List className="h-4 w-4" />}
          </Toggle>
          {hasPermission("components", "create") && (
            <Button asChild>
              <Link href="/components/new">
                <Plus className="h-4 w-4 mr-2" />
                Novo Componente
              </Link>
            </Button>
          )}
        </div>
      </div>

      {(searchQuery || selectedCategory) && (
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredComponents.length} resultado(s) encontrado(s)
            {selectedCategory && ` na categoria "${selectedCategory}"`}
          </p>
        </div>
      )}

      <div className="space-y-8">
        <div
          className={`grid gap-6 ${modoVisualizacao === "grade" ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}
        >
          {paginatedComponents.map((componente) => (
            <ComponentCard key={componente.id} componente={componente} />
          ))}
        </div>

        <ComponentsPaginationFooter
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={setItemsPerPage}
          totalItems={filteredComponents.length}
        />
      </div>
    </div>
  );
}