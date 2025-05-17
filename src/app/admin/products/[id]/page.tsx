import ProductForm from "@/components/ui/derived/CreateProductform";
import ProductEdit from "@/components/ui/ProductEdit";
import React from "react";

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/product/${id}`,
    {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return <div className="text-red-600">Error loading product</div>;
  }

  const rawProduct = await response.json();

  // Transform colors.images to be a flat array of image URLs
 const transformedColors: Record<
  string,
  { images: (string | null)[]; size: Record<string, number> }
> = Object.fromEntries(
  Object.entries(rawProduct.colors).map(([colorName, colorData]: any) => {
    const flatImages = Array.from(
      new Set(
        colorData.images
          .flatMap((imgObj: any) =>
            Array.isArray(imgObj?.images) ? imgObj.images : []
          )
          .filter(Boolean) // Remove nulls/undefined
      )
    );

    return [
      colorName,
      {
        images: flatImages,
        size: colorData.size,
      },
    ];
  })
);


  const product = {
    _id: rawProduct._id,
    id: rawProduct.id,
    name: rawProduct.name,
    description: rawProduct.description,
    price: rawProduct.price,
    colors: transformedColors,
  };

  return <ProductEdit product={product} />;
};

export default Page;
