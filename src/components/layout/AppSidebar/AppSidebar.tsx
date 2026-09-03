"use client";

import AppSidebarHeader from "./AppSidebarHeader";
import AppSidebarFooter from "./AppSidebarFooter";
import AppSidebarContent from "./AppSidebarContent";
import { Sidebar, SidebarSeparator } from "@/components/ui/sidebar";
import { navFooter, navHeader, navMain, SidebarType } from "./nav-data";

const AppSidebar = (props: SidebarType) => {
  const { header = null, content = [], footer = null } = props;
  const headerContent = header ?? navHeader;
  const contentMap = content.length > 0 ? content : navMain;
  const footerContent = footer ?? navFooter;
  return (
    <>
      <Sidebar collapsible="icon" variant="inset" className="border-r p-0">
        <AppSidebarHeader header={headerContent} />
        <AppSidebarContent content={contentMap} />
        <SidebarSeparator />
        <AppSidebarFooter footer={footerContent} />
      </Sidebar>
    </>
  );
};

export default AppSidebar;
