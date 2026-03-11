# H5 — Run Club Community OS
## Landing Page Implementation Plan
### Claude Code Execution Guide

> **Purpose:** Validate hypothesis H5 through a performance landing page targeting run club leaders in Brazil. The page must capture intent (email sign-up / waitlist) and generate qualitative signal (leader pain points) to inform Phase 01 of the execution plan.

---

## 0. Prerequisites

Before opening Claude Code, have the following ready:

| Item | Detail |
|------|--------|
| **Runtime** | Node.js 18+ |
| **Package manager** | npm or pnpm |
| **Framework** | Next.js 14 (App Router) |
| **Styling** | Tailwind CSS + CSS custom properties |
| **Deployment target** | Vercel (free tier sufficient for validation) |
| **Form backend** | Resend (email) + Vercel KV or Supabase (lead storage) |
| **Analytics** | Vercel Analytics + optional Meta Pixel / GTM for paid media |
| **Domain** | Custom domain recommended (e.g. `grupodecorrida.com.br`) |

---

## 1. Project Initialization

Paste the following prompt into Claude Code to scaffold the project:

```
Create a new Next.js 14 project using the App Router with the following setup:
- TypeScript
- Tailwind CSS
- ESLint
- App directory structure
- src/ directory convention

Project name: run-club-os-landing

After scaffolding, install these additional dependencies:
- @vercel/analytics
- resend
- @vercel/kv
- framer-motion
- lucide-react

Create the following directory structure inside src/app:
- /api/waitlist/route.ts  (API route for form submissions)
- /components/             (shared UI components)
- /lib/                    (utilities and config)
```

---

## 2. Content Architecture

The page tests **one core hypothesis**: run club leaders will sign up for a free platform that pays them to manage their club.

The conversion goal is a **waitlist sign-up with 3 qualification fields** (name, city, club size) that double as early-signal data for Phase 01 research.

### Page sections — in order

```
┌─────────────────────────────────────────────────────┐
│  NAV          Logo · "Para Líderes" · CTA button    │
├─────────────────────────────────────────────────────┤
│  HERO         Primary value prop + waitlist form     │
├─────────────────────────────────────────────────────┤
│  PAIN STRIP   3 pains stated as brutal truths        │
├─────────────────────────────────────────────────────┤
│  SOLUTION     What the platform does (feature tour)  │
├─────────────────────────────────────────────────────┤
│  MONETIZATION How leaders earn (the differentiator)  │
├─────────────────────────────────────────────────────┤
│  SOCIAL PROOF Running clubs / leader testimonials    │
├─────────────────────────────────────────────────────┤
│  FAQ          5 objection-handling questions         │
├─────────────────────────────────────────────────────┤
│  FOOTER CTA   Second sign-up form + trust signals    │
└─────────────────────────────────────────────────────┘
```

---

## 3. Design Brief for Claude Code

This brief should be passed **verbatim** to Claude Code when building the UI. It encodes the aesthetic decisions so Claude does not default to generic patterns.

```
Build a production-grade landing page in Portuguese (Brazil) with the following 
design direction:

AESTHETIC: Urban running culture meets editorial magazine. Think the energy of 
a Saturday morning 6am group run in Ibirapuera — raw, communal, physical, real. 
NOT a tech startup. NOT purple gradients. NOT generic SaaS.

PALETTE:
  --color-bg:       #0A0A0A     (near-black, like asphalt)
  --color-surface:  #141414     (card backgrounds)
  --color-accent:   #E8FF3A     (electric yellow-green — pace/energy)
  --color-accent2:  #FF4D00     (fire orange — urgency/reward)
  --color-text:     #F0F0F0     (primary text)
  --color-muted:    #6B6B6B     (secondary text)
  --color-border:   #2A2A2A     (subtle dividers)

TYPOGRAPHY:
  Display font: "Bebas Neue" (Google Fonts) — for all headlines
  Body font: "DM Sans" (Google Fonts) — for all body copy
  Mono font: "DM Mono" — for labels, tags, metrics

MOTION:
  - Page load: staggered fade-up for hero elements (100ms delays)
  - Scroll reveals: elements enter from 20px below with opacity 0→1
  - CTA button: subtle scale on hover (1.02) with accent glow
  - No looping animations — motion serves information, not decoration

LAYOUT:
  - Max content width: 1200px, centered
  - Mobile-first, fully responsive
  - Hero: full-viewport height with form visible above fold on desktop
  - Use asymmetric grid layouts for feature sections (not boring 3-col grids)
  - Generous whitespace — sections need room to breathe

TONE (copy language):
  - Direct, no-bullshit, peer-to-peer
  - Written as if a fellow club leader is talking to another
  - Avoid corporate language ("solução", "plataforma inovadora", "ecossistema")
  - Use "grupo" not "clube" — Brazilian runners say grupo de corrida
  - Pain statements must be visceral: "você ainda manda áudio no WhatsApp às 
    23h para confirmar quem vai na saída de amanhã?"
```

