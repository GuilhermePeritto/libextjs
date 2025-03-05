"use client"

import { cn } from "@/lib/utils"
import type { FileSystemItem } from "@/types/file-system"
import type React from "react"
import { useMemo } from "react"
import { useDrop } from "react-dnd"
import { ContextMenuActions } from "./ContextMenuActions"
import { FileTreeItem } from "./FileTreeItem"

interface RootDropZoneProps {
  fileSystem: FileSystemItem[]
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
  editInputRef: React.RefObject<HTMLInputElement>
}

export const RootDropZone: React.FC<RootDropZoneProps> = ({
  fileSystem,
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
  editInputRef,
}) => {
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: "FILE_TREE_ITEM",
      drop: (item: { id: string; type: string }, monitor) => {
        if (!monitor.didDrop()) {
          onMoveItem(item.id, null, "folder")
        }
      },
      collect: (monitor) => ({
        isOver: monitor.isOver({ shallow: true }),
        canDrop: monitor.canDrop(),
      }),
    }),
    [],
  )

  return (
    <ContextMenuActions
      onRename={onRename}
      onDelete={onDelete}
      onCreateFile={onCreateFile}
      onCreateFolder={onCreateFolder}
    >
      <div ref={drop} className={cn("min-h-full w-full", isOver && canDrop && "bg-primary/10")}>
        {useMemo(
          () =>
            fileSystem.map((item) => (
              <FileTreeItem
                key={item.id}
                item={item}
                level={0}
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
            fileSystem,
            expandedFolders,
            editingItemId,
            onToggleFolder,
            onItemClick,
            onRename,
            onDelete,
            onCreateFile,
            onCreateFolder,
            onMoveItem,
            onRenameSubmit,
            editInputRef,
          ], // Dependências para recalcular
        )}
      </div>
    </ContextMenuActions>
  )
}

