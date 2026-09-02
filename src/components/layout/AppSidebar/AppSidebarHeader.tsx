"use client";

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Cat } from "lucide-react";

const AppSidebarHeader = ({ header }: { header: string[] }) => {
  const { state } = useSidebar();
  return (
    <SidebarHeader className="border-b">
      <SidebarMenu className={"flex-row items-center justify-between p-0"}>
        <SidebarMenuButton
          size={"lg"}
          tooltip={"Expense Tracker"}
          className="font-bold p-0 pr-2 justify-between group-data-[collapsible=icon]:size-12!  hover:bg-primary hover:text-primary-foreground "
        >
          <div className="flex size-8 items-center justify-left group-data-[collapsible=icon]:w-8!">
            <Cat className="size-8! " />
          </div>
          {state === "expanded" && (
            <span className="text-sm">EXPENSE TRACKER</span>
          )}
        </SidebarMenuButton>
        <SidebarTrigger
          className={"size-10 group-data-[collapsible=icon]:size-10!"}
        />
      </SidebarMenu>
    </SidebarHeader>
  );
};

export default AppSidebarHeader;
