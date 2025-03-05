"use client"

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { FileSystemProvider } from "@/contexts/FileSystemContext"
import type React from "react"
import { useEffect, useState } from "react"
import { EditorPane } from "./EditorPane"
import { Sidebar } from "./Sidebar"

export const CodeEditor: React.FC<{ className?: string }> = ({ className }) => {
  const [sidebarWidth, setSidebarWidth] = useState(240)
  const [isDragging, setIsDragging] = useState(false)

  // Handle resize logic
  const handleResize = (e: MouseEvent) => {
    if (isDragging) {
      const newWidth = Math.max(160, Math.min(480, e.clientX))
      setSidebarWidth(newWidth)
    }
  }

  // Set up event listeners for resize
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleResize)
      document.addEventListener("mouseup", () => setIsDragging(false))

      // Add a class to the body to change cursor during resize
      document.body.classList.add("resizing")

      return () => {
        document.removeEventListener("mousemove", handleResize)
        document.removeEventListener("mouseup", () => setIsDragging(false))
        document.body.classList.remove("resizing")
      }
    }
  }, [isDragging, handleResize]) // Added handleResize to dependencies

  return (
    <FileSystemProvider>
      <div className={`h-full w-full flex overflow-hidden ${className || ""}`}>
        <ResizablePanelGroup
          direction="horizontal"
        >
          <ResizablePanel className={"h-full overflow-hidden flex-shrink-0"} defaultSize={50}>
            <Sidebar />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={sidebarWidth}>
            <EditorPane />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </FileSystemProvider>
  )
}

