"use client"

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronRight, File, Folder } from "lucide-react"
import React from "react"

interface FileTreeProps {
  data: any
  onFileSelect: (file: any) => void
  selectedFile: any
  onAddFile: (path: string[]) => void
  onAddFolder: (path: string[]) => void
  onRename: (path: string[], oldName: string) => void
  onDelete: (path: string[]) => void
}

export const FileTree: React.FC<FileTreeProps> = ({
  data,
  onFileSelect,
  selectedFile,
  onAddFile,
  onAddFolder,
  onRename,
  onDelete,
}) => {
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set([data.id]))

  const toggleFolder = (id: string) => {
    const newExpanded = new Set(expanded)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpanded(newExpanded)
  }

  const renderItem = (item: any, path: string[] = []) => {
    const isFolder = item.type === "folder"
    const isExpanded = expanded.has(item.id)
    const isSelected = selectedFile?.id === item.id
    const currentPath = [...path, item.name]

    return (
      <ContextMenu key={item.id}>
        <ContextMenuTrigger>
          <div
            className={cn(
              "flex items-center py-1 px-2 hover:bg-accent rounded-sm cursor-pointer",
              isSelected && "bg-accent",
            )}
            style={{ paddingLeft: `${path.length * 12}px` }}
            onClick={(e) => {
              e.stopPropagation()
              if (isFolder) {
                toggleFolder(item.id)
              } else {
                onFileSelect(item)
              }
            }}
          >
            <div className="w-4 h-4 mr-2">
              {isFolder ? (
                isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )
              ) : null}
            </div>
            {isFolder ? <Folder className="w-4 h-4 mr-2" /> : <File className="w-4 h-4 mr-2" />}
            <span className="text-sm">{item.name}</span>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          {isFolder ? (
            <>
              <ContextMenuItem onClick={() => onAddFile(currentPath)}>Novo Arquivo</ContextMenuItem>
              <ContextMenuItem onClick={() => onAddFolder(currentPath)}>Nova Pasta</ContextMenuItem>
              <ContextMenuSeparator />
              <ContextMenuItem onClick={() => onRename(path, item.name)}>Renomear</ContextMenuItem>
              <ContextMenuItem className="text-red-600" onClick={() => onDelete(currentPath)}>
                Excluir
              </ContextMenuItem>
            </>
          ) : (
            <>
              <ContextMenuItem onClick={() => onRename(path, item.name)}>Renomear</ContextMenuItem>
              <ContextMenuItem className="text-red-600" onClick={() => onDelete(currentPath)}>
                Excluir
              </ContextMenuItem>
            </>
          )}
        </ContextMenuContent>
        {isFolder && isExpanded && <div>{item.children.map((child: any) => renderItem(child, currentPath))}</div>}
      </ContextMenu>
    )
  }

  return <div className="select-none">{renderItem(data)}</div>
}