"use client"

import { useFileSystem } from "@/contexts/FileSystemContext"
import { cn } from "@/lib/utils"
import type { EditorProps } from "@/types/editor"
import { useTheme } from "next-themes"
import type React from "react"
import { useEffect, useRef } from "react"
import { ActionBar } from "./ActionBar"
import { EditorContent } from "./EditorContent"
import { EditorTab } from "./EditorTab"

export const Editor: React.FC<EditorProps> = ({
  files = [],
  activeFileId = null,
  onFileChange,
  onFileClose,
  onFileSelect,
  className,
}) => {
  const { pendingChanges, setPendingChanges, backupData, setBackupData, saveChanges, cancelChanges } = useFileSystem()
  const tabsRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme();

  const activeFile = files.find((file) => file.id === activeFileId)

  const handleFileClose = (fileId: string) => {
    if (pendingChanges.files.has(fileId)) {
      if (!window.confirm("Há alterações não salvas. Deseja realmente fechar?")) {
        return
      }
    }
    onFileClose?.(fileId)
  }

  const handleFileSelect = (fileId: string) => {
    onFileSelect?.(fileId)
  }

  const handleContentChange = (content: string) => {
    if (!activeFileId) return

    const activeFile = files.find((f) => f.id === activeFileId)
    if (!activeFile) return

    // Verificar se o conteúdo realmente mudou antes de atualizar o estado
    if (activeFile.content === content) return

    // Fazer backup apenas na primeira modificação
    if (!backupData.files.has(activeFileId)) {
      setBackupData((prev) => ({
        ...prev,
        files: new Map(prev.files).set(activeFileId, activeFile.content || ""),
      }))
    }

    // Marcar o arquivo como modificado
    setPendingChanges((prev) => ({
      ...prev,
      files: new Set(prev.files).add(activeFileId),
    }))

    // Atualizar o conteúdo do arquivo
    onFileChange?.(activeFileId, content)
  }

  useEffect(() => {
    const tabsElement = tabsRef.current
    if (!tabsElement) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      tabsElement.scrollLeft += e.deltaY
    }

    tabsElement.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
      tabsElement.removeEventListener("wheel", handleWheel)
    }
  }, [])

  return (
    <div className={cn("flex flex-col h-full w-full overflow-hidden relative", className)}>
      <div ref={tabsRef} className="border-b w-full overflow-x-auto whitespace-nowrap hide-scrollbar">
        <div className="flex min-w-max">
          {files.map((file) => (
            <EditorTab
              key={file.id}
              file={file}
              isActive={file.id === activeFileId}
              onSelect={handleFileSelect}
              onClose={handleFileClose}
            />
          ))}
        </div>
      </div>
      <div className="flex-1 relative h-full min-h-0 overflow-hidden">
        {activeFile ? (
          <EditorContent
            file={activeFile}
            onChange={handleContentChange}
            theme={theme}
            isModified={pendingChanges.files.has(activeFile.id)}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">Nenhum arquivo aberto</div>
        )}
      </div>
      <ActionBar
        show={pendingChanges.fileSystem || pendingChanges.files.size > 0}
        onSave={saveChanges}
        onCancel={cancelChanges}
      />
    </div>
  )
}

