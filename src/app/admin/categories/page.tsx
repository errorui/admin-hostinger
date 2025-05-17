import Allcategories from '@/components/ui/derived/Allcategories'
import React from 'react'


const page = () => {
  return (
    <div className='w-full md:p-8 p-2'>
    <h1 className='text-center text-2xl font-bold uppercase'>All categories</h1>

      <div className='flex flex-wrap gap-4'>
        <Allcategories/>
      </div>  
   
  </div>
  )
}

export default page
