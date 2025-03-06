"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { useFileSystem } from "@/contexts/FileSystemContext"
import { FileSystemItem } from "@/types/file-system"
import { readFileAsDataURL } from "@/utils/file-utils"
import type React from "react"
import { useCallback, useRef, useState } from "react"
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

  // Memoize the function to focus the edit input
  const focusEditInput = useCallback((itemId: string) => {
    setEditingItemId(itemId)
    setTimeout(() => {
      const input = editInputRef.current
      if (input) {
        input.focus()
        input.select()
      }
    }, 0)
  }, [])

  // Memoize the function to toggle folder expansion
  const toggleFolder = useCallback((folderId: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(folderId)) {
        newSet.delete(folderId)
      } else {
        newSet.add(folderId)
      }
      return newSet
    })
  }, [])

  // Memoize the function to handle item clicks
  const handleItemClick = useCallback(
    (item: FileSystemItem) => {
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
    },
    [setOpenFiles, setActiveFile, toggleFolder]
  )

  // Memoize the function to delete an item
  const deleteItem = useCallback(
    (itemId: string) => {
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
    },
    [updateFileSystem]
  )

  // Memoize the function to move an item
  const moveItem = useCallback(
    (sourceId: string, targetId: string | null, targetType: "file" | "folder") => {
      updateFileSystem((prevFileSystem) => {
        let removedItem: FileSystemItem | null = null

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

        const processFileSystem = (items: FileSystemItem[], parentId: string | null = null): FileSystemItem[] => {
          return items
            .map((item) => {
              if (item.id === sourceId) {
                removedItem = { ...item }
                return null
              }

              if (item.children) {
                item.children = processFileSystem(item.children, item.id).filter(Boolean) as FileSystemItem[]
              }

              return item
            })
            .filter(Boolean) as FileSystemItem[]
        }

        let newFileSystem = processFileSystem(prevFileSystem)

        if (removedItem) {
          const addItemToTarget = (items: FileSystemItem[]): FileSystemItem[] => {
            return items.map((item) => {
              const existingNames = new Set(newFileSystem.map((child) => child.name))
              const uniqueName = generateUniqueName(removedItem.name, existingNames)

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

      if (targetId && targetType === "folder") {
        setExpandedFolders((prev) => new Set([...prev, targetId]))
      }
    },
    [updateFileSystem]
  )

  // Memoize the function to rename an item
  const renameItem = useCallback((itemId: string) => {
    setEditingItemId(itemId)
  }, [])

  // Memoize the function to handle rename submission
  const handleRenameSubmit = useCallback(
    (itemId: string, newName: string) => {
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
    },
    [updateFileSystem]
  )

  // Memoize the function to create a new item
  const createNewItem = useCallback(
    (parentId: string | null, itemType: "file" | "folder") => {
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
    },
    [updateFileSystem, focusEditInput]
  )

  // Memoize the function to handle external files
  const handleExternalFiles = useCallback(
    async (files: FileList, parentId: string | null) => {
      const processFiles = async () => {
        const newFiles: FileSystemItem[] = []

        for (const file of files) {
          const extension = file.name.split(".").pop() || ""
          const id = Math.random().toString(36).substr(2, 9)

          if (isImageFile(extension)) {
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
    },
    [updateFileSystem]
  )

  // Memoize the function to check if a file is an image
  const isImageFile = useCallback((extension: string): boolean => {
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "svg", "webp", "bmp", "ico"]
    return imageExtensions.includes(extension.toLowerCase())
  }, [])

  // Memoize the function to get the language from the file extension
  const getLanguageFromExtension = useCallback((extension: string): string => {
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
  }, [])

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full border-r h-full flex flex-col relative" ref={sidebarRef}>
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