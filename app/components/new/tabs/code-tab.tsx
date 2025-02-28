"use client"

import { CodeEditor } from "@/components/base/code-editor/CodeEditor"
import { Card } from "@/components/ui/card"
import "react-resizable/css/styles.css"

interface FileNode {
    id: string
    name: string
    type: "file" | "folder"
    content?: string
    children?: FileNode[]
}

interface CodeTabProps {
    initialFiles: FileNode[]
    onFilesChange: (files: FileNode[]) => void
}

export function CodeTab({ initialFiles, onFilesChange }: CodeTabProps) {
    return (
        <Card style={{ height: "calc(47vh)", width: "100%" }} className="overflow-hidden">
            <CodeEditor className="max-h-[calc(47vh) h-[calc(47vh) min-h-[calc(47vh)]"/>
        </Card>
    )
}