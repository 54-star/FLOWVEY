"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  History,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Guests", url: "/guests", icon: Users },
  { title: "Messages", url: "/messages", icon: MessageSquare },
  { title: "Message History", url: "/message-history", icon: History },
  { title: "Feedback", url: "/feedback", icon: MessageSquare },
  { title: "Reports", url: "/reports", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { state, toggleSidebar, isMobile, openMobile, setOpenMobile } =
    useSidebar();

  const collapsed = state === "collapsed";

  return (
    <>
      {/* Mobile overlay */}
      {isMobile && openMobile && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden z-40"
          onClick={() => setOpenMobile(false)}
        />
      )}

      <Sidebar collapsible="icon" className="border-r">
        {/* HEADER */}
        <SidebarHeader className="border-b px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold">
                F
              </div>

              {!collapsed && (
                <div>
                  <h2 className="text-lg font-bold text-primary">Flowvey</h2>
                  <p className="text-xs text-muted-foreground">
                    Guest Review Platform
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile toggle */}
            

              {/* Collapse toggle */}
              <button
                onClick={toggleSidebar}
                className="rounded-md p-1 hover:bg-accent"
              >
                {collapsed ? (
                  <ChevronRight size={16} />
                ) : (
                  <ChevronLeft size={16} />
                )}
              </button>
            </div>
          </div>
        </SidebarHeader>

        {/* MENU */}
        <SidebarContent>
          <SidebarMenu className="p-2 space-y-1">
            {items.map((item) => {
              const isActive = pathname === item.url;

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link
                      href={item.url}
                      onClick={() => setOpenMobile(false)}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-accent ${
                        isActive ? "bg-accent text-foreground" : ""
                      } ${collapsed ? "justify-center" : ""}`}
                    >
                      <item.icon size={18} />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </>
  );
}