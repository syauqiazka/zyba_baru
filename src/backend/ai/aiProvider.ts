/**
 * ZYBA Multi-Provider AI Fallback Engine
 * Rantai fallback: Gemini -> Groq -> Mistral -> OpenRouter
 * Sesuai arsitektur AGENTS.md Bagian 5.3
 */

import { PERSONAS, PersonaId } from "./personas";

export interface ChatMessageContext {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIResponse {
  content: string;
  provider: "GEMINI" | "GROQ" | "MISTRAL" | "OPENROUTER" | "LOCAL_FALLBACK";
  modelUsed: string;
}

/**
 * Generate AI response with automated chained fallback
 */
export async function generateCompanionResponse(
  personaId: PersonaId,
  messages: ChatMessageContext[],
  preferredProvider?: string
): Promise<AIResponse> {
  const persona = PERSONAS[personaId] || PERSONAS.ZIBI;
  const systemPrompt = persona.systemPrompt;

  const providers = [
    { id: "GEMINI", fn: callGemini },
    { id: "GROQ", fn: callGroq },
    { id: "MISTRAL", fn: callMistral },
    { id: "OPENROUTER", fn: callOpenRouter },
  ];

  // Jika ada preferensi, taruh di depan rantai
  if (preferredProvider) {
    const idx = providers.findIndex((p) => p.id === preferredProvider.toUpperCase());
    if (idx > 0) {
      const [fav] = providers.splice(idx, 1);
      providers.unshift(fav);
    }
  }

  const errors: string[] = [];

  for (const provider of providers) {
    try {
      const res = await provider.fn(systemPrompt, messages);
      if (res && res.content.trim()) {
        return res;
      }
    } catch (err: any) {
      errors.push(`${provider.id}: ${err.message || String(err)}`);
      console.warn(`[AI-Fallback] Provider ${provider.id} gagal:`, err.message || err);
      // Lanjut ke provider berikutnya
    }
  }

  // Jika seluruh provider tidak tersedia (misal offline dev tanpa API key), berikan jawaban ramah persona
  console.warn("[AI-Fallback] Seluruh provider gagal / belum disetup:", errors);
  return generateLocalFallback(personaId, messages);
}

// 1. Google Gemini
async function callGemini(systemPrompt: string, messages: ChatMessageContext[]): Promise<AIResponse | null> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GEMINI_MODEL || "gemini-1.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  // Format riwayat chat untuk Gemini
  const contents = messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));

  const payload = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 600,
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Gemini status ${response.status}: ${text.slice(0, 100)}`);
  }

  const data = await response.json();
  const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!replyText) throw new Error("Respons Gemini kosong");

  return {
    content: replyText.trim(),
    provider: "GEMINI",
    modelUsed: model,
  };
}

// 2. Groq
async function callGroq(systemPrompt: string, messages: ChatMessageContext[]): Promise<AIResponse | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
  const url = "https://api.groq.com/openai/v1/chat/completions";

  const chatMessages = [
    { role: "system", content: systemPrompt },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: chatMessages,
      temperature: 0.7,
      max_tokens: 600,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Groq status ${response.status}: ${text.slice(0, 100)}`);
  }

  const data = await response.json();
  const replyText = data.choices?.[0]?.message?.content;

  if (!replyText) throw new Error("Respons Groq kosong");

  return {
    content: replyText.trim(),
    provider: "GROQ",
    modelUsed: model,
  };
}

// 3. Mistral AI
async function callMistral(systemPrompt: string, messages: ChatMessageContext[]): Promise<AIResponse | null> {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) return null;

  const model = process.env.MISTRAL_MODEL || "mistral-small-latest";
  const url = "https://api.mistral.ai/v1/chat/completions";

  const chatMessages = [
    { role: "system", content: systemPrompt },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: chatMessages,
      temperature: 0.7,
      max_tokens: 600,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Mistral status ${response.status}: ${text.slice(0, 100)}`);
  }

  const data = await response.json();
  const replyText = data.choices?.[0]?.message?.content;

  if (!replyText) throw new Error("Respons Mistral kosong");

  return {
    content: replyText.trim(),
    provider: "MISTRAL",
    modelUsed: model,
  };
}

// 4. OpenRouter
async function callOpenRouter(systemPrompt: string, messages: ChatMessageContext[]): Promise<AIResponse | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) return null;

  const model = process.env.OPENROUTER_MODEL || "meta-llama/llama-3-8b-instruct:free";
  const url = "https://openrouter.ai/api/v1/chat/completions";

  const chatMessages = [
    { role: "system", content: systemPrompt },
    ...messages.map((m) => ({ role: m.role, content: m.content })),
  ];

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "HTTP-Referer": "https://zyba.my.id",
      "X-Title": "ZYBA Companion",
    },
    body: JSON.stringify({
      model,
      messages: chatMessages,
      temperature: 0.7,
      max_tokens: 600,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OpenRouter status ${response.status}: ${text.slice(0, 100)}`);
  }

  const data = await response.json();
  const replyText = data.choices?.[0]?.message?.content;

  if (!replyText) throw new Error("Respons OpenRouter kosong");

  return {
    content: replyText.trim(),
    provider: "OPENROUTER",
    modelUsed: model,
  };
}

// Local Empathetic Fallback
function generateLocalFallback(personaId: PersonaId, messages: ChatMessageContext[]): AIResponse {
  return {
    content:
      "Aku mendengarkanmu. Terima kasih sudah mau bercerita dan meluangkan waktu untuk menyapa dirimu sendiri hari ini bersama Zibi. Tarik nafas perlahan... Ceritakan apa pun yang sedang kamu rasakan saat kamu sudah siap ya.",
    provider: "LOCAL_FALLBACK",
    modelUsed: "zibi-mindful-rule",
  };
}

/**
 * Kembalikan daftar provider yang aktif di konfigurasi environment
 */
export function getActiveAIProviders(): string[] {
  const active: string[] = [];
  if (process.env.GEMINI_API_KEY) active.push("GEMINI");
  if (process.env.GROQ_API_KEY) active.push("GROQ");
  if (process.env.MISTRAL_API_KEY) active.push("MISTRAL");
  if (process.env.OPENROUTER_API_KEY) active.push("OPENROUTER");
  return active;
}
