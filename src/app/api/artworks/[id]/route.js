import { NextResponse } from "next/server";
import { supabase } from "@/config/supabase";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from("artwork_images")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Artwork not found" },
          { status: 404 }
        );
      }
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch artwork" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { data, error } = await supabase
      .from("artwork_images")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Artwork not found" },
          { status: 404 }
        );
      }
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to update artwork" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    // First, get the artwork to find the storage path
    const { data: artwork, error: fetchError } = await supabase
      .from("artwork_images")
      .select("storage_path")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Database error fetching artwork:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch artwork" },
        { status: 500 }
      );
    }

    // Delete from database
    console.log("Deleting artwork from database with ID:", id);
    console.log("Artwork data before deletion:", artwork);

    const { error, count, data } = await supabase
      .from("artwork_images")
      .delete()
      .eq("id", id)
      .select("*");

    if (error) {
      console.error("Database deletion error:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: "Failed to delete artwork from database" },
        { status: 500 }
      );
    }

    console.log("Database deletion result - count:", count);
    console.log("Database deletion result - data:", data);
    console.log(
      "Successfully deleted artwork from database. Deleted count:",
      count
    );

    // Verify the record was actually deleted
    const { data: verifyData, error: verifyError } = await supabase
      .from("artwork_images")
      .select("id")
      .eq("id", id)
      .single();

    if (verifyData) {
      console.error(
        "WARNING: Artwork record still exists in database after deletion!"
      );
    } else if (verifyError && verifyError.code === "PGRST116") {
      console.log(
        "✓ Confirmed: Artwork record successfully deleted from database"
      );
    } else {
      console.error("Error verifying deletion:", verifyError);
    }

    // Delete the image file from storage if it exists
    if (artwork.storage_path) {
      try {
        console.log("Attempting to delete storage file:", artwork.storage_path);

        // Extract the file path from the storage URL
        const url = new URL(artwork.storage_path);
        const pathParts = url.pathname
          .split("/")
          .filter((part) => part.length > 0);

        console.log("URL pathname:", url.pathname);
        console.log("Path parts:", pathParts);

        // Find the bucket name and file path
        let bucketName = "images"; // default bucket
        let filePath = "";

        // Handle different URL formats:
        // Format 1: /storage/v1/object/public/images/filename.webp
        // Format 2: /storage/v1/object/sign/images/filename.webp
        // Format 3: /images/filename.webp (direct path)

        const publicIndex = pathParts.findIndex((part) => part === "public");
        const signIndex = pathParts.findIndex((part) => part === "sign");
        const imagesIndex = pathParts.findIndex((part) => part === "images");

        if (publicIndex !== -1 && publicIndex < pathParts.length - 1) {
          // Format 1: /storage/v1/object/public/images/filename.webp
          bucketName = pathParts[publicIndex + 1];
          filePath = pathParts.slice(publicIndex + 2).join("/");
        } else if (signIndex !== -1 && signIndex < pathParts.length - 1) {
          // Format 2: /storage/v1/object/sign/images/filename.webp
          bucketName = pathParts[signIndex + 1];
          filePath = pathParts.slice(signIndex + 2).join("/");
        } else if (imagesIndex !== -1) {
          // Format 3: /images/filename.webp
          bucketName = "images";
          filePath = pathParts.slice(imagesIndex + 1).join("/");
        } else {
          // Fallback: assume the last part is the filename
          filePath = pathParts[pathParts.length - 1];
        }

        console.log("Bucket name:", bucketName);
        console.log("File path:", filePath);

        const { error: storageError } = await supabase.storage
          .from(bucketName)
          .remove([filePath]);

        if (storageError) {
          console.error("Storage deletion error:", storageError);
          console.error(
            "Failed to delete file:",
            filePath,
            "from bucket:",
            bucketName
          );
        } else {
          console.log("Successfully deleted file from storage:", filePath);
        }
      } catch (storageErr) {
        console.error("Error deleting from storage:", storageErr);
        console.error("Storage path was:", artwork.storage_path);
      }
    }

    return NextResponse.json({ message: "Artwork deleted successfully" });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
