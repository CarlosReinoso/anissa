import { supabase } from "@/config/supabase";
import { NextResponse } from "next/server";

// GET - Fetch all homepage carousel images
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");

    let query = supabase
      .from("homepage_carousel")
      .select(
        `
        *,
        artwork:artwork_images!artwork_id (
          id,
          title,
          description,
          storage_path,
          section,
          created_at
        )
      `
      )
      .eq("is_active", true)
      .order("display_order", { ascending: true });

    if (section) {
      query = query.eq("section", section);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching homepage carousel:", error);
      return NextResponse.json(
        { error: "Failed to fetch carousel images" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error in GET /api/homepage-carousel:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Add artwork to carousel
export async function POST(request) {
  try {
    const body = await request.json();
    const { section, artwork_id, display_order } = body;

    if (!section || !artwork_id || display_order === undefined) {
      return NextResponse.json(
        { error: "Section, artwork_id, and display_order are required" },
        { status: 400 }
      );
    }

    // Validate section
    if (!["graphics", "tattoos"].includes(section)) {
      return NextResponse.json(
        { error: "Section must be 'graphics' or 'tattoos'" },
        { status: 400 }
      );
    }

    // Check if artwork exists and belongs to the correct section
    const { data: artwork, error: artworkError } = await supabase
      .from("artwork_images")
      .select("id, section")
      .eq("id", artwork_id)
      .single();

    if (artworkError || !artwork) {
      return NextResponse.json({ error: "Artwork not found" }, { status: 404 });
    }

    if (artwork.section !== section) {
      return NextResponse.json(
        {
          error: `Artwork belongs to ${artwork.section} section, not ${section}`,
        },
        { status: 400 }
      );
    }

    // Insert carousel item
    const { data, error } = await supabase
      .from("homepage_carousel")
      .insert([
        {
          section,
          artwork_id,
          display_order,
          is_active: true,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error adding to carousel:", error);
      if (error.code === "23505") {
        // Unique constraint violation
        return NextResponse.json(
          {
            error:
              "This artwork is already in the carousel or the display order is taken",
          },
          { status: 409 }
        );
      }
      return NextResponse.json(
        { error: "Failed to add to carousel" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/homepage-carousel:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Update carousel items (bulk reorder)
export async function PUT(request) {
  try {
    const body = await request.json();
    const { items } = body; // Array of {id, display_order}

    if (!items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: "Items array is required" },
        { status: 400 }
      );
    }

    // Strategy: First set all items to negative display_order to avoid conflicts,
    // then update to the correct positive values

    // Step 1: Set all to temporary negative values
    const tempUpdates = items.map((item, index) =>
      supabase
        .from("homepage_carousel")
        .update({ display_order: -(index + 1000) })
        .eq("id", item.id)
    );

    const tempResults = await Promise.all(tempUpdates);

    const hasTempError = tempResults.some((result) => result.error);
    if (hasTempError) {
      const errors = tempResults.filter((r) => r.error).map((r) => r.error);
      console.error("Error in temp updates:", errors);
      return NextResponse.json(
        { error: "Failed to prepare reordering", details: errors[0] },
        { status: 500 }
      );
    }

    // Step 2: Update to final correct values
    const finalUpdates = items.map((item) =>
      supabase
        .from("homepage_carousel")
        .update({ display_order: item.display_order })
        .eq("id", item.id)
    );

    const finalResults = await Promise.all(finalUpdates);

    const hasFinalError = finalResults.some((result) => result.error);
    if (hasFinalError) {
      const errors = finalResults.filter((r) => r.error).map((r) => r.error);
      console.error("Error in final updates:", errors);
      return NextResponse.json(
        { error: "Failed to update display order", details: errors[0] },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in PUT /api/homepage-carousel:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 }
    );
  }
}
