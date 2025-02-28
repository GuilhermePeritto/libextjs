"use client"

import type React from "react"

interface ResizeHandleProps {
  onDragStart: () => void
}

export const ResizeHandle: React.FC<ResizeHandleProps> = ({ onDragStart }) => {
  return (
    <div
      className="w-1 h-full bg-border hover:bg-primary/50 cursor-col-resize flex-shrink-0 transition-colors"
      onMouseDown={(e) => {
        e.preventDefault()
        onDragStart()
      }}
    />
  )
}