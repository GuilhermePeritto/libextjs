"use client"

import { CodeEditorContainer } from "@/components/base/code-editor/code-editor-container"
import { Card, CardContent } from "@/components/ui/card"

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
        <Card className="max-h-[calc(47vh) h-[calc(47vh) min-h-[calc(47vh)]">
            <CardContent className="h-full">
                <CodeEditorContainer
                    initialFiles={initialFiles}
                    onFilesChange={(files) => onFilesChange(files)}
                    className="max-h-[calc(44vh) h-[calc(44vh) min-h-[calc(44vh)]"
                />
            </CardContent>
        </Card>
    )
}