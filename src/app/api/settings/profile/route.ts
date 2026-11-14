import { NextResponse } from "next/server";
import { getAuthTokenFromCookies } from "@/lib/authCookies";
import { verifyToken } from "@/lib/jwt";
import { settingsRepo } from "@/backend/db/settingsRepo";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const token = getAuthTokenFromCookies();
    if (!token) {
      return NextResponse.json({ error: "Sesi tidak ditemukan" }, { status: 401 });
    }

    const session = await verifyToken(token);
    if (!session?.userId) {
      return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });
    }

    const profile = await settingsRepo.getProfile(session.userId);
    return NextResponse.json({ profile });
  } catch (err: any) {
    console.error("Gagal memuat profil settings:", err);
    return NextResponse.json(
      { error: "Gagal memuat profil pengguna" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const token = getAuthTokenFromCookies();
    if (!token) {
      return NextResponse.json({ error: "Sesi tidak ditemukan" }, { status: 401 });
    }

    const session = await verifyToken(token);
    if (!session?.userId) {
      return NextResponse.json({ error: "Sesi tidak valid" }, { status: 401 });
    }

    const body = await req.json();
    const { name, username, bio, avatarUrl, companionNotif, wellnessNotif, communityNotif } = body;

    // 1. Update profil dasar jika disediakan
    let userResult = null;
    if (name !== undefined || username !== undefined || bio !== undefined || avatarUrl !== undefined) {
      userResult = await settingsRepo.updateProfile(session.userId, {
        name,
        username,
        bio,
        avatarUrl,
      });
    }

    // 2. Update preferensi notifikasi jika disediakan
    let notifResult = null;
    if (companionNotif !== undefined || wellnessNotif !== undefined || communityNotif !== undefined) {
      notifResult = await settingsRepo.updateNotificationPrefs(session.userId, {
        companionNotif,
        wellnessNotif,
        communityNotif,
      });
    }

    const updatedProfile = await settingsRepo.getProfile(session.userId);

    return NextResponse.json({
      success: true,
      profile: updatedProfile,
    });
  } catch (err: any) {
    console.error("Gagal memperbarui profil settings:", err);
    return NextResponse.json(
      { error: "Gagal memperbarui pengaturan profil" },
      { status: 500 }
    );
  }
}
