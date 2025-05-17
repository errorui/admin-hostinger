"use client"

import { handleDeleteCategories, handleDeleteProducts, handleDeleteSubcategories } from "@/app/actions";

export const DeleteCategoryBtn = ({id}:{id:string}) => {
    return (
        <button 
            className="bg-red-500 px-2 py-1 rounded-lg text-white text-sm"
            onClick={async () => {
                await handleDeleteCategories(id);
            }}
        >
            delete category
        </button>
    );
};
export const DeleteSubCategoryBtn = ({id}:{id:string}) => {
    return (
        <button 
            className="bg-red-500 px-2 py-1 rounded-lg text-white text-sm"
            onClick={async () => {
                await handleDeleteSubcategories(id);
            }}
        >
            delete category
        </button>
    );
};


export const DeleteProductbtn= ({id}:{id:string}) => {
    return (
        <button 
            className="bg-red-500 px-2 py-1 rounded-lg text-white text-sm"
            onClick={async () => {
                await handleDeleteProducts(id);
            }}
        >
            remove product
        </button>
    );
};
