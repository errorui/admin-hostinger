"use client"
import { useState } from "react"
import { Plus } from "lucide-react"
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
import { handleCreateCategory } from "@/app/actions" // replace with your actual import
import { useToast } from "@/hooks/use-toast"
export function CreateCategory() {
  const [formData, setFormData] = useState({
    name: "",
    image: null as File | null,
  })
  const [open, setOpen] = useState(false)
  const { toast } = useToast() // <-- initialize toast
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type } = e.target
    if (type === "file") {
      const file = e.target.files?.[0] || null
      setFormData((prev) => ({ ...prev, image: file }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: e.target.value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formDataToSend = new FormData()
    formDataToSend.append("name", formData.name)
    if (formData.image) {
      formDataToSend.append("image", formData.image)
    }
try {
    await handleCreateCategory(formDataToSend)

    setFormData({ name: "", image: null })
    setOpen(false)
} catch (error:any) {
    toast({
        variant: "destructive",
        title: "Failed to create subcategory",
        description: error?.message || "Something went wrong.",
      })
}
   
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="flex flex-col items-center justify-center w-48  border-2 border-dashed rounded-xl cursor-pointer hover:border-gray-400 transition">
            <Plus className="w-12 h-12 text-gray-400" />
            <span className="text-sm text-gray-500 mt-2">Create Category</span>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Category</DialogTitle>
            <DialogDescription>
              Enter the category name and upload an image.
            </DialogDescription>
          </DialogHeader>
          <form className="grid gap-4 py-4" onSubmit={handleSubmit}>
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
                required
              />
            </div>
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
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
