import AllCoupons from '@/components/ui/Allcoupons'
import React, { Suspense } from 'react'


const page = () => {
  return (
    <div className='w-full md:p-8 p-2'>
      <h1 className='text-center text-2xl font-bold uppercase'>All coupons</h1>
        
      <AllCoupons/>
   
    </div>
  )
}

export default page
