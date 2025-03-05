import type { FileSystemItem } from "@/types/file-system"

export const removeItemFromTree = (id: string, items: FileSystemItem[]): [FileSystemItem[], FileSystemItem | null] => {
  let removedItem: FileSystemItem | null = null

  const filter = (items: FileSystemItem[]): FileSystemItem[] => {
    return items.filter((item) => {
      if (item.id === id) {
        removedItem = item
        return false
      }
      if (item.children) {
        item.children = filter(item.children)
      }
      return true
    })
  }

  const newItems = filter([...items])
  return [newItems, removedItem]
}

export const addItemToParent = (
  item: FileSystemItem,
  parentId: string | null,
  items: FileSystemItem[],
): FileSystemItem[] => {
  if (parentId === null) {
    return [...items, item]
  }

  return items.map((currentItem) => {
    if (currentItem.id === parentId && currentItem.type === "folder") {
      return {
        ...currentItem,
        children: [...(currentItem.children || []), item],
      }
    }
    if (currentItem.children) {
      return {
        ...currentItem,
        children: addItemToParent(item, parentId, currentItem.children),
      }
    }
    return currentItem
  })
}

/**
 * Cria um mapa de IDs de item para IDs de pasta pai
 * @param fileSystem A árvore de arquivos
 * @returns Um mapa onde a chave é o ID do item e o valor é o ID da pasta pai
 */
export function createParentMap(fileSystem: FileSystemItem[]): Map<string, string | null> {
  const parentMap = new Map<string, string | null>()

  function mapParents(items: FileSystemItem[], parentId: string | null = null) {
    for (const item of items) {
      parentMap.set(item.id, parentId)
      if (item.children && item.children.length > 0) {
        mapParents(item.children, item.id)
      }
    }
  }

  mapParents(fileSystem)
  return parentMap
}

/**
 * Encontra um item pelo ID na árvore de arquivos
 * @param id ID do item a ser encontrado
 * @param items Árvore de arquivos
 * @returns O item encontrado ou null
 */
export function findItemById(id: string, items: FileSystemItem[]): FileSystemItem | null {
  for (const item of items) {
    if (item.id === id) return item
    if (item.children) {
      const found = findItemById(id, item.children)
      if (found) return found
    }
  }
  return null
}

/**
 * Verifica se um item é ancestral de outro
 * @param ancestorId ID do possível ancestral
 * @param descendantId ID do possível descendente
 * @param parentMap Mapa de IDs de item para IDs de pasta pai
 * @returns true se ancestorId é ancestral de descendantId
 */
export function isAncestor(ancestorId: string, descendantId: string, parentMap: Map<string, string | null>): boolean {
  let currentParentId = parentMap.get(descendantId)

  while (currentParentId !== null && currentParentId !== undefined) {
    if (currentParentId === ancestorId) {
      return true
    }
    currentParentId = parentMap.get(currentParentId)
  }

  return false
}

/**
 * Encontra o ID da pasta pai direta de um item
 * @param itemId ID do item
 * @param items Árvore de arquivos
 * @returns O ID da pasta pai direta ou null
 */
export function findDirectParentId(itemId: string, items: FileSystemItem[]): string | null {
  for (const item of items) {
    if (item.children) {
      // Verificar se o item está diretamente nesta pasta
      if (item.children.some((child) => child.id === itemId)) {
        return item.id // Retorna o ID desta pasta
      }

      // Se não encontrou diretamente, procurar nas subpastas
      const foundInChild = findDirectParentId(itemId, item.children)
      if (foundInChild !== null) {
        return foundInChild
      }
    }
  }
  return null
}

