"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { File, Folder } from "lucide-react"
import { useState } from "react"

interface FileNode {
  id: string
  name: string
  type: "file" | "folder"
  content?: string
  children?: FileNode[]
}

interface FileTreeProps {
  files: FileNode[]
  onFileSelect: (file: FileNode) => void
  onFileCreate: (parentId: string | null, type: "file" | "folder", name: string) => void
  onFileDelete: (id: string) => void
  onFileRename: (id: string, newName: string) => void
  selectedFileId?: string
  onContextMenu: (e: React.MouseEvent, file: FileNode) => void
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
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState("")

  const renderNode = (node: FileNode, level = 0) => {
    const isEditing = editingId === node.id
    const isSelected = selectedFileId === node.id

    return (
      <div key={node.id} style={{ paddingLeft: `${level * 16}px` }}>
        <div
          className={cn("flex items-center gap-2 p-1 rounded-sm hover:bg-accent group", isSelected && "bg-accent")}
          onClick={() => onFileSelect(node)}
          onContextMenu={(e) => {
            e.stopPropagation()
            onContextMenu(e, node)
          }}
        >
          {node.type === "folder" ? (
            <Folder className="h-4 w-4 text-muted-foreground" />
          ) : (
            <File className="h-4 w-4 text-muted-foreground" />
          )}

          {isEditing ? (
            <Input
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onBlur={() => {
                onFileRename(node.id, editingName)
                setEditingId(null)
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onFileRename(node.id, editingName)
                  setEditingId(null)
                }
              }}
              className="h-6 py-1 px-1"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="flex-1 cursor-pointer">{node.name}</span>
          )}
        </div>

        {node.type === "folder" && node.children?.map((child) => renderNode(child, level + 1))}
      </div>
    )
  }

  return (
    <div
      className="w-full h-full"
      onContextMenu={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onContextMenu(e, null)
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">Arquivos</h3>
      </div>
      {files.map((node) => renderNode(node))}
    </div>
  )
}

