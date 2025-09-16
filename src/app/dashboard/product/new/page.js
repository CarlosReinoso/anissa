"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/config/supabase";
import Button from "@/components/Button";

export default function NewProduct() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const router = useRouter();

  const [newProduct, setNewProduct] = useState({
    title: "",
    description: "",
    price: "",
    materials: "",
    healing_intention: "",
    is_sold_out: false,
  });

  const handleImageUpload = async (event) => {
    try {
      setUploadingImage(true);
      const files = event.target.files;
      if (!files || files.length === 0) return [];

      const uploadedUrls = [];

      for (const file of files) {
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

        uploadedUrls.push(publicUrl);
      }

      return uploadedUrls;
    } catch (error) {
      console.error("Error uploading images:", error);
      setError(error.message);
      return [];
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Check if any images are selected
      const imageInputs = document.querySelectorAll('input[type="file"]');
      let hasImages = false;
      for (const input of imageInputs) {
        if (input.files.length > 0) {
          hasImages = true;
          break;
        }
      }

      if (!hasImages) {
        throw new Error("Please upload at least one product image");
      }

      // First create the product
      const { data: product, error: productError } = await supabase
        .from("jewellery")
        .insert({
          title: newProduct.title,
          description: newProduct.description,
          price: parseFloat(newProduct.price),
          materials: newProduct.materials,
          healing_intention: newProduct.healing_intention,
          is_sold_out: newProduct.is_sold_out,
        })
        .select()
        .single();

      if (productError) throw productError;

      // If there are images, upload them and create jewellery_images entries
      for (const input of imageInputs) {
        if (input.files.length > 0) {
          const syntheticEvent = { target: { files: input.files } };
          const imageUrls = await handleImageUpload(syntheticEvent);

          // Create entries for each uploaded image
          for (let i = 0; i < imageUrls.length; i++) {
            const { error: imageError } = await supabase
              .from("jewellery_images")
              .insert({
                jewellery_id: product.id,
                image_url: imageUrls[i],
                sort_order: i,
              });

            if (imageError) throw imageError;
          }
        }
      }

      router.push("/dashboard");
    } catch (error) {
      console.error("Error creating product:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Button onClick={() => router.push("/dashboard")} arrowDirection="left">
        Back
      </Button>
      <div className="flex justify-between items-center mb-6 mt-6">
        <h1 className="text-2xl font-bold">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={newProduct.title}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  title: e.target.value,
                })
              }
              required
              className="w-full p-2 border rounded bg-gray-800 border-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={newProduct.description}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  description: e.target.value,
                })
              }
              required
              className="w-full p-2 border rounded bg-gray-800 border-gray-700 h-32"
              style={{ whiteSpace: "pre-wrap" }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  price: e.target.value,
                })
              }
              required
              min="0"
              step="0.01"
              className="w-full p-2 border rounded bg-gray-800 border-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Materials</label>
            <input
              type="text"
              value={newProduct.materials}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  materials: e.target.value,
                })
              }
              required
              className="w-full p-2 border rounded bg-gray-800 border-gray-700"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Healing Intention
            </label>
            <input
              type="text"
              value={newProduct.healing_intention}
              onChange={(e) =>
                setNewProduct({
                  ...newProduct,
                  healing_intention: e.target.value,
                })
              }
              required
              className="w-full p-2 border rounded bg-gray-800 border-gray-700"
            />
          </div>
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={newProduct.is_sold_out}
                onChange={(e) =>
                  setNewProduct({
                    ...newProduct,
                    is_sold_out: e.target.checked,
                  })
                }
                className="rounded bg-gray-800 border-gray-700"
              />
              <span>Sold Out</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Product Images <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              required
              className="w-full p-2 border rounded bg-gray-800 border-gray-700"
            />
            {uploadingImage && <p className="text-sm mt-2">Uploading...</p>}
            <p className="text-sm text-gray-400 mt-1">
              At least one image is required
            </p>
          </div>
        </div>

        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            onClick={() => router.push("/dashboard")}
            variant="secondary"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
