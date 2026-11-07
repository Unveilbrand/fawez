import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const { email } = await request.json();
  if (typeof email !== "string" || !email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  const { data, error } = await getSupabaseAdmin()
    .from("admins")
    .select("role")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ isAdmin: Boolean(data), role: data?.role ?? null });
}
