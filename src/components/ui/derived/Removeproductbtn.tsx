"use client"

import { handleRemoveProductsFromSubcateorgy } from '@/app/actions';
import React from 'react';

interface RemoveProductBtnProps {
    categoryId: string;
    subCategoryId: string;
 
}

const RemoveProductBtn: React.FC<RemoveProductBtnProps> = ({
    categoryId,
    subCategoryId,
 
}) => {
    return (
        <button 
            className="bg-red-500 px-2 py-1 rounded-lg text-white text-sm"
            onClick={async () => {
                await handleRemoveProductsFromSubcateorgy(categoryId, subCategoryId);
            }}
        >
            remove product
        </button>
    );
};

export default RemoveProductBtn;