import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/supabase/verify-admin";

// GET /api/admin/bookings — list all bookings (admin only)
export async function GET(request: Request) {
  const { supabase, error } = await verifyAdmin(request);
  if (error) return error;

  const { data, error: listError } = await supabase!
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });
  if (listError) return NextResponse.json({ error: listError.message }, { status: 500 });

  return NextResponse.json({ bookings: data });
}
