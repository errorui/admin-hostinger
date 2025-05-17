'use client'
import { useEffect, useState } from "react"
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
import { useToast } from "@/hooks/use-toast"
import { handleCreateCoupon } from "@/app/actions" // Replace with your actual action

export function CreateCoupon() {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    code: "",
    discountType: "percentage",
    discountValue: 0,
    range: "global",
    targetId: "",
    expiresAt: "",
    usageLimit: 0,
  })

  const [options, setOptions] = useState({
    categories: [],
    subcategories: [],
    products: []
  })

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [catRes, subRes, prodRes] = await Promise.all([
          fetch("http://localhost:3001/api/categories/name/getidsandnames"),
          fetch("http://localhost:3001/api/subcategories/name/getidsandnames"),
          fetch("http://localhost:3001/api/products/name/getidsandnames"),
        ])

        const [categories, subcategories, products] = await Promise.all([
          catRes.json(),
          subRes.json(),
          prodRes.json(),
        ])

        setOptions({ categories, subcategories, products })
      } catch (err) {
        console.error("Failed to fetch options", err)
      }
    }

    fetchOptions()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: name === "discountValue" || name === "usageLimit" ? Number(value) : value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        targetIds: formData.range === "global" ? [] : [formData.targetId],
      }

      await handleCreateCoupon(payload)
      setFormData({
        code: "",
        discountType: "percentage",
        discountValue: 0,
        range: "global",
        targetId: "",
        expiresAt: "",
        usageLimit: 0,
      })
      setOpen(false)
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to create coupon",
        description: error?.message || "Something went wrong.",
      })
    }
  }

  const getTargetOptions = () => {
    if (formData.range === "category") return options.categories
    if (formData.range === "subcategory") return options.subcategories
    if (formData.range === "product") return options.products
    return []
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex flex-col items-center justify-center w-48 border-2 border-dashed rounded-xl cursor-pointer hover:border-gray-400 transition">
          <Plus className="w-12 h-12 text-gray-400" />
          <span className="text-sm text-gray-500 mt-2">Create Coupon</span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Coupon</DialogTitle>
          <DialogDescription>Fill in the coupon details below.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right" htmlFor="code">Code</label>
            <input name="code" value={formData.code} onChange={handleChange} required className="col-span-3 border rounded px-3 h-10" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right" htmlFor="discountType">Type</label>
            <select name="discountType" value={formData.discountType} onChange={handleChange} className="col-span-3 border rounded px-3 h-10">
              <option value="percentage">Percentage</option>
              <option value="flat">Flat</option>
            </select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right" htmlFor="discountValue">Value</label>
            <input name="discountValue" type="number" value={formData.discountValue} onChange={handleChange} required className="col-span-3 border rounded px-3 h-10" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right" htmlFor="range">Range</label>
            <select name="range" value={formData.range} onChange={handleChange} className="col-span-3 border rounded px-3 h-10">
              <option value="global">Global</option>
              <option value="category">Category</option>
              <option value="subcategory">Subcategory</option>
              <option value="product">Product</option>
            </select>
          </div>
          {formData.range !== "global" && (
            <div className="grid grid-cols-4 items-center gap-4">
              <label className="text-right" htmlFor="targetId">Target</label>
              <select name="targetId" value={formData.targetId} onChange={handleChange} className="col-span-3 border rounded px-3 h-10">
                <option value="">Select...</option>
                {getTargetOptions().map((item: any) => (
                  <option key={item._id} value={item._id}>{item.name}</option>
                ))}
              </select>
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right" htmlFor="expiresAt">Expires</label>
            <input name="expiresAt" type="date" value={formData.expiresAt} onChange={handleChange} required className="col-span-3 border rounded px-3 h-10" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label className="text-right" htmlFor="usageLimit">Usage</label>
            <input name="usageLimit" type="number" value={formData.usageLimit} onChange={handleChange} className="col-span-3 border rounded px-3 h-10" />
          </div>
          <DialogFooter>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
