"use client";

import { usePathname } from "next/navigation";
import AppAvatar from "./AppAvatar";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import AppDialog from "./AppDialog";

const pageNames = [
  { title: "Overview", url: "/" },
  { title: "Transactions", url: "/transactions" },
  { title: "Calendar", url: "/calendar" },
  { title: "Reports", url: "/reports" },
  { title: "Wallet", url: "/wallet" },
  { title: "Profile", url: "/profile" },
  { title: "Settings", url: "/settings" },
];

const AppTopbar = () => {
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const headerName = pageNames.find((page) => pathname === page.url)?.title;

  return (
    <div className="sticky top-0 bg-background flex flex-row justify-between items-center p-2.5 px-3 border-b">
      <div className="flex items-center">
        {isMobile && (
          <SidebarTrigger
            className={
              "size-10 group-data-[collapsible=icon]:size-10! cursor-pointer"
            }
          />
        )}
        <div className="flex-1 ">
          <h1 className="font-medium">{headerName ?? ""}</h1>
          <div className="text-sm text-zinc-500">{headerName ?? ""}</div>
        </div>
      </div>
      <div className="flex flex-row items-center gap-2">
        {/* TODO: Add search v2*/}
        {/* <Field orientation="horizontal">
          <Input type="search" placeholder="Search" />
        </Field> */}
        <AppDialog />
        <Separator orientation="vertical" />
        <AppAvatar username="John Doe" />
      </div>
    </div>
  );
};

export default AppTopbar;
