import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import type { FileSystemItem } from "@/types/file-system"
import type React from "react"

interface ContextMenuActionsProps {
  item?: FileSystemItem
  children: React.ReactNode
  onRename: (itemId: string) => void
  onDelete: (itemId: string) => void
  onCreateFile: (parentId: string | null) => void
  onCreateFolder: (parentId: string | null) => void
}

export const ContextMenuActions: React.FC<ContextMenuActionsProps> = ({
  item,
  children,
  onRename,
  onDelete,
  onCreateFile,
  onCreateFolder,
}) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        {item ? (
          <>
            {item.type === "file" && <ContextMenuItem onClick={() => {}}>Open</ContextMenuItem>}
            <ContextMenuItem onClick={() => onRename(item.id)}>Rename</ContextMenuItem>
            <ContextMenuItem onClick={() => onDelete(item.id)}>Delete</ContextMenuItem>
            {item.type === "folder" && (
              <>
                <ContextMenuSeparator />
                <ContextMenuItem onClick={() => onCreateFile(item.id)}>New File</ContextMenuItem>
                <ContextMenuItem onClick={() => onCreateFolder(item.id)}>New Folder</ContextMenuItem>
              </>
            )}
          </>
        ) : (
          <>
            <ContextMenuItem onClick={() => onCreateFile(null)}>New File</ContextMenuItem>
            <ContextMenuItem onClick={() => onCreateFolder(null)}>New Folder</ContextMenuItem>
          </>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}

