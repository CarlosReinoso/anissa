"use client";

import { useState, useEffect } from "react";
import Button from "@/components/Button";
import {
  PlusIcon,
  TrashIcon,
  PencilIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/solid";

export default function MenuManager({ section, onMenuChange }) {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedMenus, setExpandedMenus] = useState({});
  const [editingMenu, setEditingMenu] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [newMenuItem, setNewMenuItem] = useState({ name: "", description: "" });
  const [newSubcategory, setNewSubcategory] = useState({});

  useEffect(() => {
    fetchMenuItems();
  }, [section]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/menu-items?section=${section}&includeSubcategories=true`
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to fetch menu items");
      }

      setMenuItems(result.data);
      
      // Auto-expand all menus on load
      const expanded = {};
      result.data.forEach((item) => {
        expanded[item.id] = true;
      });
      setExpandedMenus(expanded);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMenuItem = async () => {
    if (!newMenuItem.name.trim()) return;

    try {
      const response = await fetch("/api/menu-items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newMenuItem.name,
          description: newMenuItem.description,
          section: section,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create menu item");
      }

      // Add to local state with empty subcategories array
      setMenuItems((prev) => [...prev, { ...result.data, subcategories: [] }]);
      setNewMenuItem({ name: "", description: "" });
      setExpandedMenus((prev) => ({ ...prev, [result.data.id]: true }));

      if (onMenuChange) {
        onMenuChange();
      }
    } catch (err) {
      setError(err.message);
      alert(`Error: ${err.message}`);
    }
  };

  const handleDeleteMenuItem = async (menuId, menuName) => {
    const menuItem = menuItems.find((m) => m.id === menuId);
    const subcategoryCount = menuItem?.subcategories?.length || 0;

    const confirmMessage = `Are you sure you want to delete the menu item "${menuName}"?\n\n${
      subcategoryCount > 0
        ? `This will also delete ${subcategoryCount} subcategorie(s) and ALL IMAGES within them.\n\n`
        : ""
    }This action cannot be undone!`;

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      const response = await fetch(`/api/menu-items/${menuId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete menu item");
      }

      setMenuItems((prev) => prev.filter((item) => item.id !== menuId));

      if (onMenuChange) {
        onMenuChange();
      }

      alert(result.message || "Menu item deleted successfully.");
    } catch (err) {
      setError(err.message);
      alert(`Error: ${err.message}`);
    }
  };

  const handleToggleVisibility = async (menuId, currentVisibility) => {
    try {
      const response = await fetch(`/api/menu-items/${menuId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_visible: !currentVisibility,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update visibility");
      }

      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === menuId
            ? { ...item, is_visible: !currentVisibility }
            : item
        )
      );

      if (onMenuChange) {
        onMenuChange();
      }
    } catch (err) {
      setError(err.message);
      alert(`Error: ${err.message}`);
    }
  };

  const handleReorderMenuItems = async (reorderedMenuItems) => {
    try {
      const updates = reorderedMenuItems.map((item, index) => ({
        id: item.id,
        sort_order: index,
      }));

      const response = await fetch("/api/menu-items", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updates }),
      });

      if (!response.ok) {
        throw new Error("Failed to update menu item order");
      }

      setMenuItems(reorderedMenuItems);

      if (onMenuChange) {
        onMenuChange();
      }
    } catch (err) {
      console.error("Error reordering menu items:", err);
      alert("Error reordering menu items. Please try again.");
    }
  };

  const handleStartEdit = (menuItem) => {
    setEditingMenu(menuItem.id);
    setEditingName(menuItem.name);
    setEditingDescription(menuItem.description || "");
  };

  const handleCancelEdit = () => {
    setEditingMenu(null);
    setEditingName("");
    setEditingDescription("");
  };

  const handleSaveEdit = async (menuId) => {
    if (!editingName.trim()) return;

    try {
      const response = await fetch(`/api/menu-items/${menuId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editingName,
          description: editingDescription,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update menu item");
      }

      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === menuId
            ? {
                ...item,
                name: editingName,
                description: editingDescription,
                slug: result.data.slug,
              }
            : item
        )
      );

      handleCancelEdit();

      if (onMenuChange) {
        onMenuChange();
      }
    } catch (err) {
      setError(err.message);
      alert(`Error: ${err.message}`);
    }
  };

  // Subcategory management
  const handleAddSubcategory = async (menuItemId) => {
    const subcategoryName = newSubcategory[menuItemId];
    if (!subcategoryName?.trim()) return;

    try {
      const response = await fetch("/api/subcategories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: subcategoryName.toLowerCase(),
          section: section,
          menu_item_id: menuItemId,
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

      // Update local state
      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === menuItemId
            ? {
                ...item,
                subcategories: [...(item.subcategories || []), result.data],
              }
            : item
        )
      );

      setNewSubcategory((prev) => ({ ...prev, [menuItemId]: "" }));

      if (onMenuChange) {
        onMenuChange();
      }
    } catch (err) {
      setError(err.message);
      alert(`Error: ${err.message}`);
    }
  };

  const handleDeleteSubcategory = async (subcategoryId, subcategoryName, menuItemId) => {
    const confirmMessage = `Are you sure you want to delete the subcategory "${subcategoryName}"?\n\nThis will DELETE ALL IMAGES in this subcategory.\n\nThis action cannot be undone!`;

    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      const response = await fetch(`/api/subcategories/${subcategoryId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to delete subcategory");
      }

      // Update local state
      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === menuItemId
            ? {
                ...item,
                subcategories: item.subcategories.filter(
                  (sub) => sub.id !== subcategoryId
                ),
              }
            : item
        )
      );

      if (onMenuChange) {
        onMenuChange();
      }

      alert(result.message || "Subcategory deleted successfully.");
    } catch (err) {
      setError(err.message);
      alert(`Error: ${err.message}`);
    }
  };

  const handleReorderSubcategories = async (menuItemId, reorderedSubcategories) => {
    try {
      const updates = reorderedSubcategories.map((sub, index) => ({
        id: sub.id,
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
      setMenuItems((prev) =>
        prev.map((item) =>
          item.id === menuItemId
            ? { ...item, subcategories: reorderedSubcategories }
            : item
        )
      );

      if (onMenuChange) {
        onMenuChange();
      }
    } catch (err) {
      console.error("Error reordering subcategories:", err);
      alert("Error reordering subcategories. Please try again.");
    }
  };

  const toggleExpanded = (menuId) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };

  if (loading) {
    return <div className="text-white">Loading menu structure...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error: {error}
        <Button onClick={fetchMenuItems} className="ml-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white">
          Manage {section} Menu Structure
        </h2>
      </div>

      {/* Add New Menu Item */}
      <div className="mb-6 bg-gray-700 rounded-lg p-4">
        <h3 className="text-white font-medium mb-3">Add New Menu Item</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={newMenuItem.name}
            onChange={(e) =>
              setNewMenuItem((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Menu item name (e.g., Illustrations, Sketches)"
            className="flex-1 px-3 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:border-secondary focus:outline-none"
            onKeyPress={(e) => e.key === "Enter" && handleAddMenuItem()}
          />
          <input
            type="text"
            value={newMenuItem.description}
            onChange={(e) =>
              setNewMenuItem((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            placeholder="Description (optional)"
            className="flex-1 px-3 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:border-secondary focus:outline-none"
            onKeyPress={(e) => e.key === "Enter" && handleAddMenuItem()}
          />
          <Button
            onClick={handleAddMenuItem}
            className="bg-secondary hover:bg-secondary/80"
            showArrow={false}
          >
            <PlusIcon className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Menu Items List */}
      <div className="space-y-4">
        {menuItems.map((menuItem, index) => (
          <div
            key={menuItem.id}
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
                const newMenuItems = [...menuItems];
                const draggedItem = newMenuItems[draggedIndex];
                newMenuItems.splice(draggedIndex, 1);
                newMenuItems.splice(index, 0, draggedItem);
                handleReorderMenuItems(newMenuItems);
              }
            }}
            className="bg-gray-700 rounded-lg overflow-hidden"
          >
            {/* Menu Item Header */}
            <div className="flex justify-between items-center px-4 py-3 cursor-move hover:bg-gray-600 transition-colors">
              <div className="flex items-center space-x-3 flex-1">
                <button
                  onClick={() => toggleExpanded(menuItem.id)}
                  className="text-white hover:text-secondary transition-colors"
                >
                  {expandedMenus[menuItem.id] ? (
                    <ChevronDownIcon className="w-5 h-5" />
                  ) : (
                    <ChevronRightIcon className="w-5 h-5" />
                  )}
                </button>
                <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center">
                  <span className="text-xs text-white">⋮⋮</span>
                </div>
                {editingMenu === menuItem.id ? (
                  <div className="flex items-center space-x-2 flex-1">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="bg-gray-800 text-white px-2 py-1 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSaveEdit(menuItem.id);
                        } else if (e.key === "Escape") {
                          handleCancelEdit();
                        }
                      }}
                    />
                    <input
                      type="text"
                      value={editingDescription}
                      onChange={(e) => setEditingDescription(e.target.value)}
                      placeholder="Description"
                      className="bg-gray-800 text-white px-2 py-1 rounded border border-gray-600 focus:border-blue-500 focus:outline-none flex-1"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSaveEdit(menuItem.id);
                        } else if (e.key === "Escape") {
                          handleCancelEdit();
                        }
                      }}
                    />
                    <Button
                      onClick={() => handleSaveEdit(menuItem.id)}
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
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">
                        {menuItem.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        Position {index + 1}
                      </span>
                      {!menuItem.is_visible && (
                        <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded">
                          Hidden
                        </span>
                      )}
                      <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">
                        {menuItem.subcategories?.length || 0} subcategories
                      </span>
                    </div>
                    {menuItem.description && (
                      <p className="text-xs text-gray-400 mt-1">
                        {menuItem.description}
                      </p>
                    )}
                  </div>
                )}
              </div>
              {editingMenu !== menuItem.id && (
                <div className="flex gap-2">
                  <Button
                    onClick={() =>
                      handleToggleVisibility(menuItem.id, menuItem.is_visible)
                    }
                    className="bg-gray-600 hover:bg-gray-500 text-sm"
                    showArrow={false}
                    title={
                      menuItem.is_visible ? "Hide from menu" : "Show in menu"
                    }
                  >
                    {menuItem.is_visible ? (
                      <EyeIcon className="w-4 h-4" />
                    ) : (
                      <EyeSlashIcon className="w-4 h-4" />
                    )}
                  </Button>
                  <Button
                    onClick={() => handleStartEdit(menuItem)}
                    className="bg-gray-600 hover:bg-gray-500 text-sm"
                    showArrow={false}
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() =>
                      handleDeleteMenuItem(menuItem.id, menuItem.name)
                    }
                    className="bg-red-600 hover:bg-red-700 text-sm"
                    showArrow={false}
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Subcategories */}
            {expandedMenus[menuItem.id] && (
              <div className="bg-gray-800 px-4 py-3 border-t border-gray-600">
                <div className="mb-3">
                  <h4 className="text-sm text-gray-300 font-medium mb-2">
                    Subcategories for {menuItem.name}
                  </h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSubcategory[menuItem.id] || ""}
                      onChange={(e) =>
                        setNewSubcategory((prev) => ({
                          ...prev,
                          [menuItem.id]: e.target.value,
                        }))
                      }
                      placeholder="Add subcategory (e.g., abstract, portrait)"
                      className="flex-1 px-3 py-1.5 bg-gray-700 text-white text-sm rounded border border-gray-600 focus:border-secondary focus:outline-none"
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleAddSubcategory(menuItem.id)
                      }
                    />
                    <Button
                      onClick={() => handleAddSubcategory(menuItem.id)}
                      className="bg-secondary hover:bg-secondary/80 text-sm"
                      showArrow={false}
                    >
                      <PlusIcon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Subcategory List */}
                <div className="space-y-1">
                  {(menuItem.subcategories || []).map((subcategory, subIndex) => (
                    <div
                      key={subcategory.id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData("subIndex", subIndex.toString());
                        e.dataTransfer.setData("menuId", menuItem.id);
                        e.dataTransfer.effectAllowed = "move";
                        e.stopPropagation();
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        e.dataTransfer.dropEffect = "move";
                        e.stopPropagation();
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const draggedSubIndex = parseInt(
                          e.dataTransfer.getData("subIndex")
                        );
                        const draggedMenuId = e.dataTransfer.getData("menuId");
                        
                        if (draggedMenuId === menuItem.id && draggedSubIndex !== subIndex) {
                          const newSubcategories = [...menuItem.subcategories];
                          const draggedItem = newSubcategories[draggedSubIndex];
                          newSubcategories.splice(draggedSubIndex, 1);
                          newSubcategories.splice(subIndex, 0, draggedItem);
                          handleReorderSubcategories(menuItem.id, newSubcategories);
                        }
                      }}
                      className="flex justify-between items-center bg-gray-700 rounded px-3 py-2 cursor-move hover:bg-gray-600 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-gray-600 rounded flex items-center justify-center">
                          <span className="text-xs text-white">⋮</span>
                        </div>
                        <span className="text-white text-sm capitalize">
                          {subcategory.name}
                        </span>
                        <span className="text-xs text-gray-400">
                          #{subIndex + 1}
                        </span>
                      </div>
                      <Button
                        onClick={() =>
                          handleDeleteSubcategory(
                            subcategory.id,
                            subcategory.name,
                            menuItem.id
                          )
                        }
                        className="bg-red-600 hover:bg-red-700 text-xs px-2 py-1"
                        showArrow={false}
                      >
                        <TrashIcon className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                  {(!menuItem.subcategories ||
                    menuItem.subcategories.length === 0) && (
                    <div className="text-center py-4 text-gray-400 text-sm">
                      No subcategories yet. Add your first one above.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {menuItems.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No menu items found. Add your first menu item above.
        </div>
      )}
    </div>
  );
}

