"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, HelpCircle } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Gagal masuk. Periksa kembali email dan kata sandi.");
        setLoading(false);
        return;
      }

      if (!data.user.onboardingCompleted) {
        router.push("/assessment");
      } else {
        router.push(from.startsWith("/") ? from : "/dashboard");
      }
    } catch {
      setError("Terjadi kendala jaringan. Coba beberapa saat lagi.");
      setLoading(false);
    }
  };

  return (
    <Card variant="content" elevation={2} className="space-y-6">
      <div className="space-y-2 text-center">
        <Badge variant="warm" pill>
          SELAMAT DATANG KEMBALI
        </Badge>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-brown-900">
          Masuk ke Ruang Tenangmu
        </h1>
        <p className="font-body text-xs sm:text-sm text-brown-700">
          Lanjutkan perjalanan merawat batin dan ritme hidupmu.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-danger/10 border border-danger/20 text-xs font-medium text-danger">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="login-email"
          type="email"
          label="Alamat Email"
          placeholder="nama@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <Input
          id="login-password"
          type="password"
          label="Kata Sandi"
          placeholder="Minimal 8 karakter"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Button
          type="submit"
          variant="warm"
          size="lg"
          fullWidth
          disabled={loading}
        >
          <span>{loading ? "Memeriksa..." : "Masuk Sekarang"}</span>
          <ArrowRight className="w-4 h-4 text-brown-900" strokeWidth={1.8} />
        </Button>
      </form>

      <div className="pt-4 border-t border-brown-900/10 text-center space-y-2">
        <p className="text-xs text-brown-700">
          Belum memiliki akun di ZYBA?{" "}
          <Link
            href="/onboarding"
            className="font-bold text-brown-900 underline hover:text-orange-500 transition-colors"
          >
            Daftar sekarang
          </Link>
        </p>
      </div>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-cream text-brown-900 flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <header className="max-w-md mx-auto w-full flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brown-900 text-cream flex items-center justify-center font-display font-extrabold text-base">
            Z
          </div>
          <span className="font-display font-bold text-lg text-brown-900">ZYBA</span>
        </Link>
        <Link href="/guidebook">
          <Button variant="ghost" size="sm">
            <HelpCircle className="w-4 h-4 text-brown-700" strokeWidth={1.8} />
            <span>Hotline Krisis</span>
          </Button>
        </Link>
      </header>

      {/* Center Auth Card with Suspense Boundary */}
      <main className="max-w-md mx-auto w-full my-auto py-8">
        <Suspense
          fallback={
            <Card variant="content" elevation={2} className="p-8 text-center text-brown-700 text-sm">
              Menyiapkan formulir...
            </Card>
          }
        >
          <LoginForm />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="max-w-md mx-auto w-full text-center text-xs text-brown-700/60 py-4">
        ZYBA — Pendamping Kesehatan Holistik Gen Z. 100% Bebas Biaya.
      </footer>
    </div>
  );
}
