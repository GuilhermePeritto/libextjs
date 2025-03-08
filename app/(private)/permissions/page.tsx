"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePermissions } from "@/hooks/use-permissions";
import { IModule } from "@/models/Module";
import { IPermissionGroup } from "@/models/Permission";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function PermissionsPage() {
  const { hasPermission } = usePermissions();
  const [groups, setGroups] = useState<IPermissionGroup[]>([]);
  const [modules, setModules] = useState<IModule[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<IPermissionGroup | null>(null);
  const [newGroup, setNewGroup] = useState({ name: "", description: "" });
  const [loading, setLoading] = useState(true);

  // Buscar grupos de permissões e módulos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [groupsResponse, modulesResponse] = await Promise.all([
          fetch("/api/permissions"),
          fetch("/api/modules"),
        ]);

        if (!groupsResponse.ok || !modulesResponse.ok) {
          throw new Error("Erro ao carregar dados");
        }

        const groupsData = await groupsResponse.json();
        const modulesData = await modulesResponse.json();

        setGroups(groupsData);
        setModules(modulesData);
      } catch (error) {
        toast.error("Erro ao carregar dados");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Criar um novo grupo de permissões
  const handleCreateGroup = async () => {
    if (!newGroup.name || !newGroup.description) {
      toast.error("Preencha todos os campos");
      return;
    }

    try {
      const response = await fetch("/api/permissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newGroup),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar grupo");
      }

      const createdGroup = await response.json();
      setGroups([...groups, createdGroup]);
      setNewGroup({ name: "", description: "" });
      toast.success("Grupo criado com sucesso!");
    } catch (error) {
      toast.error("Erro ao criar grupo");
    }
  };

  // Atualizar permissões de um grupo
  const handleUpdatePermissions = async (group: IPermissionGroup) => {
    try {
      const response = await fetch(`/api/permissions/${group._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ permissions: group.permissions }),
      });

      if (!response.ok) {
        throw new Error("Erro ao atualizar permissões");
      }

      const updatedGroup = await response.json();
      setGroups(groups.map((g) => (g._id === updatedGroup._id ? updatedGroup : g)));
      toast.success("Permissões atualizadas com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar permissões");
    }
  };

  // Adicionar um usuário a um grupo
  const handleAddUserToGroup = async (groupId: string, userId: string) => {
    try {
      const response = await fetch(`/api/permissions/${groupId}/add-user`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Erro ao adicionar usuário ao grupo");
      }

      const updatedGroup = await response.json();
      setGroups(groups.map((g) => (g._id === updatedGroup._id ? updatedGroup : g)));
      toast.success("Usuário adicionado ao grupo!");
    } catch (error) {
      toast.error("Erro ao adicionar usuário ao grupo");
    }
  };

  // Remover um usuário de um grupo
  const handleRemoveUserFromGroup = async (groupId: string, userId: string) => {
    try {
      const response = await fetch(`/api/permissions/${groupId}/remove-user`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Erro ao remover usuário do grupo");
      }

      const updatedGroup = await response.json();
      setGroups(groups.map((g) => (g._id === updatedGroup._id ? updatedGroup : g)));
      toast.success("Usuário removido do grupo!");
    } catch (error) {
      toast.error("Erro ao remover usuário do grupo");
    }
  };

  if (!hasPermission("permissions", "manage")) {
    return (
      <div className="container mx-auto py-8 px-4">
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
      <div className="container mx-auto py-8 px-4">
        <p className="text-center">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Grupos de Permissões</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Novo Grupo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Grupo</DialogTitle>
              <DialogDescription>Defina as informações básicas do novo grupo de permissões</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Grupo</Label>
                <Input
                  id="name"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={newGroup.description}
                  onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
                />
              </div>
              <Button onClick={handleCreateGroup}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Grupo
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {groups.map((group) => (
          <Card key={group._id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{group.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{group.description}</p>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" onClick={() => setSelectedGroup(group)}>
                      Gerenciar
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Gerenciar Grupo: {group.name}</DialogTitle>
                      <DialogDescription>Configure as permissões e usuários deste grupo</DialogDescription>
                    </DialogHeader>
                    <Tabs defaultValue="permissions" className="mt-4">
                      <TabsList>
                        <TabsTrigger value="permissions">Permissões</TabsTrigger>
                        <TabsTrigger value="users">Usuários</TabsTrigger>
                      </TabsList>
                      <TabsContent value="permissions">
                        <div className="space-y-4">
                          {modules.map((module) => (
                            <Card key={module._id}>
                              <CardHeader>
                                <CardTitle className="text-lg">{module.label}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                  {module.actions.map((action) => (
                                    <div key={`${module.name}-${action}`} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`${module.name}-${action}`}
                                        checked={group.permissions[module.name]?.includes(action)}
                                        onCheckedChange={(checked) => {
                                          const updatedPermissions = {
                                            ...group.permissions,
                                          };
                                          if (checked) {
                                            updatedPermissions[module.name] = [
                                              ...(updatedPermissions[module.name] || []),
                                              action,
                                            ];
                                          } else {
                                            updatedPermissions[module.name] = updatedPermissions[module.name].filter(
                                              (a) => a !== action
                                            );
                                          }
                                          const updatedGroup = {
                                            ...group,
                                            permissions: updatedPermissions,
                                          };
                                          handleUpdatePermissions(updatedGroup);
                                        }}
                                      />
                                      <Label htmlFor={`${module.name}-${action}`} className="capitalize">
                                        {action}
                                      </Label>
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>
                      <TabsContent value="users">
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <Select
                              onValueChange={(value) => {
                                handleAddUserToGroup(group._id, value);
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Adicionar usuário" />
                              </SelectTrigger>
                              <SelectContent>
                                {/* Aqui você pode buscar os usuários disponíveis */}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            {group.users.map((user) => (
                              <div key={user._id} className="flex items-center justify-between p-2 rounded-lg border">
                                <div className="flex items-center gap-3">
                                  <Avatar>
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveUserFromGroup(group._id, user._id)}
                                >
                                  Remover
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {group.users.map((user) => (
                  <Badge key={user._id} variant="secondary">
                    {user.name}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {Object.entries(group.permissions).map(([module, permissions]) => (
                  <div key={module} className="space-y-1">
                    <h3 className="font-medium capitalize">{module}</h3>
                    <div className="flex flex-wrap gap-2">
                      {permissions.map((permission) => (
                        <Badge key={permission} variant="outline" className="capitalize">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}