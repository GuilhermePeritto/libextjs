"use client"

import type React from "react"

import { cn } from "@/lib/utils"
import type { FileSystemItem } from "@/types/file-system"
import { isAncestor } from "@/utils/file-system"
import { ChevronDown, ChevronRight } from "lucide-react"
import { useMemo, useRef } from "react"
import { useDrag, useDrop } from "react-dnd"
import { ContextMenuActions } from "./ContextMenuActions"
import { FileIcon } from "./FileIcon"

interface FileTreeItemProps {
  item: FileSystemItem
  level: number
  expandedFolders: Set<string>
  onToggleFolder: (folderId: string) => void
  onItemClick: (item: FileSystemItem) => void
  onRename: (itemId: string) => void
  onDelete: (itemId: string) => void
  onCreateFile: (parentId: string | null, itemType: "file" | "folder") => void
  onCreateFolder: (parentId: string | null, itemType: "file" | "folder") => void
  onMoveItem: (sourceId: string, targetId: string | null, targetType: "file" | "folder") => void
  editingItemId: string | null
  onRenameSubmit: (itemId: string, newName: string) => void
  fileSystem: FileSystemItem[]
  editInputRef: React.RefObject<HTMLInputElement>
}

export const FileTreeItem: React.FC<FileTreeItemProps> = ({
  item,
  level,
  expandedFolders,
  onToggleFolder,
  onItemClick,
  onRename,
  onDelete,
  onCreateFile,
  onCreateFolder,
  onMoveItem,
  editingItemId,
  onRenameSubmit,
  fileSystem,
  editInputRef,
}) => {
  // Configuração do drag
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "FILE_TREE_ITEM",
      item: () => ({ id: item.id, type: item.type }),
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [item.id, item.type],
  )

  // Função auxiliar para encontrar um item pelo ID
  const findItemById = (id: string, items: FileSystemItem[]): FileSystemItem | null => {
    for (const item of items) {
      if (item.id === id) return item
      if (item.children) {
        const found = findItemById(id, item.children)
        if (found) return found
      }
    }
    return null
  }

  // Configuração do drop
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: "FILE_TREE_ITEM",
      canDrop: (draggedItem: { id: string; type: string }) => {
        // Não permitir soltar um item sobre ele mesmo
        if (draggedItem.id === item.id) return false

        // Verificar se não está tentando mover uma pasta para dentro dela mesma
        // usando o mapa de pais para verificação rápida
        if (item.type === "folder") {
          // Criar um mapa de pais temporário para esta verificação
          const tempParentMap = new Map<string, string | null>()

          const buildParentMap = (items: FileSystemItem[], parentId: string | null = null) => {
            for (const item of items) {
              tempParentMap.set(item.id, parentId)
              if (item.children) {
                buildParentMap(item.children, item.id)
              }
            }
          }

          buildParentMap(fileSystem)

          // Verificar se o item arrastado é ancestral do alvo
          return !isAncestor(draggedItem.id, item.id, tempParentMap)
        }

        return true // Permitir soltar em arquivos
      },
      drop: (draggedItem: { id: string; type: string }, monitor) => {
        if (!monitor.didDrop()) {
          if (item.type === "folder") {
            // Se o alvo for uma pasta, mover para dentro dela
            onMoveItem(draggedItem.id, item.id, "folder")
          } else {
            // Se o alvo for um arquivo, mover para a mesma pasta do arquivo
            // Aqui está o problema - precisamos encontrar o ID da pasta pai corretamente

            // Função para encontrar o ID da pasta pai direta de um item
            const findDirectParentId = (
              itemId: string,
              items: FileSystemItem[],
              parentId: string | null = null,
            ): string | null => {
              for (const item of items) {
                if (item.children) {
                  // Verificar se o item está diretamente nesta pasta
                  const directChild = item.children.find((child) => child.id === itemId)
                  if (directChild) {
                    return item.id // Retorna o ID desta pasta
                  }

                  // Se não encontrou diretamente, procurar nas subpastas
                  const foundInChild = findDirectParentId(itemId, item.children, item.id)
                  if (foundInChild !== null) {
                    return foundInChild
                  }
                }
              }
              return null
            }

            // Encontrar o ID da pasta pai direta do arquivo alvo
            const parentId = findDirectParentId(item.id, fileSystem)
            onMoveItem(draggedItem.id, parentId, "file")
          }
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver({ shallow: true }),
        canDrop: monitor.canDrop(),
      }),
    }),
    [item.id, item.type, fileSystem],
  )

  // Referência composta para drag e drop
  const ref = useRef<HTMLDivElement>(null)
  drag(drop(ref))

  const renderedChildren = useMemo(
    () =>
      item.type === "folder" &&
      expandedFolders.has(item.id) &&
      item.children &&
      item.children?.map((child) => (
        <FileTreeItem
          key={child.id}
          item={child}
          level={level + 1}
          expandedFolders={expandedFolders}
          onToggleFolder={onToggleFolder}
          onItemClick={onItemClick}
          onRename={onRename}
          onDelete={onDelete}
          onCreateFile={onCreateFile}
          onCreateFolder={onCreateFolder}
          onMoveItem={onMoveItem}
          editingItemId={editingItemId}
          onRenameSubmit={onRenameSubmit}
          fileSystem={fileSystem}
          editInputRef={editInputRef}
        />
      )),
    [
      item.children,
      expandedFolders,
      editingItemId,
      level,
      item.type,
      item.id,
      onItemClick,
      onToggleFolder,
      onRenameSubmit,
      onRename,
      onDelete,
      onMoveItem,
      onCreateFolder,
      onCreateFile,
      fileSystem,
      editInputRef,
    ],
  )

  return (
    <ContextMenuActions
      item={item}
      onRename={onRename}
      onDelete={onDelete}
      onCreateFile={onCreateFile}
      onCreateFolder={onCreateFolder}
    >
      <div
        ref={ref}
        className={cn(
          "flex items-center rounded-md px-2 py-1 cursor-pointer transition-colors duration-150",
          isDragging && "opacity-50",
          isOver && canDrop && "bg-primary/10",
          !isDragging && "hover:bg-muted/50",
        )}
        style={{
          paddingLeft: `${level * 8 + (item.type === "file" ? 12 : 0)}px`,
        }}
        onClick={() => onItemClick(item)}
      >
        <div className="flex items-center gap-2 min-w-0 w-full">
          {item.type === "folder" && (
            <span
              onClick={(e) => {
                e.stopPropagation()
                onToggleFolder(item.id)
              }}
              className="flex-shrink-0"
            >
              {expandedFolders.has(item.id) ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </span>
          )}
          <span className="flex-shrink-0">
            {item.type === "folder" ? (
              <FileIcon extension="folder" className="text-yellow-500" />
            ) : (
              <FileIcon extension={item.extension} />
            )}
          </span>
          {editingItemId === item.id ? (
            <input
              ref={editInputRef}
              type="text"
              defaultValue={item.name}
              className="bg-transparent outline-none flex-1 min-w-0 w-full"
              autoComplete="on"
              onBlur={(e) => {
                e.preventDefault()
                onRenameSubmit(item.id, e.target.value)
              }
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onRenameSubmit(item.id, e.currentTarget.value)
                }
              }}
            />
          ) : (
            <span className="truncate flex-1">{item.name}</span>
          )}
        </div>
      </div>
      {renderedChildren}
    </ContextMenuActions>
  )
}

