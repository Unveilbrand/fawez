import nodemailer from "nodemailer";
import path from "path";

// Server-only SMTP transport (cPanel mailbox). Never expose these env vars to the client.
export function getTransporter() {
  const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS } = process.env;
  const missing = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS"].filter(
    (k) => !process.env[k]
  );
  if (missing.length) {
    throw new Error(`SMTP not configured — missing env vars: ${missing.join(", ")}`);
  }
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT ?? 465),
    secure: SMTP_SECURE === "true",
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    // Fail fast instead of hanging until the serverless function times out
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
}

const baseUrl = () => (process.env.BASE_URL ?? "http://localhost:3000").replace(/\/+$/, "");

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const fmtDate = (date: string) => {
  const d = new Date(`${date}T00:00:00`);
  return Number.isNaN(d.getTime())
    ? esc(date)
    : esc(
        d.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      );
};

export function bookingAdminEmail(booking: {
  id?: string;
  name: string;
  email: string | null;
  phone: string | null;
  date: string;
  time: string;
  subject: string;
  message: string;
}) {
  const base = baseUrl();
  const link = `${base}/admin/bookings${booking.id ? `?view=${booking.id}` : ""}`;
  const text = [
    `New Booking: ${booking.subject}`,
    `Name: ${booking.name}`,
    `Email: ${booking.email ?? "—"}`,
    `Phone: ${booking.phone ?? "—"}`,
    `Requested: ${booking.date} · ${booking.time}`,
    "",
    "Message:",
    booking.message,
    "",
    `View booking: ${link}`,
  ].join("\n");

  const icon = (name: string, size: number) =>
    `<td width="36" valign="middle"><div style="width:36px;height:36px;border-radius:50%;background:#ffffff;text-align:center;line-height:36px;"><img src="cid:${name}-icon" alt="" width="${size}" height="${size}" style="display:inline-block;vertical-align:middle;" /></div></td>`;

  const cell = (iconName: string, label: string, value: string, border: boolean) => `
      <td width="33.3%" style="padding:12px 8px;${
        border ? "border-right:1px solid #c9e2f8;" : ""
      }">
        <table role="presentation" cellpadding="0" cellspacing="0" align="center"><tr>
          ${icon(iconName, 18)}
          <td valign="middle" style="padding-left:8px;">
            <div style="font-size:11px;color:#555;">${label}</div>
            <div style="font-size:13px;font-weight:bold;color:#000;margin-top:2px;">${value}</div>
          </td>
        </tr></table>
      </td>`;

  const social = (name: string) =>
    `<a href="#" style="display:inline-block;margin:0 7px;"><img src="cid:${name}-icon" alt="${name}" width="18" height="18" style="display:inline-block;" /></a>`;

  const html = `<!doctype html>
<html><body style="margin:0;padding:0;background:#f5f6fa;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;padding:36px 24px;">
    <div style="text-align:center;">
      <img src="cid:fawez-logo" alt="Fawez Helping Hands" width="200" style="max-width:200px;height:auto;" />
    </div>
    <div style="text-align:center;margin-top:24px;">
      <img src="cid:mail-illustration" alt="Appointment booked" width="320" style="max-width:100%;height:auto;" />
    </div>
    <hr style="border:none;border-top:1px solid #e5e5e5;margin:32px 0;" />
    <h1 style="margin:0;text-align:center;font-size:22px;color:#720142;">New Appointment Booking</h1>
    <p style="margin:10px 0 0;text-align:center;font-size:14px;color:#333;">
      A customer has just booked an appointment through<br/>the website.
    </p>
    <div style="text-align:center;margin-top:24px;">
      <a href="${link}" style="display:inline-block;background:#720142;color:#ffffff;text-decoration:none;font-size:13px;font-weight:bold;letter-spacing:1px;padding:14px 34px;border-radius:6px;">
        VIEW BOOKING DETAILS
      </a>
    </div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;background:#d8ecff;border-radius:12px;">
      <tr>
        ${cell("adults", "Customer", esc(booking.name), true)}
        ${cell("date", "Date", fmtDate(booking.date), true)}
        ${cell("time", "Time", esc(booking.time), false)}
      </tr>
    </table>
    <p style="margin:28px 0 0;text-align:center;font-size:12px;color:#333;">
      Log in to your dashboard to review the full details, confirm the<br/>
      appointment and take the next action.
    </p>
    <hr style="border:none;border-top:1px solid #e5e5e5;margin:24px 0;" />
    <p style="margin:0;text-align:center;font-size:11px;letter-spacing:1px;color:#333;">
      FOLLOW US
    </p>
    <div style="margin-top:10px;text-align:center;">
      ${social("facebook")}${social("twitter")}${social("instagram")}
    </div>
  </div>
</body></html>`;

  // Embed images inline so recipients never need to load remote resources
  const attach = (file: string, cid: string) => ({
    filename: file,
    path: path.join(process.cwd(), "public", "images", file),
    cid,
  });
  const attachments = [
    attach("fawez_logo.png", "fawez-logo"),
    attach("mail_img.png", "mail-illustration"),
    attach("email/adults.png", "adults-icon"),
    attach("email/date.png", "date-icon"),
    attach("email/time.png", "time-icon"),
    attach("email/facebook.png", "facebook-icon"),
    attach("email/twitter.png", "twitter-icon"),
    attach("email/instagram.png", "instagram-icon"),
  ];

  return { subject: `New Booking: ${booking.subject}`, html, text, attachments };
}
