import { NextResponse } from "next/server";
import { supabase } from "@/config/supabase";
import { generateSlug } from "@/utils/slug";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");
    const includeSubcategories = searchParams.get("includeSubcategories") === "true";

    let query = supabase
      .from("menu_items")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (section) {
      query = query.eq("section", section);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch menu items" },
        { status: 500 }
      );
    }

    // If requested, include subcategories for each menu item
    if (includeSubcategories && data) {
      const menuItemsWithSubcategories = await Promise.all(
        data.map(async (menuItem) => {
          const { data: subcategories, error: subError } = await supabase
            .from("subcategories")
            .select("*")
            .eq("menu_item_id", menuItem.id)
            .order("sort_order", { ascending: true });

          if (subError) {
            console.error("Error fetching subcategories:", subError);
            return { ...menuItem, subcategories: [] };
          }

          return { ...menuItem, subcategories: subcategories || [] };
        })
      );

      return NextResponse.json({ data: menuItemsWithSubcategories });
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

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, section, description } = body;

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

    // Generate slug from name
    const slug = generateSlug(name);

    // Get the current max sort_order for this section
    const { data: maxSortData } = await supabase
      .from("menu_items")
      .select("sort_order")
      .eq("section", section)
      .order("sort_order", { ascending: false })
      .limit(1);

    const nextSortOrder = maxSortData && maxSortData[0] 
      ? maxSortData[0].sort_order + 1 
      : 0;

    const { data, error } = await supabase
      .from("menu_items")
      .insert([
        {
          name,
          slug,
          section,
          description,
          sort_order: nextSortOrder,
        },
      ])
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        // Unique constraint violation
        return NextResponse.json(
          { error: "Menu item with this name already exists in this section" },
          { status: 409 }
        );
      }
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to create menu item" },
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

    // Update sort orders for each menu item
    for (const update of updates) {
      const { id, sort_order } = update;

      if (id === undefined || sort_order === undefined) {
        return NextResponse.json(
          { error: "Each update must have id and sort_order" },
          { status: 400 }
        );
      }

      const { error } = await supabase
        .from("menu_items")
        .update({ sort_order })
        .eq("id", id);

      if (error) {
        console.error("Database error:", error);
        return NextResponse.json(
          { error: "Failed to update menu item order" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      message: "Menu items reordered successfully",
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

