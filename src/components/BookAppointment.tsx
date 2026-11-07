"use client";

import { useState } from "react";
import { services } from "@/components/Services";

const input =
  "w-full rounded-md bg-[#F3F8FF] px-4 py-3.5 text-sm text-black placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-primary/40";

const requiredFields = ["name", "email", "phone", "date", "time", "subject", "message"];

function BookingForm({ subject, onClose }: { subject: string; onClose: () => void }) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [missing, setMissing] = useState<Set<string>>(new Set());

  function fieldClass(name: string, base = input) {
    return missing.has(name) ? `${base} ring-2 ring-red-500` : base;
  }

  function clearMissing(e: React.FormEvent<HTMLFormElement>) {
    const name = (e.target as HTMLInputElement).name;
    if (name && missing.has(name)) {
      setMissing((prev) => {
        const next = new Set(prev);
        next.delete(name);
        return next;
      });
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    setError(null);

    const form = new FormData(formEl);
    const empty = requiredFields.filter((f) => !String(form.get(f) ?? "").trim());
    if (empty.length) {
      setMissing(new Set(empty));
      setError("Please fill in all required fields.");
      return;
    }
    const email = String(form.get("email") ?? "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMissing(new Set(["email"]));
      setError("Please enter a valid email address.");
      return;
    }
    setMissing(new Set());

    setSending(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form)),
      });
      if (!res.ok) {
        const { error: msg } = await res.json();
        setError(msg ?? "Could not send your request. Please try again.");
        return;
      }
      formEl.reset();
      setSent(true);
    } catch {
      setError("Could not send your request. Please try again.");
    } finally {
      setSending(false);
    }
  }

  if (sent) {
    return (
      <div className="py-10 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        <h3 className="mt-4 text-lg font-bold text-black">Booking received</h3>
        <p className="mt-2 text-sm text-gray-500">
          Thank you! We&apos;ll be in touch shortly about {subject}.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 rounded-md bg-primary px-8 py-3 text-sm font-bold uppercase text-white transition-colors hover:bg-primary-dark"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} onChange={clearMissing} noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="name" type="text" required placeholder="Full Name*" aria-label="Full Name" className={fieldClass("name")} />
        <input name="phone" type="tel" required placeholder="Phone*" aria-label="Phone" className={fieldClass("phone")} />
      </div>
      <input name="email" type="email" required placeholder="Email*" aria-label="Email" className={`${fieldClass("email")} mt-4`} />
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <input name="date" type="date" required aria-label="Date" className={fieldClass("date", `${input} text-gray-400`)} />
        <select name="time" required defaultValue="" aria-label="Select time" className={fieldClass("time", `${input} invalid:text-gray-400`)}>
          <option value="" disabled>
            Select Time*
          </option>
          {["8:00 AM", "10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM"].map((t) => (
            <option key={t} value={t} className="text-black">
              {t}
            </option>
          ))}
        </select>
      </div>
      <select name="subject" required defaultValue={subject} aria-label="Subject" className={`${fieldClass("subject")} mt-4`}>
        {services.map(({ title }) => (
          <option key={title} value={title} className="text-black">
            {title}
          </option>
        ))}
      </select>
      <textarea name="message" required rows={4} placeholder="Message.*" aria-label="Message" className={`${fieldClass("message")} mt-4 resize-none`} />

      <button
        type="submit"
        disabled={sending}
        className="mt-5 w-full rounded-md bg-primary py-4 text-sm font-bold uppercase text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
      >
        {sending ? "Sending..." : "Book Appointment"}
      </button>
      {error && (
        <p role="alert" className="mt-3 text-center text-sm text-red-600">
          {error}
        </p>
      )}
    </form>
  );
}

export default function BookAppointment({ subject }: { subject: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-8 inline-flex w-fit items-center gap-2.5 rounded-md bg-primary px-6 py-3.5 text-sm font-bold uppercase text-white transition-colors hover:bg-primary-dark"
      >
        Book Appointment
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 6l6 6-6 6M13 6l6 6-6 6" />
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-black">Book Appointment</h2>
                <p className="mt-1 text-sm text-gray-500">{subject}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-gray-400 hover:text-black"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <BookingForm subject={subject} onClose={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
