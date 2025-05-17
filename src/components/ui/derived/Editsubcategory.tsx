"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { handleUpdatesubcategory } from "@/app/actions"


export function Editsubcategory({ category }: { category: any }) {
  // State to store form values
  const [formData, setFormData] = useState({
    name: category || "", // Default to the passed category
    image: null as File | null,
  })
  const [open, setOpen] = useState(false)
  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type } = e.target

    if (type === "file") {
      const file = e.target.files?.[0] || null
      setFormData((prev) => ({ ...prev, image: file }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: e.target.value }))
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formDataToSend = new FormData()
    formDataToSend.append("name", formData.name)
    const p=[]
    console.log(category.productIds)
    for(const a of category.productIds){
        p.push(a._id)
    }
    console.log(p)
    
    formDataToSend.append("productIds", JSON.stringify(p))
    if (formData.image) {
      formDataToSend.append("image", formData.image)
    }

    await handleUpdatesubcategory(category._id, formDataToSend)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Edit subcategory</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Subcategory</DialogTitle>
          <DialogDescription>
            Make changes to your subcategory here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right">
              Name
            </label>
            <input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="col-span-3 h-10 rounded-md border px-3"
              type="text"
            />
          </div>

          {/* Image Upload */}
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="image" className="text-right">
              Image
            </label>
            <input
              id="image"
              name="image"
              onChange={handleChange}
              className="col-span-3"
              type="file"
              accept="image/*"
            />
          </div>

          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