---

## 4. Section-by-Section Build Prompts

Use each block below as a separate Claude Code prompt, in order. Review and iterate before moving to the next section.

---

### 4.1 — Hero Section

```
Build the Hero section for the run club landing page.

FILE: src/app/components/Hero.tsx

HEADLINE (h1, Bebas Neue, ~80px desktop / 48px mobile):
  "Seu grupo de corrida merece mais do que um grupo no WhatsApp."

SUBHEADLINE (DM Sans, 20px, muted color):
  "Gerencie suas saídas, engaje seus corredores e ainda ganhe dinheiro com 
  as marcas que já patrocinam o esporte. Tudo em um lugar. De graça."

FORM (inline on desktop, stacked on mobile):
  - Input: Nome completo (placeholder: "Seu nome")  
  - Input: WhatsApp (placeholder: "(11) 99999-9999")
  - Input: Cidade (placeholder: "São Paulo")
  - Select: Tamanho do grupo
      options: ["Menos de 30 corredores", "30–100 corredores", 
                "100–300 corredores", "Mais de 300 corredores"]
  - Button: "Quero acesso antecipado →" (accent yellow-green background, 
    black text, Bebas Neue)

Below the form, add in small DM Mono text:
  "✓ Gratuito para líderes   ✓ Sem cartão de crédito   ✓ Acesso em 48h"

BACKGROUND:
  Dark near-black (#0A0A0A) with a very subtle grain texture overlay (CSS 
  noise using SVG filter). Add a large, heavily blurred accent circle 
  (electric yellow-green, ~600px, 15% opacity) positioned top-right behind 
  the headline — creates atmosphere without distraction.

The form should POST to /api/waitlist on submit. Show a success state 
(replace form with confirmation message) on successful submission. Show 
inline error on failure.
```

---

### 4.2 — Pain Strip

```
Build the Pain Strip section.

FILE: src/app/components/PainStrip.tsx

This section is a full-width dark band with 3 pain statements. 
Layout: horizontal on desktop, vertical stack on mobile.
Background: #141414 with a 1px top/bottom border in #2A2A2A.

PAINS (each has a number, headline, and 1-line description):

01  "WhatsApp não é ferramenta de gestão."
    "Confirmações perdidas, avisos ignorados, e você refazendo a lista toda semana."

02  "Você constrói a comunidade. A marca patrocina a corrida. Você não vê nada."
    "Você trouxe 200 pessoas para o evento. O cheque foi para o organizador."

03  "Quanto vale o seu grupo? Você nunca vai saber se não tem os dados."
    "Presença, engajamento, retenção — tudo acontece e desaparece no chat."

Each pain card:
- Number in DM Mono, accent orange (#FF4D00), large (~48px)
- Headline in Bebas Neue, white, ~28px
- Description in DM Sans, muted, ~16px
- Left-aligned, no icons needed — the copy is enough
- Subtle left border in accent orange on hover (transition: 0.2s)
```

---

### 4.3 — Solution / Feature Tour

```
Build the Solution section showing platform features.

FILE: src/app/components/Features.tsx

SECTION LABEL (DM Mono, muted, caps):
  "O QUE VOCÊ GANHA"

HEADLINE (Bebas Neue, ~56px):
  "Uma sede para o seu grupo. Que trabalha por você."

Layout: 2-column asymmetric grid on desktop (feature list left, 
mock screenshot area right). Single column on mobile.

LEFT COLUMN — Feature list (4 items):
Each item has an icon (lucide-react), a short label, and a description.

  🗓  "Saídas organizadas"
     "Crie saídas recorrentes, defina o percurso e o pace. Seus corredores 
     confirmam presença em 1 toque."

  💬  "Comunicação que chega"
     "Notificações no app, não mais áudio às 23h. Avisos de cancelamento, 
     mudança de percurso, tudo em um lugar."

  📊  "Dados do seu grupo"
     "Veja quem está mais ativo, qual saída tem mais presença, como seu grupo 
     cresce ao longo do tempo."

  💰  "Patrocínios que pagam você"
     "Marcas do universo do esporte pagam para alcançar o seu grupo. Você 
     recebe parte diretamente na sua conta."

RIGHT COLUMN — Stylized UI mockup:
  Create an abstract representation of the app interface using pure CSS/HTML.
  NOT a real screenshot — a stylized dark card with:
  - A fake "Próxima saída" card showing a run session
  - A small "Presença confirmada: 34" badge
  - An earnings chip: "R$ 420 este mês" in accent yellow-green
  Make it feel like a design artifact, not a real UI. Tilted 3deg on desktop.
```

