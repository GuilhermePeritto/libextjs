"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { cn } from "@/lib/utils"
import { useEffect, useRef, useState } from "react"
import { FileTree } from "../file-explorer/file-tree"
import { MonacoEditor } from "./monaco-editor"

interface FileNode {
  id: string
  name: string
  type: "file" | "folder"
  content?: string
  children?: FileNode[]
  parentId?: string | null
}

interface CodeEditorContainerProps {
  initialFiles: FileNode[]
  onFilesChange: (files: FileNode[]) => void
  className?: string
}

export function CodeEditorContainer({ initialFiles, onFilesChange, className }: CodeEditorContainerProps) {
  const [files, setFiles] = useState<FileNode[]>(initialFiles)
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null)
  const [contextMenuTarget, setContextMenuTarget] = useState<FileNode | null>(null)
  const [dialogOpen, setDialogOpen] = useState<{
    type: "new-file" | "new-folder" | "rename" | null
    parentId: string | null
  }>({ type: null, parentId: null })
  const [inputValue, setInputValue] = useState("")

  // Referência para evitar múltiplas atualizações de estado durante o redimensionamento
  const isUpdatingRef = useRef(false)

  // Criar um arquivo padrão se não houver arquivos
  useEffect(() => {
    if (files.length === 0 && !isUpdatingRef.current) {
      isUpdatingRef.current = true

      const defaultFile: FileNode = {
        id: generateId(),
        name: "component.tsx",
        type: "file",
        parentId: null,
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

      // Usar setTimeout para evitar múltiplas atualizações de estado em um único ciclo de renderização
      setTimeout(() => {
        setFiles([defaultFile])
        onFilesChange([defaultFile])
        isUpdatingRef.current = false
      }, 0)
    }
  }, [files.length, onFilesChange])

  const generateId = () => Math.random().toString(36).substring(2, 11)

  const handleFileSelect = (file: FileNode) => {
    if (file.type === "file") {
      setSelectedFile(file)
    }
  }

  const handleContextMenu = (e: React.MouseEvent, file: FileNode | null) => {
    setContextMenuTarget(file)
  }

  const handleCreateFile = (parentId: string | null, name = "novo-arquivo.tsx") => {
    setDialogOpen({ type: "new-file", parentId })
    setInputValue(name)
  }

  const handleCreateFolder = (parentId: string | null, name = "nova-pasta") => {
    setDialogOpen({ type: "new-folder", parentId })
    setInputValue(name)
  }

  const handleRename = (file: FileNode) => {
    setDialogOpen({ type: "rename", parentId: file.parentId })
    setContextMenuTarget(file)
    setInputValue(file.name)
  }

  const handleDelete = (id: string) => {
    // Função recursiva para encontrar e remover o nó
    const removeNode = (nodes: FileNode[]): FileNode[] => {
      return nodes.filter((node) => {
        // Se este é o nó a ser removido
        if (node.id === id) {
          // Se o arquivo selecionado está sendo excluído, limpe a seleção
          if (selectedFile?.id === id) {
            setSelectedFile(null)
          }
          return false
        }

        // Se este nó tem filhos, processe-os recursivamente
        if (node.children && node.children.length > 0) {
          node.children = removeNode(node.children)
        }

        return true
      })
    }

    const updatedFiles = removeNode([...files])
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)
  }

  const handleConfirmDialog = () => {
    if (!inputValue.trim()) return

    if (dialogOpen.type === "new-file" || dialogOpen.type === "new-folder") {
      const newNode: FileNode = {
        id: generateId(),
        name: inputValue,
        type: dialogOpen.type === "new-file" ? "file" : "folder",
        parentId: dialogOpen.parentId,
        content: dialogOpen.type === "new-file" ? "" : undefined,
        children: dialogOpen.type === "new-folder" ? [] : undefined,
      }

      // Função recursiva para adicionar o nó no lugar correto
      const addNode = (nodes: FileNode[]): FileNode[] => {
        // Se estamos adicionando na raiz
        if (!dialogOpen.parentId) {
          return [...nodes, newNode]
        }

        return nodes.map((node) => {
          // Se este é o nó pai, adicione o novo nó aos seus filhos
          if (node.id === dialogOpen.parentId) {
            return {
              ...node,
              children: [...(node.children || []), newNode],
            }
          }

          // Se este nó tem filhos, processe-os recursivamente
          if (node.children && node.children.length > 0) {
            return {
              ...node,
              children: addNode(node.children),
            }
          }

          return node
        })
      }

      const updatedFiles = addNode([...files])
      setFiles(updatedFiles)
      onFilesChange(updatedFiles)

      // Se criamos um arquivo, selecione-o automaticamente
      if (dialogOpen.type === "new-file") {
        setSelectedFile(newNode)
      }
    } else if (dialogOpen.type === "rename" && contextMenuTarget) {
      // Função recursiva para renomear o nó
      const renameNode = (nodes: FileNode[]): FileNode[] => {
        return nodes.map((node) => {
          if (node.id === contextMenuTarget.id) {
            // Verificar se a extensão do arquivo mudou
            const oldExtension = node.name.split(".").pop()?.toLowerCase()
            const newExtension = inputValue.split(".").pop()?.toLowerCase()

            // Se o arquivo renomeado é o arquivo selecionado e a extensão mudou
            if (selectedFile && selectedFile.id === node.id && oldExtension !== newExtension) {
              // Atualizar o arquivo selecionado com o novo nome
              setTimeout(() => {
                setSelectedFile({
                  ...selectedFile,
                  name: inputValue,
                })
              }, 0)
            }

            return {
              ...node,
              name: inputValue,
            }
          }

          if (node.children && node.children.length > 0) {
            return {
              ...node,
              children: renameNode(node.children),
            }
          }

          return node
        })
      }

      const updatedFiles = renameNode([...files])
      setFiles(updatedFiles)
      onFilesChange(updatedFiles)
    }

    setDialogOpen({ type: null, parentId: null })
  }

  const handleCodeChange = (newValue: string) => {
    if (!selectedFile) return

    // Função recursiva para atualizar o conteúdo do arquivo
    const updateContent = (nodes: FileNode[]): FileNode[] => {
      return nodes.map((node) => {
        if (node.id === selectedFile.id) {
          return {
            ...node,
            content: newValue,
          }
        }

        if (node.children && node.children.length > 0) {
          return {
            ...node,
            children: updateContent(node.children),
          }
        }

        return node
      })
    }

    const updatedFiles = updateContent([...files])
    setFiles(updatedFiles)
    onFilesChange(updatedFiles)
  }

  return (
    <div className={cn("", className)}>
      <ResizablePanelGroup direction="horizontal" className={cn("", className)}>
        <ResizablePanel defaultSize={20} minSize={15} className={cn("", className)}>
          <div className={cn("overflow-hidden", className)}>
            <FileTree
              files={files}
              onFileSelect={handleFileSelect}
              onFileCreate={(parentId, type, name) => {
                if (type === "file") {
                  handleCreateFile(parentId)
                } else {
                  handleCreateFolder(parentId)
                }
              }}
              onFileDelete={handleDelete}
              onFileRename={(id, newName) => {
                if (!newName.trim()) return

                // Função recursiva para renomear o nó
                const renameNode = (nodes: FileNode[]): FileNode[] => {
                  return nodes.map((node) => {
                    if (node.id === id) {
                      // Verificar se a extensão do arquivo mudou
                      const oldExtension = node.name.split(".").pop()?.toLowerCase()
                      const newExtension = newName.split(".").pop()?.toLowerCase()

                      // Se o arquivo renomeado é o arquivo selecionado e a extensão mudou
                      if (selectedFile && selectedFile.id === id && oldExtension !== newExtension) {
                        // Atualizar o arquivo selecionado com o novo nome
                        setTimeout(() => {
                          setSelectedFile({
                            ...selectedFile,
                            name: newName,
                          })
                        }, 0)
                      }

                      return {
                        ...node,
                        name: newName,
                      }
                    }

                    if (node.children && node.children.length > 0) {
                      return {
                        ...node,
                        children: renameNode(node.children),
                      }
                    }

                    return node
                  })
                }

                const updatedFiles = renameNode([...files])
                setFiles(updatedFiles)
                onFilesChange(updatedFiles)
              }}
              selectedFileId={selectedFile?.id}
              onContextMenu={handleContextMenu}
            />
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={80}>
          <div className="h-full">
            {selectedFile ? (
                <MonacoEditor
                  value={selectedFile.content || ""}
                  onChange={handleCodeChange}
                  language={getLanguageFromFilename(selectedFile.name)}
                />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Selecione um arquivo para editar
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      <Dialog
        open={dialogOpen.type !== null}
        onOpenChange={(open) => {
          if (!open) setDialogOpen({ type: null, parentId: null })
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogOpen.type === "new-file" && "Criar Novo Arquivo"}
              {dialogOpen.type === "new-folder" && "Criar Nova Pasta"}
              {dialogOpen.type === "rename" && "Renomear"}
            </DialogTitle>
          </DialogHeader>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              dialogOpen.type === "new-file"
                ? "Nome do arquivo (ex: arquivo.tsx)"
                : dialogOpen.type === "new-folder"
                  ? "Nome da pasta"
                  : "Novo nome"
            }
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleConfirmDialog()
              }
            }}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button onClick={handleConfirmDialog}>
              {dialogOpen.type === "new-file" && "Criar Arquivo"}
              {dialogOpen.type === "new-folder" && "Criar Pasta"}
              {dialogOpen.type === "rename" && "Renomear"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Função para determinar a linguagem com base na extensão do arquivo
function getLanguageFromFilename(filename: string): string {
  const extension = filename.split(".").pop()?.toLowerCase()

  switch (extension) {
    case "ts":
    case "tsx":
      return "typescript"
    case "js":
    case "jsx":
      return "javascript"
    case "json":
      return "json"
    case "css":
      return "css"
    case "html":
      return "html"
    case "md":
      return "markdown"
    default:
      return "plaintext"
  }
}

