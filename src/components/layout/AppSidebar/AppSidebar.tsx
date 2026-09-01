import AppSidebarHeader from "./AppSidebarHeader";
import AppSidebarFooter from "./AppSidebarFooter";
import AppSidebarContent from "./AppSidebarContent";
import { Sidebar, SidebarTrigger } from "@/components/ui/sidebar";
import { Fragment } from "react/jsx-runtime";

const AppSidebar = (props) => {
  const { header, content, footer } = props;
  return (
    <>
      <Sidebar collapsible="icon" variant="inset" className="border-r px-0">
        <AppSidebarHeader header={header} />
        <AppSidebarContent content={content} />
        <AppSidebarFooter footer={footer} />
      </Sidebar>
    </>
  );
};

export default AppSidebar;
