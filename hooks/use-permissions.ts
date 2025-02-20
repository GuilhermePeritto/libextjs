"use client"

import { useState, useEffect } from "react"

interface Permissions {
  [key: string]: string[]
}

export function usePermissions() {
  const [permissions, setPermissions] = useState<Permissions>({})

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      const { permissions } = JSON.parse(user)
      setPermissions(permissions)
    }
  }, [])

  const hasPermission = (module: string, action: string) => {
    return permissions[module]?.includes(action) ?? false
  }

  return { permissions, hasPermission }
}

