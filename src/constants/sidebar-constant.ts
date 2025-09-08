// "use client";
import { Home } from "lucide-react";

export const SIDEBAR_MENU_LIST = {
  admin: [
    {
      title: "Home",
      url: "/home",
      icon: Home,
    },
  ],
  cashier: [],
  kitchen: [],
};

export type SidebarMenuKey = keyof typeof SIDEBAR_MENU_LIST;
