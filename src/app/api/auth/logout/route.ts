import { NextResponse } from "next/server";
import { removeAuthCookie } from "@/lib/authCookies";

export const dynamic = "force-dynamic";

export async function POST() {
  removeAuthCookie();
  return NextResponse.json({ success: true, message: "Berhasil keluar akun." });
}

