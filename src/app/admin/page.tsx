"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { formatBlogDate } from "@/lib/blogs";

type Booking = {
  id: string;
  name: string;
  phone: string | null;
  subject: string;
  date: string;
  time: string;
  created_at: string;
};

type BlogRow = { id: string; title: string; slug: string; created_at: string };

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];

function startOfWeek(offsetWeeks = 0) {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay() - offsetWeeks * 7);
  return d;
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          {icon}
        </span>
        <div className="flex flex-col">
          <p className="text-xs text-gray-400">{label}</p>
          <p className="text-2xl font-bold text-black">{value}</p>
        </div>
      </div>
      
    </div>
  );
}

function Overview() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [blogs, setBlogs] = useState<BlogRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<"this" | "last" | "monthly">("this");

  useEffect(() => {
    (async () => {
      const supabase = getSupabaseBrowser();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const [bookingsRes, blogsRes] = await Promise.all([
        fetch("/api/admin/bookings", {
          headers: { Authorization: `Bearer ${session?.access_token ?? ""}` },
        }),
        supabase.from("blogs").select("id, title, slug, created_at").order("created_at", { ascending: false }),
      ]);
      if (bookingsRes.ok) {
        const json = await bookingsRes.json();
        setBookings(json.bookings ?? []);
      }
      setBlogs((blogsRes.data ?? []) as BlogRow[]);
      setLoading(false);
    })();
  }, []);

  const thisWeekStart = useMemo(() => startOfWeek(0), []);
  const lastWeekStart = useMemo(() => startOfWeek(1), []);

  const bookingsThisWeek = useMemo(
    () => bookings.filter((b) => new Date(b.created_at) >= thisWeekStart).length,
    [bookings, thisWeekStart]
  );
  const blogsThisWeek = useMemo(
    () => blogs.filter((b) => new Date(b.created_at) >= thisWeekStart).length,
    [blogs, thisWeekStart]
  );

  const chartData = useMemo(() => {
    if (period === "monthly") {
      const now = new Date();
      const months = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (6 - i), 1);
        return d;
      });
      const counts = months.map(
        (m) =>
          bookings.filter((b) => {
            const d = new Date(b.created_at);
            return d.getFullYear() === m.getFullYear() && d.getMonth() === m.getMonth();
          }).length
      );
      return {
        labels: months.map((m) => m.toLocaleDateString("en-US", { month: "short" })),
        counts,
      };
    }
    const start = period === "this" ? thisWeekStart : lastWeekStart;
    const counts = Array(7).fill(0) as number[];
    for (const b of bookings) {
      const d = new Date(b.created_at);
      const diff = Math.floor((d.getTime() - start.getTime()) / 86400000);
      if (diff >= 0 && diff < 7) counts[d.getDay()]++;
    }
    return { labels: DAY_LABELS, counts };
  }, [bookings, period, thisWeekStart, lastWeekStart]);

  const maxCount = Math.max(2, ...chartData.counts);
  const yMax = Math.ceil(maxCount / 2) * 2;
  const yTicks = Array.from({ length: yMax / 2 + 1 }, (_, i) => i * 2).reverse();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">Overview</h1>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Blogs"
          value={blogs.length}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M8 7h8M8 12h8M8 17h5" />
            </svg>
          }
        />
        <StatCard
          label="Total Bookings"
          value={bookings.length}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
          }
        />
        <StatCard
          label="Bookings This Week"
          value={bookingsThisWeek}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 3" />
            </svg>
          }
        />
        <StatCard
          label="Blogs This Week"
          value={blogsThisWeek}
          icon={
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
            </svg>
          }
        />
      </div>

      {/* Recent bookings */}
      <div className="overflow-x-auto rounded-xl bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-black">Recent Bookings</h2>
          <Link href="/admin/bookings" className="text-xs font-medium text-primary hover:underline">
            View all
          </Link>
        </div>
        <table className="mt-4 w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs uppercase text-gray-400">
              <th className="pb-3 pr-4 font-medium">Name</th>
              <th className="pb-3 pr-4 font-medium">Subject</th>
              <th className="pb-3 pr-4 font-medium">Phone</th>
              <th className="pb-3 font-medium">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-400">Loading…</td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-400">No bookings yet.</td>
              </tr>
            ) : (
              bookings.slice(0, 5).map((b) => (
                <tr key={b.id} className="border-b border-gray-50 last:border-0">
                  <td className="py-3 pr-4 font-medium text-black">{b.name}</td>
                  <td className="py-3 pr-4 text-black">{b.subject}</td>
                  <td className="py-3 pr-4 text-black">{b.phone || "—"}</td>
                  <td className="py-3 text-black">{formatBlogDate(b.created_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Chart + latest blogs */}
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.05)] xl:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-black">Bookings</h2>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as "this" | "last" | "monthly")}
              className="rounded-lg border border-gray-200 px-3 py-2 text-xs text-black outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="this">This Week</option>
              <option value="last">Last Week</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div className="mt-6 flex">
            <div className="flex w-8 flex-col justify-between pb-7 text-right text-xs text-gray-400">
              {yTicks.map((t) => (
                <span key={t} className="pr-2 leading-none">{t}</span>
              ))}
            </div>
            <div className="relative flex-1">
              <div className="absolute inset-x-0 bottom-7 top-0 flex flex-col justify-between">
                {yTicks.map((t) => (
                  <span key={t} className="h-px w-full bg-gray-100" />
                ))}
              </div>
              <div className="relative flex h-56 items-end justify-around pb-7">
                {chartData.counts.map((count, i) => (
                  <div key={i} className="flex h-full flex-col items-center justify-end">
                    <div
                      title={`${count} booking${count === 1 ? "" : "s"}`}
                      style={{ height: `${(count / yMax) * 100}%` }}
                      className="w-6 rounded-full bg-primary transition-all sm:w-8"
                    />
                  </div>
                ))}
              </div>
              <div className="absolute inset-x-0 bottom-0 flex justify-around text-xs text-gray-400">
                {chartData.labels.map((d, i) => (
                  <span key={`${d}-${i}`} className="w-6 text-center sm:w-8">{d}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-primary">
            <span className="size-2.5 rounded-full bg-primary" />
            Bookings
          </div>
        </div>

        <div className="rounded-xl bg-white p-5 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-black">Latest Blogs</h2>
            <Link href="/admin/blogs" className="text-xs font-medium text-primary hover:underline">
              View all
            </Link>
          </div>
          <ul className="mt-4 space-y-4">
            {loading ? (
              <li className="py-4 text-center text-sm text-gray-400">Loading…</li>
            ) : blogs.length === 0 ? (
              <li className="py-4 text-center text-sm text-gray-400">No blogs yet.</li>
            ) : (
              blogs.slice(0, 5).map((b) => (
                <li key={b.id} className="border-b border-gray-50 pb-3 last:border-0">
                  <Link
                    href={`/admin/blogs/${b.id}/edit`}
                    className="line-clamp-2 text-sm font-medium text-black hover:text-primary"
                  >
                    {b.title}
                  </Link>
                  <p className="mt-0.5 text-xs text-gray-400">{formatBlogDate(b.created_at)}</p>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminShell>
      <Overview />
    </AdminShell>
  );
}
