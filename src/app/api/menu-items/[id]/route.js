import { NextResponse } from "next/server";
import { supabase } from "@/config/supabase";
import { generateSlug } from "@/utils/slug";

export async function GET(request, { params }) {
  try {
    const { id } = params;

    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json(
          { error: "Menu item not found" },
          { status: 404 }
        );
      }
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch menu item" },
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
    const { id } = params;
    const body = await request.json();
    const { name, description, is_visible } = body;

    // Build update object
    const updates = {};

    if (name !== undefined) {
      updates.name = name;
      updates.slug = generateSlug(name);
    }

    if (description !== undefined) {
      updates.description = description;
    }

    if (is_visible !== undefined) {
      updates.is_visible = is_visible;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("menu_items")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json(
          { error: "Menu item with this name already exists" },
          { status: 409 }
        );
      }
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to update menu item" },
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
    const { id } = params;

    // Get the menu item details first
    const { data: menuItem, error: menuError } = await supabase
      .from("menu_items")
      .select("name, section")
      .eq("id", id)
      .single();

    if (menuError) {
      console.error("Menu item not found:", menuError);
      return NextResponse.json(
        { error: "Menu item not found" },
        { status: 404 }
      );
    }

    console.log(`Deleting menu item: ${menuItem.name} (${menuItem.section})`);

    // Get all subcategories linked to this menu item
    const { data: subcategories, error: checkError } = await supabase
      .from("subcategories")
      .select("id, name")
      .eq("menu_item_id", id);

    if (checkError) {
      console.error("Database error:", checkError);
      return NextResponse.json(
        { error: "Failed to check menu item dependencies" },
        { status: 500 }
      );
    }

    console.log(`Found ${subcategories?.length || 0} subcategories to delete`);

    // Delete all artwork in all subcategories
    let totalArtworkDeleted = 0;
    for (const subcategory of subcategories || []) {
      console.log(`Processing subcategory: ${subcategory.name}`);

      // Find all artwork in this subcategory
      const { data: artworkList, error: artworkError } = await supabase
        .from("artwork_images")
        .select("id, title, storage_path")
        .or(
          `sub_category.eq.${subcategory.name},subcategory_id.eq.${subcategory.id}`
        )
        .eq("section", menuItem.section);

      if (artworkError) {
        console.error(
          `Error fetching artwork for subcategory ${subcategory.name}:`,
          artworkError
        );
        continue;
      }

      console.log(
        `Found ${artworkList?.length || 0} artwork items in subcategory ${
          subcategory.name
        }`
      );

      // Delete each artwork item
      for (const artwork of artworkList || []) {
        try {
          await deleteArtwork(artwork.id, artwork.storage_path);
          totalArtworkDeleted++;
          console.log(`✓ Deleted artwork: ${artwork.title}`);
        } catch (err) {
          console.error(`✗ Failed to delete artwork ${artwork.id}:`, err);
        }
      }
    }

    // Delete the menu item (CASCADE will handle subcategories)
    const { error: deleteError } = await supabase
      .from("menu_items")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Database error:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete menu item" },
        { status: 500 }
      );
    }

    const subcategoryCount = subcategories?.length || 0;
    console.log(`✓ Successfully deleted menu item: ${menuItem.name}`);
    console.log(
      `✓ Deleted ${subcategoryCount} subcategories and ${totalArtworkDeleted} artwork items`
    );

    return NextResponse.json({
      message: `Menu item "${menuItem.name}" deleted successfully`,
      deletedSubcategories: subcategoryCount,
      deletedArtwork: totalArtworkDeleted,
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
        // Don't throw - we already deleted from database
      }
    } catch (storageErr) {
      console.error("Error deleting from storage:", storageErr);
      // Don't throw - we already deleted from database
    }
  }
}
