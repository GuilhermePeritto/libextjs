import type { FileSystemItem } from "./file-system"

export type EditorProps = {
  files?: FileSystemItem[]
  activeFileId?: string | null
  onFileChange?: (fileId: string, content: string) => void
  onFileClose?: (fileId: string) => void
  onFileSelect?: (fileId: string) => void
  onSave?: (fileId: string) => void
  onCancel?: (fileId: string) => void
  className?: string
  theme?: "light" | "dark"
}

export type EditorTabProps = {
  file: FileSystemItem
  isActive: boolean
  onSelect: (fileId: string) => void
  onClose: (fileId: string) => void
}

export type EditorContentProps = {
  file: FileSystemItem
  onChange?: (content: string) => void
  theme?: string | undefined
  isModified?: boolean
}

export type ImageViewerProps = {
  file: FileSystemItem
  className?: string
}

export type ActionBarProps = {
  show: boolean
  onSave?: () => void
  onCancel?: () => void
  className?: string
}

