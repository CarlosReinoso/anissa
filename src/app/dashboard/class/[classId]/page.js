"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ClassFormInputs from "@/components/dashboard/ClassFormInputs";
import { useClasses } from "@/app/hooks/useClasses";
import Button from "@/components/Button";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function EditClassPage() {
  const router = useRouter();
  const params = useParams();
  const { updateClass, classes, addClassImage, deleteClassImage } =
    useClasses();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (classes.length > 0) {
      const classToEdit = classes.find((c) => c.id === params.classId);
      if (classToEdit) {
        setClassData(classToEdit);
      }
      setLoading(false);
    }
  }, [classes, params.classId]);

  const handleSubmit = async (formData, imageUrl) => {
    try {
      setIsSubmitting(true);

      // Filter to only include valid class table columns
      const validClassColumns = [
        "title",
        "description",
        "class_type",
        "day",
        "time",
        "location",
        "booking_url",
        "is_active",
      ];
      const classTableData = {};
      validClassColumns.forEach((column) => {
        if (formData.hasOwnProperty(column)) {
          classTableData[column] = formData[column];
        }
      });

      // Update the class data with only the actual class table columns
      await updateClass(params.classId, classTableData);

      // If there's a new image, handle it separately
      if (imageUrl && imageUrl !== classData?.image) {
        // Delete existing images for this class
        if (classData?.class_images) {
          for (const img of classData.class_images) {
            await deleteClassImage(img.id);
          }
        }

        // Add the new image
        await addClassImage(params.classId, imageUrl, 0);
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Error updating class:", error);
      alert("Error updating class. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!classData) {
    return (
      <div className="text-center py-20">
        <div className="text-red-500">Class not found</div>
        <Button onClick={() => router.push("/dashboard")} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Button
          onClick={() => router.back()}
          variant="secondary"
          className="mb-4"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <h1 className="text-3xl font-bold text-white">Edit Class</h1>
        <p className="text-gray-400 mt-2">Update the class information</p>
      </div>

      <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
        <ClassFormInputs
          classData={classData}
          onChange={setClassData}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
