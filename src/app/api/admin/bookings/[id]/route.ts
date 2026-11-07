import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/supabase/verify-admin";

// DELETE /api/admin/bookings/[id] — remove a booking (admin only)
export async function DELETE(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { supabase, error } = await verifyAdmin(request);
  if (error) return error;

  const { id } = await ctx.params;
  const { error: deleteError } = await supabase!.from("bookings").delete().eq("id", id);
  if (deleteError)
    return NextResponse.json({ error: deleteError.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
