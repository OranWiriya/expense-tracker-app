"use client";

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavItemType } from "./nav-data";

const AppSidebarHeader = ({ header }: { header: NavItemType }) => {
  const { state } = useSidebar();
  return (
    <SidebarHeader className="border-b">
      <SidebarMenu className={"flex-row items-center justify-between p-0"}>
        <SidebarMenuButton
          size={"lg"}
          tooltip={"Expense Tracker"}
          className="font-bold p-0 pr-2 justify-between group-data-[collapsible=icon]:size-12! cursor-pointer hover:bg-primary hover:text-primary-foreground "
        >
          <div className="flex size-8 items-center justify-left group-data-[collapsible=icon]:w-8!">
            {header.icon && <header.icon className="size-8! " />}
          </div>
          {state === "expanded" && (
            <span className="text-sm">{header.title}</span>
          )}
        </SidebarMenuButton>
        <SidebarTrigger
          className={
            "size-10 group-data-[collapsible=icon]:size-10! cursor-pointer"
          }
        />
      </SidebarMenu>
    </SidebarHeader>
  );
};

export default AppSidebarHeader;
