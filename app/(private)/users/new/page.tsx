"use client";

import { Button } from "@/components/ui/button";
import { UserForm } from "@/components/user-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function NewUserPage() {
  const router = useRouter();

  const handleSubmit = async (userData: any, password?: string) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...userData, password }),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar usuário");
      }

      const data = await response.json();
      toast.success("Usuário criado com sucesso!");
      router.push("/users");
    } catch (error) {
      toast.error("Erro ao criar usuário");
    }
  };

  return (
    <div className="container mx-auto py-4 px-4">
      <Button variant="ghost" onClick={() => router.back()} className="mb-2">
        Voltar
      </Button>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
        <div>
          <h1 className="text-3xl font-bold">Novo Usuário</h1>
          <p className="text-muted-foreground mt-1">Crie um novo usuário no sistema</p>
        </div>
      </div>

      <UserForm isNewUser={true} onSubmit={handleSubmit} onCancel={() => router.back()} />
    </div>
  );
}