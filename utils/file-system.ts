import type { FileSystemItem } from "@/types/file-system"

export const findItemById = (id: string, items: FileSystemItem[]): FileSystemItem | null => {
  for (const item of items) {
    if (item.id === id) return item
    if (item.children) {
      const found = findItemById(id, item.children)
      if (found) return found
    }
  }
  return null
}

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

