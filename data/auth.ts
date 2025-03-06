export interface User {
  id: string
  name: string
  email: string
  role: string
  avatar: string
  permissions: {
    [key: string]: string[]
  }
}

export const adminUser: User = {
  id: "1",
  name: "Administrador",
  email: "adm@adm",
  role: "admin",
  avatar: "/placeholder",
  permissions: {
    components: ["view", "create", "edit", "delete"],
    documentation: ["view", "create", "edit", "delete"],
    users: ["view", "create", "edit", "delete"],
    permissions: ["view", "manage"],
  },
}

export const regularUser: User = {
  id: "2",
  name: "Usuário",
  email: "user@user",
  role: "user",
  avatar: "/placeholder",
  permissions: {
    components: ["view"],
    documentation: ["view"],
    users: ["view"],
  },
}

export const users = [adminUser, regularUser]

