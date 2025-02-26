"use client"

import Editor, { useMonaco } from "@monaco-editor/react"
import { useTheme } from "next-themes"
import { useEffect } from "react"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  language?: string
  readOnly?: boolean
}

export function MonacoEditor({ value, onChange, language = "typescript", readOnly = false }: CodeEditorProps) {
  const { theme } = useTheme()
  const monaco = useMonaco()

  useEffect(() => {
    alterarTema()
  }, [theme])

  useEffect(() => {
    alterarTema()
  }, [])

  const alterarTema = () => {
    debugger
    if (!monaco) return

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
  }

  return (
    <Editor
      height="100%"
      defaultLanguage={language}
      value={value}
      onChange={(value) => onChange(value || "")}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: "on",
        readOnly,
        renderWhitespace: "none",
        scrollBeyondLastLine: false,
        automaticLayout: true,
      }}
    />
  )
}

