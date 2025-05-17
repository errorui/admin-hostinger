
import Link from 'next/link';
import React from 'react'

import { CreateSubcategory } from './CreateSubcategory';



const Allsubcategories = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subcategories`, {
        method: 'GET',
        cache: 'no-cache',
    });
    if (!response.ok) {
        return <div>Error loading subcategories</div>
    }
    const categories = await response.json();
    
   

    return (
         <div className='flex flex-wrap gap-4'>
            {categories.length>0&&categories.map((category: any) => (
                <div className="card bg-white shadow-md rounded-lg p-4 md:w-60 w-full hover:bg-slate-500" key={category._id}>
                
                <Link  href={`/admin/subcategories/${category._id}`}  >
                 <div  >
                    <img src={`${category.image}?t=${new Date().getTime()}` || "check"} alt={category.name} className="w-full h-32 object-cover rounded-t-lg" />
                    <h2 className="text-lg font-semibold mt-2">{category.name}</h2>
                </div>
               
                </Link>
                </div>
                
               
            ))}
            <CreateSubcategory/>
        </div>
    );
};

export default Allsubcategories;

