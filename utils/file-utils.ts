import type { FileSystemItem } from "@/types/file-system"

export const isImageFile = (extension: string): boolean => {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "svg", "webp", "bmp", "ico"]
  return imageExtensions.includes(extension.toLowerCase())
}

export const getLanguageFromExtension = (extension: string): string => {
  const languageMap: Record<string, string> = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    html: "html",
    css: "css",
    json: "json",
    md: "markdown",
    py: "python",
    java: "java",
    cpp: "cpp",
    c: "c",
    cs: "csharp",
    go: "go",
    rs: "rust",
    php: "php",
    rb: "ruby",
    sql: "sql",
    yml: "yaml",
    yaml: "yaml",
    xml: "xml",
    sh: "shell",
    bash: "shell",
  }
  return languageMap[extension.toLowerCase()] || "plaintext"
}

export const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export const addFilesToFolder = (
  item: FileSystemItem,
  parentId: string,
  newFiles: FileSystemItem[],
): FileSystemItem => {
  if (item.id === parentId && item.type === "folder") {
    return {
      ...item,
      children: [...(item.children || []), ...newFiles],
    }
  }

  if (item.children) {
    return {
      ...item,
      children: item.children.map((child) => addFilesToFolder(child, parentId, newFiles)),
    }
  }

  return item
}

