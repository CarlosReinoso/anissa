import { NextResponse } from "next/server";
import { supabase } from "@/config/supabase";

export async function PUT(request) {
  try {
    const { updates } = await request.json();

    if (!updates || !Array.isArray(updates)) {
      return NextResponse.json(
        { error: "Updates array is required" },
        { status: 400 }
      );
    }

    // Update sort orders for all items
    const promises = updates.map(({ id, sort_order }) =>
      supabase.from("artwork_images").update({ sort_order }).eq("id", id)
    );

    const results = await Promise.all(promises);

    // Check for any errors
    const errors = results.filter((result) => result.error);
    if (errors.length > 0) {
      console.error("Database errors:", errors);
      return NextResponse.json(
        { error: "Failed to update some artwork sort orders" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Sort orders updated successfully",
      updated: updates.length,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
