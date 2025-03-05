import { Button } from "@/components/ui/button"
import { useFileSystem } from "@/contexts/FileSystemContext"
import { cn } from "@/lib/utils"
import type { ActionBarProps } from "@/types/editor"
import { Loader2, Save, X } from "lucide-react"
import type React from "react"

export const ActionBar: React.FC<ActionBarProps> = ({ show, onSave, onCancel, className }) => {
  const { isSaving } = useFileSystem()

  if (!show) return null

  return (
    <div
      className={cn(
        "absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-lg shadow-lg bg-background border animate-in fade-in slide-in-from-bottom-4 duration-200 z-50",
        className,
      )}
    >
      <Button size="sm" variant="default" onClick={onSave} disabled={isSaving}>
        {isSaving ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Salvando...
          </>
        ) : (
          <>
            <Save className="w-4 h-4 mr-2" />
            Salvar alterações
          </>
        )}
      </Button>
      <Button size="sm" variant="ghost" onClick={onCancel} disabled={isSaving}>
        <X className="w-4 h-4 mr-2" />
        Cancelar
      </Button>
    </div>
  )
}