---

### 4.4 — Monetization Section

```
Build the Monetization section — this is the key differentiator.

FILE: src/app/components/Monetization.tsx

This is the emotional peak of the page. The message: 
"You built this community. You should profit from it."

SECTION LABEL (DM Mono, accent yellow-green):
  "COMO VOCÊ GANHA DINHEIRO"

HEADLINE (Bebas Neue, ~64px, two-line):
  "Você construiu a comunidade.
  Agora ela trabalha por você."

BODY (DM Sans, 18px, muted):
  "Marcas de calçados, nutrição, seguros e eventos pagam para 
  se conectar com grupos de corrida ativos. A gente faz a ponte, 
  você fica com uma parte de cada patrocínio."

Show 3 sponsorship format cards in a row (or stacked on mobile):

Card 1 — "Desafio Patrocinado"
  Example: "Corra 80km em novembro com a Asics"
  "Marca patrocina, seus corredores completam, você recebe."
  Earning chip: "Até R$ 800 / desafio"

Card 2 — "Destaque Pós-Saída"  
  Example: "Recap da sua saída com oferta exclusiva da marca"
  "Resumo automático da saída com visibilidade da marca."
  Earning chip: "Até R$ 200 / saída"

Card 3 — "Oferta Exclusiva"
  Example: "Desconto só para o seu grupo"
  "Oferta exclusiva para membros — você ativa, a marca converte."
  Earning chip: "Comissão por venda"

Each card: dark surface (#141414), accent border on hover, 
earning chip in accent yellow-green (Bebas Neue font).

BELOW THE CARDS — a single line in DM Mono, muted:
  "Grupos com 100–300 corredores geram entre R$ 500–2.000 / mês em média estimada"
  (Note: add a small asterisk "*Projeção baseada em benchmarks de mercado")
```

---

### 4.5 — Social Proof

```
Build the Social Proof section.

FILE: src/app/components/SocialProof.tsx

Since the product doesn't exist yet, use ONE honest approach:
Show a "founding leaders" concept — people who will shape the product.

HEADLINE (Bebas Neue, ~48px):
  "Primeiros 100 líderes moldam o produto."

BODY:
  "Estamos construindo isso com líderes reais de grupos reais. 
  Os primeiros 100 a entrar têm acesso permanente gratuito e 
  participam das decisões de produto."

Below this, add a social proof counter widget:
  - Large number (Bebas Neue, accent yellow-green): "47" 
    (set this as a static number — update manually each week)
  - Label (DM Mono, muted): "líderes na lista de espera"
  - Subtext: "de 100 vagas fundadoras"
  - A simple progress bar (47/100) in accent yellow-green

Add 3 placeholder testimonial cards with dummy Brazilian names/cities 
and realistic quotes about the pain (WhatsApp chaos, no data, no revenue). 
Design them to look like real quotes — photo placeholder circle, name, city, 
club size badge.

Example quotes to use:
  "Meu grupo tem 180 pessoas e eu ainda controlo tudo por planilha."
  — Rodrigo M., São Paulo • 180 corredores

  "Fiz parceria com uma loja de corrida mas não tinha como medir nada."
  — Camila T., Rio de Janeiro • 95 corredores

  "Todo domingo confirmo presença no WhatsApp. São 4 grupos diferentes."
  — Felipe A., Belo Horizonte • 230 corredores
```

---

### 4.6 — FAQ

```
Build an FAQ section with accordion behavior.

FILE: src/app/components/FAQ.tsx

Use a pure CSS/JS accordion (no external library needed).
Closed state: question visible, answer hidden.
Open state: answer expands with smooth transition.

QUESTIONS AND ANSWERS:

Q: "É realmente gratuito para líderes de grupo?"
A: "Sim, sem condições. O modelo de negócio é baseado em patrocínio de marcas — 
   elas pagam para acessar grupos como o seu. Você nunca paga nada."

Q: "Como os patrocínios chegam até o meu grupo?"
A: "A plataforma conecta marcas com grupos baseado em perfil (cidade, tamanho, 
   tipo de corrida). Você aprova antes de qualquer coisa chegar para seus membros."

Q: "Meu grupo usa muito WhatsApp. Meus corredores vão migrar?"
A: "O app é um complemento, não um substituto forçado. Você continua usando 
   o WhatsApp se quiser — mas passa a ter um lugar onde os dados ficam registrados 
   e onde o patrocínio acontece."

Q: "Quando o produto vai estar disponível?"
A: "Estamos lançando em beta fechado para os primeiros 100 grupos nas próximas 
   8 semanas. Quem está na lista tem acesso prioritário e ajuda a definir as 
   funcionalidades."

Q: "Vocês vendem os dados do meu grupo?"
A: "Não. Os dados do seu grupo são seus. O patrocínio funciona com você 
   ativando a campanha para seus membros — as marcas não têm acesso direto 
   aos seus corredores."

Style: each item has a bottom border (#2A2A2A), the question in DM Sans 
semi-bold white, the "+" toggle in accent yellow-green.
```

