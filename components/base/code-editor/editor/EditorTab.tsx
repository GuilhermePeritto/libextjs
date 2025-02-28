import type React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type { EditorTabProps } from "@/types/editor"

export const EditorTab: React.FC<EditorTabProps> = ({ file, isActive, onSelect, onClose }) => {
  return (
    <div
      className={cn(
        "group flex items-center gap-2 border-r px-4 py-2 text-sm cursor-pointer min-w-[120px] max-w-[200px]",
        isActive ? "bg-background border-b-2 border-b-primary" : "bg-muted/50 hover:bg-muted",
      )}
      onClick={() => onSelect(file.id)}
    >
      <span className="truncate flex-1">{file.name}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-4 w-4 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation()
          onClose(file.id)
        }}
      >
        <X className="h-3 w-3" />
        <span className="sr-only">Close tab</span>
      </Button>
    </div>
  )
}

