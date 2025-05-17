"use client"


import React from "react";
import { Trash } from "lucide-react";
import { handleRemoveSubfromcateorgy } from "@/app/actions";




export const Removesubfromcategory = ({
  id,
  categoryid
}: {
  categoryid:string,
  id: string;
}) => {
  

  return (
      <form>
          <button type="submit"
       onClick={async()=>{
        await handleRemoveSubfromcateorgy(categoryid,id);
       }}
      
      className="p-2 bg-red-500 text-sm text-white rounded hover:bg-red-600 disabled:bg-gray-400"
    >
      remove from category
    </button>
      </form>
       
 
   
  );
};
