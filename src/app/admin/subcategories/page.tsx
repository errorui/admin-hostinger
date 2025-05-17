
import Allsubcategories from '@/components/ui/derived/Allsubcatgories'
import React, { Suspense } from 'react'

const page = async()=>{
  
  return (
    <div className='w-full md:p-8 p-2'>
    <h1 className='text-center text-2xl font-bold uppercase'>All subcategories</h1>

    <Allsubcategories/>
   

  </div>
  )
}

export default page
