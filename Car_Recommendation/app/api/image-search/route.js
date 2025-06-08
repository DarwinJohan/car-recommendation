import { NextResponse } from "next/server";

const UNSPLASH_ACCESS_KEY =
  process.env.UNSPLASH_ACCESS_KEY || "7mjuTuOzVGODpVqLznCRICf2ifuuYZt7CTJ7eO9Thuk"; // Ganti kalau perlu

export async function POST(req) {
  try {
    const { query } = await req.json();
    console.log("Search query:", query); // ✅ Ini akan muncul di terminal/console
    if (!query) {
      return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }
    

    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
      query
    )}&per_page=1&order_by=popular`;
    console.log(query)
    const response = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Unsplash API error:", text);
      throw new Error("Failed to fetch from Unsplash");
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      return NextResponse.json({ imageUrl: null }); // No image found
    }

    const imageUrl = data.results[0].urls.regular;

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("Error in /api/image-search:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
