---
name: agentic-awesome-skills
description: Master catalog, gateway, and dynamic skill loader for 2,960+ specialized playbooks from the Agentic Awesome Skills (AAS) library. Use to search, discover, and activate specialized skills for any task across Next.js, React, databases, AI/LLM, security, DevOps, SEO, mobile, and design.
---

# Agentic Awesome Skills (AAS) — Master Skill & Catalog Gateway

You have full access to **Agentic Awesome Skills (AAS)**, a comprehensive local repository of **2,960+ specialized `SKILL.md` playbooks** stored directly within this project at:

`.agents/skills_library/agentic-awesome-skills/`

This gateway skill enables you to query, consult, and dynamically activate any playbook from the AAS library on demand without overwhelming the context window.

---

## 1. How to Use AAS Skills On-Demand

Whenever a specific technical challenge arises, you can tap into the AAS library using two methods:

### Method A: Direct Playbook Consultation (Zero-Install, Instant)
Read the specialized playbook directly from disk using `read_file`:
```text
.agents/skills_library/agentic-awesome-skills/skills/<skill-id>/SKILL.md
```
*Example:* If working on deep Next.js caching or streaming, read `.agents/skills_library/agentic-awesome-skills/skills/nextjs-app-router-patterns/SKILL.md`.

### Method B: Activate to Project Workspace
Activate a skill so that it becomes permanently active in `.agents/skills/`:
```bash
pnpm run skills:install <skill-id>
```
To search for matching skills across the 2,960 catalog:
```bash
pnpm run skills:search <keyword>
```
To list active skills:
```bash
pnpm run skills:list
```

---

## 2. Curated AAS Index for ZYBA Stack

Below are key curated skills already indexed and available in the library:

### Frontend & Fullstack (Next.js & React)
- **`nextjs-app-router-patterns`** *(Aktif)*: Arsitektur Next.js 14 App Router, Server vs Client components, parallel routing, intercepting routes.
- **`nextjs-best-practices`** *(Aktif)*: Data fetching, streaming with Suspense, Route Handlers, ISR, dan server-side caching.
- **`react-best-practices`** *(Aktif)*: 50+ aturan performa Vercel React: eliminasi re-render, memoization, batching, virtualization.
- **`tailwind-patterns`** *(Aktif)*: Modern Tailwind CSS token architecture, container queries, fluid typography.
- **`react-state-management`**: Pola state lokal, URL state, optimistic UI, context hygiene.
- **`react-component-performance`**: Profiling, layout shift prevention, render tracking.

### Database & Backend
- **`prisma-expert`** *(Aktif)*: Schema design, multi-database relations, batching queries, migrations, connection pooling.
- **`neon-postgres`**: Serverless Postgres, connection pooling, branch management, cold-start handling.
- **`postgres-best-practices`**: Query indexing, JSONB indexing, vacuuming, pagination cursor.
- **`auth-implementation-patterns`**: JWT Jose, HttpOnly cookies, CSRF protection, session rotation.

### AI, LLM & Vision
- **`agent-mcp-builder`**: Tool definitions, MCP server architecture, prompt interfaces.
- **`rag-implementation`**: Embeddings, vector retrieval, hybrid search, context reranking.
- **`llm-evals`**: Evaluasi respons model, factual consistency, safety filtering.

### UX, Desain & Aksesibilitas
- **`ux-guardrails`** *(Aktif)*: Nielsen heuristics, anti-dark patterns, mobile tap targets, state matrices, konteks Indonesia.
- **`ui-ux-pro-max`** *(Aktif)*: 79 gaya visual, 192 palet warna, tipografi, micro-interactions.
- **`taste-skill`** *(Aktif)*: Komposisi asimetris, ritme whitespace lapang, eliminasi AI-slop visual.
- **`impeccable`** *(Aktif)*: Audit detail, rasio kontras WCAG 2.2 AAA, microcopy empatik.

### SEO, Performa & Keamanan
- **`nextjs-seo-indexing`**: Canonical tags, sitemaps, OpenGraph metadata, Google Search Console indexing.
- **`web-vitals-performance`**: LCP, FID/INP, CLS optimization, bundle analyzer, dynamic imports.
- **`007`**: Security auditing, OWASP Top 10, sanitasi input, rate limiting.

---

## 3. Aturan Pelaksanaan

1. **Selalu Konsultasikan Playbook:** Saat menghadapi domain teknis baru, gunakan `pnpm run skills:search` untuk memeriksa apakah AAS telah memiliki playbook spesifik.
2. **Kesesuaian Arsitektur:** Pastikan saran dari skill AAS selalu diselaraskan dengan aturan terkunci di `AGENTS.md` dan `DESIGN.md`.
