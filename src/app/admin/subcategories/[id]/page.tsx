'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

import { handleDeleteSubcategories, handleUpdatesubcategory } from '@/app/actions'
import Link from 'next/link'


const Page = () => {
  const { id } = useParams()
  const { toast } = useToast()
  const router = useRouter()
  const [subcategory, setSubcategory] = useState<any>(null)
  const [allProducts, setAllProducts] = useState<any[]>([])
  const [selectedProductId, setSelectedProductId] = useState('')
  const [loading, setLoading] = useState(true)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)
  const fetchData = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subcategories/${id}`)
        const data = await res.json()
        setSubcategory(data)
        setLoading(false)

        const prodRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/name/getidsandnames`)
        const prodData = await prodRes.json()
        setAllProducts(prodData)
      } catch (err) {
        toast({ title: 'Error', description: 'Failed to load data', variant: 'destructive' })
      }
    }
  useEffect(() => {
  
    fetchData()
  }, [id])

  const handleAddProduct = () => {
    const found = allProducts.find((p) => p._id === selectedProductId)
    if (!found || subcategory.productIds.find((p: any) => p._id === selectedProductId)) return
    setSubcategory({ ...subcategory, productIds: [...subcategory.productIds, found] })
    setSelectedProductId('')
  }

  

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        setImageFile(file)
        setImagePreview(URL.createObjectURL(file))
      }
    }
  const handleRemoveProduct = (prodId: string) => {
    setSubcategory({
      ...subcategory,
      productIds: subcategory.productIds.filter((p: any) => p._id !== prodId),
    })
  }


  const handleSave = async () => {
    const formData = new FormData()
    if (imageFile) {
      formData.append('image', imageFile)
    }
    formData.append('name', subcategory.name)
    formData.append('productIds', JSON.stringify(subcategory.productIds.map((p: any) => p._id)))
    setUpdating(true)
    try {
      
      const res = await handleUpdatesubcategory(String(id), formData)
      if (res) {
      
        toast({ title: 'Success', description: 'Subcategory updated successfully' })
        await   fetchData()
      } else {
        toast({ title: 'Error', description: 'Failed to update subcategory', variant: 'destructive' })
      }
  
    } catch (err) {
      toast({ title: 'Error', description: `Update error:${err} `, variant: 'destructive' })
    }
    setUpdating(false)
  }

  if (loading || !subcategory) return <div className="p-4">Loading...</div>

  const existingProductIds = new Set(subcategory.productIds.map((p: any) => p._id))
  const availableProducts = allProducts.filter((p) => !existingProductIds.has(p._id))

  return (
    <div className="w-full md:p-8 p-4 space-y-6">
      <div className="flex justify-between items-center gap-4">
        <div className="space-y-2 w-full">
          <label className="text-lg font-bold">Subcategory Name</label>
          <input
            type="text"
            value={subcategory.name}
            onChange={(e) => setSubcategory({ ...subcategory, name: e.target.value })}
            className="border px-3 py-2 rounded w-full"
          />
        </div>
        
      </div>
{subcategory.image && (
          <img src={`${subcategory.image}?t=${new Date().getTime()}`} alt="img" className="w-32 h-20 object-cover rounded" />
        )}
        {/* remove btn */}
        <button className='text-red-600 border border-red-600 px-4 py-1 rounded w-full hover:bg-red-50' onClick={async () => {

         setUpdating(true)
          try {
            await handleDeleteSubcategories(String(id))
            router.push('/admin/subcategories')
            toast({ title: 'Success', description: 'Subcategory deleted successfully' })
          } catch (error) {
            toast({ title: 'Error', description: 'Failed to delete subcategory', variant: 'destructive' })
            
          }
          setUpdating(false)
          
        }}>Delete</button>
      <div className="space-y-2">
        <label className="text-lg font-bold">Upload Image</label>
        <div className="flex gap-2 items-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
            {imagePreview && <img src={imagePreview} alt="Preview" className="w-48 h-32 object-cover rounded" />}
         
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Add Product</h3>
        <div className="flex gap-2 items-center">
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">Select a product</option>
            {availableProducts.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddProduct}
            className="text-green-600 border border-green-600 px-3 py-1 rounded hover:bg-green-50"
          >
            Add
          </button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
        {subcategory.productIds.length > 0 ? (
          subcategory.productIds.map((p: any) => (
            <div
              key={p._id}
              className="p-4 rounded-lg bg-white shadow-md border hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center gap-4 mb-2">
                <h2 className="text-sm font-bold">{p.name}</h2>
                <button
                  onClick={() => handleRemoveProduct(p._id)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
              {p.image && <img src={p.image} alt={p.name} className="w-full h-24 object-cover rounded" />}
            </div>
          ))
        ) : (
          <div className="text-gray-500">No products in this subcategory</div>
        )}
      </div>

      <button
        onClick={handleSave}
        disabled={updating}
        className="text-blue-600 border border-blue-600 px-4 py-1 rounded hover:bg-blue-50"
      >
        {updating ? 'Updating...' : 'Save'}
      </button>
      <Link
        href='/admin/subcategories'
        className="text-blue-600 border border-blue-600 px-4 py-1 rounded hover:bg-blue-50"
      >
        Back to Subcategories
      </Link>
    </div>
  )
}

export default Page
