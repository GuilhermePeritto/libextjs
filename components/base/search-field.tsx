"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Plus, Search } from "lucide-react"
import * as React from "react"

interface SearchFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onAdd?: () => void
  items?: { id: string; nome: string }[]
  onSelect?: (item: { id: string; nome: string }) => void
  addButtonTooltip?: string
  className?: string
}

export function SearchField({
  onAdd,
  items = [],
  onSelect,
  addButtonTooltip = "Adicionar novo",
  className,
  ...props
}: SearchFieldProps) {
  const [search, setSearch] = React.useState("")
  const [isOpen, setIsOpen] = React.useState(false)

  const filteredItems = React.useMemo(() => {
    return items.filter((item) => item.nome.toLowerCase().includes(search.toLowerCase()))
  }, [items, search])

  return (
    <div className={cn("relative", className)}>
      <div className="relative flex items-center">
        <Search className="absolute left-2 h-4 w-4 text-muted-foreground" />
        <Input
          {...props}
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setIsOpen(true)
          }}
          className="pl-8 pr-8"
          onFocus={() => setIsOpen(true)}
        />
        {onAdd && (
          <Button variant="ghost" size="icon" className="absolute right-0" onClick={onAdd} title={addButtonTooltip}>
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>
      {items.length > 0 && isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-popover text-popover-foreground rounded-md border shadow-md">
          <div className="p-1">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground"
                  onClick={() => {
                    onSelect?.(item)
                    setSearch(item.nome)
                    setIsOpen(false)
                  }}
                >
                  {item.nome}
                </div>
              ))
            ) : (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">Nenhum resultado encontrado</div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

