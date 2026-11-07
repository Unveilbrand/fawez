import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

// POST /api/bookings — public form endpoint (Contact + Consultation)
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

  const booking = {
    name: String(body.name ?? "").trim(),
    phone: String(body.phone ?? "").trim() || null,
    email: String(body.email ?? "").trim() || null,
    date: String(body.date ?? "").trim(),
    time: String(body.time ?? "").trim(),
    subject: String(body.subject ?? "").trim(),
    message: String(body.message ?? "").trim(),
  };

  if (!booking.name || !booking.date || !booking.time || !booking.subject || !booking.message) {
    return NextResponse.json({ error: "Please fill in all required fields." }, { status: 400 });
  }

  const { error } = await getSupabaseAdmin().from("bookings").insert(booking);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true }, { status: 201 });
}
