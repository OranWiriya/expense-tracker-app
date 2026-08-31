"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { SquareTerminal } from "lucide-react";
import Link from "next/link";

export function AppSidebar() {
  const { state } = useSidebar();
  return (
    <>
      <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader />
        <SidebarContent>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem key={"test"}>
              <SidebarMenuButton>
                <Link href={"/"} className="flex">
                  <SquareTerminal />
                  {state === "expanded" && <span>test</span>}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarGroup />
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
      <SidebarTrigger />
    </>
  );
}
