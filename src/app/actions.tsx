"use server"

import { revalidatePath } from "next/cache";
import { redirect } from "next/dist/server/api-utils";
import { cookies } from "next/headers";
import { error } from "node:console";



// ddddddd
export const handleDeleteSubcategories = async (id:string) => {
    "use server"
    const c = await cookies()
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subcategories/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        Cookie: c.toString()
      }
      });    
      const data = await response.json();

      if (response.ok) {
     
        revalidatePath("/admin/subcategories")
        
      } else {
        throw error("Error deleting subcategory:", data.error);
      }
    } catch (error) {
      console.error("Error deleting subcategory:", error);
    }
  };
export const handleDeleteCategories = async (id:string) => {
    "use server"
    const c = await cookies()
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        Cookie: c.toString()
      }
      });
      
      
      
      
      
      

      const data = await response.json();
      if (response.ok) {
        // console.log("Subcategory deleted successfully", data);
        revalidatePath("/admin/categories");
        
      } else {
        console.error("Error deleting subcategory:", data.error);
      }
    } catch (error) {
      console.error("Error deleting subcategory:", error);
    }
  };
export const handleDeleteProducts = async (id:string) => {
    "use server"
    const c = await cookies()
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`, {
      method: "DELETE",
      credentials: "include",
      headers: {
        Cookie: c.toString()
      }
      });   
      //  console.log("response", response);
      const data = await response.json();
      if (response.ok) {
        // console.log("Subcategory deleted successfully", data);
        revalidatePath("/admin/products");
        
      } else {
        console.error("Error deleting subcategory:", data.error);
      }
    } catch (error) {
      console.error("Error deleting subcategory:", error);
    }
  };




  
// export const handleCreate = async (data,colors) => {
//     "use server"
//     const formdata = new FormData();
  
//     // Append text fields to FormData
//     formdata.append("category", data.category);
//     formdata.append("subcategory", data.subcategory);
//     formdata.append("name", data.name);
//     formdata.append("description", data.description);
//     formdata.append("price", data.price);
  
   
//     Object.keys(colors).forEach((color) => {
    
//       Object.keys(colors[color].size).forEach((sizeLabel) => {
//         formdata.append(`colors[${color}][size][${sizeLabel}]`, colors[color].size[sizeLabel].toString());
//       });
  
     
//       colors[color].images.forEach((image, index) => {
//         if(image){
//             formdata.append(`colors[${color}][images][${index}]`, image);
//         }
        
//       });
//     });
//     const c = await cookies()
//     console.log("formdata", formdata);
//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/create`, {
//         method: "POST",
//         body: formdata,
       
//         headers: {
//             Cookie: c.toString()
//         }
//     });
//     if (response.ok) {
        
//         revalidatePath("/");
        
//       } 
//     return response
// }


export const handleUpdatesubcategory = async (id: string, formdata:FormData) => {
  "use server"
  const c = await cookies()
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subcategories/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
       
        Cookie: c.toString()
      },
      body: formdata
    });
    
    const data = await response.json();
    revalidatePath("admin/subcategories");
    if (response.ok) {
      
      return data;
    } else {
      throw new Error(data.error);
    }
      
  } catch (error) {
    console.error("Error updating subcategory:", error);
    throw error;
  }
};
export const handleUpdatecategory = async (id: string, formdata:FormData) => {
   "use server"
  const c = await cookies()
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
       
        Cookie: c.toString()
      },
      body: formdata
    });
    
    const data = await response.json();
    if (response.ok) {
      revalidatePath("/admin/categories");
      return data;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const handleUpdateProduct = async (id: string, formdata:FormData) => {
  "use server"
  const c = await cookies()
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/product/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
       
        Cookie: c.toString()
      },
      body: formdata
    });
    // console.log("response", response);
    const data = await response.json();
    if (response.ok) {
      revalidatePath("/admin/products");
      return data;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};




export const handleRemoveSubfromcateorgy=async(categoryid:string,subcategoryid:string)=>{
   "use server"
  const c = await cookies()
  
  try {
    const formdata=new FormData()
    
    formdata.append("subcategoryid",subcategoryid)
    console.log("formdata",formdata)
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/remove/${categoryid}/${subcategoryid}`
      , {
     method:"PUT",
     credentials:"include",
      headers: {
        ContentType:"application/json",
        Cookie: c.toString()
      },
      body: formdata
    });
    if(response.ok){
      revalidatePath(`/admin/categories/${categoryid}`)
    }

  } catch (error) {
    console.log("erro while removing SUB from category",error)
    throw error
  }

}











export const handleRemoveProductsFromSubcateorgy=async(subcategoryid:string,productid:string)=>{
   
  const c = await cookies()
  console.log("hit handleremoveproduct")
  try {
    const formdata=new FormData()
    formdata.append("productid",productid)
    console.log(formdata)
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subcategories/remove/${subcategoryid}/${productid}`
      , {
      method: "POST",
      credentials:"include",
      headers: {
       ContentType:"application/json",
        Cookie: c.toString()
      },
      body: formdata
    });
    if(response.ok){
    
      revalidatePath(`/admin/subcategories/${subcategoryid}`)
      
    }
   
   
  } catch (error) {
    console.log("erro while removing product from subcategory",error)
    throw error
  }

}










export  async function check2(message:any){
       try {
        console.log("message",message)
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/check`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({message})
        });
        // console.log(response)
        if(response.ok){
          const data = await response.json();
        
        return data
        }
       
      
       } catch (error) {
        console.log(error);
       }


}







export const handleCreateCategory = async (formData: FormData) => {
  const c = await cookies()

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categories/create`, {
      method: "POST",
      body: formData,
      credentials: "include",
      headers: {
        Cookie: c.toString(),
      },
    })

    const data = await response.json()

    if (response.ok) {
      revalidatePath("/admin/categories")
      return data
    } else {
      console.error("Failed to create category:", data)
      throw new Error(data.message || "Error creating category")
    }
  } catch (error) {
    console.error("Error in handleCreateCategory:", error)
    throw error
  }
}

export const handleCreateSubcategory = async (formData: FormData) => {
  const c = await cookies()
  

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subcategories/create`, {
      method: "POST",
      body: formData,
      credentials: "include",
      headers: {
        Cookie: c.toString(),
      },
    })

    const data = await response.json()

    if (response.ok) {
      revalidatePath("/admin/subcategories")
      return data
    } else {
      console.error("Failed to create subcategory:", data)
      throw new Error(data.message || "Error creating subcategory")
    }
  } catch (error) {
    console.error("Error in handleCreateSubcategory:", error)
    throw error
  }
}
export const handleCreateCoupon = async (formData: any) => {
  const c = await cookies()
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/coupons/`, {
      method: "POST",
      body: JSON.stringify(formData),
      credentials: "include",
      headers: {
        Cookie: c.toString(),
        "Content-Type": "application/json"
      },
    })

    if (!response.ok) {
      console.error("Failed to create coupon:", await response.json())
      throw new Error("Error creating coupon")
    }
    const data = await response.json()

    if (response.ok) {
      revalidatePath("/admin/coupons")
      return data
    } else {
      console.error("Failed to create coupon:", data)
      throw new Error(data.message || "Error creating coupon")
    }
  } catch (error) {
    console.error("Error in handleCreateCoupon:", error)
    throw error
  }
}