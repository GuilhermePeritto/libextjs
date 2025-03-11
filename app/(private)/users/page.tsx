"use client"

import { ComponentsPaginationFooter } from "@/components/components-pagination-footer"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { usePermissions } from "@/hooks/use-permissions"
import { IUser } from "@/models/User"
import {
  Calendar,
  CheckCircle,
  Eye,
  Filter,
  MoreHorizontal,
  Pencil,
  RefreshCw,
  Search,
  UserPlus,
  X,
  XCircle,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

export default function UsersPage() {
  const router = useRouter()
  const { hasPermission } = usePermissions()
  const [users, setUsers] = useState<IUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [userToDeactivate, setUserToDeactivate] = useState<IUser | null>(null)
  const [showDeactivateDialog, setShowDeactivateDialog] = useState(false)
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all")
  const [permissionFilter, setPermissionFilter] = useState<"all" | "group" | "custom">("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(4)

  // Busca os usuários da API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/users")
        if (!response.ok) {
          throw new Error("Failed to fetch users")
        }
        const data = await response.json()
        setUsers(data)
      } catch (error) {
        toast.error("Erro ao carregar usuários")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  // Formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date)
  }

  // Filtra usuários com base na busca e filtros
  const filteredUsers = users.filter((user) => {
    // Filtro de busca
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.permissionGroup && user.permissionGroup.toLowerCase().includes(searchQuery.toLowerCase()))

    // Filtro de status
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && user.status === "active") ||
      (statusFilter === "inactive" && user.status === "inactive")

    // Filtro de permissões
    const matchesPermission =
      permissionFilter === "all" ||
      (permissionFilter === "group" && user.useGroupPermissions) ||
      (permissionFilter === "custom" && !user.useGroupPermissions)

    return matchesSearch && matchesStatus && matchesPermission
  })

  // Paginação
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Função para alternar o status do usuário
  const toggleUserStatus = (userId: string) => {
    setUsers(
      users.map((user) =>
        user._id === userId ? { ...user, status: user.status === "active" ? "inactive" : "active" } : user,
      ),
    )

    toast.success("Status do usuário atualizado com sucesso!")
    setShowDeactivateDialog(false)
    setUserToDeactivate(null)
  }

  // Modifique a função clearFilters para ser mais específica
  const clearFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setPermissionFilter("all")
    setCurrentPage(1)
  }

  // Verifica permissões
  if (!hasPermission("users", "view")) {
    return (
      <div className="container mx-auto py-4 px-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Você não tem permissão para acessar esta página.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-4 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <div>
          <h1 className="text-3xl font-bold">Usuários</h1>
          <p className="text-muted-foreground mt-1">Gerencie os usuários do sistema</p>
        </div>
        {hasPermission("users", "create") && (
          <Button onClick={() => router.push("/users/new")}>
            <UserPlus className="h-4 w-4 mr-2" />
            Novo Usuário
          </Button>
        )}
      </div>

      <Card className="mb-4">
        <CardContent className="pt-6">
          <div className="flex flex-col space-y-4">
            {/* Barra de pesquisa e contador de resultados */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="relative flex-1 w-full sm:max-w-md">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, email ou grupo..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="pl-8"
                />
              </div>
              <div className="flex items-center">
                {(searchQuery || statusFilter !== "all" || permissionFilter !== "all") && (
                  <Button variant="ghost" onClick={clearFilters} size="sm" className="h-9">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Limpar filtros
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="ml-2 h-9">
                      <Filter className="h-4 w-4 mr-2" />
                      Filtros
                      {(statusFilter !== "all" || permissionFilter !== "all") && (
                        <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                          {(statusFilter !== "all" ? 1 : 0) + (permissionFilter !== "all" ? 1 : 0)}
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Status</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                      value={statusFilter}
                      onValueChange={(value: any) => {
                        setStatusFilter(value)
                        setCurrentPage(1)
                      }}
                    >
                      <DropdownMenuRadioItem value="all">Todos</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="active">Ativos</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="inactive">Inativos</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>

                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Tipo de Permissão</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                      value={permissionFilter}
                      onValueChange={(value: any) => {
                        setPermissionFilter(value)
                        setCurrentPage(1)
                      }}
                    >
                      <DropdownMenuRadioItem value="all">Todas</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="group">Grupo</DropdownMenuRadioItem>
                      <DropdownMenuRadioItem value="custom">Personalizadas</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Chips de filtros ativos */}
            {(statusFilter !== "all" || permissionFilter !== "all") && (
              <div className="flex flex-wrap gap-2">
                {statusFilter !== "all" && (
                  <Badge variant="secondary" className="pl-2 pr-1 py-1 h-6">
                    Status: {statusFilter === "active" ? "Ativos" : "Inativos"}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 hover:bg-muted"
                      onClick={() => {
                        setStatusFilter("all")
                        setCurrentPage(1)
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {permissionFilter !== "all" && (
                  <Badge variant="secondary" className="pl-2 pr-1 py-1 h-6">
                    Permissão: {permissionFilter === "group" ? "Grupo" : "Personalizadas"}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 ml-1 hover:bg-muted"
                      onClick={() => {
                        setPermissionFilter("all")
                        setCurrentPage(1)
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
              </div>
            )}

            {/* Resultados da busca */}
            {searchQuery && (
              <div className="text-sm text-muted-foreground">
                {filteredUsers.length} resultado(s) encontrado(s) para "{searchQuery}"
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>Lista de Usuários</CardTitle>
            <Badge variant="outline">{filteredUsers.length} usuários encontrados</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuário</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Permissões</TableHead>
                  <TableHead>Cadastro</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <TableRow>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.useGroupPermissions ? (
                          <Badge variant="secondary">{user.permissionGroup.name}</Badge>
                        ) : (
                          <Badge variant="outline">Personalizadas</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5 mr-1" />
                          {formatDate(user.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.status === "active" ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3.5 w-3.5 mr-1" />
                            Ativo
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="bg-red-100 text-red-800">
                            <XCircle className="h-3.5 w-3.5 mr-1" />
                            Inativo
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Abrir menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/users/${user._id}`)}>
                              <Eye className="h-4 w-4 mr-2" />
                              Visualizar
                            </DropdownMenuItem>
                            {hasPermission("users", "edit") && (
                              <DropdownMenuItem onClick={() => router.push(`/users/${user._id}/edit`)}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Editar
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            {hasPermission("users", "edit") && (
                              <DropdownMenuItem
                                onClick={() => {
                                  setUserToDeactivate(user)
                                  setShowDeactivateDialog(true)
                                }}
                                className={user.status === "active" ? "text-red-600" : "text-green-600"}
                              >
                                {user.status === "active" ? (
                                  <>
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Inativar
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Ativar
                                  </>
                                )}
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      Nenhum usuário encontrado com os filtros selecionados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>

          {/* Usando o ComponentsPaginationFooter */}
          <ComponentsPaginationFooter
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
            totalItems={filteredUsers.length}
          />
        </CardContent>
      </Card>

      {/* Diálogo de confirmação para inativar/ativar usuário */}
      <Dialog open={showDeactivateDialog} onOpenChange={setShowDeactivateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{userToDeactivate?.status === "active" ? "Inativar" : "Ativar"} Usuário</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja {userToDeactivate?.status === "active" ? "inativar" : "ativar"} o usuário{" "}
              <strong>{userToDeactivate?.name}</strong>?
              {userToDeactivate?.status === "active"
                ? " Usuários inativos não podem acessar o sistema."
                : " Usuários ativos podem acessar o sistema normalmente."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeactivateDialog(false)}>
              Cancelar
            </Button>
            <Button
              variant={userToDeactivate?.status === "active" ? "destructive" : "default"}
              onClick={() => userToDeactivate && toggleUserStatus(userToDeactivate._id)}
            >
              {userToDeactivate?.status === "active" ? "Inativar" : "Ativar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}