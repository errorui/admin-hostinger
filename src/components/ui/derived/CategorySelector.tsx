"use client";

import { useState } from "react";

const CategorySelector = ({
  label,
  options,
  selectedValue,
  onSelect,
  onAddOption,
}: {
  label: string;
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
  onAddOption: (newOption: string) => void;
}) => {
  const [newOption, setNewOption] = useState("");

  return (
    <div>
      <label>{label}</label>
      <select
        value={selectedValue}
        onChange={(e) => onSelect(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="">Select {label}</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>

      {/* Add new category */}
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          value={newOption}
          onChange={(e) => setNewOption(e.target.value)}
          placeholder={`Add new ${label}`}
          className="p-2 border rounded w-full"
        />
        <button
          type="button"
          onClick={() => {
            if (newOption.trim() && !options.includes(newOption)) {
              onAddOption(newOption);
              setNewOption(""); 
            }
          }}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default CategorySelector;
