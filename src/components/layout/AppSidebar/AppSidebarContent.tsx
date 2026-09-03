"use client";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavContentType } from "./nav-data";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { isActiveNavMenu } from "./utils";

const AppSidebarContent = ({ content }: { content: NavContentType[] }) => {
  const pathname = usePathname();
  const { state } = useSidebar();

  const classNameSidebarButtonBase =
    " hover:text-primary-foreground data-active:text-primary-foreground data-active:font-bold data-active:hover:text-primary-foreground";

  return (
    <>
      <SidebarContent>
        {content.map((contentItem, index) => (
          <SidebarGroup key={contentItem.title + index}>
            <SidebarGroupLabel className="text-base uppercase">
              {contentItem.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {contentItem.items?.map((item, index) => {
                  return (
                    <SidebarMenuItem key={item.title + index}>
                      <SidebarMenuButton
                        isActive={isActiveNavMenu({ pathname, url: item.url })}
                        render={<Link href={item.url} />}
                        variant={"outline"}
                        size={"lg"}
                        className={
                          (state === "collapsed"
                            ? "min-w-full justify-center items-center"
                            : "") + classNameSidebarButtonBase
                        }
                      >
                        {item.icon && <item.icon className={"size-6!"} />}
                        {
                          <span
                            className={state === "collapsed" ? "hidden" : ""}
                          >
                            {item.title}
                          </span>
                        }
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </>
  );
};

export default AppSidebarContent;
