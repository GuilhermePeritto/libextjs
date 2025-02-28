import type { FileSystemItem } from "./file-system"

export type FileTreeItemProps = {
  item: FileSystemItem
  level: number
}

export type RootDropZoneProps = {
  onDrop?: (files: FileList) => void
}

export type FileIconProps = {
  extension?: string
  className?: string
}

