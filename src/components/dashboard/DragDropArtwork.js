"use client";

import { useState } from "react";
import Button from "@/components/Button";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/solid";

export default function DragDropArtwork({
  artwork,
  onReorder,
  onEdit,
  onDelete,
}) {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dragOverItem, setDragOverItem] = useState(null);

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.outerHTML);
  };

  const handleDragOver = (e, item) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverItem(item);
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = (e, targetItem) => {
    e.preventDefault();

    if (!draggedItem || draggedItem.id === targetItem.id) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    // Find the indices of the dragged and target items
    const draggedIndex = artwork.findIndex(
      (item) => item.id === draggedItem.id
    );
    const targetIndex = artwork.findIndex((item) => item.id === targetItem.id);

    // Create new array with reordered items
    const newArtwork = [...artwork];
    const [draggedArtwork] = newArtwork.splice(draggedIndex, 1);
    newArtwork.splice(targetIndex, 0, draggedArtwork);

    // Update sort_order for all items
    const reorderedItems = newArtwork.map((item, index) => ({
      ...item,
      sort_order: index,
    }));

    onReorder(reorderedItems);
    setDraggedItem(null);
    setDragOverItem(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
  };

  return (
    <div className="space-y-2">
      {artwork.map((item, index) => (
        <div
          key={item.id}
          draggable
          onDragStart={(e) => handleDragStart(e, item)}
          onDragOver={(e) => handleDragOver(e, item)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, item)}
          onDragEnd={handleDragEnd}
          className={`bg-gray-700 rounded-lg p-4 cursor-move transition-all ${
            draggedItem?.id === item.id
              ? "opacity-50 scale-95"
              : dragOverItem?.id === item.id
              ? "border-2 border-secondary bg-gray-600"
              : "hover:bg-gray-600"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-gray-400 text-sm font-mono w-8">
                {index + 1}
              </div>
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-600">
                <img
                  src={item.storage_path}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium">{item.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-1">
                  {item.description}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-xs text-gray-500 capitalize">
                    {item.category}
                  </span>
                  {item.sub_category && (
                    <>
                      <span className="text-gray-500">•</span>
                      <span className="text-xs text-gray-500 capitalize">
                        {item.sub_category}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                onClick={() => onEdit(item.id)}
                className="bg-gray-600 hover:bg-gray-500 text-sm"
                showArrow={false}
              >
                <PencilIcon className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => onDelete(item.id)}
                className="bg-red-600 hover:bg-red-700 text-sm"
                showArrow={false}
              >
                <TrashIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}

      {artwork.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No artwork to reorder. Add some artwork first.
        </div>
      )}
    </div>
  );
}
