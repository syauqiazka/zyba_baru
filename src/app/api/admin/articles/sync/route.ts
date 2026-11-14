import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/authCookies";
import { runIngestionPipeline } from "@/backend/articles/ingestionPipeline";
import { getSyncLogs } from "@/backend/db/articleRepo";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Akses tidak diizinkan." }, { status: 403 });
    }

    const logs = await getSyncLogs(25);
    return NextResponse.json({ logs });
  } catch (err: any) {
    console.error("[ADMIN_SYNC_LOGS_GET_ERROR]", err);
    return NextResponse.json({ error: "Gagal memuat log sinkronisasi." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getAuthUser();
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Akses tidak diizinkan." }, { status: 403 });
    }

    let targetSourceId: string | undefined = undefined;
    try {
      const body = await request.json();
      targetSourceId = body.targetSourceId;
    } catch {}

    const result = await runIngestionPipeline({
      triggeredBy: "MANUAL_ADMIN",
      targetSourceId,
      maxArticlesPerSource: 5,
    });

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("[ADMIN_SYNC_TRIGGER_ERROR]", err);
    return NextResponse.json(
      { error: "Gagal menjalankan sinkronisasi artikel." },
      { status: 500 }
    );
  }
}
