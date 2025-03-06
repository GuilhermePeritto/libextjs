import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import type { ImageViewerProps } from "@/types/editor"
import Image from "next/image"
import type React from "react"
import { useMemo } from "react"

export const ImageViewer: React.FC<ImageViewerProps> = ({ file, className }) => {
  const isIcon = file.extension?.toLowerCase() === "ico"

  const content = useMemo(() => {
    if (!file.content) {
      return (
        <div className={cn("flex items-center justify-center text-muted-foreground h-full", className)}>
          Nenhum conteúdo de imagem disponível
        </div>
      )
    }

    return (
      <ScrollArea className={cn("w-full h-full bg-[#1e1e1e] dark:bg-[#1e1e1e]", className)}>
        <div className="flex items-center justify-center min-h-full p-4">
          <div className="relative flex items-center justify-center w-full h-full">
            {isIcon ? (
              <img
                src={file.content || "/placeholder.svg"}
                alt={file.name}
                className="object-contain max-w-full max-h-full"
                style={{
                  imageRendering: "pixelated",
                }}
              />
            ) : (
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src={file.content || "/placeholder.svg"}
                  alt={file.name}
                  width={1200}
                  height={800}
                  className="object-contain max-w-full max-h-full"
                  unoptimized={file.extension === "svg"}
                  style={{
                    margin: "auto",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    )
  }, [file.content, file.name, file.extension, isIcon, className])

  return content
}

