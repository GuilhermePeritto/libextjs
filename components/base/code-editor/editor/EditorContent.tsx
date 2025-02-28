import type React from "react"
import Editor from "@monaco-editor/react"
import { ImageViewer } from "./ImageViewer"
import type { EditorContentProps } from "@/types/editor"

const isImageFile = (extension?: string): boolean => {
  if (!extension) return false
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "svg", "webp", "bmp", "ico", "tiff", "avif"]
  return imageExtensions.includes(extension.toLowerCase())
}

export const EditorContent: React.FC<EditorContentProps> = ({ file, onChange, theme = "light", isModified }) => {
  if (isImageFile(file.extension)) {
    return <ImageViewer file={file} className="h-full" />
  }

  return (
    <Editor
      height="100%"
      width="100%"
      language={file.language || "plaintext"}
      value={file.content || ""}
      onChange={(value) => onChange?.(value || "")}
      theme={theme === "dark" ? "vs-dark" : "light"}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: "on",
        padding: { top: 16 },
        scrollBeyondLastLine: false,
        automaticLayout: true,
        tabSize: 2,
        renderLineHighlight: "all",
      }}
    />
  )
}

