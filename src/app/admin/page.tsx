"use client";
import React, { useState, useEffect } from "react";
import { check2 } from "../actions"; // your POST server action

const Page = () => {
  const [loading, setLoading] = useState(false);
  const [categoryState, setCategoryState] = useState({
    men: false,
    women: false,
    children: false,
  });

  // Fetch current category states from GET /check
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/check`);
        const data = await res.json();
        // console.log(data);
        setCategoryState(data.state);
      } catch (error) {
        console.error("Failed to fetch category states", error);
      }
    };
    fetchStates();
  }, []);

  const handleCheckboxChange = (key: string) => {
    const updatedState = {
      ...categoryState,
      [key]: !categoryState[key as keyof typeof categoryState],
    };
    setCategoryState(updatedState);
  };

  const handleSubmit = async () => {
    setLoading(true);
    await check2(categoryState); // send POST request with current state
    setLoading(false);
  };

  return (
    <div className="p-4 space-y-4">
      {Object.entries(categoryState).map(([key, value]) => (
        <label key={key} className="block">
          <input
            type="checkbox"
            checked={value}
            onChange={() => handleCheckboxChange(key)}
            className="mr-2"
          />
          {key}
        </label>
      ))}

      <button
        disabled={loading}
        onClick={handleSubmit}
        className="p-2 hover:bg-amber-800 hover:text-black rounded-2xl bg-amber-400 text-white font-bold"
      >
        {loading ? <div className="animate-spin">loading</div> : "Submit"}
      </button>
    </div>
  );
};

export default Page;
