import {
  SidebarFooter,
  SidebarGroup,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavFooterType } from "./nav-data";

const AppSidebarFooter = ({ footer }: { footer: NavFooterType }) => {
  const { state } = useSidebar();
  return (
    <SidebarFooter>
      <SidebarGroup className="items-center text-zinc-500">
        <h1 className={state === "expanded" ? "text-sm" : "text-xs"}>
          {footer.title}
        </h1>
        <span className={state === "expanded" ? "text-xs" : "hidden"}>
          {footer.subtitle}
        </span>
      </SidebarGroup>
    </SidebarFooter>
  );
};

export default AppSidebarFooter;
