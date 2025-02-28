import type { EditorContentProps } from "@/types/editor"
import Editor, { useMonaco } from "@monaco-editor/react"
import type React from "react"
import { useEffect } from "react"
import { ImageViewer } from "./ImageViewer"

const isImageFile = (extension?: string): boolean => {
  if (!extension) return false
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "svg", "webp", "bmp", "ico", "tiff", "avif"]
  return imageExtensions.includes(extension.toLowerCase())
}

export const EditorContent: React.FC<EditorContentProps> = ({ file, onChange, theme = "light", isModified }) => {
  const monaco = useMonaco();

  if (isImageFile(file.extension)) {
    return <ImageViewer file={file} className="h-full" />
  }

  useEffect(() => {
    if(!monaco) return
    
    if (theme === "dark") {
      import('monaco-themes/themes/GitHub Dark.json')
        .then(data => {
          monaco.editor.defineTheme("tema", data)
          monaco.editor.setTheme("tema")
        })
    } else {
      import('monaco-themes/themes/GitHub Light.json')
        .then(data => {
          monaco.editor.defineTheme("tema", data);
          monaco.editor.setTheme("tema");
        })
    }
  }, [theme])

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

