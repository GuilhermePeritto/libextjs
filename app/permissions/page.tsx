"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { usePermissions } from "@/hooks/use-permissions"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PermissionGroup {
  id: string
  name: string
  description: string
  permissions: {
    [key: string]: string[]
  }
  users: User[]
}

interface User {
  id: string
  name: string
  email: string
  role: string
  avatar: string
}

const initialGroups: PermissionGroup[] = [
  {
    id: "admin",
    name: "Administradores",
    description: "Acesso total ao sistema",
    permissions: {
      components: ["view", "create", "edit", "delete"],
      documentation: ["view", "create", "edit", "delete"],
      users: ["view", "create", "edit", "delete"],
      permissions: ["view", "manage"],
    },
    users: [
      {
        id: "1",
        name: "Administrador",
        email: "adm@adm",
        role: "admin",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
  },
  {
    id: "users",
    name: "Usuários",
    description: "Acesso básico ao sistema",
    permissions: {
      components: ["view"],
      documentation: ["view"],
      users: ["view"],
    },
    users: [
      {
        id: "2",
        name: "Usuário",
        email: "user@user",
        role: "user",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    ],
  },
]

const modules = [
  {
    name: "components",
    label: "Componentes",
    actions: ["view", "create", "edit", "delete"],
  },
  {
    name: "documentation",
    label: "Documentação",
    actions: ["view", "create", "edit", "delete"],
  },
  {
    name: "users",
    label: "Usuários",
    actions: ["view", "create", "edit", "delete"],
  },
  {
    name: "permissions",
    label: "Permissões",
    actions: ["view", "manage"],
  },
]

export default function PermissionsPage() {
  const { hasPermission } = usePermissions()
  const [groups, setGroups] = useState<PermissionGroup[]>(initialGroups)
  const [selectedGroup, setSelectedGroup] = useState<PermissionGroup | null>(null)
  const [newGroup, setNewGroup] = useState({
    name: "",
    description: "",
  })

  if (!hasPermission("permissions", "manage")) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Você não tem permissão para acessar esta página.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleCreateGroup = () => {
    if (!newGroup.name || !newGroup.description) {
      toast.error("Preencha todos os campos")
      return
    }

    const newGroupData: PermissionGroup = {
      id: Date.now().toString(),
      name: newGroup.name,
      description: newGroup.description,
      permissions: {},
      users: [],
    }

    setGroups([...groups, newGroupData])
    setNewGroup({ name: "", description: "" })
    toast.success("Grupo criado com sucesso!")
  }

  const handleUpdatePermissions = (group: PermissionGroup) => {
    const updatedGroups = groups.map((g) => (g.id === group.id ? group : g))
    setGroups(updatedGroups)
    toast.success("Permissões atualizadas com sucesso!")
  }

  const handleAddUserToGroup = (group: PermissionGroup, user: User) => {
    const updatedGroup = {
      ...group,
      users: [...group.users, user],
    }
    const updatedGroups = groups.map((g) => (g.id === group.id ? updatedGroup : g))
    setGroups(updatedGroups)
    toast.success("Usuário adicionado ao grupo!")
  }

  const handleRemoveUserFromGroup = (group: PermissionGroup, userId: string) => {
    const updatedGroup = {
      ...group,
      users: group.users.filter((u) => u.id !== userId),
    }
    const updatedGroups = groups.map((g) => (g.id === group.id ? updatedGroup : g))
    setGroups(updatedGroups)
    toast.success("Usuário removido do grupo!")
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Grupos de Permissões</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Novo Grupo</Button>
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
              <Button onClick={handleCreateGroup}>Criar Grupo</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {groups.map((group) => (
          <Card key={group.id}>
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
                            <Card key={module.name}>
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
                                          }
                                          if (checked) {
                                            updatedPermissions[module.name] = [
                                              ...(updatedPermissions[module.name] || []),
                                              action,
                                            ]
                                          } else {
                                            updatedPermissions[module.name] = updatedPermissions[module.name].filter(
                                              (a) => a !== action,
                                            )
                                          }
                                          const updatedGroup = {
                                            ...group,
                                            permissions: updatedPermissions,
                                          }
                                          handleUpdatePermissions(updatedGroup)
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
                                const user = initialGroups.flatMap((g) => g.users).find((u) => u.id === value)
                                if (user && !group.users.find((u) => u.id === user.id)) {
                                  handleAddUserToGroup(group, user)
                                }
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Adicionar usuário" />
                              </SelectTrigger>
                              <SelectContent>
                                {initialGroups
                                  .flatMap((g) => g.users)
                                  .filter((user) => !group.users.find((u) => u.id === user.id))
                                  .map((user) => (
                                    <SelectItem key={user.id} value={user.id}>
                                      {user.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            {group.users.map((user) => (
                              <div key={user.id} className="flex items-center justify-between p-2 rounded-lg border">
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
                                  onClick={() => handleRemoveUserFromGroup(group, user.id)}
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
                  <Badge key={user.id} variant="secondary">
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
  )
}

