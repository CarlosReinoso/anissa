import { NextResponse } from "next/server";
import { supabase } from "@/config/supabase";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");

    let query = supabase
      .from("artwork_images")
      .select("category, sub_category, sort_order")
      .eq("published", true);

    if (section) {
      query = query.eq("section", section);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json(
        { error: "Failed to fetch categories" },
        { status: 500 }
      );
    }

    // Group by category and subcategory for backward compatibility
    const categories = {};
    data.forEach((item) => {
      if (!categories[item.category]) {
        categories[item.category] = {
          name: item.category,
          subcategories: new Set(),
        };
      }
      if (item.sub_category) {
        categories[item.category].subcategories.add(item.sub_category);
      }
    });

    // Convert sets to arrays and sort
    const result = Object.values(categories).map((cat) => ({
      name: cat.name,
      subcategories: Array.from(cat.subcategories).sort(),
    }));

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
