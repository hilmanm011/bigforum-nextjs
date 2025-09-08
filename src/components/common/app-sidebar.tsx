"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  SidebarGroup,
  SidebarGroupContent,
} from "../ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { LogOut } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
import {
  SIDEBAR_MENU_LIST,
  SidebarMenuKey,
} from "@/constants/sidebar-constant";

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { state } = useSidebar();

  return (
    <Sidebar collapsible="icon">
      {/* Header: Profile */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div className="font-semibold ">
                <Separator
                  orientation="vertical"
                  className="mr-2 h-6 border-r-2 border-orange-400"
                />
                {state === "expanded" && (
                  <span className="truncate">CRUD OPERATIONS</span>
                )}
                {state === "collapsed" && <span>C</span>}
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content: Menu */}
      <SidebarContent>
        {state === "expanded" && (
          <div className="flex flex-col items-center gap-2 px-1 py-1.5">
            <Avatar className="w-20 h-20 rounded-full">
              <AvatarImage
                src="/assets/default-avatar.png"
                alt={user?.firstName}
              />
              <AvatarFallback className="rounded-full">
                {user?.firstName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="leading-tight">
              <h4 className="truncate font-medium">
                {`${user?.firstName || "User"} ${user?.lastName || ""}`.trim()}
              </h4>
              <p className="text-muted-foreground truncate text-xs capitalize">
                {user?.role || "Admin"}
              </p>
            </div>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {SIDEBAR_MENU_LIST["admin" as SidebarMenuKey]?.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <a
                      href={item.url}
                      className={cn("px-4 py-3 h-auto", {
                        "bg-primary text-white font-semibold hover:bg-primary":
                          pathname === item.url,
                      })}
                    >
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer: Logout */}
      <SidebarFooter className="px-4 py-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="flex items-center gap-2 px-4 py-3 w-full text-left rounded-md"
              >
                <span>Logout</span>
                <LogOut className="w-4 h-4" />
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
