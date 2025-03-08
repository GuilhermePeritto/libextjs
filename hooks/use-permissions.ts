"use client"

import { useEffect, useState } from "react";

interface Permissions {
  [key: string]: string[]
}

export function usePermissions() {
  const [permissions, setPermissions] = useState<Permissions>({})

  useEffect(() => {
    const loadPermissions = async () => {
      try {
        const response = await fetch("/api/users/permissions");
        const data = await response.json();
        setPermissions(data.permissions);
      } catch (error) {
        console.error("Erro ao carregar permissões:", error);
      }
    };

    loadPermissions();
  }, []);

  const hasPermission = (module: string, action: string) => {
    return permissions[module]?.includes(action) ?? false
  }

  return { permissions, hasPermission }
}

