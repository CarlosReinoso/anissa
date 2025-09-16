"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/config/supabase";
import Button from "@/components/Button";
import { use } from "react";
import ProductFormInputs from "@/components/dashboard/ProductFormInputs";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableImage({ image, index, onDelete, isEditing }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: image.image_url });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <div className="relative aspect-square">
        <div {...attributes} {...listeners} className="w-full h-full">
          <Image
            src={image.image_url}
            alt={`Product Image ${index + 1}`}
            fill
            className="object-cover rounded-lg"
          />
        </div>
        {isEditing && (
          <>
            <div className="absolute top-2 left-2 bg-black/50 text-white rounded-full w-6 h-6 flex items-center justify-center">
              {index + 1}
            </div>
            <button
              type="button"
              onClick={() => {
                console.log("Delete clicked");
                onDelete(image.image_url);
              }}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 z-10"
            >
              ×
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function ProductDetail({ params }) {
  const unwrappedParams = use(params);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState(null);
  console.log("🚀 ~ ProductDetail ~ editedProduct:", editedProduct);
  const [uploadingImage, setUploadingImage] = useState(false);
  const router = useRouter();
  const [images, setImages] = useState([]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchProduct();
  }, [unwrappedParams.productId]);

  useEffect(() => {
    if (product?.jewellery_images) {
      setImages(
        product.jewellery_images.sort((a, b) => a.sort_order - b.sort_order)
      );
    }
  }, [product]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from("jewellery")
        .select(
          `
          *,
          jewellery_images (
            image_url,
            sort_order
          )
        `
        )
        .eq("id", unwrappedParams.productId)
        .single();

      if (error) throw error;

      setProduct(data);
      setEditedProduct({
        ...data,
        description: data.description || "", // Ensure description is initialized
      });
    } catch (error) {
      console.error("Error fetching product:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from("jewellery")
        .update({
          title: editedProduct.title,
          description: editedProduct.description,
          price: editedProduct.price,
          materials: editedProduct.materials,
          healing_intention: editedProduct.healing_intention,
          is_sold_out: editedProduct.is_sold_out,
        })
        .eq("id", unwrappedParams.productId);

      if (error) throw error;

      setProduct({
        ...editedProduct,
        jewellery_images: images,
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating product:", error);
      setError(error.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      const { error } = await supabase
        .from("jewellery")
        .delete()
        .eq("id", unwrappedParams.productId);

      if (error) throw error;

      router.push("/dashboard");
    } catch (error) {
      console.error("Error deleting product:", error);
      setError(error.message);
    }
  };

  const handleDeleteImage = async (imageUrl) => {
    if (!imageUrl) {
      console.error("No image URL provided for deletion");
      setError("No image URL provided for deletion");
      return;
    }

    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      console.log("Attempting to delete image with URL:", imageUrl);

      const { error } = await supabase
        .from("jewellery_images")
        .delete()
        .eq("image_url", imageUrl);

      if (error) {
        console.error("Supabase error details:", error);
        throw error;
      }

      console.log("Image deleted successfully, refreshing product data...");
      // Refresh product data
      await fetchProduct();
    } catch (error) {
      console.error("Error deleting image:", error);
      setError(error.message || "Failed to delete image. Please try again.");
    }
  };

  const handleImageUpload = async (event) => {
    try {
      setUploadingImage(true);
      const files = event.target.files;
      if (!files || files.length === 0) return;

      // Get the highest current sort order
      const highestSortOrder =
        images.length > 0
          ? Math.max(...images.map((img) => img.sort_order))
          : -1;

      // Process each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        // Upload image to Supabase Storage
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError, data } = await supabase.storage
          .from("images")
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get the public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("images").getPublicUrl(fileName);

        // Add image to jewellery_images table with incremented sort order
        const { error: insertError } = await supabase
          .from("jewellery_images")
          .insert({
            jewellery_id: unwrappedParams.productId,
            image_url: publicUrl,
            sort_order: highestSortOrder + i + 1,
          });

        if (insertError) throw insertError;
      }

      // Refresh product data after all uploads are complete
      await fetchProduct();
    } catch (error) {
      console.error("Error uploading images:", error);
      setError(error.message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      try {
        const oldIndex = images.findIndex(
          (item) => item.image_url === active.id
        );
        const newIndex = images.findIndex((item) => item.image_url === over.id);

        const newItems = arrayMove(images, oldIndex, newIndex);

        // Update the local state immediately for smooth UI
        setImages(newItems);

        // Update sort order in database for all items
        const updatePromises = newItems.map((item, index) =>
          supabase
            .from("jewellery_images")
            .update({ sort_order: index })
            .eq("image_url", item.image_url)
        );

        // Wait for all updates to complete
        await Promise.all(updatePromises);
      } catch (error) {
        console.error("Error updating sort order:", error);
        setError("Failed to save image order. Please try again.");
        // Refresh the product data to ensure UI is in sync with database
        await fetchProduct();
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Button onClick={() => router.push("/dashboard")} arrowDirection="left">
        Back
      </Button>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {isEditing ? "Edit Product" : "Product Details"}
        </h1>
        <div className="space-x-4">
          {isEditing ? (
            <>
              <Button onClick={handleSave}>Save Changes</Button>
              <Button onClick={() => setIsEditing(false)} variant="secondary">
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button onClick={handleEdit}>Edit Product</Button>
              <Button onClick={handleDelete} variant="destructive">
                Delete Product
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          {isEditing ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={images.map((img) => img.image_url)}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid grid-cols-2 gap-4">
                  {images.map((image, index) => (
                    <SortableImage
                      key={image.image_url}
                      image={image}
                      index={index}
                      onDelete={handleDeleteImage}
                      isEditing={isEditing}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {images.map((image, index) => (
                <div key={index} className="relative aspect-square">
                  <Image
                    src={image.image_url}
                    alt={`${product.title} - Image ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          )}

          {isEditing && (
            <div className="mt-4">
              <label className="block text-sm font-medium mb-2">
                Add New Images
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={uploadingImage}
                className="w-full p-2 border rounded bg-gray-800 border-gray-700"
              />
              {uploadingImage && <p className="text-sm mt-2">Uploading...</p>}
            </div>
          )}
        </div>

        <div className="space-y-6">
          {isEditing ? (
            <ProductFormInputs
              editedProduct={editedProduct}
              setEditedProduct={setEditedProduct}
            />
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{product.title}</h2>
              <p className="text-2xl font-bold">£{product.price}</p>
              <div>
                <h3 className="font-medium mb-1">Description</h3>
                <p className="whitespace-pre-wrap">{product.description}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Materials</h3>
                <p>{product.materials}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Healing Intention</h3>
                <p>{product.healing_intention}</p>
              </div>
              {product.is_sold_out && (
                <span className="inline-block bg-red-100 text-red-800 text-sm px-3 py-1 rounded">
                  Sold Out
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
