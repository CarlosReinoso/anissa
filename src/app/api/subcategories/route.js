import { NextResponse } from "next/server";
import { supabase } from "@/config/supabase";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");
    const name = searchParams.get("name");

    let query = supabase
      .from("subcategories")
      .select("id, name, sort_order")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (section) {
      query = query.eq("section", section);
    }

    if (name) {
      query = query.eq("name", name.toLowerCase());
    }

    const { data, error } = await query;

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch subcategories" },
        { status: 500 }
      );
    }

    // Always return full data objects with id, name, and sort_order
    return NextResponse.json({ data });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, section } = body;

    // Validate required fields
    if (!name || !section) {
      return NextResponse.json(
        { error: "Name and section are required" },
        { status: 400 }
      );
    }

    // Validate section
    if (!["graphics", "tattoos"].includes(section)) {
      return NextResponse.json(
        { error: "Section must be either 'graphics' or 'tattoos'" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("subcategories")
      .insert([{ name: name.toLowerCase(), section }])
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        // Unique constraint violation
        return NextResponse.json(
          { error: "Subcategory already exists" },
          { status: 409 }
        );
      }
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to create subcategory" },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    const { updates } = body;

    // Validate required fields
    if (!updates || !Array.isArray(updates)) {
      return NextResponse.json(
        { error: "Updates array is required" },
        { status: 400 }
      );
    }

    // Update sort orders for each subcategory
    for (const update of updates) {
      const { id, sort_order } = update;

      if (id === undefined || sort_order === undefined) {
        return NextResponse.json(
          { error: "Each update must have id and sort_order" },
          { status: 400 }
        );
      }

      const { error } = await supabase
        .from("subcategories")
        .update({ sort_order })
        .eq("id", id);

      if (error) {
        console.error("Database error:", error);
        return NextResponse.json(
          { error: "Failed to update subcategory order" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      message: "Subcategories reordered successfully",
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
