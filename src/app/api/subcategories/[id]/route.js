import { NextResponse } from "next/server";
import { supabase } from "@/config/supabase";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Check if name already exists (excluding current subcategory)
    const { data: existingSubcategory, error: checkError } = await supabase
      .from("subcategories")
      .select("id")
      .eq("name", name.toLowerCase())
      .neq("id", id)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Database error:", checkError);
      return NextResponse.json(
        { error: "Failed to check subcategory name" },
        { status: 500 }
      );
    }

    if (existingSubcategory) {
      return NextResponse.json(
        { error: "Subcategory name already exists" },
        { status: 409 }
      );
    }

    // Get the current subcategory to find its section
    const { data: currentSubcategory, error: getError } = await supabase
      .from("subcategories")
      .select("name, section")
      .eq("id", id)
      .single();

    if (getError) {
      console.error("Database error getting subcategory:", getError);
      return NextResponse.json(
        { error: "Failed to get subcategory" },
        { status: 500 }
      );
    }

    // Update the subcategory
    const { data, error } = await supabase
      .from("subcategories")
      .update({ name: name.toLowerCase() })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to update subcategory" },
        { status: 500 }
      );
    }

    // Update all artwork_images that reference this subcategory
    const { error: artworkError } = await supabase
      .from("artwork_images")
      .update({ sub_category: name.toLowerCase() })
      .eq("sub_category", currentSubcategory.name)
      .eq("category", currentSubcategory.section);

    if (artworkError) {
      console.error("Database error updating artwork:", artworkError);
      // Note: We don't return an error here because the subcategory was already updated
      // The artwork update is a secondary operation
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

    // First, get the subcategory details
    const { data: subcategory, error: fetchError } = await supabase
      .from("subcategories")
      .select("name, section")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error("Error fetching subcategory:", fetchError);
      return NextResponse.json(
        { error: "Subcategory not found" },
        { status: 404 }
      );
    }

    console.log(
      `Deleting subcategory: ${subcategory.name} (${subcategory.section})`
    );

    // Find all artwork in this subcategory using both old text field and new FK
    // This ensures we catch artwork using either the old or new structure
    const { data: artworkList, error: artworkError } = await supabase
      .from("artwork_images")
      .select("id, title, storage_path")
      .or(`sub_category.eq.${subcategory.name},subcategory_id.eq.${id}`)
      .eq("section", subcategory.section);

    if (artworkError) {
      console.error("Error fetching artwork:", artworkError);
      return NextResponse.json(
        { error: "Failed to fetch related artwork" },
        { status: 500 }
      );
    }

    console.log(`Found ${artworkList?.length || 0} artwork items to delete`);

    // Delete each artwork item using the artwork DELETE helper
    const deletionResults = [];
    for (const artwork of artworkList || []) {
      console.log(`Deleting artwork: ${artwork.title} (ID: ${artwork.id})`);

      try {
        // Use the deleteArtwork helper function defined below
        await deleteArtwork(artwork.id, artwork.storage_path);
        deletionResults.push({ id: artwork.id, success: true });
        console.log(`✓ Successfully deleted artwork: ${artwork.title}`);
      } catch (err) {
        console.error(`✗ Failed to delete artwork ${artwork.id}:`, err);
        deletionResults.push({
          id: artwork.id,
          success: false,
          error: err.message,
        });
        // Continue with other artwork even if one fails
      }
    }

    // Finally, delete the subcategory itself
    const { error } = await supabase
      .from("subcategories")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Database error deleting subcategory:", error);
      return NextResponse.json(
        { error: "Failed to delete subcategory" },
        { status: 500 }
      );
    }

    const successCount = deletionResults.filter((r) => r.success).length;
    console.log(`✓ Successfully deleted subcategory: ${subcategory.name}`);
    console.log(
      `✓ Deleted ${successCount}/${artworkList?.length || 0} artwork items`
    );

    return NextResponse.json({
      message: `Subcategory "${subcategory.name}" and ${successCount} associated artwork deleted successfully`,
      deletedArtwork: successCount,
      totalArtwork: artworkList?.length || 0,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper function to delete artwork (same logic as /api/artworks/[id])
async function deleteArtwork(artworkId, storagePath) {
  // Delete from database
  const { error: deleteError } = await supabase
    .from("artwork_images")
    .delete()
    .eq("id", artworkId);

  if (deleteError) {
    throw new Error(`Failed to delete from database: ${deleteError.message}`);
  }

  // Delete from storage if storage_path exists
  if (storagePath) {
    try {
      // Extract the file path from the storage URL
      const url = new URL(storagePath);
      const pathParts = url.pathname
        .split("/")
        .filter((part) => part.length > 0);

      // Find the bucket name and file path
      let bucketName = "images";
      let filePath = "";

      const publicIndex = pathParts.findIndex((part) => part === "public");
      const signIndex = pathParts.findIndex((part) => part === "sign");
      const imagesIndex = pathParts.findIndex((part) => part === "images");

      if (publicIndex !== -1 && publicIndex < pathParts.length - 1) {
        bucketName = pathParts[publicIndex + 1];
        filePath = pathParts.slice(publicIndex + 2).join("/");
      } else if (signIndex !== -1 && signIndex < pathParts.length - 1) {
        bucketName = pathParts[signIndex + 1];
        filePath = pathParts.slice(signIndex + 2).join("/");
      } else if (imagesIndex !== -1) {
        bucketName = "images";
        filePath = pathParts.slice(imagesIndex + 1).join("/");
      } else {
        filePath = pathParts[pathParts.length - 1];
      }

      const { error: storageError } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);

      if (storageError) {
        console.error("Storage deletion error:", storageError);
        throw new Error(
          `Failed to delete from storage: ${storageError.message}`
        );
      }
    } catch (storageErr) {
      console.error("Error deleting from storage:", storageErr);
      // Don't throw here - we already deleted from database
    }
  }
}
