"use client"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useFileSystem } from "@/contexts/FileSystemContext"
import { cn } from "@/lib/utils"
import { FileSystemItem } from "@/types/file-system"
import { ChevronDown, ChevronRight, File, FileCode, FileText, Folder, Image } from "lucide-react"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

type DragItem = {
  id: string
  type: string
}

export const Sidebar: React.FC = () => {
  const { fileSystem, updateFileSystem, setOpenFiles, setActiveFile, pendingChanges, saveChanges, cancelChanges } =
    useFileSystem()
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["1"]))
  const [editingItemId, setEditingItemId] = useState<string | null>(null)
  const editInputRef = useRef<HTMLInputElement>(null)
  const sidebarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editingItemId && editInputRef.current) {
      editInputRef.current.focus()
      editInputRef.current.select()
    }
  }, [editingItemId])

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

  const getFileIcon = (item: FileSystemItem) => {
    switch (item.extension?.toLowerCase()) {
      case "js":
      case "ts":
      case "jsx":
      case "tsx":
        return <FileCode className="w-4 h-4 text-yellow-500" />
      case "md":
        return <FileText className="w-4 h-4 text-blue-500" />
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "svg":
      case "webp":
      case "bmp":
      case "ico":
        return <Image className="w-4 h-4 text-purple-500" />
      default:
        return <File className="w-4 h-4" />
    }
  }

  const removeItemFromTree = (
    itemId: string,
    items: FileSystemItem[],
  ): [FileSystemItem[], FileSystemItem | undefined] => {
    let removedItem: FileSystemItem | undefined
    const newItems = items.filter((item) => {
      if (item.id === itemId) {
        removedItem = item
        return false
      }
      if (item.children) {
        const [newChildren, childRemovedItem] = removeItemFromTree(itemId, item.children)
        item.children = newChildren
        if (childRemovedItem) removedItem = childRemovedItem
      }
      return true
    })
    return [newItems, removedItem]
  }

  const addItemToParent = (
    item: FileSystemItem,
    parentId: string | null,
    items: FileSystemItem[],
  ): FileSystemItem[] => {
    if (parentId === null) {
      return [...items, item]
    } else {
      const newItems = items.map((item) => {
        if (item.id === parentId && item.type === "folder") {
          return {
            ...item,
            children: [...(item.children || []), item],
          }
        }
        if (item.children) {
          return {
            ...item,
            children: addItemToParent(item, parentId, item.children),
          }
        }
        return item
      })
      return newItems
    }
  }

  const moveItem = (sourceId: string, targetId: string | null) => {
    // Fazer backup do estado atual antes de mover
    updateFileSystem((prevFileSystem) => {
      // Função auxiliar para encontrar e remover um item
      const findAndRemoveItem = (items: FileSystemItem[]): [FileSystemItem[], FileSystemItem | null] => {
        let removedItem: FileSystemItem | null = null
        const newItems = items.filter((item) => {
          if (item.id === sourceId) {
            removedItem = JSON.parse(JSON.stringify(item)) // Deep clone do item
            return false
          }
          if (item.children) {
            const [newChildren, removed] = findAndRemoveItem(item.children)
            if (removed) {
              removedItem = removed
              item.children = newChildren
            }
          }
          return true
        })
        return [newItems, removedItem]
      }

      // Função auxiliar para adicionar um item a um destino
      const addItemToTarget = (items: FileSystemItem[], item: FileSystemItem): FileSystemItem[] => {
        if (!targetId) {
          return [...items, item]
        }

        return items.map((current) => {
          if (current.id === targetId && current.type === "folder") {
            return {
              ...current,
              children: [...(current.children || []), item],
            }
          }
          if (current.children) {
            return {
              ...current,
              children: addItemToTarget(current.children, item),
            }
          }
          return current
        })
      }

      // Encontrar e remover o item da sua localização atual
      const [newFileSystem, removedItem] = findAndRemoveItem(prevFileSystem)

      // Se não encontrou o item, retorna o estado atual
      if (!removedItem) {
        return prevFileSystem
      }

      // Adicionar o item ao novo destino
      return addItemToTarget(newFileSystem, removedItem)
    })

    // Expandir a pasta de destino se houver
    if (targetId) {
      setExpandedFolders((prev) => new Set([...prev, targetId]))
    }
  }

  const renameItem = (itemId: string, newName: string) => {
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
    setEditingItemId(newItem.id)
  }

  // Otimizar a função handleExternalFiles para melhor desempenho
  const handleExternalFiles = async (files: FileList, parentId: string | null) => {
    // Processar arquivos em lotes para melhor desempenho
    const processFiles = async () => {
      const newFiles: FileSystemItem[] = []

      for (const file of files) {
        const extension = file.name.split(".").pop() || ""
        const isImage = isImageFile(extension)
        const id = Math.random().toString(36).substr(2, 9)

        if (isImage) {
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

        return prev.map((item) => addFilesToFolder(item, parentId, newFiles))
      })
    }

    await processFiles()
  }

  // Função auxiliar para ler um arquivo como DataURL
  const readFileAsDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // Função auxiliar para adicionar arquivos a uma pasta
  const addFilesToFolder = (item: FileSystemItem, parentId: string, newFiles: FileSystemItem[]): FileSystemItem => {
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

  const RootDropZone: React.FC = () => {
    const [{ isOver, canDrop }, drop] = useDrop(
      () => ({
        accept: "FILE_TREE_ITEM",
        drop: (item: any, monitor) => {
          if (!monitor.didDrop()) {
            moveItem(item.id, null)
          }
        },
        collect: (monitor) => ({
          isOver: monitor.isOver({ shallow: true }),
          canDrop: monitor.canDrop(),
        }),
      }),
      [],
    )

    return (
      <div ref={drop} className={cn("min-h-full w-full", isOver && canDrop && "bg-primary/10")}>
        {fileSystem.map((item) => (
          <FileTreeItem key={item.id} item={item} level={0} />
        ))}
      </div>
    )
  }

  // Modificar o FileTreeItem para aceitar arquivos externos
  const FileTreeItem: React.FC<{ item: FileSystemItem; level: number }> = ({ item, level }) => {
    // Configuração do drag
    const [{ isDragging }, drag] = useDrag(
      () => ({
        type: "FILE_TREE_ITEM",
        item: () => ({ id: item.id, type: "FILE_TREE_ITEM" }),
        collect: (monitor) => ({
          isDragging: monitor.isDragging(),
        }),
      }),
      [item.id],
    )

    // Configuração do drop
    const [{ isOver, canDrop }, drop] = useDrop(
      () => ({
        accept: "FILE_TREE_ITEM",
        canDrop: (draggedItem: any) => {
          if (item.type !== "folder") return false
          if (draggedItem.id === item.id) return false

          // Verificar se não está tentando mover uma pasta para dentro dela mesma
          const isParent = (parentId: string, childId: string): boolean => {
            const parent = findItemById(parentId, fileSystem)
            if (!parent || !parent.children) return false
            return parent.children.some(
              (child) => child.id === childId || (child.children && isParent(child.id, childId)),
            )
          }

          return !isParent(item.id, draggedItem.id)
        },
        drop: (draggedItem: any, monitor) => {
          if (!monitor.didDrop()) {
            moveItem(draggedItem.id, item.id)
          }
        },
        collect: (monitor) => ({
          isOver: monitor.isOver({ shallow: true }),
          canDrop: monitor.canDrop(),
        }),
      }),
      [item.id, item.type, fileSystem],
    )

    // Referência composta para drag e drop
    const ref = useRef<HTMLDivElement>(null)
    drag(drop(ref))

    return (
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            ref={ref}
            className={cn(
              "flex items-center rounded-md px-2 py-1 cursor-pointer transition-colors duration-150",
              isDragging && "opacity-50",
              item.type === "folder" && isOver && canDrop && "bg-primary/10",
              !isDragging && "hover:bg-muted/50",
            )}
            style={{
              paddingLeft: `${level * 8 + (item.type === "file" ? 12 : 0)}px`,
            }}
            onClick={() => handleItemClick(item)}
          >
            <div className="flex items-center gap-2 min-w-0 w-full">
              {item.type === "folder" && (
                <span
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFolder(item.id)
                  }}
                  className="flex-shrink-0"
                >
                  {expandedFolders.has(item.id) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </span>
              )}
              <span className="flex-shrink-0">
                {item.type === "folder" ? <Folder className="w-4 h-4 text-yellow-500" /> : getFileIcon(item)}
              </span>
              {editingItemId === item.id ? (
                <input
                  ref={editInputRef}
                  type="text"
                  defaultValue={item.name}
                  className="bg-transparent outline-none flex-1 min-w-0 w-full"
                  onBlur={(e) => renameItem(item.id, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      renameItem(item.id, e.currentTarget.value)
                    }
                  }}
                />
              ) : (
                <span className="truncate flex-1">{item.name}</span>
              )}
            </div>
          </div>
          {item.type === "folder" && expandedFolders.has(item.id) && item.children && (
            <div className="ml-4">
              {item.children.map((child) => (
                <FileTreeItem key={child.id} item={child} level={level + 1} />
              ))}
            </div>
          )}
        </ContextMenuTrigger>
        <ContextMenuContent>
          {item.type === "file" && <ContextMenuItem onClick={() => handleItemClick(item)}>Abrir</ContextMenuItem>}
          <ContextMenuItem onClick={() => setEditingItemId(item.id)}>Renomear</ContextMenuItem>
          <ContextMenuItem onClick={() => deleteItem(item.id)}>Excluir</ContextMenuItem>
          {item.type === "folder" && (
            <>
              <ContextMenuSeparator />
              <ContextMenuItem onClick={() => createNewItem(item.id, "file")}>Novo Arquivo</ContextMenuItem>
              <ContextMenuItem onClick={() => createNewItem(item.id, "folder")}>Nova Pasta</ContextMenuItem>
            </>
          )}
        </ContextMenuContent>
      </ContextMenu>
    )
  }

  // Função auxiliar para encontrar um item pelo ID
  const findItemById = (id: string, items: FileSystemItem[]): FileSystemItem | null => {
    for (const item of items) {
      if (item.id === id) return item
      if (item.children) {
        const found = findItemById(id, item.children)
        if (found) return found
      }
    }
    return null
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="w-full border-r h-full bg-white dark:bg-gray-900 flex flex-col relative" ref={sidebarRef}>
            <div className="p-2 flex justify-between items-center border-b">
              <Label className="text-lg font-semibold">Arquivos</Label>
            </div>
            <ScrollArea className="flex-grow">
              <div className="p-2 h-full min-h-0">
                <RootDropZone />
              </div>
            </ScrollArea>
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => createNewItem(null, "file")}>Novo Arquivo</ContextMenuItem>
          <ContextMenuItem onClick={() => createNewItem(null, "folder")}>Nova Pasta</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </DndProvider>
  )
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

