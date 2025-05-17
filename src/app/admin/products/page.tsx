import { DeleteProductbtn } from '@/components/ui/derived/Deletebtns';
import RemoveProductBtn from '@/components/ui/derived/Removeproductbtn';
import Link from 'next/link';
import React from 'react'

const page = () => {
  return (
    <div className='w-full md:p-8 p-2'>
      <h1 className='text-center text-2xl font-bold uppercase'>All products</h1>
      <Allsubcategories/>
    </div>
  )
}
const Allsubcategories = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`, {
      method: 'GET',
      next: { revalidate: 10 },
  });
  const categories = await response.json();

 

  return (
       <div className='flex flex-wrap gap-4'>
          {categories.length>0&&categories.map((category: any) => (
            <div className="card bg-white shadow-md rounded-lg p-4 md:w-60 hover:bg-slate-500" key={category._id}>
              <DeleteProductbtn id={category._id} ></DeleteProductbtn>
              <Link  href={`/admin/products/${category._id}`} key={category._id} >
               <div  >
                  <img src={category.image || "check"} alt={category.name} className="w-full h-32 object-cover rounded-t-lg" />
                  <h2 className="text-lg font-semibold mt-2">{category.name}</h2>
              </div></Link>
              </div>
             
          ))}
      </div>
  );
};

export default page
