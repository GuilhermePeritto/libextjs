import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { IModule } from "@/models/Module";
import { IPermissionGroup } from "@/models/Permission";
import { IUser } from "@/models/User";
import { Upload } from "lucide-react";
import mongoose from "mongoose";
import React, { useEffect, useState } from "react";

interface UserFormProps {
  user?: IUser;
  isNewUser?: boolean;
  onSubmit: (user: IUser, password?: string) => void;
  onCancel: () => void;
}

export function UserForm({ user, isNewUser = false, onSubmit, onCancel }: UserFormProps) {
  const defaultUser: IUser = {
    name: "",
    email: "",
    avatar: "/avatar.png",
    status: "active",
    useGroupPermissions: true,
    permissionGroup: new mongoose.Types.ObjectId(),
    permissions: {},
    password: "",
    createdAt: new Date(),
  };

  const [formData, setFormData] = useState<IUser>(user || defaultUser);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modules, setModules] = useState<IModule[]>([]);
  const [permissionGroups, setPermissionGroups] = useState<IPermissionGroup[]>([]);

  useEffect(() => {
    if (user) {
      setFormData(user);
    }
  }, [user]);

  useEffect(() => {
    // Buscar módulos e permissões
    const fetchModulesAndPermissions = async () => {
      try {
        const modulesResponse = await fetch("/api/modules");
        const modulesData = await modulesResponse.json();
        setModules(modulesData);

        const permissionGroupsResponse = await fetch("/api/permissions");
        const permissionGroupsData = await permissionGroupsResponse.json();
        setPermissionGroups(permissionGroupsData);
      } catch (error) {
        console.error("Erro ao buscar módulos e permissões:", error);
      }
    };

    fetchModulesAndPermissions();
  }, []);

  const updatePermission = (module: string, action: string, checked: boolean) => {
    setFormData((prev) => {
      const newPermissions = { ...prev.permissions } || {};

      if (!newPermissions[module]) {
        newPermissions[module] = [];
      }

      if (checked) {
        newPermissions[module] = [...newPermissions[module], action];
      } else {
        newPermissions[module] = newPermissions[module].filter((a) => a !== action);
      }

      return { ...prev, permissions: newPermissions };
    });
  };

  const hasPermissionChecked = (module: string, action: string) => {
    return formData.permissions?.[module]?.includes(action) || false;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData, isNewUser ? password : undefined);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Coluna da esquerda - Informações básicas */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>Dados pessoais e de acesso do usuário</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center mb-4">
                <Avatar className="h-20 w-20 mb-2">
                  <AvatarImage src={formData.avatar} alt="Avatar" />
                  <AvatarFallback>{formData.name.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  {isNewUser ? "Adicionar Avatar" : "Alterar Avatar"}
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: "active" | "inactive") => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{isNewUser ? "Senha" : "Alterar Senha"}</CardTitle>
              <CardDescription>
                {isNewUser ? "Defina a senha do usuário" : "Deixe em branco para manter a senha atual"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">{isNewUser ? "Senha" : "Nova Senha"}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isNewUser ? "" : "Deixe em branco para manter a senha atual"}
                  required={isNewUser}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar {isNewUser ? "Senha" : "Nova Senha"}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme a senha"
                  required={isNewUser}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Coluna da direita - Permissões */}
        <div className="md:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle>Permissões</CardTitle>
              <CardDescription>Configure as permissões de acesso do usuário</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="useGroupPermissions">Usar Permissões de Grupo</Label>
                  <p className="text-sm text-muted-foreground">
                    O usuário herdará todas as permissões do grupo selecionado
                  </p>
                </div>
                <Switch
                  id="useGroupPermissions"
                  checked={formData.useGroupPermissions}
                  onCheckedChange={(checked) => setFormData({ ...formData, useGroupPermissions: checked })}
                />
              </div>

              {formData.useGroupPermissions ? (
                <div className="space-y-2">
                  <Label htmlFor="permissionGroup">Grupo de Permissões</Label>
                  <Select
                    value={formData.permissionGroup.toString()}
                    onValueChange={(value) => setFormData({ ...formData, permissionGroup: new mongoose.Types.ObjectId(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um grupo" />
                    </SelectTrigger>
                    <SelectContent>
                      {permissionGroups.map((group) => (
                        <SelectItem key={group._id.toString()} value={group._id.toString()}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <ScrollArea className="h-[calc(100vh-350px)] pr-4">
                  <div className="space-y-4">
                    {modules.map((module) => (
                      <Card key={module.name}>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg">{module.label}</CardTitle>
                          <CardDescription>Permissões para o módulo {module.label.toLowerCase()}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {module.actions.map((action) => (
                              <div key={`${module.name}-${action}`} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`${module.name}-${action}`}
                                  checked={hasPermissionChecked(module.name, action)}
                                  onCheckedChange={(checked) =>
                                    updatePermission(module.name, action, checked as boolean)
                                  }
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
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-4">
        <Button variant="outline" onClick={onCancel} type="button">
          Cancelar
        </Button>
        <Button type="submit">{isNewUser ? "Criar Usuário" : "Salvar Alterações"}</Button>
      </div>
    </form>
  );
}