"use client";

import React, { useState } from "react";
import TiptapEditor from "./derived/TipTap";
import { toast, useToast } from "@/hooks/use-toast";
import { handleUpdateProduct } from "@/app/actions";

const sizeLabels = ["XS", "S", "M", "L", "XL", "XXL"];

type ColorData = {
  images: (string | File)[];
  size: Record<string, number>;
};

type ProductFormData = {
  id: string;
  name: string;
  description: string;
  price: number;
  colors: Record<string, ColorData>;
};

const ProductEdit = ({ product }: { product: any }) => {
  const [formData, setFormData] = useState<ProductFormData>({
    id: product._id,
    name: product.name,
    description: product.description,
    price: product.price,
    colors: product.colors,
  });

  const [newColor, setNewColor] = useState("");
  const [updating, setUpdating] = useState(false);
  const [newColorImages, setNewColorImages] = useState<File[]>([]);
  const [imageUploads, setImageUploads] = useState<Record<string, File[]>>({});

  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? +value : value,
    }));
  };

  const handleStockChange = (color: string, size: string, value: number) => {
    setFormData((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [color]: {
          ...prev.colors[color],
          size: {
            ...prev.colors[color].size,
            [size]: value,
          },
        },
      },
    }));
  };

  const handleRemoveImage = (color: string, img: string | File) => {
    setFormData((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [color]: {
          ...prev.colors[color],
          images: prev.colors[color].images.filter((i) => i !== img),
        },
      },
    }));
  };
  const handleremovecolor = (color: string) => {
    setFormData((prev) => {
      const newColors = { ...prev.colors };
      delete newColors[color];
      return {
        ...prev,
        colors: newColors,
      };
    });
  };

  const handleAddImagesToExistingColor = async (color: string, files: File[]) => {
    const uploaded = files.map((file) => file); // Replace with upload logic
    setFormData((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [color]: {
          ...prev.colors[color],
          images: [...prev.colors[color].images, ...uploaded],
        },
      },
    }));
  };

  const handleupdate = async () => {
    setUpdating(true);
    const form = new FormData();

    // Append simple fields
    form.append("name", formData.name);
    form.append("price", String(formData.price));
    form.append("description", formData.description);

    // Prepare and append colors
    Object.entries(formData.colors).forEach(([color, data]) => {
      // Append stock sizes
    Object.entries(data.size).forEach(([sizeIndex, qty]) => {
      form.append(`colors[${color}][size][${sizeIndex}]`, String(qty));
    });

    // Append images: new images as File, old ones as URLs
    data.images.forEach((img: File | string, idx: number) => {
      if (img instanceof File) {
        form.append(`colors[${color}][images]`, img);
      } else {
        form.append(`colors[${color}][images]`, img); // URL
      }
    });
  });

  try {
    const response = await handleUpdateProduct(product.id, form);
    if (!response) {
      alert("Error updating product");
      return;
    }
    alert("Product updated!");
  } catch (err) {
    alert("Update failed");
    console.error(err);
  }
  setUpdating(false);
};

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>

      {/* Name */}
      {product.id}
      <div>
        <label className="font-semibold block">Name</label>
        <input
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="border p-2 w-full rounded"
        />
      </div>

      {/* Price */}
      <div>
        <label className="font-semibold block">Price</label>
        <input
          name="price"
          type="number"
          value={formData.price}
          onChange={handleInputChange}
          className="border p-2 w-full rounded"
        />
      </div>

      {/* Description */}
      <div>
        <label className="font-semibold block">Description</label>
        <TiptapEditor value={formData.description} onChange={handleDescriptionChange} />
      </div>

      {/* Existing Colors */}
      {Object.entries(formData.colors).map(([color, data]) => (
        <div key={color} className="mt-6 border-t pt-4">
            <div className="flex justify-between w-full">
                    <h2 className="text-lg font-semibold">{color}</h2>
                    <button
                      onClick={() => handleremovecolor(color)}
                      className="text-red-600 hover:underline"
                    >
                      Remove
                    </button>
            </div>

          {/* Images */}
          <div className="flex gap-2 flex-wrap mt-2">
            {data.images.map((img, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={typeof img === "string" ? img : URL.createObjectURL(img)}
                  className="w-24 h-24 object-cover rounded border"
                />
                <button
                  onClick={() => handleRemoveImage(color, img)}
                  className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded px-1 hidden group-hover:block"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Upload New Images */}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) =>
              e.target.files && handleAddImagesToExistingColor(color, Array.from(e.target.files))
            }
            className="mt-2"
          />

          {/* Stock per size */}
          <div className="grid grid-cols-6 gap-2 mt-4">
            {Object.entries(data.size).map(([sizeIdx, stock]) => (
              <div key={sizeIdx} className="text-center bg-gray-100 p-2 rounded">
                <div className="font-bold">{sizeLabels[+sizeIdx]}</div>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => handleStockChange(color, sizeIdx, +e.target.value)}
                  className="mt-1 p-1 w-full border rounded"
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Add New Color */}
      <div className="border-t pt-6 mt-6">
        <h3 className="text-lg font-semibold mb-2">Add New Color Variant</h3>

        <input
          placeholder="Color name"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          className="border p-2 w-full mb-2 rounded"
        />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) =>
            setNewColorImages(e.target.files ? Array.from(e.target.files) : [])
          }
        />

        <div className="flex gap-2 mt-2">
          {newColorImages.map((f, i) => (
            <img
              key={i}
              src={URL.createObjectURL(f)}
              className="w-20 h-20 object-cover border rounded"
            />
          ))}
        </div>

        <button
          onClick={() => {
            if (!newColor || !newColorImages.length) return alert("Fill all fields");
            setFormData((prev) => ({
              ...prev,
              colors: {
                ...prev.colors,
                [newColor]: {
                  images: [...newColorImages],
                  size: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
                },
              },
            }));
            setNewColor("");
            setNewColorImages([]);
          }}
          className="mt-4 px-4 py-2 border-2 border-blue-500 text-blue-600 rounded"
        >
          Add Color
        </button>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleupdate}
        disabled={updating}
        className="mt-6 px-4 py-2 border-2 border-green-600 text-green-700 rounded"
      >
        {updating ? "Updating..." : "Update Product"}
      </button>
    </div>
  );
};

export default ProductEdit;
