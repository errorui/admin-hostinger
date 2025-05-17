import React from 'react'
import Link from 'next/link'
import { CreateCoupon } from './createCoupon'


const AllCoupons = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/coupons`, {
    method: 'GET',
    cache: 'no-store',
  })

  const coupons = await response.json()
    if (!response.ok) {
        return <div>Error loading coupons</div>
    }
    // await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate a delay
  return (
    <div className='flex flex-wrap gap-4'>
      {coupons.length > 0 && coupons.map((coupon: any) => (
        <Link key={coupon._id} href={`/admin/coupons/${coupon._id}`}>
          <div className="card bg-white shadow-md rounded-lg p-4 md:w-60 hover:bg-slate-500 cursor-pointer">
            <h2 className="text-lg font-semibold">{coupon.code}</h2>
            <h5 className='text-sm' >type:{coupon.discountType}</h5>
          </div>
        </Link>
      ))}
      <CreateCoupon />
    </div>
  )
}

export default AllCoupons
