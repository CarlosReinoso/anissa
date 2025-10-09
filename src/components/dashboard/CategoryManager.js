"use client";

import { useState, useEffect } from "react";
import Button from "@/components/Button";
import { PlusIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/solid";

export default function CategoryManager({ section, onCategoryChange }) {
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");

  useEffect(() => {
    fetchSubcategories();
  }, [section]);

  const fetchSubcategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/subcategories?section=${section}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch subcategories");
      }

      // The API now returns full subcategory objects with id, name, and sort_order
      setSubcategories(result.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubcategory = async () => {
    if (!newSubcategory.trim()) return;

    try {
      // Check if subcategory already exists locally
      const exists = subcategories.some(
        (sub) => sub.name === newSubcategory.toLowerCase()
      );
      if (exists) {
        alert("Subcategory already exists");
        return;
      }

      // Save to database
      const response = await fetch("/api/subcategories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newSubcategory.toLowerCase(),
          section: section,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          alert("Subcategory already exists");
          return;
        }
        throw new Error(result.error || "Failed to create subcategory");
      }

      // Add to local state (the API returns the new subcategory object)
      setSubcategories((prev) => [...prev, result.data]);
      setNewSubcategory("");

      // Call the callback to refresh parent component
      if (onCategoryChange) {
        onCategoryChange();
      }
    } catch (err) {
      setError(err.message);
      alert(`Error: ${err.message}`);
    }
  };

  const handleDeleteSubcategory = async (subcategoryId, subcategoryName) => {
    // First, get the count of artwork in this subcategory
    let artworkCount = 0;
    try {
      const response = await fetch(
        `/api/artworks?section=${section}&sub_category=${encodeURIComponent(
          subcategoryName
        )}&limit=1`
      );
      const result = await response.json();
      if (response.ok) {
        // Get the total count from the response headers or make another request
        const countResponse = await fetch(
          `/api/artworks?section=${section}&sub_category=${encodeURIComponent(
            subcategoryName
          )}&count=true`
        );
        const countResult = await countResponse.json();
        artworkCount = countResult.count || 0;
      }
    } catch (err) {
      console.error("Error getting artwork count:", err);
    }

    // Always show the message about deleting all images in this category
    const confirmMessage = `Are you sure you want to delete the subcategory "${subcategoryName}"?\n\nThis will DELETE ALL IMAGES in this subcategory.\n\nThis action cannot be undone!`;

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      // Delete the subcategory (API will handle artwork deletion automatically)
      const deleteResponse = await fetch(
        `/api/subcategories/${subcategoryId}`,
        {
          method: "DELETE",
        }
      );

      const result = await deleteResponse.json();

      if (!deleteResponse.ok) {
        throw new Error(result.error || "Failed to delete subcategory");
      }

      // Remove from local state
      setSubcategories((prev) =>
        prev.filter((sub) => sub.id !== subcategoryId)
      );

      // Call the callback to refresh parent component
      if (onCategoryChange) {
        onCategoryChange();
      }

      // Show success message
      alert(
        result.message ||
          `Subcategory "${subcategoryName}" deleted successfully.`
      );
    } catch (err) {
      setError(err.message);
      alert(`Error: ${err.message}`);
    }
  };

  const handleReorderSubcategories = async (reorderedSubcategories) => {
    try {
      // Update sort orders in database
      const updates = reorderedSubcategories.map((subcategory, index) => ({
        id: subcategory.id,
        sort_order: index,
      }));

      const response = await fetch("/api/subcategories", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updates }),
      });

      if (!response.ok) {
        throw new Error("Failed to update subcategory order");
      }

      // Update local state
      setSubcategories(reorderedSubcategories);

      // Call the callback to refresh parent component
      if (onCategoryChange) {
        onCategoryChange();
      }
    } catch (err) {
      console.error("Error reordering subcategories:", err);
      alert("Error reordering subcategories. Please try again.");
    }
  };

  const handleStartEdit = (subcategory) => {
    setEditingSubcategory(subcategory.id);
    setEditingName(subcategory.name);
  };

  const handleCancelEdit = () => {
    setEditingSubcategory(null);
    setEditingName("");
  };

  const handleSaveEdit = async (subcategoryId) => {
    if (!editingName.trim()) return;

    try {
      // Check if the new name already exists (excluding current subcategory)
      const exists = subcategories.some(
        (sub) =>
          sub.name === editingName.toLowerCase() && sub.id !== subcategoryId
      );
      if (exists) {
        alert("Subcategory name already exists");
        return;
      }

      // Update in database
      const response = await fetch(`/api/subcategories/${subcategoryId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editingName.toLowerCase(),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          alert("Subcategory name already exists");
          return;
        }
        throw new Error(result.error || "Failed to update subcategory");
      }

      // Update local state
      setSubcategories((prev) =>
        prev.map((sub) =>
          sub.id === subcategoryId
            ? { ...sub, name: editingName.toLowerCase() }
            : sub
        )
      );

      // Reset editing state
      setEditingSubcategory(null);
      setEditingName("");

      // Call the callback to refresh parent component
      if (onCategoryChange) {
        onCategoryChange();
      }
    } catch (err) {
      setError(err.message);
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) {
    return <div className="text-white">Loading subcategories...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error: {error}
        <Button onClick={fetchSubcategories} className="ml-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">
          Manage {section} Subcategories
        </h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={newSubcategory}
            onChange={(e) => setNewSubcategory(e.target.value)}
            placeholder="New subcategory name (e.g., abstract, portrait)"
            className="px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-secondary focus:outline-none"
            onKeyPress={(e) => e.key === "Enter" && handleAddSubcategory()}
          />
          <Button
            onClick={handleAddSubcategory}
            className="bg-secondary hover:bg-secondary/80"
            showArrow={false}
          >
            <PlusIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {subcategories.map((subcategory, index) => (
          <div
            key={subcategory.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", index.toString());
              e.dataTransfer.effectAllowed = "move";
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
            }}
            onDrop={(e) => {
              e.preventDefault();
              const draggedIndex = parseInt(
                e.dataTransfer.getData("text/plain")
              );
              if (draggedIndex !== index) {
                const newSubcategories = [...subcategories];
                const draggedItem = newSubcategories[draggedIndex];
                newSubcategories.splice(draggedIndex, 1);
                newSubcategories.splice(index, 0, draggedItem);
                handleReorderSubcategories(newSubcategories);
              }
            }}
            className="flex justify-between items-center bg-gray-700 rounded-lg px-4 py-3 cursor-move hover:bg-gray-600 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center">
                <span className="text-xs text-white">⋮⋮</span>
              </div>
              {editingSubcategory === subcategory.id ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="bg-gray-800 text-white px-2 py-1 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSaveEdit(subcategory.id);
                      } else if (e.key === "Escape") {
                        handleCancelEdit();
                      }
                    }}
                  />
                  <Button
                    onClick={() => handleSaveEdit(subcategory.id)}
                    className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1"
                    showArrow={false}
                  >
                    Save
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    className="bg-gray-600 hover:bg-gray-500 text-xs px-2 py-1"
                    showArrow={false}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                <>
                  <span className="text-white capitalize font-medium">
                    {subcategory.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    Position {index + 1}
                  </span>
                </>
              )}
            </div>
            {editingSubcategory !== subcategory.id && (
              <div className="flex gap-2">
                <Button
                  onClick={() => handleStartEdit(subcategory)}
                  className="bg-gray-600 hover:bg-gray-500 text-sm"
                  showArrow={false}
                >
                  <PencilIcon className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() =>
                    handleDeleteSubcategory(subcategory.id, subcategory.name)
                  }
                  className="bg-red-600 hover:bg-red-700 text-sm"
                  showArrow={false}
                >
                  <TrashIcon className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {subcategories.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No subcategories found. Add your first subcategory above.
        </div>
      )}
    </div>
  );
}
