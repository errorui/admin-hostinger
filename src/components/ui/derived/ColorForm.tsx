"use client";
import { Dispatch, SetStateAction, useState } from "react";
import { LucideX } from "lucide-react";

type ColorFormProps = {
  colors: Record<string, { images: File[]; size: Record<string, number> }>;
  handleImageUpload: (color: string, files: FileList | null) => void;
  handleSizeChange: (color: string, sizeLabel: string, value: string) => void;
  setColors: Dispatch<
    SetStateAction<Record<string, { images: File[]; size: Record<string, number> }>>
  >;
};

export default function ColorForm({
  colors,
  handleImageUpload,
  handleSizeChange,
  setColors,
}: ColorFormProps) {
  const predefinedColors = [
    "Red",
    "Blue",
    "Green",
    "Black",
    "White",
    "Yellow",
    "Purple",
    "Pink",
  ];

  const [selectedColor, setSelectedColor] = useState("");
  const [customColor, setCustomColor] = useState("");

  const availableColors = predefinedColors.filter((color) => !colors[color]);

  const addColor = () => {
    const colorToAdd = selectedColor || customColor.trim();
    if (!colorToAdd) return; // Prevent adding empty color
    if (colors[colorToAdd]) return; // Prevent duplicates

    // Create a size object with default values of 0.
    setColors((prev) => ({
      ...prev,
      [colorToAdd]: { 
        images: [], 
        size: { XS: 0, S: 0, M: 0, L: 0, XL: 0, XXL: 0 } 
      },
    }));

    // Reset fields after adding
    setSelectedColor("");
    setCustomColor("");
  };

  const removeColor = (colorToRemove: string) => {
    setColors((prev) => {
      const newColors = { ...prev };
      delete newColors[colorToRemove];
      return newColors;
    });
  };

  return (
    <div>
      <label className="font-semibold">Colors</label>
      <div className="space-y-2">
        {/* Dropdown to select predefined colors */}
        <select
          onChange={(e) => setSelectedColor(e.target.value)}
          value={selectedColor}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Predefined Color</option>
          {availableColors.map((color) => (
            <option key={color} value={color}>
              {color}
            </option>
          ))}
        </select>

        <div className="flex space-x-2 mt-2">
          {/* Input for custom color */}
          <input
            type="text"
            placeholder="Or enter custom color"
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            className="w-full p-2 border rounded"
          />

          {/* Add Color Button */}
          <button
            type="button"
            onClick={addColor}
            className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            disabled={!selectedColor && !customColor.trim()}
          >
            Add Color
          </button>
        </div>

        {/* Display selected colors */}
        {Object.keys(colors).map((color) => (
          <div key={color} className="rounded-xl border p-2 mt-2">
            <div className="flex justify-between items-center">
              <h3 className="font-bold">{color}</h3>
              <div className="text-red-700" onClick={() => removeColor(color)}>
                <LucideX />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <label>Images</label>
              <input
                type="file"
                multiple
                onChange={(e) => handleImageUpload(color, e.target.files)}
                className="w-full p-2 border rounded"
              />
            </div>

            {/* Sizes / Stock */}
            <div className="mt-2">
              <label>Stock</label>
              <div className="space-y-2">
                {["XS", "S", "M", "L", "XL", "XXL"].map((sizeLabel) => (
                  <div key={sizeLabel} className="flex items-center space-x-2">
                    <label htmlFor={`${color}-${sizeLabel}`}>{sizeLabel}</label>
                    <input
                      type="number"
                      id={`${color}-${sizeLabel}`}
                      placeholder={`Stock for ${sizeLabel}`}
                      value={colors[color]?.size[sizeLabel] ?? 0}
                      min={0}
                      onChange={(e) =>
                        handleSizeChange(color, sizeLabel, e.target.value)
                      }
                      className="w-full p-2 border rounded"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
