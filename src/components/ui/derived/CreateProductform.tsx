"use client";
import { useState } from "react";
import TiptapEditor from "./TipTap";
import CategorySelector from "./CategorySelector";
import ColorForm from "./ColorForm";



const ProductForm = () => {
  const [categories, setCategories] = useState([
    "Clothing",
    "Electronics",
    "Eelctronics",
    "Furniture",
  ]);
  const [subcategories, setSubcategories] = useState<Record<string, string[]>>({
    Clothing: ["Shirts", "Pants", "Jackets"],
    Electronics: ["Phones", "Laptops", "Accessories"],
    Eelectronics: ["Phones", "Laptops", "Accessories"],
    Furniture: ["Tables", "Chairs", "Beds"],
  });

  const [colors, setColors] = useState<
    Record<string, { images: File[]; size: Record<string, number> }>
  >({});

  const [formData, setFormData] = useState({
    category: "",
    subcategory: "",
    name: "",
    description: "",
    price: "", // Stored as string for controlled input
    colors: {} as Record<string, { images: File[]; size: Record<string, number> }>,
  });

  // Update category
  const handleCategoryChange = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      category,
      subcategory: "",
    }));
  };

  // Update subcategory
  const handleSubcategoryChange = (subcategory: string) => {
    setFormData((prev) => ({
      ...prev,
      subcategory,
    }));
  };

  // Update description
  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      description: value,
    }));
  };

  const handleSizeChange = (color: string, sizeLabel: string, value: string) => {
    const parsedValue = parseInt(value);
    setColors((prev) => ({
      ...prev,
      [color]: {
        ...prev[color],
        size: {
          ...prev[color].size,
          // Only fall back to 0 if parsedValue is NaN.
          [sizeLabel]: isNaN(parsedValue) ? 0 : parsedValue,
        },
      },
    }));
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   
    // Create a FormData instance to send the data
    const formdata = new FormData();
  
    // Append text fields to FormData
    formdata.append("category", formData.category);
    formdata.append("subcategory", formData.subcategory);
    formdata.append("name", formData.name);
    formdata.append("description", formData.description);
    formdata.append("price", formData.price);
  
   
    Object.keys(colors).forEach((color) => {
    
      Object.keys(colors[color].size).forEach((sizeLabel) => {
        formdata.append(`colors[${color}][size][${sizeLabel}]`, colors[color].size[sizeLabel].toString());
      });
  
     
      colors[color].images.forEach((image, index) => {
        formdata.append(`colors[${color}][images][${index}]`, image);
      });
    });
  
    try {
  
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/create`, {
        method: "POST",
        body: formdata, 
        credentials:"include",
      });
  
      // Check if the request was successful
     
   
      alert("producted created successfully")
     
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 w-full bg-slate-100">
  
      <CategorySelector
        label="Category"
        options={categories}
        selectedValue={formData.category}
        onSelect={handleCategoryChange}
        onAddOption={(newCategory) => {
          if (!categories.includes(newCategory)) {
            setCategories([...categories, newCategory]);
            setSubcategories({
              ...subcategories,
              [newCategory]: [],
            });
          }
        }}
      />

   
      {formData.category && (
        <CategorySelector
          label="Subcategory"
          options={subcategories[formData.category] || []}
          selectedValue={formData.subcategory}
          onSelect={handleSubcategoryChange}
          onAddOption={(newSubcategory) => {
            setSubcategories({
              ...subcategories,
              [formData.category]: [
                ...(subcategories[formData.category] || []),
                newSubcategory,
              ],
            });
          }}
        />
      )}

  
      <div>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          required
          className="w-full p-2 border rounded"
        />
      </div>

    
      <div>
        <label>Description</label>
        <TiptapEditor
          value={formData.description}
          onChange={handleDescriptionChange}
        />
      </div>

      {/* Price */}
      <div>
        <label>Price</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              price: e.target.value,
            }))
          }
          required
          className="w-full p-2 border rounded"
        />
      </div>

      {/* ColorForm */}
      <ColorForm
        colors={colors}
        setColors={setColors}
        handleImageUpload={(color, files) => {
          if (files) {
            setColors((prev) => ({
              ...prev,
              [color]: {
                ...prev[color],
                images: [...prev[color].images, ...Array.from(files)],
              },
            }));
          }
        }}
        handleSizeChange={handleSizeChange}
      />

      <button
        type="submit"
        className="w-full bg-blue-900 text-white p-2 rounded hover:bg-blue-600"
      >
        Create Product
      </button>
    </form>
  );
};

export default ProductForm;
