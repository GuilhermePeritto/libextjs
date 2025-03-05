import { Button } from "@/components/ui/button"
import { Folder, Plus } from "lucide-react"
import type React from "react"

interface SidebarHeaderProps {
  onCreateFile: () => void
  onCreateFolder: () => void
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ onCreateFile, onCreateFolder }) => {
  return (
    <div className="p-2 flex justify-between items-center border-b">
      <h2 className="text-lg font-semibold">Arquivos</h2>
      <div className="flex gap-1">
        <Button variant="ghost" size="icon" onClick={onCreateFile} title="New File">
          <Plus className="h-4 w-4" />
          <span className="sr-only">New File</span>
        </Button>
        <Button variant="ghost" size="icon" onClick={onCreateFolder} title="New Folder">
          <Folder className="h-4 w-4" />
          <span className="sr-only">New Folder</span>
        </Button>
      </div>
    </div>
  )
}

