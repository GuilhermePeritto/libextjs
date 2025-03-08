"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePermissions } from "@/hooks/use-permissions";
import { IUser } from "@/models/User";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function UserDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { hasPermission } = usePermissions();
  const [user, setUser] = useState<IUser>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${params.id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user");
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

  if (!hasPermission("users", "view")) {
    return (
      <div className="container mx-auto py-4 px-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Você não tem permissão para acessar esta página.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
      <Button onClick={() => router.back()} className="mb-4">
        Voltar
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Usuário</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Nome: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Status: {user.status}</p>
        </CardContent>
      </Card>
    </div>
  );
}