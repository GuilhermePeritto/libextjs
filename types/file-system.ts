import type { Dispatch, SetStateAction } from "react"

export type FileSystemItem = {
  id: string
  name: string
  type: "file" | "folder"
  content?: string
  children?: FileSystemItem[]
  extension?: string
  isOpen?: boolean
  language?: string
}

export type FileSystemContextType = {
  fileSystem: FileSystemItem[]
  updateFileSystem: (
    newFileSystem: FileSystemItem[],
    options?: {
      deletedId?: string
      renamedItem?: { id: string; newName: string }
    },
  ) => void
  openFiles: FileSystemItem[]
  setOpenFiles: Dispatch<SetStateAction<FileSystemItem[]>>
  activeFile: string | null
  setActiveFile: Dispatch<SetStateAction<string | null>>
  pendingChanges: PendingChanges
  setPendingChanges: Dispatch<SetStateAction<PendingChanges>>
  backupData: BackupData
  setBackupData: Dispatch<SetStateAction<BackupData>>
  saveChanges: () => Promise<void>
  cancelChanges: () => void
  isSaving: boolean
}

export type PendingChanges = {
  fileSystem: boolean
  files: Set<string>
}

export type BackupData = {
  fileSystem: FileSystemItem[] | null
  files: Map<string, string>
}

