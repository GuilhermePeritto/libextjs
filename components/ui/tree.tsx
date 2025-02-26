import { ChevronRight } from "lucide-react"
import type React from "react"

export interface TreeItem {
  id: string
  name: string
  icon?: React.ReactNode
  children: TreeItem[]
  actions?: React.ReactNode
}

interface TreeProps {
  data: TreeItem[]
  onNodeClick?: (node: TreeItem) => void
}

export const Tree: React.FC<TreeProps> = ({ data, onNodeClick }) => {
  const renderTreeItems = (items: TreeItem[]) => {
    return items.map((item) => (
      <div key={item.id} className="ml-4">
        <div className="flex items-center space-x-2 py-1">
          {item.children.length > 0 ? <ChevronRight className="h-4 w-4" /> : <span className="w-4" />}
          {item.icon}
          <span className="cursor-pointer" onClick={() => onNodeClick && onNodeClick(item)}>
            {item.name}
          </span>
          {item.actions}
        </div>
        {item.children.length > 0 && <div className="ml-4">{renderTreeItems(item.children)}</div>}
      </div>
    ))
  }

  return <div>{renderTreeItems(data)}</div>
}