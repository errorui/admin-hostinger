import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { AppAccordion } from "./AppAccordion";
import Link from "next/link";
// Menu items.


export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
      
        <SidebarGroup>
      
      
        <SidebarGroupLabel >
          <Link href={'/admin'}>
          Application</Link>
          
          </SidebarGroupLabel>
        
          

          <SidebarGroupContent>
            <SidebarMenu>
            <AppAccordion></AppAccordion>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
