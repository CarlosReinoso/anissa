import { NextResponse } from "next/server";
import { supabase } from "@/config/supabase";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");
    const category = searchParams.get("category");
    const subCategory = searchParams.get("sub_category");
    const limit = parseInt(searchParams.get("limit")) || 24;
    const offset = parseInt(searchParams.get("offset")) || 0;
    const countOnly = searchParams.get("count") === "true";

    let query = supabase
      .from("artwork_images")
      .select(
        countOnly
          ? "count"
          : "id, slug, title, description, storage_path, category, sub_category, section, sort_order, created_at"
      )
      .eq("published", true);

    // Apply filters
    if (section) {
      query = query.eq("section", section);
    }
    if (category) {
      query = query.eq("category", category);
    }
    if (subCategory) {
      query = query.eq("sub_category", subCategory);
    }

    if (countOnly) {
      // For count queries, we don't need ordering or pagination
      const { count, error } = await query;

      if (error) {
        console.error("Database error:", error);
        return NextResponse.json(
          { error: "Failed to count artwork" },
          { status: 500 }
        );
      }

      return NextResponse.json({ count: count || 0 });
    } else {
      // Apply ordering and pagination for regular queries
      query = query
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

      const { data, error } = await query;

      if (error) {
        console.error("Database error:", error);
        return NextResponse.json(
          { error: "Failed to fetch artwork" },
          { status: 500 }
        );
      }

      return NextResponse.json({ data: data || [] });
    }
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
    const { section, category, sub_category, sort_order } = body;

    // Validate required fields
    if (!section || !category) {
      return NextResponse.json(
        { error: "Section and category are required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("artwork_images")
      .insert([body])
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to create artwork" },
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
