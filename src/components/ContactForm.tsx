"use client";

import { useState } from "react";
import { services } from "@/components/Services";

const input =
  "w-full rounded-md bg-[#F3F8FF] px-4 py-3.5 text-sm text-black placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-primary/40";
const label = "mb-2 block text-sm font-medium text-black";

const requiredFields = ["name", "email", "phone", "date", "time", "subject", "message"];

export default function ContactForm() {
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

  return (
    <form
      onSubmit={onSubmit}
      onChange={clearMissing}
      noValidate
      className="rounded-2xl bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] sm:p-8"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className={label}>
            Full Name*
          </label>
          <input id="cf-name" name="name" type="text" required placeholder="Full name" className={fieldClass("name")} />
        </div>
        <div>
          <label htmlFor="cf-phone" className={label}>
            Phone*
          </label>
          <input id="cf-phone" name="phone" type="tel" required placeholder="Phone number" className={fieldClass("phone")} />
        </div>
        <div>
          <label htmlFor="cf-email" className={label}>
            Email*
          </label>
          <input id="cf-email" name="email" type="email" required placeholder="Email address" className={fieldClass("email")} />
        </div>
        <div>
          <label htmlFor="cf-date" className={label}>
            Date*
          </label>
          <input
            id="cf-date"
            name="date"
            type="text"
            required
            placeholder="Select Date"
            aria-label="Date"
            onFocus={(e) => (e.currentTarget.type = "date")}
            onBlur={(e) => {
              if (!e.currentTarget.value) e.currentTarget.type = "text";
            }}
            className={fieldClass("date", `${input} min-w-0 max-sm:appearance-none invalid:text-gray-400`)}
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="cf-time" className={label}>
            Time*
          </label>
          <select id="cf-time" name="time" required defaultValue="" aria-label="Select time" className={fieldClass("time", `${input} invalid:text-gray-400`)}>
            <option value="" disabled>
              Select Time
            </option>
            {["8:00 AM", "10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM", "6:00 PM"].map((t) => (
              <option key={t} value={t} className="text-black">
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="cf-subject" className={label}>
          What do you need help with?*
        </label>
        <select id="cf-subject" name="subject" required defaultValue="" className={fieldClass("subject", `${input} invalid:text-gray-400`)}>
          <option value="" disabled>
            Select...
          </option>
          {services.map(({ title }) => (
            <option key={title} value={title} className="text-black">
              {title}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5">
        <label htmlFor="cf-message" className={label}>
          Message*
        </label>
        <textarea id="cf-message" name="message" required rows={5} placeholder="Your Message" className={fieldClass("message", `${input} resize-none`)} />
      </div>

      <button
        type="submit"
        disabled={sending}
        className="mt-6 w-full rounded-full bg-primary py-4 text-sm font-bold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
      >
        {sending ? "Sending..." : "Send message"}
      </button>
      {error && (
        <p role="alert" className="mt-4 text-center text-sm text-red-600">
          {error}
        </p>
      )}
      {sent && (
        <p role="status" className="mt-4 text-center text-sm text-primary">
          Thank you! We&apos;ll be in touch shortly.
        </p>
      )}
    </form>
  );
}
