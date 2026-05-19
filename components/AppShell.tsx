"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, ListMusic, LogOut, PlusCircle, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { ThemeSelector } from "@/components/ThemeSelector";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/add", label: "Add Concert", icon: PlusCircle },
  { href: "/concerts", label: "My Concerts", icon: ListMusic },
];

export function AppShell({
  children,
  userEmail,
}: {
  children: React.ReactNode;
  userEmail: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-dvh bg-base-200">
      <header className="navbar bg-base-100 border-b border-base-300 shadow-sm px-4 lg:px-8">
        <div className="flex-1 flex-col items-start gap-0.5 min-w-0">
          <h1 className="text-lg sm:text-xl font-bold truncate">Concert Cost Tracker</h1>
          <p className="text-xs text-base-content/60 hidden sm:block">
            Track what you spend and how much fun you had at every show
          </p>
        </div>
        <div className="flex-none flex flex-wrap items-center gap-2 justify-end">
          <ThemeSelector compact />
          <div className="hidden md:flex items-center gap-1 text-sm text-base-content/70 max-w-[12rem] truncate">
            <User className="h-4 w-4 shrink-0" />
            <span className="truncate" title={userEmail}>
              {userEmail}
            </span>
          </div>
          <button type="button" className="btn btn-ghost btn-sm gap-1" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </header>

      <div className="px-4 lg:px-8 py-4 max-w-7xl mx-auto w-full">
        <div role="tablist" className="tabs tabs-boxed bg-base-100 shadow-sm mb-6 w-full flex-wrap">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                role="tab"
                className={`tab gap-2 flex-1 sm:flex-none ${active ? "tab-active" : ""}`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </div>
        {children}
      </div>
    </div>
  );
}


