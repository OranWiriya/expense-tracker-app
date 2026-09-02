import AppSidebarHeader from "./AppSidebarHeader";
import AppSidebarFooter from "./AppSidebarFooter";
import AppSidebarContent from "./AppSidebarContent";
import { Sidebar } from "@/components/ui/sidebar";

const AppSidebar = (props) => {
  const { header, content, footer } = props;
  return (
    <>
      <Sidebar collapsible="icon" variant="inset" className="border-r p-0">
        <AppSidebarHeader header={header} />
        <AppSidebarContent content={content} />
        <AppSidebarFooter footer={footer} />
      </Sidebar>
    </>
  );
};

export default AppSidebar;
