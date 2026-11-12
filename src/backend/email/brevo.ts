/**
 * Brevo Transactional Email Service via HTTPS (Port 443)
 * Sesuai AGENTS.md D7 & Lampiran E: Seluruh email transaksi dikirim melalui REST API
 */

interface SendOtpEmailParams {
  toEmail: string;
  toName: string;
  otp: string;
}

export async function sendOtpEmail({
  toEmail,
  toName,
  otp,
}: SendOtpEmailParams): Promise<{ success: boolean; messageId?: string }> {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail =
    process.env.BREVO_SENDER_EMAIL || "muhammad.syauqi1869@smk.belajar.id";
  const senderName = "ZYBA Wellness";

  // Mode pengujian / development saat API key belum diisi
  if (!apiKey) {
    console.warn(
      `[BREVO_DEV_MODE] BREVO_API_KEY belum dikonfigurasi. Kode OTP untuk ${toEmail} adalah: ${otp}`
    );
    return { success: true, messageId: "dev-simulated-message-id" };
  }

  const emailBody = {
    sender: {
      name: senderName,
      email: senderEmail,
    },
    to: [
      {
        email: toEmail,
        name: toName || "Teman ZYBA",
      },
    ],
    subject: "Kode Verifikasi Masuk ZYBA Kamu",
    htmlContent: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'DM Sans', Arial, sans-serif; background-color: #F7F2E7; color: #3B2A20; margin: 0; padding: 24px; }
          .card { max-width: 480px; margin: 0 auto; background: #FFFFFF; border-radius: 20px; border: 1px solid rgba(59,42,32,0.1); padding: 32px; }
          .logo { font-size: 20px; font-weight: 800; color: #3B2A20; letter-spacing: -0.5px; margin-bottom: 24px; }
          .code-box { background-color: #FCE3D3; border-radius: 12px; padding: 16px; text-align: center; margin: 24px 0; }
          .code { font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #3B2A20; font-family: monospace; }
          .footer { font-size: 12px; color: #5A4636; margin-top: 32px; line-height: 1.6; border-top: 1px solid rgba(59,42,32,0.1); padding-top: 16px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="logo">ZYBA</div>
          <h2 style="font-size: 20px; font-weight: 700; margin-top: 0;">Halo, ${toName || "Teman ZYBA"}</h2>
          <p style="font-size: 14px; line-height: 1.6; color: #5A4636;">
            Gunakan kode verifikasi 6 digit di bawah ini untuk melanjutkan pendaftaran atau masuk ke ruang tenangmu di ZYBA:
          </p>
          <div class="code-box">
            <span class="code">${otp}</span>
          </div>
          <p style="font-size: 13px; color: #5A4636; line-height: 1.5;">
            Kode ini berlaku selama 10 menit. Jangan berikan kode ini kepada siapa pun demi keamanan akunmu.
          </p>
          <div class="footer">
            Ruang aman yang lapang, hangat, dan tenang.<br>
            Jika kamu tidak meminta kode ini, kamu dapat mengabaikan email ini dengan aman.
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(emailBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[BREVO_ERROR] Gagal mengirim email OTP:", errorText);
      return { success: false };
    }

    const data = await response.json();
    return { success: true, messageId: data.messageId };
  } catch (error) {
    console.error("[BREVO_NETWORK_ERROR]", error);
    return { success: false };
  }
}

