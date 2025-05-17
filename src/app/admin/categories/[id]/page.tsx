'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { handleUpdatecategory } from '@/app/actions'
import { Router } from 'next/router'


const Page = () => {
  const { id } = useParams()
  const router = useRouter()
  const { toast } = useToast()

  const [category, setCategory] = useState<any>(null)
  const [allSubcategories, setAllSubcategories] = useState<any[]>([])
  const [selectedSubId, setSelectedSubId] = useState('')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
 
  const fetchCategory = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/${id}`)
      const data = await res.json()
      setCategory(data)
  
      if (data.image) setImagePreview(data.image)
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to load category', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const fetchAllSubcategories = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subcategories/name/getidsandnames`)
      const data = await res.json()
      setAllSubcategories(data)
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to fetch subcategories', variant: 'destructive' })
    }
  }

  useEffect(() => {
    if (id) {
      fetchCategory()
      fetchAllSubcategories()
    }
  }, [id])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleSave = async () => {
    setUpdating(true)
    const formData = new FormData()
    formData.append('name', category.name)
    formData.append('subcategory', JSON.stringify(category.subcategory.map((s: any) => s._id)))

    if (imageFile) {
      formData.append('image', imageFile)
    }

    try {
      const res = await handleUpdatecategory(String(id), formData)
    
      if (res) {
        toast({ title: 'Success', description: 'Category updated successfully' })
  
        setLoading(false)
        fetchCategory()
      } else {
        toast({ title: 'Error', description: 'Failed to update category', variant: 'destructive' })
      }
    } catch (err) {
      console.error('Error updating category:', err)
      toast({ title: 'Error', description: 'Update error', variant: 'destructive' })
    } finally {
      setUpdating(false)
    }
  }

  const handleAddSubcategory = () => {
    const found = allSubcategories.find((s) => s._id === selectedSubId)
    if (!found || category.subcategory.find((s: any) => s._id === selectedSubId)) return
    setCategory({ ...category, subcategory: [...category.subcategory, found] })
    setSelectedSubId('')
  }

  const handleRemoveSub = (subId: string) => {
    setCategory({
      ...category,
      subcategory: category.subcategory.filter((s: any) => s._id !== subId),
    })
  }

  const handleDelete = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    router.push('/admin/categories')
  }

  if (loading || !category) return <div className="p-4">Loading...</div>

  const existingSubIds = new Set(category.subcategory.map((s: any) => s._id))
  const availableSubs = allSubcategories.filter((s) => !existingSubIds.has(s._id))

  return (
    <div className="w-full md:p-8 p-4 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <div className="w-full md:w-1/2 space-y-2">
          <label className="text-xl font-bold">Category Name</label>
          <img src={category.image} alt={category.name} className="w-48 h-32 object-cover rounded" />
          <input
            type="text"
            value={category.name}
            onChange={(e) => setCategory({ ...category, name: e.target.value })}
            className="border px-3 py-2 rounded w-full"
          />
        </div>
        <button
          onClick={handleDelete}
          className="text-red-600 border border-red-600 px-4 py-1 rounded hover:bg-red-50 h-fit"
        >
          Delete
        </button>
      </div>

      <div className="space-y-2">
        <label className="text-lg font-semibold">Category Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {imagePreview && <img src={imagePreview} alt="Preview" className="w-48 h-32 object-cover rounded" />}
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Add Subcategory</h3>
        <div className="flex gap-2 items-center">
          <select
            value={selectedSubId}
            onChange={(e) => setSelectedSubId(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">Select a subcategory</option>
            {availableSubs.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
          <button
            onClick={handleAddSubcategory}
            className="text-green-600 border border-green-600 px-3 py-1 rounded hover:bg-green-50"
          >
            Add
          </button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
        {category.subcategory?.length > 0 ? (
          category.subcategory.map((subcat: any) => (
            <div
              key={subcat._id}
              className="p-4 rounded-lg bg-white shadow-md border hover:shadow-lg transition"
            >
              <div className="flex justify-between items-center gap-4 mb-2">
                <h2 className="text-lg font-bold">{subcat.name}</h2>
                <button
                  onClick={() => handleRemoveSub(subcat._id)}
                  className="text-sm text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
              {subcat.image && (
                <img src={subcat.image} alt={subcat.name} className="w-full h-32 object-cover rounded" />
              )}
            </div>
          ))
        ) : (
          <div className="text-gray-500">No subcategories</div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          onClick={handleSave}
          disabled={updating}
          className="mt-4 text-blue-600 border border-blue-600 px-4 py-1 rounded hover:bg-blue-50"
        >
            {updating ? 'updating...' : 'Save'}
       
        </button>
        <button
          onClick={() => router.push('/admin/categories')}
          className="mt-4 text-blue-600 border border-blue-600 px-4 py-1 rounded hover:bg-blue-50"
        >
          Back
        </button>
      </div>
    </div>
  )
}

export default Page
