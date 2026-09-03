import {
  House,
  TableProperties,
  Calendar,
  Newspaper,
  Wallet,
  Cat,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ElementType } from "react";

export interface NavItemType {
  title: string;
  url: string;
  icon?: LucideIcon | ElementType;
}

export interface NavContentType extends Omit<NavItemType, "url"> {
  items: NavItemType[];
}

export interface NavFooterType {
  title: string;
  subtitle: string;
}

export interface SidebarType {
  header: NavItemType;
  content: NavContentType[];
  footer: NavFooterType;
}

export const navHeader = { title: "EXPENSE TRACKER", url: "/", icon: Cat };

export const navMain = [
  {
    title: "home",
    items: [
      {
        title: "Overview",
        url: "/",
        icon: House,
      },
      {
        title: "Transactions",
        url: "/transactions",
        icon: TableProperties,
      },
      {
        title: "Calendar",
        url: "/calendar",
        icon: Calendar,
      },
      {
        title: "Reports",
        url: "/reports",
        icon: Newspaper,
      },
      {
        title: "Wallet",
        url: "/wallet",
        icon: Wallet,
      },
    ],
  },
];

export const navFooter = {
  title: "© 2026 All rights reserved",
  subtitle: "the website bake by love.",
};
