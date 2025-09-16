"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ClassFormInputs from "@/components/dashboard/ClassFormInputs";
import { useClasses } from "@/app/hooks/useClasses";
import Button from "@/components/Button";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function NewClassPage() {
  const router = useRouter();
  const { addClass } = useClasses();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [classData, setClassData] = useState({
    title: "",
    description: "",
    class_type: "",
    day: "",
    time: "",
    location: "",
    booking_url: "",
    image: null,
  });

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      await addClass(formData);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating class:", error);
      alert("Error creating class. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <h1 className="text-3xl font-bold text-white">Add New Class</h1>
        <p className="text-gray-400 mt-2">
          Create a new class for your timetable
        </p>
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
