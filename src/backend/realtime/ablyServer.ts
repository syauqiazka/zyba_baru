import * as Ably from "ably";

let ablyRestInstance: Ably.Rest | null = null;

export function getAblyRest(): Ably.Rest | null {
  const apiKey = process.env.ABLY_API_KEY?.trim();
  if (!apiKey) {
    console.warn("[Ably] ABLY_API_KEY tidak ditemukan di environment variables.");
    return null;
  }

  if (!ablyRestInstance) {
    try {
      ablyRestInstance = new Ably.Rest(apiKey);
    } catch (err) {
      console.error("[Ably] Gagal menginisialisasi Ably REST client:", err);
      return null;
    }
  }

  return ablyRestInstance;
}

/**
 * Menghasilkan Token Request untuk autentikasi client-side di browser
 */
export async function createAblyTokenRequest(clientId: string) {
  const rest = getAblyRest();
  if (!rest) {
    throw new Error("Ably client belum terkonfigurasi");
  }

  // Capability: user hanya dapat mengakses channel percakapan mereka & notifikasi mereka
  const tokenRequest = await rest.auth.createTokenRequest({
    clientId,
    capability: {
      [`direct:*`]: ["subscribe", "publish", "presence"],
      [`user:${clientId}`]: ["subscribe"],
    },
  });

  return tokenRequest;
}

/**
 * Menerbitkan pesan baru ke channel percakapan langsung realtime
 */
export async function publishDirectMessage(
  conversationId: string,
  message: {
    id: string;
    conversationId: string;
    senderId: string;
    senderName?: string;
    content: string;
    createdAt: string;
  }
) {
  const rest = getAblyRest();
  if (!rest) return;

  try {
    const channel = rest.channels.get(`direct:${conversationId}`);
    await channel.publish("new-message", message);
  } catch (err) {
    console.error(`[Ably] Gagal menerbitkan pesan ke direct:${conversationId}:`, err);
  }
}

/**
 * Menerbitkan notifikasi realtime ke channel pribadi user
 */
export async function publishRealtimeNotification(
  recipientId: string,
  notification: {
    id: string;
    type: string;
    actorName: string;
    content: string;
    createdAt: string;
  }
) {
  const rest = getAblyRest();
  if (!rest) return;

  try {
    const channel = rest.channels.get(`user:${recipientId}`);
    await channel.publish("notification", notification);
  } catch (err) {
    console.error(`[Ably] Gagal menerbitkan notifikasi ke user:${recipientId}:`, err);
  }
}
