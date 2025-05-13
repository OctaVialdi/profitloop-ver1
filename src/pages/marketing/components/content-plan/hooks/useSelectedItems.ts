
import { useState } from "react";

export function useSelectedItems() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    }
  };

  return {
    selectedItems,
    setSelectedItems,
    handleSelectItem
  };
}
