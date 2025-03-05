"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { useFileSystem } from "@/contexts/FileSystemContext"
import { FileSystemItem } from "@/types/file-system"
import { createParentMap } from "@/utils/file-system"
import { readFileAsDataURL } from "@/utils/file-utils"
import type React from "react"
import { useCallback, useMemo, useRef, useState } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { RootDropZone } from "./sidebar/RootDropZone"
import { SidebarHeader } from "./sidebar/SidebarHeader"

export const Sidebar: React.FC = () => {
  const { fileSystem, updateFileSystem, setOpenFiles, setActiveFile } = useFileSystem()
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["1"]))
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const editInputRef = useRef<HTMLInputElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)

  // Adicionar memoização do mapa de pais
  const parentMap = useMemo(() => createParentMap(fileSystem), [fileSystem])

  // Função para focar o input de edição
  const focusEditInput = (itemId: string) => {
    setEditingItemId(itemId)
    setTimeout(() => {
      const input = editInputRef.current
      if (input) {
        input.focus()
        input.select()
      }
    }, 0)
  }

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(folderId)) {
        newSet.delete(folderId)
      } else {
        newSet.add(folderId)
      }
      return newSet
    })
  }

  const handleItemClick = (item: FileSystemItem) => {
    if (item.type === "folder") {
      toggleFolder(item.id)
    } else {
      setOpenFiles((prev) => {
        if (!prev.some((file) => file.id === item.id)) {
          return [...prev, item]
        }
        return prev
      })
      setActiveFile(item.id)
    }
  }

  const deleteItem = (itemId: string) => {
    updateFileSystem(
      (prevFileSystem) => {
        const deleteItemFromTree = (items: FileSystemItem[]): FileSystemItem[] => {
          return items.filter((item) => {
            if (item.id === itemId) {
              return false
            }
            if (item.children) {
              item.children = deleteItemFromTree(item.children)
            }
            return true
          })
        }
        return deleteItemFromTree(prevFileSystem)
      },
      { deletedId: itemId },
    )
  }

  const moveItem = useCallback(
    (sourceId: string, targetId: string | null, targetType: "file" | "folder") => {
      updateFileSystem((prevFileSystem) => {
        let removedItem: FileSystemItem | null = null

        // Função para gerar um nome único
        const generateUniqueName = (name: string, existingNames: Set<string>): string => {
          const [baseName, extension] = name.split(".")
          let newName = name
          let counter = 1

          while (existingNames.has(newName)) {
            const match = baseName.match(/^(.+?)($$\d+$$)?$/)
            if (match) {
              newName = `${match[1]}(${counter})${extension ? "." + extension : ""}`
            } else {
              newName = `${baseName}(${counter})${extension ? "." + extension : ""}`
            }
            counter++
          }

          return newName
        }

        // Função para processar a árvore de arquivos
        const processFileSystem = (items: FileSystemItem[], parentId: string | null = null): FileSystemItem[] => {
          return items
            .map((item) => {
              // Se este é o item que estamos movendo, removemos ele e o armazenamos
              if (item.id === sourceId) {
                removedItem = { ...item }
                return null // Isso efetivamente remove o item desta posição
              }

              // Se este item tem filhos, processamos eles recursivamente
              if (item.children) {
                item.children = processFileSystem(item.children, item.id).filter(Boolean) as FileSystemItem[]
              }

              return item
            })
            .filter(Boolean) as FileSystemItem[] // Removemos os itens null (que foram removidos)
        }

        // Primeiro passo: processar a árvore para remover o item e encontrar o pai do alvo
        let newFileSystem = processFileSystem(prevFileSystem)

        // Segundo passo: adicionar o item removido ao local correto
        if (removedItem) {
          const addItemToTarget = (items: FileSystemItem[]): FileSystemItem[] => {
            return items.map((item) => {
              const existingNames = new Set(newFileSystem.map((child) => child.name))
              const uniqueName = generateUniqueName(removedItem.name, existingNames)

              // Atualizar o nome do item removido se necessário
              if (uniqueName !== removedItem?.name) {
                removedItem = { ...removedItem, name: uniqueName }
              }

              if (
                (targetType === "folder" && item.id === targetId) ||
                (targetType === "file" && item.id === targetId)
              ) {
                return {
                  ...item,
                  children: [...(item.children || []), removedItem!],
                }
              }
              if (item.children) {
                item.children = addItemToTarget(item.children)
              }
              return item
            })
          }

          newFileSystem = addItemToTarget(newFileSystem)
        }

        return newFileSystem
      })

      // Expandir a pasta de destino se for uma pasta
      if (targetId && targetType === "folder") {
        setExpandedFolders((prev) => new Set(prev).add(targetId))
      }
    },
    [updateFileSystem],
  )

  const renameItem = (itemId: string) => {
    setEditingItemId(itemId)
  }

  const handleRenameSubmit = (itemId: string, newName: string) => {

    if (!newName.trim()) return

    if (newName === "Novo Arquivo" || newName === "Nova Pasta") return

    updateFileSystem(
      (prevFileSystem) => {
        const renameItemInTree = (items: FileSystemItem[]): FileSystemItem[] => {
          return items.map((item) => {
            if (item.id === itemId) {
              return { ...item, name: newName }
            }
            if (item.children) {
              return { ...item, children: renameItemInTree(item.children) }
            }
            return item
          })
        }
        return renameItemInTree(prevFileSystem)
      },
      { renamedItem: { id: itemId, newName } },
    )
    setEditingItemId(null)
  }

  const createNewItem = (parentId: string | null, itemType: "file" | "folder") => {
    debugger
    const newItemName = itemType === "file" ? "Novo Arquivo" : "Nova Pasta"
    const newItem: FileSystemItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: newItemName,
      type: itemType,
      children: itemType === "folder" ? [] : undefined,
    }

    updateFileSystem((prevFileSystem) => {
      if (parentId === null) {
        return [...prevFileSystem, newItem]
      }

      const addNewItem = (items: FileSystemItem[]): FileSystemItem[] => {
        return items.map((item) => {
          if (item.id === parentId) {
            return {
              ...item,
              children: [...(item.children || []), newItem],
            }
          }
          if (item.children) {
            return { ...item, children: addNewItem(item.children) }
          }
          return item
        })
      }

      return addNewItem(prevFileSystem)
    })

    if (parentId) {
      setExpandedFolders((prev) => new Set([...prev, parentId]))
    }
    focusEditInput(newItem.id)
  }

  const handleExternalFiles = async (files: FileList, parentId: string | null) => {
    // Processar arquivos em lotes para melhor desempenho
    const processFiles = async () => {
      const newFiles: FileSystemItem[] = []

      for (const file of files) {
        const extension = file.name.split(".").pop() || ""
        const id = Math.random().toString(36).substr(2, 9)

        if (isImageFile(extension)) {
          // Para arquivos de imagem, criar uma URL do objeto
          try {
            const dataUrl = await readFileAsDataURL(file)
            newFiles.push({
              id,
              name: file.name,
              type: "file",
              extension,
              content: dataUrl,
            })
          } catch (error) {
            console.error("Erro ao ler arquivo de imagem:", error)
          }
        } else {
          // Para arquivos de texto, ler o conteúdo
          try {
            const text = await file.text()
            newFiles.push({
              id,
              name: file.name,
              type: "file",
              extension,
              content: text,
              language: getLanguageFromExtension(extension),
            })
          } catch (error) {
            console.error("Erro ao ler arquivo de texto:", error)
          }
        }
      }

      // Atualizar o sistema de arquivos uma única vez com todos os novos arquivos
      updateFileSystem((prev) => {
        if (parentId === null) {
          return [...prev, ...newFiles]
        }

        const addFilesToFolder = (
          item: FileSystemItem,
          parentId: string,
          newFiles: FileSystemItem[],
        ): FileSystemItem => {
          if (item.id === parentId && item.type === "folder") {
            return {
              ...item,
              children: [...(item.children || []), ...newFiles],
            }
          }

          if (item.children) {
            return {
              ...item,
              children: item.children.map((child) => addFilesToFolder(child, parentId, newFiles)),
            }
          }

          return item
        }

        return prev.map((item) => addFilesToFolder(item, parentId, newFiles))
      })
    }

    await processFiles()
  }

  const isImageFile = (extension: string): boolean => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "svg", "webp", "bmp", "ico"]
    return imageExtensions.includes(extension.toLowerCase())
  }
  const getLanguageFromExtension = (extension: string): string => {
    const languageMap: Record<string, string> = {
      js: "javascript",
      jsx: "javascript",
      ts: "typescript",
      tsx: "typescript",
      html: "html",
      css: "css",
      json: "json",
      md: "markdown",
      py: "python",
      java: "java",
      cpp: "cpp",
      c: "c",
      cs: "csharp",
      go: "go",
      rs: "rust",
      php: "php",
      rb: "ruby",
      sql: "sql",
      yml: "yaml",
      yaml: "yaml",
      xml: "xml",
      sh: "shell",
      bash: "shell",
    }
    return languageMap[extension.toLowerCase()] || "plaintext"
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full border-r h-full bg-white flex flex-col relative" ref={sidebarRef}>
        <SidebarHeader
          onCreateFile={() => createNewItem(null, "file")}
          onCreateFolder={() => createNewItem(null, "folder")}
        />
        <ScrollArea className="flex-grow">
          <div className="p-2 h-full">
            <RootDropZone
              fileSystem={fileSystem}
              expandedFolders={expandedFolders}
              onToggleFolder={toggleFolder}
              onItemClick={handleItemClick}
              onRename={renameItem}
              onDelete={deleteItem}
              onCreateFile={createNewItem}
              onCreateFolder={createNewItem}
              onMoveItem={moveItem}
              editingItemId={editingItemId}
              onRenameSubmit={handleRenameSubmit}
              editInputRef={editInputRef}
            />
          </div>
        </ScrollArea>
      </div>
    </DndProvider>
  )
}