import { revalidateTag } from "next/cache";

export async function GET(req: Request) {
  try {
    // Revalidate the "subcate" tag
    revalidateTag("subcate");

    return new Response(JSON.stringify({ message: "Subcategory tag revalidated successfully" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to revalidate subcategory tag" }),
      { status: 500 }
    );
  }
}
