import { SidebarHeader } from "@/components/ui/sidebar";

const AppSidebarHeader = ({ header }: { header: string[] }) => {
  return (
    <SidebarHeader>
      <h1>App Header</h1>
    </SidebarHeader>
  );
};

export default AppSidebarHeader;
