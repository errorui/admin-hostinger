'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { Faster_One } from 'next/font/google'

const Page = () => {
  const { id } = useParams()
  const router = useRouter()
  const { toast } = useToast()

  const [coupon, setCoupon] = useState<any>(null)
  const [targets, setTargets] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const fetchCoupon = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/coupons/${id}`)
    const data = await res.json()
    setCoupon(data)
    setLoading(false)
  }

  const fetchTargets = async (range: string) => {
    if (!range || range === 'global') return
    const map: { [key: string]: string } = {
      category: 'categories',
      subcategory: 'subcategories',
      product: 'products',
    }
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/${map[range]}/name/getidsandnames`
      )
      const data = await res.json()
      setTargets(data)
    } catch (error) {
      console.error('Error fetching targets:', error)
      setTargets([])
    }
  }

  useEffect(() => {
    if (id) fetchCoupon()
  }, [id])

  useEffect(() => {
    if (coupon?.range) {
      fetchTargets(coupon.range)
    }
  }, [coupon?.range])

  const handleUpdate = async (field: string, value: any) => {
    const updated = { ...coupon, [field]: value }
    setCoupon(updated)
  }
  const handleSave = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/coupons/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
         
        },
        body: JSON.stringify(coupon),
        credentials: 'include',
      })
      if (res.ok) {
        toast({
          title: 'Success',
          description: 'Coupon updated successfully',
          variant: 'default',
        })
        setLoading(false)
        
      } else {
        const error = await res.json()
        toast({
          title: 'Error',
          description: error.message || 'Failed to update coupon',
          variant: 'destructive',
        })
      }
      
    } catch (error) {
      
    }
  }

  const handleDelete = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/coupons/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    router.push('/admin/coupons')
  }

  const toggleTarget = (targetId: string) => {
    const exists = coupon.targetIds.includes(targetId)
    const updatedIds = exists
      ? coupon.targetIds.filter((t: string) => t !== targetId)
      : [...coupon.targetIds, targetId]
    handleUpdate('targetIds', updatedIds)
  }

  if (loading || !coupon) return <div className="p-4">Loading...</div>

  return (
    <div className="w-full mx-auto md:p-4 space-y-6">
      <div className=" w-full flex justify-between items-center gap-y-4">
   
        <label className="text-2xl font-bold ">Coupon:</label>
        <input
          type="text"
          value={coupon.code}
          onChange={(e) => handleUpdate('code', e.target.value)}
          className="w-full border rounded px-2 py-1"
        />
        <button
          onClick={handleDelete}
          className="text-red-600 border border-red-600 px-4 py-1 rounded hover:bg-red-50"
        >
          Delete
        </button>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
        <div>
          <label className="block font-semibold">Discount Type</label>
          <select
            value={coupon.discountType}
            onChange={(e) => handleUpdate('discountType', e.target.value)}
            className="w-full border rounded px-2 py-1"
          >
            <option value="percentage">Percentage</option>
            <option value="flat">Flat</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold">Discount Value</label>
          <input
            type="number"
            value={coupon.discountValue}
            onChange={(e) => handleUpdate('discountValue', Number(e.target.value))}
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <div>
          <label className="block font-semibold">Range</label>
          <select
            value={coupon.range}
            onChange={(e) => handleUpdate('range', e.target.value)}
            className="w-full border rounded px-2 py-1"
          >
            <option value="global">Global</option>
            <option value="category">Category</option>
            <option value="subcategory">Subcategory</option>
            <option value="product">Product</option>
          </select>
        </div>

        <div>
          <label className="block font-semibold">Usage Limit</label>
          <input
            type="number"
            value={coupon.usageLimit || ''}
            onChange={(e) =>
              handleUpdate('usageLimit', e.target.value ? Number(e.target.value) : null)
            }
            className="w-full border rounded px-2 py-1"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="block font-semibold">Is Active</label>
          <input
            type="checkbox"
            checked={coupon.isActive}
            onChange={(e) => handleUpdate('isActive', e.target.checked)}
          />
        </div>

        <div>
          <label className="block font-semibold">Expires At</label>
          <input
            type="date"
            value={coupon.expiresAt?.slice(0, 10)}
            onChange={(e) => handleUpdate('expiresAt', e.target.value)}
            className="w-full border rounded px-2 py-1"
          />
        </div>
      </div>

      {coupon.range !== 'global' && (
        <div>
          <label className="block font-semibold mb-2">Select Target IDs</label>
          <div className="flex flex-wrap gap-2">
            {targets.map((item: any) => (
              <button
                key={item._id}
                onClick={() => toggleTarget(item._id)}
                className={`px-3 py-1 rounded border ${
                  coupon.targetIds.includes(item._id)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="text-sm text-gray-500 mt-6">
        Used: {coupon.usedCount} / {coupon.usageLimit || '∞'}
      </div>
      {/* update button */}
      <button
        onClick={() => handleSave()}
        disabled={loading}  
        className="mt-4 text-blue-600 border border-blue-600 px-4 py-1 rounded hover:bg-blue-50"
      >
        Update
      </button>
      <div className="text-sm text-gray-500">
        Created At: {new Date(coupon.createdAt).toLocaleDateString()}
      </div>
      <button
        onClick={() => router.push('/admin/coupons')}
        className="mt-4 text-blue-600 border border-blue-600 px-4 py-1 rounded hover:bg-blue-50"
      >
        Back to Coupons
      </button>
    </div>
  )
}

export default Page
