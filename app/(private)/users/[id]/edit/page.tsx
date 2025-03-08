"use client";

import { Button } from "@/components/ui/button";
import { UserForm } from "@/components/user-form";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function EditUserPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${params.id}`);
        if (!response.ok) {
          throw new Error("Erro ao carregar usuário");
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        toast.error("Erro ao carregar usuário");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [params.id]);

  const handleSubmit = async (userData: any, password?: string) => {
    try {
      const response = await fetch(`/api/users/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...userData, password }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar usuário");
      }

      const data = await response.json();
      toast.success("Usuário atualizado com sucesso!");
      router.push("/users");
    } catch (error) {
      toast.error("Erro ao atualizar usuário");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-4 px-4">
        <p className="text-center">Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-4 px-4">
        <p className="text-center">Usuário não encontrado</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 px-4">
      <Button variant="ghost" onClick={() => router.back()} className="mb-2">
        Voltar
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
        <div>
          <h1 className="text-3xl font-bold">Editar Usuário</h1>
          <p className="text-muted-foreground mt-1">Atualize as informações do usuário</p>
        </div>
      </div>

      <UserForm user={user} isNewUser={false} onSubmit={handleSubmit} onCancel={() => router.back()} />
    </div>
  );
}