---

### 4.7 — API Route (Waitlist Backend)

```
Build the waitlist API route.

FILE: src/app/api/waitlist/route.ts

This route should:
1. Accept POST with body: { name, whatsapp, city, groupSize }
2. Validate all fields are present
3. Store the lead in Vercel KV with key pattern: 
   "waitlist:${Date.now()}:${whatsapp}"
4. Send a confirmation email via Resend to a configured admin email
5. Return { success: true, position: number } where position is the 
   total count of leads + 1
6. Return 400 with { error: string } on validation failure
7. Return 500 on storage/email failure

Email to admin should include all fields in a clean HTML format.

Use environment variables:
  RESEND_API_KEY
  KV_REST_API_URL  
  KV_REST_API_TOKEN
  ADMIN_EMAIL
  
Add a GET handler that returns { count: number } for the social proof counter.
```

---

### 4.8 — Analytics & Tracking

```
Add analytics instrumentation to the landing page.

FILE: src/app/layout.tsx (update)
FILE: src/app/components/Analytics.tsx (new)

1. Add Vercel Analytics (<Analytics />) to the root layout

2. Add custom event tracking for:
   - "hero_form_focus" — when user clicks into any form field
   - "hero_form_submit_attempt" — when submit button is clicked
   - "waitlist_success" — on successful API response
   - "waitlist_error" — on API error
   - Section visibility events using IntersectionObserver:
     "section_pain_viewed", "section_features_viewed", 
     "section_monetization_viewed", "section_faq_viewed"

3. Add a <meta> tag slot in layout.tsx for Meta Pixel / GTM injection 
   via environment variable (NEXT_PUBLIC_META_PIXEL_ID). 
   If the variable is not set, render nothing.

4. Add UTM parameter capture on page load:
   - Read utm_source, utm_medium, utm_campaign, utm_content from URL
   - Store in sessionStorage
   - Include in waitlist API POST payload as { utm: { source, medium, campaign } }
```

---

### 4.9 — Performance & SEO

```
Configure SEO and performance for the landing page.

FILE: src/app/layout.tsx
FILE: src/app/page.tsx

1. Add metadata export to layout.tsx:
   title: "Grupo de Corrida OS — Gerencie. Engaje. Ganhe."
   description: "A plataforma gratuita para líderes de grupos de corrida 
   no Brasil. Organize saídas, engaje seus corredores e ganhe com patrocínios 
   de marcas. Acesso antecipado disponível."
   openGraph: full og:image, og:title, og:description (Brazilian Portuguese)
   twitter: card summary_large_image

2. Create a static og-image at public/og-image.png dimensions 1200x630:
   Use a simple dark background with the headline and logo.
   (Provide the HTML/CSS for a Next.js generateImageMetadata approach 
   OR a static placeholder instruction)

3. Add structured data (JSON-LD) as a script in the head:
   Type: "SoftwareApplication" with name, description, applicationCategory

4. Ensure all images use next/image with explicit width/height
   
5. Add a robots.txt and sitemap.xml in the /public directory
```

---

## 5. Environment Setup

Create a `.env.local` file with the following variables. Ask Claude Code to generate the `.env.example` template:

```bash
# Resend (transactional email)
RESEND_API_KEY=re_...

# Vercel KV (lead storage)
KV_REST_API_URL=https://...
KV_REST_API_TOKEN=...

# Admin notification
ADMIN_EMAIL=your@email.com

# Analytics (optional)
NEXT_PUBLIC_META_PIXEL_ID=

# App config
NEXT_PUBLIC_APP_URL=https://grupodecorrida.com.br
```

---

## 6. Deployment Checklist

Use this as a final prompt to Claude Code before deploying:

