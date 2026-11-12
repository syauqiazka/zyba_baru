import type { Metadata, Viewport } from "next";
import { Manrope, DM_Sans } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ZYBA — Gen Z Wellness Support",
  description:
    "Pendamping kesehatan mental, fisik, dan sosial berbasis AI. Ruang aman yang lapang, hangat, dan tenang.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#F7F2E7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${manrope.variable} ${dmSans.variable}`}>
      <body className="min-h-screen bg-cream text-brown-900 font-body antialiased selection:bg-orange-100 selection:text-brown-900">
        {children}
      </body>
    </html>
  );
}

