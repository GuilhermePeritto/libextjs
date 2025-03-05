import type { FileIconProps } from "@/types/file-tree"
import { File, FileCode, FileText, Image } from "lucide-react"
import type React from "react"

export const FileIcon: React.FC<FileIconProps> = ({ extension, className }) => {
  switch (extension?.toLowerCase()) {
    case "js":
    case "ts":
    case "jsx":
    case "tsx":
      return <FileCode className={`w-4 h-4 text-yellow-500 ${className}`} />
    case "md":
      return <FileText className={`w-4 h-4 text-blue-500 ${className}`} />
    case "jpg":
    case "jpeg":
    case "png":
    case "gif":
    case "svg":
    case "webp":
    case "bmp":
    case "ico":
      return <Image className={`w-4 h-4 text-purple-500 ${className}`} />
    default:
      return <File className={`w-4 h-4 ${className}`} />
  }
}