```
Review the entire project and complete the following pre-deployment checklist:

□ All form fields have proper validation (client + server side)
□ API route handles errors gracefully and never exposes stack traces
□ All environment variables are referenced via process.env (not hardcoded)
□ next/image is used for all images (no raw <img> tags)
□ No console.log statements in production code
□ Mobile responsiveness tested at 375px, 768px, 1280px breakpoints
□ Lighthouse score > 90 on Performance, Accessibility, SEO
□ Font loading uses next/font/google (not CDN link tags)
□ Tailwind purge is configured (no unused CSS in production)
□ vercel.json has correct region configuration (use gru1 for Brazil latency)

Generate a vercel.json with:
- framework: nextjs
- region: gru1
- env vars list (names only, not values)
```

---

## 7. Post-Launch Measurement Plan

Once live and connected to paid media (H1 infrastructure), track the following weekly:

### Leading Indicators (first 2 weeks)

| Metric | Target | Tool |
|--------|--------|------|
| Visitor → form start rate | > 25% | Vercel Analytics |
| Form start → submission rate | > 60% | Custom events |
| Overall CVR (visitor → waitlist) | > 8% | Vercel Analytics |
| Avg. time on page | > 90s | Vercel Analytics |
| Mobile vs. desktop split | Monitor | Vercel Analytics |
| UTM source breakdown | Monitor | Custom events |

### Qualification Signal (validate H5 assumptions)

The 3 form fields (city, group size, WhatsApp) give you immediate data to answer:

- **Where are the leaders?** (city breakdown validates geo expansion order)
- **What size groups are responding?** (validates H5 target segment: 50–300)
- **Are they reachable?** (WhatsApp collection enables concierge follow-up for Phase 01 interviews)

### Weekly review questions

1. Is CVR above 8%? If below 5%, test new hero headline first (highest leverage).
2. Which UTM sources convert best? Double down on paid media to top source.
3. What group sizes are over-represented? Adjust copy to speak more directly to that segment.
4. Are drop-offs happening before or after the monetization section? Tests whether "earn money" is a hook or a concern.

---

## 8. A/B Test Roadmap (after first 200 leads)

Once you have sufficient traffic, test these variants in order of expected impact:

| Priority | Variable | Variant A (control) | Variant B |
|----------|----------|---------------------|-----------|
| 1 | Hero headline | "Seu grupo de corrida merece mais do que um grupo no WhatsApp." | "Você gerencia 200 corredores. Quanto você ganha por isso?" |
| 2 | CTA label | "Quero acesso antecipado →" | "Entrar na lista — é grátis →" |
| 3 | Primary value prop | Manage + Engage + Earn | Earn first: "Ganhe até R$ 2.000/mês com o seu grupo de corrida" |
| 4 | Form length | 4 fields (name + WhatsApp + city + group size) | 2 fields (WhatsApp + group size) |

---

## 9. File Structure Reference

Final expected project structure after all prompts are executed:

```
run-club-os-landing/
├── src/
│   └── app/
│       ├── api/
│       │   └── waitlist/
│       │       └── route.ts
│       ├── components/
│       │   ├── Analytics.tsx
│       │   ├── FAQ.tsx
│       │   ├── Features.tsx
│       │   ├── Footer.tsx
│       │   ├── Hero.tsx
│       │   ├── Monetization.tsx
│       │   ├── Nav.tsx
│       │   ├── PainStrip.tsx
│       │   └── SocialProof.tsx
│       ├── lib/
│       │   ├── kv.ts
│       │   └── resend.ts
│       ├── globals.css
│       ├── layout.tsx
│       └── page.tsx
├── public/
│   ├── og-image.png
│   ├── robots.txt
│   └── sitemap.xml
├── .env.local
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── vercel.json
```

---

## 10. Strategic Notes for the Builder

A few things worth keeping in mind as you build and iterate:

**The monetization section is the hypothesis test, not just a feature.** How users respond to the earning potential section — do they scroll past it or does it drive form completions — is the most important signal on the page. Instrument it carefully and review the section-visibility → conversion funnel first.

**The form is a research instrument, not just a lead capture.** Group size data from early sign-ups will tell you which segment is most activated by this message, before you've done a single interview. Read it weekly.

**"Gratuito para líderes" is your biggest weapon and your biggest risk.** Free is a powerful hook but attracts low-intent sign-ups. The WhatsApp field acts as a commitment filter — people who give their WhatsApp are genuinely interested. Prioritize following up with those leads personally in Phase 01.

**The page is in Portuguese — keep it that way throughout.** Do not let Claude Code default to English in error messages, placeholder text, or validation messages. Every pixel of this page should feel like it was built for Ibirapuera, not Silicon Valley.

---

*Document version 1.0 · March 2026 · H5 — Run Club Community OS*
