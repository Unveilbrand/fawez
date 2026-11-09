"use client";

import Image from "next/image";
import { useState } from "react";
import { services, stats } from "@/components/Services";

const field =
  "w-full rounded-sm bg-white px-3 py-3 text-sm text-black placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-primary/40";

const requiredFields = ["name", "email", "phone", "date", "time", "subject", "message"];

export default function Consultation() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [missing, setMissing] = useState<Set<string>>(new Set());

  function fieldClass(name: string, base = field) {
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
    <section className="relative isolate overflow-hidden pt-16 pb-0 md:py-24">
      <Image
        src="/images/consult_bg.png"
        alt=""
        fill
        sizes="100vw"
        className="-z-20 scale-105 object-cover object-[50%_25%] blur-[3px]"
      />
      <div className="absolute inset-0 -z-10 bg-white/25" />
      <div className="site-container">
        <div className="grid items-center gap-10 rounded-t-[40px] bg-[#B2DAFFA6] px-2 py-10 sm:px-10 md:py-14 lg:grid-cols-2 lg:gap-16 lg:px-12 lg:py-12 xl:px-20">
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-bold text-black sm:text-4xl lg:text-[36px]">
              Get A Consultation
            </h2>
            <p className="mx-auto mt-3 max-w-[480px] text-sm leading-snug text-black sm:mx-0">
              We provide respectful assistance with dressing, changing clothes, and daily grooming
              routines, helping clients maintain their dignity, comfort, and confidence
            </p>
            <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-flow-col sm:gap-6 sm:grid-cols-2 sm:grid-rows-2 sm:gap-x-4">
              {stats.map(({ value, label, icon, w, h }) => (
                <li key={value} className="flex flex-col items-center gap-3 text-center sm:flex-row sm:gap-5 sm:text-left">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.08)]">
                    <Image src={icon} alt="" width={w} height={h} />
                  </span>
                  <div>
                    <p className="text-lg font-bold leading-tight text-black">{value}</p>
                    <p className="text-sm text-black">{label}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <form
            onSubmit={onSubmit}
            onChange={clearMissing}
            noValidate
            className="space-y-3.5 rounded-2xl bg-[#B2DAFF] p-6"
          >
            <div className="grid gap-3.5 sm:grid-cols-2">
              <input name="name" type="text" required placeholder="Full Name" aria-label="Full Name" className={fieldClass("name")} />
              <input name="phone" type="tel" required placeholder="Phone" aria-label="Phone" className={fieldClass("phone")} />
            </div>
            <input name="email" type="email" required placeholder="Email" aria-label="Email" className={fieldClass("email")} />
            <div className="grid gap-3.5 sm:grid-cols-2">
              <input name="date" type="date" required aria-label="Date" className={fieldClass("date", `${field} min-w-0 text-gray-400 max-sm:appearance-none`)} />
              <select name="time" required defaultValue="" aria-label="Select time" className={fieldClass("time", `${field} min-w-0 invalid:text-gray-400`)}>
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
            <select name="subject" required defaultValue="" aria-label="Subject" className={fieldClass("subject", `${field} invalid:text-gray-400`)}>
              <option value="" disabled>
                --Select a subject --
              </option>
              {services.map(({ title }) => (
                <option key={title} value={title} className="text-black">
                  {title}
                </option>
              ))}
            </select>
            <textarea name="message" required rows={3} placeholder="Message." aria-label="Message" className={fieldClass("message", `${field} resize-none`)} />
            <button
              type="submit"
              disabled={sending}
              className="w-full rounded-sm bg-primary-dark py-3.5 text-sm font-bold uppercase text-white transition-colors hover:bg-primary disabled:opacity-60"
            >
              {sending ? "Sending..." : "Send Message"}
            </button>
            {error && (
              <p role="alert" className="text-center text-sm text-red-600">
                {error}
              </p>
            )}
            {sent && (
              <p role="status" className="text-center text-sm text-primary-dark">
                Thank you! We&apos;ll be in touch shortly.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
