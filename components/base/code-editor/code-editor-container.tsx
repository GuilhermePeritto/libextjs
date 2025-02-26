"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { FileTree } from "../file-explorer/file-tree"
import { MonacoEditor } from "./monaco-editor"

interface FileNode {
  id: string
  name: string
  type: "file" | "folder"
  content?: string
  children?: FileNode[]
}

interface CodeEditorContainerProps {
  initialFiles: FileNode[]
  onFilesChange: (files: FileNode[]) => void
  className?: string
}

export function CodeEditorContainer({ initialFiles, onFilesChange, className }: CodeEditorContainerProps) {
  const [files, setFiles] = useState<FileNode[]>(initialFiles)
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null)
  const [showNewFileDialog, setShowNewFileDialog] = useState(false)
  const [newFileName, setNewFileName] = useState("")
  const [contextMenuTarget, setContextMenuTarget] = useState<FileNode | null>(null)
  const [isRenaming, setIsRenaming] = useState(false)
  const [newName, setNewName] = useState("")

  // Criar um arquivo padrão se não houver arquivos
  useEffect(() => {
    if (files.length === 0) {
      const defaultFile: FileNode = {
        id: Math.random().toString(36).substr(2, 9),
        name: "component.tsx",
        type: "file",
        content: `import React from 'react';

export interface ComponentProps {
  // Defina as props do componente aqui
}

export function Component({ ...props }: ComponentProps) {
  return (
    <div>
      {/* Conteúdo do componente */}
      <h1>Meu Componente</h1>
    </div>
  );
}
`,
      }

      setFiles([defaultFile])
      setSelectedFile(defaultFile)
      onFilesChange([defaultFile])
    }
  }, [files, onFilesChange])

  const handleFileSelect = (file: FileNode) => {
    if (file.type === "file") {
      setSelectedFile(file)
    }
  }

  const handleFileCreate = (parentId: string | null, type: "file" | "folder", name: string) => {
    const newNode: FileNode = {
      id: Math.random().toString(36).substr(2, 9),
      name: name,
      type,
      content: type === "file" ? "" : undefined,
      children: type === "folder" ? [] : undefined,
    }

    const updateFiles = (nodes: FileNode[]): FileNode[] => {
      if (!parentId) {
        return [...nodes, newNode]
      }

      return nodes.map((node) => {
        if (node.id === parentId && node.type === "folder") {
          return {
            ...node,
            children: [...(node.children || []), newNode],
          }
        }
        if (node.children) {
          return {
            ...node,
            children: updateFiles(node.children),
          }
        }
        return node
      })
    }

    const updatedFiles = updateFiles(files)
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)
  }

  const handleFileDelete = (id: string) => {
    const deleteFromFiles = (nodes: FileNode[]): FileNode[] => {
      return nodes.filter((node) => {
        if (node.id === id) {
          if (selectedFile?.id === id) {
            setSelectedFile(null)
          }
          return false
        }
        if (node.children) {
          node.children = deleteFromFiles(node.children)
        }
        return true
      })
    }

    const updatedFiles = deleteFromFiles([...files])
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)
  }

  const handleFileRename = (id: string, newName: string) => {
    const updateFiles = (nodes: FileNode[]): FileNode[] => {
      return nodes.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            name: newName,
          }
        }
        if (node.children) {
          return {
            ...node,
            children: updateFiles(node.children),
          }
        }
        return node
      })
    }

    const updatedFiles = updateFiles(files)
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)
  }

  const handleCodeChange = (newValue: string) => {
    if (!selectedFile) return

    const updateFiles = (nodes: FileNode[]): FileNode[] => {
      return nodes.map((node) => {
        if (node.id === selectedFile.id) {
          return {
            ...node,
            content: newValue,
          }
        }
        if (node.children) {
          return {
            ...node,
            children: updateFiles(node.children),
          }
        }
        return node
      })
    }

    const updatedFiles = updateFiles(files)
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)
  }

  const handleContextMenu = (e: React.MouseEvent, file: FileNode | null) => {
    debugger
    e.preventDefault()
    e.stopPropagation()
    setContextMenuTarget(file)
  }

  const handleNewFile = () => {
    setShowNewFileDialog(true)
  }

  const createNewFile = () => {
    if (newFileName) {
      handleFileCreate(contextMenuTarget?.id || null, "file", newFileName)
      setNewFileName("")
      setShowNewFileDialog(false)
    }
  }

  const startRenaming = () => {
    if (contextMenuTarget) {
      setNewName(contextMenuTarget.name)
      setIsRenaming(true)
    }
  }

  const completeRenaming = () => {
    if (contextMenuTarget && newName) {
      handleFileRename(contextMenuTarget.id, newName)
      setIsRenaming(false)
    }
  }

  return (
    <div className={cn("", className) }>
      <ResizablePanelGroup className="h-full" direction="horizontal">
        <ResizablePanel defaultSize={20} minSize={15}>
          <div className="h-full overflow-auto">
            <ContextMenu>
              <ContextMenuTrigger className={cn("", className) }>
                <div className={cn("", className) } onContextMenu={(e) => handleContextMenu(e, null)}>
                  <FileTree
                    files={files}
                    onFileSelect={handleFileSelect}
                    onFileCreate={handleFileCreate}
                    onFileDelete={handleFileDelete}
                    onFileRename={handleFileRename}
                    selectedFileId={selectedFile?.id}
                    onContextMenu={handleContextMenu}
                  />
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                {contextMenuTarget ? (
                  // Menu para arquivo/pasta selecionado
                  <>
                    <ContextMenuItem onSelect={startRenaming}>Renomear</ContextMenuItem>
                    <ContextMenuItem onSelect={() => handleFileDelete(contextMenuTarget.id)}>Excluir</ContextMenuItem>
                  </>
                ) : (
                  // Menu para área vazia
                  <>
                    <ContextMenuItem onSelect={handleNewFile}>Novo Arquivo</ContextMenuItem>
                    <ContextMenuItem onSelect={() => handleFileCreate(null, "folder", "Nova Pasta")}>
                      Nova Pasta
                    </ContextMenuItem>
                  </>
                )}
              </ContextMenuContent>
            </ContextMenu>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={80}>
          <div className="h-full">
            {selectedFile ? (
              <MonacoEditor
                value={selectedFile.content || ""}
                onChange={handleCodeChange}
                language={selectedFile.name.endsWith(".tsx") ? "typescript" : "javascript"}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Selecione um arquivo para editar
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      <Dialog open={showNewFileDialog} onOpenChange={setShowNewFileDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Novo Arquivo</DialogTitle>
          </DialogHeader>
          <Input
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            placeholder="Nome do arquivo (ex: arquivo.tsx)"
          />
          <DialogClose asChild>
            <Button onClick={createNewFile}>Criar</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>

      <Dialog open={isRenaming} onOpenChange={setIsRenaming}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Renomear {contextMenuTarget?.name}</DialogTitle>
          </DialogHeader>
          <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Novo nome" />
          <DialogClose asChild>
            <Button onClick={completeRenaming}>Renomear</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </div>
  )
}

