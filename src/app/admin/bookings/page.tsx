"use client";

import { useEffect, useMemo, useState } from "react";
import AdminShell from "@/components/admin/AdminShell";
import ConfirmDelete from "@/components/admin/ConfirmDelete";
import { getSupabaseBrowser } from "@/lib/supabase/client";
import { formatBlogDate } from "@/lib/blogs";

type Booking = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  date: string;
  time: string;
  subject: string;
  message: string;
  created_at: string;
};

async function getToken() {
  const {
    data: { session },
  } = await getSupabaseBrowser().auth.getSession();
  return session?.access_token ?? "";
}

function BookingsDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [pendingDelete, setPendingDelete] = useState<Booking | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [mailFor, setMailFor] = useState<Booking | null>(null);
  const [mailSubject, setMailSubject] = useState("");
  const [mailMessage, setMailMessage] = useState("");
  const [mailSending, setMailSending] = useState(false);
  const [mailStatus, setMailStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/bookings", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      const json = await res.json();
      if (res.ok) setBookings(json.bookings ?? []);
      else setError(json.error ?? "Could not load bookings.");
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return bookings;
    return bookings.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.subject.toLowerCase().includes(q) ||
        (b.phone ?? "").includes(q)
    );
  }, [bookings, query]);

  async function remove(booking: Booking) {
    setDeleting(booking.id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/bookings/${booking.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (!res.ok) {
        const { error: msg } = await res.json();
        setError(msg ?? "Delete failed");
        return;
      }
      setBookings((prev) => prev.filter((b) => b.id !== booking.id));
      setSelected((cur) => (cur?.id === booking.id ? null : cur));
      setPendingDelete(null);
    } finally {
      setDeleting(null);
    }
  }

  function openMail(booking: Booking) {
    setMailFor(booking);
    setMailSubject(`Re: Your booking — ${booking.subject}`);
    setMailMessage("");
    setMailStatus(null);
  }

  async function sendMail() {
    if (!mailFor) return;
    setMailSending(true);
    setMailStatus(null);
    try {
      const res = await fetch(`/api/admin/bookings/${mailFor.id}/mail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await getToken()}`,
        },
        body: JSON.stringify({ subject: mailSubject, message: mailMessage }),
      });
      const json = await res.json();
      if (!res.ok) {
        setMailStatus(json.error ?? "Could not send the email.");
        return;
      }
      setMailStatus("Email sent.");
      setTimeout(() => setMailFor(null), 1200);
    } catch {
      setMailStatus("Could not send the email.");
    } finally {
      setMailSending(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-primary">Bookings</h1>
        <div className="relative">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, subject or phone"
            className="w-56 rounded-lg border border-gray-200 bg-white py-2.5 pl-4 pr-10 text-sm outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-primary/30 sm:w-72"
          />
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-6 overflow-x-auto rounded-xl bg-white p-2 shadow-[0_2px_16px_rgba(0,0,0,0.05)]">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs uppercase text-gray-400">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Subject</th>
              <th className="px-4 py-3 font-medium">Requested</th>
              <th className="px-4 py-3 font-medium">Submitted</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                  Loading bookings…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                  {bookings.length === 0 ? "No bookings yet." : "No bookings match your search."}
                </td>
              </tr>
            ) : (
              filtered.map((booking) => (
                <tr key={booking.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3 font-medium text-black">{booking.name}</td>
                  <td className="px-4 py-3 text-black">{booking.phone || "—"}</td>
                  <td className="px-4 py-3 text-black">{booking.subject}</td>
                  <td className="px-4 py-3 text-black">
                    {booking.date} · {booking.time}
                  </td>
                  <td className="px-4 py-3 text-black">{formatBlogDate(booking.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setSelected(booking)}
                        aria-label="View booking"
                        className="text-gray-400 transition-colors hover:text-primary"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => openMail(booking)}
                        disabled={!booking.email}
                        title={booking.email ? "Send email" : "No email on this booking"}
                        aria-label="Send mail"
                        className={
                          booking.email
                            ? "text-gray-400 transition-colors hover:text-primary"
                            : "cursor-not-allowed text-gray-300"
                        }
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="4" width="20" height="16" rx="2" />
                          <path d="m22 7-10 6L2 7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPendingDelete(booking)}
                        disabled={deleting === booking.id}
                        aria-label="Delete booking"
                        className="text-gray-400 transition-colors hover:text-red-600 disabled:opacity-50"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-lg font-bold text-black">Booking details</h2>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="text-gray-400 hover:text-black"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              {[
                ["Name", selected.name],
                ["Email", selected.email || "—"],
                ["Phone", selected.phone || "—"],
                ["Subject", selected.subject],
                ["Requested", `${selected.date} · ${selected.time}`],
                ["Submitted", formatBlogDate(selected.created_at)],
              ].map(([label, value]) => (
                <div key={label} className="flex gap-3">
                  <dt className="w-24 shrink-0 font-medium text-gray-400">{label}</dt>
                  <dd className="text-black">{value}</dd>
                </div>
              ))}
              <div>
                <dt className="font-medium text-gray-400">Message</dt>
                <dd className="mt-1 rounded-lg bg-[#F5F6FA] p-3 leading-relaxed text-black">
                  {selected.message}
                </dd>
              </div>
            </dl>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => selected.email && openMail(selected)}
                disabled={!selected.email}
                title={selected.email ? "Send email" : "No email on this booking"}
                className="flex-1 rounded-lg bg-primary py-3 text-sm font-bold uppercase text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-40"
              >
                Send Mail
              </button>
              <button
                type="button"
                onClick={() => setPendingDelete(selected)}
                disabled={deleting === selected.id}
                className="rounded-lg border border-red-200 px-5 py-3 text-sm font-bold uppercase text-red-600 transition-colors hover:bg-red-50 disabled:opacity-50"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {mailFor && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
          onClick={() => setMailFor(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-lg font-bold text-black">Send Mail</h2>
              <button
                type="button"
                onClick={() => setMailFor(null)}
                aria-label="Close"
                className="text-gray-400 hover:text-black"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-4 space-y-4 text-sm">
              <div>
                <label className="mb-1 block font-medium text-gray-400">To</label>
                <p className="rounded-lg bg-[#F5F6FA] px-4 py-3 text-black">
                  {mailFor.name} &lt;{mailFor.email}&gt;
                </p>
              </div>
              <div>
                <label htmlFor="mail-subject" className="mb-1 block font-medium text-gray-400">
                  Subject
                </label>
                <input
                  id="mail-subject"
                  value={mailSubject}
                  onChange={(e) => setMailSubject(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-black outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div>
                <label htmlFor="mail-message" className="mb-1 block font-medium text-gray-400">
                  Message
                </label>
                <textarea
                  id="mail-message"
                  value={mailMessage}
                  onChange={(e) => setMailMessage(e.target.value)}
                  rows={6}
                  placeholder="Write your reply…"
                  className="w-full resize-y rounded-lg border border-gray-200 px-4 py-3 text-black outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>
            {mailStatus && (
              <p className={`mt-3 text-center text-sm ${mailStatus === "Email sent." ? "text-primary" : "text-red-600"}`}>
                {mailStatus}
              </p>
            )}
            <button
              type="button"
              onClick={sendMail}
              disabled={mailSending || !mailSubject.trim() || !mailMessage.trim()}
              className="mt-5 w-full rounded-lg bg-primary py-3.5 text-sm font-bold uppercase text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
            >
              {mailSending ? "Sending…" : "Send"}
            </button>
          </div>
        </div>
      )}

      {pendingDelete && (
        <ConfirmDelete
          title="Delete Booking"
          message={`Deleting the booking from ${pendingDelete.name} will permanently remove it. This action cannot be undone.`}
          loading={deleting === pendingDelete.id}
          onCancel={() => setPendingDelete(null)}
          onConfirm={() => remove(pendingDelete)}
        />
      )}
    </div>
  );
}

export default function BookingsPage() {
  return (
    <AdminShell>
      <BookingsDashboard />
    </AdminShell>
  );
}
