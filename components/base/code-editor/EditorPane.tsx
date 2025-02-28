"use client"

import { useFileSystem } from "@/contexts/FileSystemContext"
import type { FC } from "react"
import { useCallback, useMemo } from "react"
import { Editor } from "./editor/Editor"

export const EditorPane: FC = () => {
  const { openFiles, activeFile, setOpenFiles, setActiveFile } = useFileSystem()

  const handleFileChange = useCallback(
    (fileId: string, content: string) => {
      setOpenFiles((prev) => prev.map((file) => (file.id === fileId ? { ...file, content } : file)))
    },
    [setOpenFiles],
  )

  const handleFileClose = useCallback(
    (fileId: string) => {
      setOpenFiles((prev) => {
        const newFiles = prev.filter((file) => file.id !== fileId)

        if (activeFile === fileId && newFiles.length > 0) {
          setActiveFile(newFiles[0].id)
        } else if (newFiles.length === 0) {
          setActiveFile(null)
        }

        return newFiles
      })
    },
    [activeFile, setActiveFile, setOpenFiles],
  )

  return useMemo(
    () => (
      <div className="flex-1 h-full min-w-0 overflow-hidden">
        <Editor
          files={openFiles}
          activeFileId={activeFile}
          onFileChange={handleFileChange}
          onFileClose={handleFileClose}
          onFileSelect={setActiveFile}
          className="h-full"
        />
      </div>
    ),
    [openFiles, activeFile, handleFileChange, handleFileClose, setActiveFile],
  )
}

