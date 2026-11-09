import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getTransporter, bookingAdminEmail } from "@/lib/mail";

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

  const { data: row, error } = await getSupabaseAdmin()
    .from("bookings")
    .insert(booking)
    .select("id")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Notify the admin inbox — don't fail the booking if the email fails
  let mailError: string | null = null;
  try {
    await getTransporter().sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.SMTP_USER,
      ...bookingAdminEmail({ ...booking, id: row?.id }),
    });
    console.info(`[bookings] notification email sent for booking ${row?.id}`);
  } catch (err) {
    mailError = err instanceof Error ? err.message : String(err);
    console.error(`[bookings] notification email failed for booking ${row?.id}:`, err);
  }

  return NextResponse.json(
    { ok: true, mailSent: !mailError, ...(mailError ? { mailError } : {}) },
    { status: 201 }
  );
}
