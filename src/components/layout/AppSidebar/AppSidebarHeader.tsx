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
      <SidebarMenu
        className={
          state === "collapsed"
            ? "flex-row items-center justify-between"
            : "flex-row items-center"
        }
      >
        <SidebarMenuButton
          size={"lg"}
          tooltip={"Expense Tracker"}
          className="font-bold hover:bg-primary hover:text-primary-foreground"
        >
          <div className="flex size-12 items-center justify-center">
            <Cat className="size-8! " />
          </div>
          {state === "expanded" && (
            <span className="text-sm">EXPENSE TRACKER</span>
          )}
        </SidebarMenuButton>
        <SidebarTrigger />
      </SidebarMenu>
    </SidebarHeader>
  );
};

export default AppSidebarHeader;
