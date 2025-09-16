"use client";

import { useState } from "react";
import ClassesGrid from "@/components/dashboard/admin/ClassesGrid";
import NoResults from "@/components/dashboard/admin/NoResults";
import { useClasses } from "@/app/hooks/useClasses";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import Button from "@/components/Button";
import { PlusIcon } from "@heroicons/react/24/solid";

export default function DashboardPage() {
  const { classes, loading, error, deleteClass } = useClasses();
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Filter classes based on search query
  const filteredClasses = classes.filter((classItem) => {
    if (!searchQuery) return true;

    const lowerQuery = searchQuery.toLowerCase();
    return (
      classItem.title.toLowerCase().includes(lowerQuery) ||
      classItem.description?.toLowerCase().includes(lowerQuery) ||
      classItem.location?.toLowerCase().includes(lowerQuery) ||
      classItem.day?.toLowerCase().includes(lowerQuery)
    );
  });

  const handleEdit = (classItem) => {
    router.push(`/dashboard/class/${classItem.id}`);
  };

  const handleDelete = async (classId) => {
    if (confirm("Are you sure you want to delete this class?")) {
      try {
        await deleteClass(classId);
      } catch (error) {
        console.error("Error deleting class:", error);
        alert("Error deleting class. Please try again.");
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-red-500 text-center py-20">
            Error loading classes. Please try again later.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Class Timetable</h1>
          <Button
            onClick={() => router.push("/dashboard/class/new")}
            showArrow={false}
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Class
          </Button>
        </div>

        <div className="mb-6">
          <div className="space-y-1">
            <label
              htmlFor="search"
              className="block text-sm font-medium text-white"
            >
              Search Classes
            </label>
            <input
              id="search"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, description, location, or day..."
              className="w-full px-3 py-2 bg-black border border-secondary rounded-md text-white focus:outline-none focus:border-secondary"
            />
          </div>
        </div>

        <ClassesGrid
          classes={filteredClasses}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {filteredClasses.length === 0 && (
          <NoResults
            message="No classes found"
            description="Try adjusting your search or add a new class to get started."
          />
        )}
      </div>
    </div>
  );
}
