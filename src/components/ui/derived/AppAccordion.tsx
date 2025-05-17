import {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
  } from "@/components/ui/accordion";
  import { ChevronDown, FileText, PlusCircle } from "lucide-react"; // Import icons for links
import Link from "next/link";
  
  // Accordion menu items
  const accordionItems = [
    {
      title: "Orders",
      links: [
        { label: "All Orders", url: "/admin/orders", icon: FileText }, // Adding icon to links
      ],
    },
    {
      title: "coupons",
      links: [
        { label: "All coupons", url: "/admin/coupons", icon: FileText }, // Adding icon to links
      ],
    },
    {
      title: "Products",
      links: [
        { label: "All Products", url: "/admin/products", icon: FileText }, // Adding icon to links
        { label: "Make New Product", url: "/admin/products/new", icon: PlusCircle }, // Different icon for new product
      ],
    },
    {
      title: "Categories",
      links: [
        { label: "All categories", url: "/admin/categories", icon: FileText }, 
        
      ],
    },
    {
      title: "SubCategories",
      links: [
        { label: "All categories", url: "/admin/subcategories", icon: FileText }, 
        
      ],
    },
  ];
  
  export const AppAccordion = () => {
    return (
      <Accordion type="multiple" >
        {accordionItems.map((item, index) => (
          <AccordionItem key={index} value={item.title.toLowerCase()}>
            <AccordionTrigger className="flex items-center gap-2 text-lg font-medium">
              {item.title}
          
            </AccordionTrigger>
            <AccordionContent>
              <ul className="ml-4 space-y-2">
                {item.links.map((link, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <link.icon className="text-blue-500" size={16} /> {/* Icon next to the label */}
                    <Link href={link.url} className="text-blue-500">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  };
  