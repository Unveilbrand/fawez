"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase/client";

type AdminUser = { email: string; role: string };

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    (async () => {
      const supabase = getSupabaseBrowser();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session?.user?.email) {
        const next = encodeURIComponent(window.location.pathname + window.location.search);
        router.replace(`/login?next=${next}`);
        return;
      }
      const res = await fetch("/api/auth/admin-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email }),
      });
      const { isAdmin, role } = await res.json();
      if (!isAdmin) {
        router.replace("/");
        return;
      }
      setUser({ email: session.user.email, role: role ?? "admin" });
      setChecking(false);
    })();
  }, [router]);

  async function logout() {
    await getSupabaseBrowser().auth.signOut();
    router.replace("/login");
  }

  if (checking || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5F6FA]">
        <p className="text-sm text-gray-500">Loading dashboard…</p>
      </main>
    );
  }

  const navItems = [
    {
      label: "Overview",
      href: "/admin",
      active: pathname === "/admin",
      icon: (
        <>
          <rect x="3" y="3" width="7" height="9" rx="1" />
          <rect x="14" y="3" width="7" height="5" rx="1" />
          <rect x="14" y="12" width="7" height="9" rx="1" />
          <rect x="3" y="16" width="7" height="5" rx="1" />
        </>
      ),
    },
    {
      label: "Blogs",
      href: "/admin/blogs",
      active: pathname.startsWith("/admin/blogs"),
      icon: (
        <>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M8 7h8M8 12h8M8 17h5" />
        </>
      ),
    },
    {
      label: "Bookings",
      href: "/admin/bookings",
      active: pathname.startsWith("/admin/bookings"),
      icon: (
        <>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </>
      ),
    },
  ];

  return (
    <main className="flex min-h-screen bg-[#F5F6FA]">
      {/* Sidebar */}
      <aside className="sticky top-0 flex h-svh w-16 shrink-0 flex-col self-start bg-white sm:w-60">
        <div className="px-4 py-5 sm:px-6">
          <Link href="/" aria-label="Fawez home">
            <Image
              src="/images/fawez_logo.png"
              alt="Fawez - Helping Hands"
              width={255}
              height={71}
              className="h-9 w-auto"
            />
          </Link>
        </div>

        <nav className="mt-4 flex-1 space-y-1 px-3 sm:px-4">
          {navItems.map(({ label, href, active, icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                active ? "bg-primary text-white" : "text-black hover:bg-gray-100"
              }`}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                {icon}
              </svg>
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}
        </nav>

        <div className="px-3 pb-6 sm:px-4">
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="M16 17l5-5-5-5M21 12H9" />
            </svg>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 bg-white px-4 py-4 sm:px-8">
          <div className="relative w-full max-w-md">
            <input
              type="search"
              placeholder="search anything"
              className="w-full rounded-lg bg-[#F5F6FA] py-2.5 pl-4 pr-10 text-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-primary/30"
            />
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right text-xs leading-tight sm:block">
              <p className="max-w-[180px] truncate text-sm font-medium text-black">{user.email}</p>
              <p className="capitalize text-gray-500">{user.role}</p>
            </div>
            <span className="flex size-9 items-center justify-center rounded-full bg-primary text-sm font-bold uppercase text-white">
              {user.email[0]}
            </span>
          </div>
        </header>

        <div className="flex-1 p-4 sm:p-8">{children}</div>
      </div>
    </main>
  );
}
