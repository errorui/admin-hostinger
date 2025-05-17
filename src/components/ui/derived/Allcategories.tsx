
import Link from 'next/link';
import React from 'react'
import { Editcategory } from './Editcategory';
import { Delete } from 'lucide-react';
import { DeleteCategoryBtn } from './Deletebtns';
import { CreateCategory } from './Createcatergory';



const Allcategories = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories`, {
  method: 'GET',
  next: { revalidate: 10 }, 
});
    if (!response.ok) {
        return <div>Error loading categories</div>
    }
    // await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate a delay
    const categories = await response.json();
   

    return (
         <div className='flex flex-wrap gap-4'>
            {categories.length>0&&categories.map((category: any) => (
                <div key={category._id} className="card bg-white shadow-md rounded-lg p-4 md:w-60 w-full hover:bg-slate-500">
                    <div className="flex">
                  
                    </div>
                    
                <Link  href={`/admin/categories/${category._id}`}  >
                 <div  >
                    <img src={`${category.image}?t=${new Date().getTime()}` || "check"} alt={category.name} className="w-full h-32 object-cover rounded-t-lg" />
                    <h2 className="text-lg font-semibold mt-2">{category.name}</h2>
                </div></Link>
                </div>
                
               
            ))}
            <CreateCategory/>
        </div>
    );
};

export default Allcategories;

