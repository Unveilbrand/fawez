import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/supabase/verify-admin";
import { getTransporter } from "@/lib/mail";

// POST /api/admin/bookings/[id]/mail — send an email to the booking's contact (admin only)
export async function POST(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { supabase, error } = await verifyAdmin(request);
  if (error) return error;

  const { id } = await ctx.params;
  const { data: booking } = await supabase!
    .from("bookings")
    .select("name, email")
    .eq("id", id)
    .maybeSingle();
  if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  if (!booking.email)
    return NextResponse.json({ error: "This booking has no email address." }, { status: 400 });

  const body = await request.json().catch(() => null);
  const subject = String(body?.subject ?? "").trim();
  const message = String(body?.message ?? "").trim();
  if (!subject || !message)
    return NextResponse.json({ error: "Subject and message are required." }, { status: 400 });

  try {
    await getTransporter().sendMail({
      from: process.env.MAIL_FROM,
      to: booking.email,
      replyTo: process.env.SMTP_USER,
      subject,
      text: message,
    });
  } catch (err) {
    console.error(`[admin-mail] failed for booking ${id}:`, err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: `Could not send the email: ${msg}` }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
