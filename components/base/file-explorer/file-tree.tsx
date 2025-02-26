"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  ChevronDown,
  ChevronRight,
  File,
  FileCode,
  FileCodeIcon as FileCss,
  FileIcon as FileHtml,
  FileImage,
  FileJson,
  FileText,
  Folder,
  MoreHorizontal,
} from "lucide-react"
import { useState } from "react"

interface FileNode {
  id: string
  name: string
  type: "file" | "folder"
  content?: string
  children?: FileNode[]
  parentId?: string | null
}

interface FileTreeProps {
  files: FileNode[]
  onFileSelect: (file: FileNode) => void
  onFileCreate: (parentId: string | null, type: "file" | "folder", name: string) => void
  onFileDelete: (id: string) => void
  onFileRename: (id: string, newName: string) => void
  selectedFileId?: string
  onContextMenu: (e: React.MouseEvent, file: FileNode | null) => void
}

export function FileTree({
  files,
  onFileSelect,
  onFileCreate,
  onFileDelete,
  onFileRename,
  selectedFileId,
  onContextMenu,
}: FileTreeProps) {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({})
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")

  const toggleFolder = (folderId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }))
  }

  const handleStartRename = (node: FileNode, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingId(node.id)
    setEditingName(node.name)
  }

  const handleRename = (id: string) => {
    if (editingName.trim()) {
      onFileRename(id, editingName)
    }
    setEditingId(null)
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase()

    switch (extension) {
      case "tsx":
      case "jsx":
      case "ts":
      case "js":
        return <FileCode className="h-4 w-4 mr-2 text-blue-500" />
      case "json":
        return <FileJson className="h-4 w-4 mr-2 text-yellow-500" />
      case "md":
        return <FileText className="h-4 w-4 mr-2 text-gray-500" />
      case "css":
      case "scss":
      case "less":
        return <FileCss className="h-4 w-4 mr-2 text-purple-500" />
      case "html":
        return <FileHtml className="h-4 w-4 mr-2 text-orange-500" />
      case "png":
      case "jpg":
      case "jpeg":
      case "gif":
      case "svg":
        return <FileImage className="h-4 w-4 mr-2 text-green-500" />
      default:
        return <File className="h-4 w-4 mr-2 text-muted-foreground" />
    }
  }

  const renderFileTree = (nodes: FileNode[], level = 0) => {
    return nodes.map((node) => {
      const isFolder = node.type === "folder"
      const isExpanded = expandedFolders[node.id]
      const isSelected = selectedFileId === node.id
      const isEditing = editingId === node.id

      return (
        <div key={node.id} className="select-none">
          <div
            className={cn(
              "group flex items-center py-1 px-2 rounded-md hover:bg-accent/50 relative",
              isSelected && "bg-accent text-accent-foreground",
            )}
            style={{ paddingLeft: `${level * 12 + 4}px` }}
            onClick={(e) => {
              e.stopPropagation()
              onFileSelect(node)
            }}
            onContextMenu={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onContextMenu(e, node)
            }}
          >
            {isFolder && (                             
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 mr-1"
                onClick={(e) => toggleFolder(node.id, e)}
              >
                {isExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
              </Button>
            )}
            {!isFolder && <span className="w-5" />}

            {isFolder ? <Folder className="h-4 w-4 mr-2 text-yellow-500" /> : getFileIcon(node.name)}

            {isEditing ? (
              <Input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={() => handleRename(node.id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleRename(node.id)
                  if (e.key === "Escape") setEditingId(null)
                }}
                className="h-6 py-0 px-1 text-sm"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="text-sm truncate">{node.name}</span>
            )}

            <div className="ml-auto opacity-0 group-hover:opacity-100">
              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  {isFolder && (
                    <>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          onFileCreate(node.id, "file", "novo-arquivo.tsx")
                        }}
                      >
                        <File className="h-4 w-4 mr-2" />
                        Novo Arquivo
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          onFileCreate(node.id, "folder", "nova-pasta")
                        }}
                      >
                        <Folder className="h-4 w-4 mr-2" />
                        Nova Pasta
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem onClick={(e) => handleStartRename(node, e)}>Renomear</DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation()
                      onFileDelete(node.id)
                    }}
                    className="text-destructive focus:text-destructive"
                  >
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {isFolder && isExpanded && node.children && node.children.length > 0 && (
            <div className="pl-2">{renderFileTree(node.children, level + 1)}</div>
          )}
        </div>
      )
    })
  }

  return (
    <div
      className="h-full overflow-auto p-2"
      onContextMenu={(e) => {
        e.preventDefault()
        onContextMenu(e, null)
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-sm">Arquivos</h3>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation()
              onFileCreate(null, "file", "novo-arquivo.tsx")
            }}
          >
            <File className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={(e) => {
              e.stopPropagation()
              onFileCreate(null, "folder", "nova-pasta")
            }}
          >
            <Folder className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {files.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-32 text-muted-foreground text-sm">
          <p>Nenhum arquivo</p>
          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7"
              onClick={() => onFileCreate(null, "file", "novo-arquivo.tsx")}
            >
              <File className="h-3.5 w-3.5 mr-1" />
              Novo Arquivo
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-7"
              onClick={() => onFileCreate(null, "folder", "nova-pasta")}
            >
              <Folder className="h-3.5 w-3.5 mr-1" />
              Nova Pasta
            </Button>
          </div>
        </div>
      ) : (
        renderFileTree(files)
      )}
    </div>
  )
}

