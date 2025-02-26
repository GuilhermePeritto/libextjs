"use client"

import { Download, Edit, Eye, File, Folder, RefreshCw, Trash } from "lucide-react"
import type React from "react"
import { useEffect, useRef } from "react"

interface ContextMenuProps {
  x: number
  y: number
  type: "file" | "folder" | "empty"
  onClose: () => void
  onCreateFile: () => void
  onCreateFolder: () => void
  onDelete: () => void
  onRename: () => void
}

export function ContextMenu({
  x,
  y,
  type,
  onClose,
  onCreateFile,
  onCreateFolder,
  onDelete,
  onRename,
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (menuRef.current) {
      const menuRect = menuRef.current.getBoundingClientRect()
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight

      let adjustedX = x
      let adjustedY = y

      if (x + menuRect.width > windowWidth) {
        adjustedX = windowWidth - menuRect.width - 10
      }

      if (y + menuRect.height > windowHeight) {
        adjustedY = windowHeight - menuRect.height - 10
      }

      menuRef.current.style.left = `${adjustedX}px`
      menuRef.current.style.top = `${adjustedY}px`
    }
  }, [x, y])

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-white dark:bg-gray-900 shadow-lg rounded-md border border-gray-200 dark:border-gray-800 py-1 min-w-[180px]"
      style={{ left: x, top: y }}
      onClick={handleClick}
    >
      {type === "empty" && (
        <>
          <MenuItem icon={<File />} label="New File" onClick={onCreateFile} />
          <MenuItem icon={<Folder />} label="New Folder" onClick={onCreateFolder} />
          <Divider />
          <MenuItem icon={<RefreshCw />} label="Refresh" onClick={onClose} />
        </>
      )}

      {type === "file" && (
        <>
          <MenuItem icon={<Eye />} label="Open" onClick={onClose} />
          <MenuItem icon={<Download />} label="Download" onClick={onClose} />
          <Divider />
          <MenuItem icon={<Edit />} label="Rename" onClick={onRename} />
          <MenuItem icon={<Trash />} label="Delete" onClick={onDelete} />
        </>
      )}

      {type === "folder" && (
        <>
          <MenuItem icon={<File />} label="New File" onClick={onCreateFile} />
          <MenuItem icon={<Folder />} label="New Folder" onClick={onCreateFolder} />
          <Divider />
          <MenuItem icon={<Edit />} label="Rename" onClick={onRename} />
          <MenuItem icon={<Trash />} label="Delete" onClick={onDelete} />
        </>
      )}
    </div>
  )
}

interface MenuItemProps {
  icon: React.ReactNode
  label: string
  onClick: () => void
}

function MenuItem({ icon, label, onClick }: MenuItemProps) {
  return (
    <div
      className="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
      onClick={onClick}
    >
      <span className="mr-2 text-gray-500 dark:text-gray-400">{icon}</span>
      <span className="text-sm">{label}</span>
    </div>
  )
}

function Divider() {
  return <div className="h-px bg-gray-200 dark:bg-gray-800 my-1" />
}