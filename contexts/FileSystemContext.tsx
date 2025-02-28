"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"
import type { FileSystemContextType, FileSystemItem } from "../types/file-system"
import initialFileSystem from "../data/initial-file-system.json"

const FileSystemContext = createContext<FileSystemContextType | undefined>(undefined)

export const useFileSystem = () => {
  const context = useContext(FileSystemContext)
  if (context === undefined) {
    throw new Error("useFileSystem must be used within a FileSystemProvider")
  }
  return context
}

export const FileSystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fileSystem, setFileSystem] = useState<FileSystemItem[]>(initialFileSystem)
  const [openFiles, setOpenFiles] = useState<FileSystemItem[]>([])
  const [activeFile, setActiveFile] = useState<string | null>(null)
  const [pendingChanges, setPendingChanges] = useState({
    fileSystem: false,
    files: new Set<string>(),
  })
  const [backupData, setBackupData] = useState<{
    fileSystem: FileSystemItem[] | null
    files: Map<string, string>
  }>({
    fileSystem: null,
    files: new Map(),
  })
  const [isSaving, setIsSaving] = useState(false)

  // Função auxiliar para encontrar um arquivo no sistema de arquivos
  const findFileInSystem = useCallback((fileId: string, items: FileSystemItem[]): FileSystemItem | null => {
    for (const item of items) {
      if (item.id === fileId) return item
      if (item.children) {
        const found = findFileInSystem(fileId, item.children)
        if (found) return found
      }
    }
    return null
  }, [])

  // Atualizar as tabs quando um arquivo é excluído
  const updateOpenFilesOnDelete = useCallback((fileId: string) => {
    setOpenFiles((prev) => prev.filter((file) => file.id !== fileId))
    setActiveFile((prev) => (prev === fileId ? null : prev))
  }, [])

  // Atualizar as tabs quando um arquivo é renomeado
  const updateOpenFilesOnRename = useCallback((fileId: string, newName: string) => {
    setOpenFiles((prev) =>
      prev.map((file) =>
        file.id === fileId
          ? {
              ...file,
              name: newName,
            }
          : file,
      ),
    )
  }, [])

  const updateFileSystem = useCallback(
    (
      newFileSystemOrUpdater: FileSystemItem[] | ((prev: FileSystemItem[]) => FileSystemItem[]),
      options?: {
        deletedId?: string
        renamedItem?: { id: string; newName: string }
      },
    ) => {
      // Fazer backup apenas se ainda não existe
      if (!backupData.fileSystem) {
        setBackupData((prev) => ({
          ...prev,
          fileSystem: JSON.parse(JSON.stringify(fileSystem)),
        }))
      }

      // Atualizar o sistema de arquivos
      setFileSystem((prev) => {
        const newFileSystem =
          typeof newFileSystemOrUpdater === "function" ? newFileSystemOrUpdater(prev) : newFileSystemOrUpdater

        return newFileSystem
      })

      setPendingChanges((prev) => ({
        ...prev,
        fileSystem: true,
      }))

      // Atualizar as tabs se necessário
      if (options?.deletedId) {
        updateOpenFilesOnDelete(options.deletedId)
      }
      if (options?.renamedItem) {
        updateOpenFilesOnRename(options.renamedItem.id, options.renamedItem.newName)
      }
    },
    [fileSystem, backupData.fileSystem, updateOpenFilesOnDelete, updateOpenFilesOnRename],
  )

  const saveChanges = useCallback(async () => {
    setIsSaving(true)
    try {
      // Simulando uma requisição assíncrona
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Salvar as alterações no arquivo JSON
      const updatedFiles = openFiles.reduce((acc, file) => {
        if (pendingChanges.files.has(file.id)) {
          const updateFileInSystem = (items: FileSystemItem[]): FileSystemItem[] => {
            return items.map((item) => {
              if (item.id === file.id) {
                return { ...item, content: file.content }
              }
              if (item.children) {
                return { ...item, children: updateFileInSystem(item.children) }
              }
              return item
            })
          }
          return updateFileInSystem(acc)
        }
        return acc
      }, fileSystem)

      setFileSystem(updatedFiles)

      // Atualizar o arquivo JSON
      try {
        const response = await fetch("/api/save-file-system", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFiles),
        })

        if (!response.ok) {
          throw new Error("Failed to save file system")
        }
      } catch (error) {
        console.error("Error saving file system:", error)
        // Você pode adicionar uma notificação de erro aqui
      }

      setBackupData({
        fileSystem: null,
        files: new Map(),
      })
      setPendingChanges({
        fileSystem: false,
        files: new Set(),
      })
    } catch (error) {
      console.error("Erro ao salvar:", error)
    } finally {
      setIsSaving(false)
    }
  }, [fileSystem, openFiles, pendingChanges])

  const cancelChanges = useCallback(() => {
    // Restaurar o sistema de arquivos se houver alterações
    if (pendingChanges.fileSystem && backupData.fileSystem) {
      const restoredFileSystem = JSON.parse(JSON.stringify(backupData.fileSystem))
      setFileSystem(restoredFileSystem)

      // Sincronizar os arquivos abertos com o sistema de arquivos restaurado
      setOpenFiles((prev) =>
        prev.map((openFile) => {
          const findRestoredFile = (items: FileSystemItem[]): FileSystemItem | undefined => {
            for (const item of items) {
              if (item.id === openFile.id) return item
              if (item.children) {
                const found = findRestoredFile(item.children)
                if (found) return found
              }
            }
            return undefined
          }

          // Procurar o arquivo no sistema de arquivos restaurado
          const restoredFile = findRestoredFile(restoredFileSystem)
          if (restoredFile) {
            return {
              ...restoredFile,
              // Restaurar também o conteúdo se houver backup
              content: backupData.files.get(openFile.id) || restoredFile.content,
            }
          }
          return openFile
        }),
      )
    } else {
      // Mesmo se não houver alterações no sistema de arquivos,
      // ainda precisamos restaurar o conteúdo dos arquivos modificados
      setOpenFiles((prev) =>
        prev.map((file) => {
          const originalContent = backupData.files.get(file.id)
          if (originalContent !== undefined) {
            return { ...file, content: originalContent }
          }
          return file
        }),
      )
    }

    // Atualizar o arquivo ativo se necessário
    setActiveFile((prev) => {
      if (!prev) return null
      // Verificar se o arquivo ativo ainda existe após a restauração
      const activeFileExists = openFiles.some((file) => file.id === prev)
      return activeFileExists ? prev : openFiles[0]?.id || null
    })

    // Limpar os backups e pendências
    setBackupData({
      fileSystem: null,
      files: new Map(),
    })
    setPendingChanges({
      fileSystem: false,
      files: new Set(),
    })
  }, [backupData, pendingChanges, openFiles])

  return (
    <FileSystemContext.Provider
      value={{
        fileSystem,
        updateFileSystem,
        openFiles,
        setOpenFiles,
        activeFile,
        setActiveFile,
        pendingChanges,
        setPendingChanges,
        backupData,
        setBackupData,
        saveChanges,
        cancelChanges,
        isSaving,
      }}
    >
      {children}
    </FileSystemContext.Provider>
  )
}

