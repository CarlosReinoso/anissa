import { supabase } from "@/config/supabase";
import { NextResponse } from "next/server";

// DELETE - Remove artwork from carousel
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const { error } = await supabase
      .from("homepage_carousel")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting carousel item:", error);
      return NextResponse.json(
        { error: "Failed to delete carousel item" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in DELETE /api/homepage-carousel/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH - Update single carousel item
export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { display_order, is_active } = body;

    const updates = {};
    if (display_order !== undefined) updates.display_order = display_order;
    if (is_active !== undefined) updates.is_active = is_active;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("homepage_carousel")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating carousel item:", error);
      return NextResponse.json(
        { error: "Failed to update carousel item" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error("Error in PATCH /api/homepage-carousel/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
