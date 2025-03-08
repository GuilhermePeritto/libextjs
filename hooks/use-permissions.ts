"use client";

import { IPermissionGroup } from "@/models/Permission";
import { IUser } from "@/models/User";
import { useEffect, useState } from "react";

interface Permissions {
  [key: string]: string[];
}

export function usePermissions() {
  const [permissions, setPermissions] = useState<Permissions>({});
  const [user, setUser] = useState<IUser>();

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const response = await fetch("/api/users/permissions");
        if (!response.ok) {
          throw new Error("Erro ao carregar permissões do usuário");
        }

        const user = await response.json();
        setUser(user);
        if (!user) return;

        let userPermissions: Permissions = {};

        if (user.useGroupPermissions && user.permissionGroup) {
          // Busca as permissões do grupo
          const response = await fetch(`/api/permissions/${user.permissionGroup}`);
          if (!response.ok) {
            throw new Error("Erro ao carregar permissões do grupo");
          }
          const group: IPermissionGroup = await response.json();
          userPermissions = group.permissions;
        } else if (user.permissions) {
          // Usa as permissões personalizadas do usuário
          userPermissions = user.permissions;
        }

        setPermissions(userPermissions);
      } catch (error) {
        console.error("Erro ao carregar permissões:", error);
      }
    };

    loadPermissions();
  }, []);

  const hasPermission = (module: string, action: string) => {
    return permissions[module]?.includes(action) ?? false;
  };

  return { permissions, hasPermission };
}