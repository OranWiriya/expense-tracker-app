import AppSidebarHeader from "./AppSidebarHeader";
import AppSidebarFooter from "./AppSidebarFooter";
import AppSidebarContent from "./AppSidebarContent";
import { Sidebar, SidebarTrigger } from "@/components/ui/sidebar";

const AppSidebar = (props) => {
  const { header, content, footer } = props;
  return (
    <>
      <Sidebar collapsible="icon" variant="inset">
        <AppSidebarHeader header={header} />
        <AppSidebarContent content={content} />
        <AppSidebarFooter footer={footer} />
      </Sidebar>
      <SidebarTrigger />
    </>
  );
};

export default AppSidebar;
