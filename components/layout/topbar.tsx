"use client";

import { useState } from "react";
import { ChevronUp, Bell, Search, UserCircle } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Topbar() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-3 sm:px-6 gap-2">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {/* Mobile sidebar trigger — hide while mobile search is open to give input full width */}
        {!mobileSearchOpen && (
          <SidebarTrigger className="md:hidden shrink-0" />
        )}

        {/* Search - full bar on sm+, icon/expand on mobile */}
        <div className="relative hidden sm:block w-full max-w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={18}
          />
          <input
            type="text"
            placeholder="Search guests..."
            className="w-full rounded-lg border border-border bg-card py-2 pl-10 pr-4 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Mobile search: icon button OR expanded input */}
        {mobileSearchOpen ? (
          <div className="relative w-full sm:hidden">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <input
              autoFocus
              type="text"
              placeholder="Search guests..."
              onBlur={() => setMobileSearchOpen(false)}
              className="w-full rounded-lg border border-border bg-card py-2 pl-10 pr-4 text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        ) : (
          <button
            onClick={() => setMobileSearchOpen(true)}
            className="sm:hidden rounded-full p-2 hover:bg-accent transition-colors shrink-0"
          >
            <Search size={20} />
          </button>
        )}
      </div>

      {/* Right Side — collapse entirely while mobile search is open */}
      {!mobileSearchOpen && (
        <div className="flex items-center gap-1 sm:gap-5 shrink-0">
          <div className="">
            <ThemeToggle />
          </div>

          <div className="relative">
            <button className="rounded-full p-2 hover:bg-accent transition-colors">
              <Bell size={20} />
            </button>
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </div>

          <button className="flex items-center gap-2 rounded-lg p-1.5 sm:p-2 transition-colors hover:bg-accent">
            <UserCircle className="h-8 w-8 sm:h-9 sm:w-9 text-primary" />
            <div className="text-left hidden md:block">
              <p className="text-sm font-semibold">Echo</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
            <ChevronUp className="h-4 w-4 text-muted-foreground hidden md:block" />
          </button>
        </div>
      )}
    </header>
  );
}