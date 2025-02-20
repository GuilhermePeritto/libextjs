import { users } from "./auth"

export interface PermissionGroup {
  id: string
  name: string
  description: string
  permissions: {
    [key: string]: string[]
  }
  users: typeof users
}

export const initialGroups: PermissionGroup[] = [
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
    users: [users[0]], // Admin user
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
    users: [users[1]], // Regular user
  },
]

export const modules = [
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

