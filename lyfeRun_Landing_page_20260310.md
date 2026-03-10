# LYFE RUN — LANDING PAGE IMPLEMENTATION SPEC
# Claude Code Instruction Document v1.0

## CONTEXT
Platform: Lyfe Run — SaaS for running coaches (virtual + in-person coaching businesses)
Target audience of THIS PAGE: Running coaches evaluating the platform
Tech stack: Next.js 14 (App Router), TypeScript strict, Tailwind CSS, shadcn/ui
Goal of this task: Build the public marketing landing page at `/` (root route)

---

## TASK
Implement the complete public-facing landing page for Lyfe Run.
This page targets **running coaches** who want a platform to manage and grow their coaching business.
The page must be production-quality, fully responsive (mobile-first), and optimized for conversion.

---

## BRAND

```
Primary green:    #2D6A2B
Accent green:     #4CAF50
Light green bg:   #E8F5E9
Dark (headlines): #1A1A2E
Body text:        #333333
Muted text:       #666666
White:            #FFFFFF
```

Font: Inter (Google Fonts). Weights used: 400, 500, 600, 700, 800.
Logo text: "Lyfe Run" — use a styled span, no image asset required initially.
Icon set: lucide-react.

---

## PAGE STRUCTURE

Implement sections in this exact order:

### 1. NAVBAR
- Fixed top, blurs on scroll (backdrop-filter: blur)
- Left: Logo ("Lyfe Run" in #2D6A2B, bold)
- Right: Links: "Features" | "Pricing" | "For Coaches" — anchor scroll links
- CTA button: "Start Free Trial" → href="#pricing" — filled, #2D6A2B bg
- Mobile: hamburger menu with slide-down drawer
- On scroll past hero: add white background + shadow

### 2. HERO
- Full viewport height (min-h-screen)
- Background: dark (#1A1A2E) with subtle animated gradient or mesh pattern in green tones
- Badge pill above headline: "🏃 Built for Running Coaches"
- H1 headline (max 2 lines): "Your entire coaching business. One platform."
- Subheadline: "Manage athletes, deliver training plans, integrate wearables, and grow your practice — all from Lyfe Run."
- CTA row: Primary button "Start Free Trial" (#4CAF50) + Secondary ghost button "See How It Works" (scroll to features)
- Social proof strip below CTA: "Trusted by 500+ coaches" + avatar stack (use placeholder initials) + star rating "4.9/5"
- Hero visual: right-side mockup — use a styled div/card that simulates a coach dashboard (athlete list, a weekly plan grid, a metric card). Must look real, built with Tailwind divs, no image dependency.

### 3. LOGOS / SOCIAL PROOF BAR
- Background: #F9F9F9
- Label: "Integrates with the tools your athletes already use"
- Display 6 logos as styled text badges (simulate logo pills): Garmin | Apple Watch | Strava | Whoop | Google Fit | PIX
- Subtle horizontal scroll animation on mobile

### 4. FEATURES — SECTION A ("Everything you need to coach at scale")
- 3-column grid (desktop), 1-column (mobile)
- Background: white
- 6 feature cards with icon, title, description:

  1. Icon: Users — "Athlete Management" — "Onboard new runners, manage subscriptions, and track every athlete's progress from a single back-office."
  2. Icon: CalendarDays — "Weekly Training Plans" — "Build personalized weekly plans with a drag-and-drop calendar. Push updates anytime — athletes get notified instantly."
  3. Icon: Brain — "AI-Powered Plans (Gold)" — "Generate a complete training block in seconds. Claude AI creates periodized plans based on the athlete's goals, fitness level, and race calendar."
  4. Icon: Watch — "Wearable Integration" — "Sync with Garmin, Apple Watch, Whoop, and Strava. Plans land on the athlete's device automatically."
  5. Icon: BarChart2 — "Performance Analytics" — "Planned vs. actual, VO2 Max estimation, predicted race times for 5K to marathon — updated after every run."
  6. Icon: MessageSquare — "AI Feedback (Gold)" — "After each session, AI drafts a coaching message. You review, edit, or approve with one click. Offload the repetitive work."

### 5. HOW IT WORKS
- Background: #E8F5E9 (light green)
- H2: "From sign-up to first plan in under 10 minutes"
- 4-step horizontal stepper (desktop) / vertical (mobile):
  1. "Set up your practice" — logo, branding, subdomain, coach profile
  2. "Invite your athletes" — they onboard, pay, and self-assess through your custom landing page
  3. "Deliver plans" — build weekly plans or let AI generate them. Push to wearables automatically.
  4. "Coach smarter" — review AI-generated feedback, track compliance, watch fitness scores improve

### 6. FEATURES — SECTION B ("Your athletes get a world-class experience")
- 2-column layout (desktop): left text + right simulated mobile app mockup
- Background: white
- Left side content:
  - H2: "Everything your athletes need. Right in their pocket."
  - List of 5 features with check icons:
    - Receive weekly plans directly on Garmin or Apple Watch
    - GPS run recording when no device is available
    - Real-time pace, HR zones, and distance tracking
    - Post-run analysis: planned vs. actual performance
    - Race calendar with ticket purchasing and goal pace prediction
- Right side: styled div simulating a mobile phone frame containing a "Today's Run" card with fake session data (distance, pace, HR zone, map placeholder)

### 7. PRICING
- id="pricing"
- Background: #1A1A2E (dark)
- H2 white: "Simple, coach-friendly pricing"
- Subtext: "Grow your practice. Only pay more when you earn more."
- 2 pricing cards side by side (centered on desktop, stacked on mobile):

  **Basic Plan**
  - Price: R$ 200 / month
  - Badge: "Get Started"
  - Features list:
    - Up to 20 athletes
    - Weekly plan builder
    - Strava + GPS recording
    - Custom landing page
    - PIX, credit card, bank transfer
    - Basic analytics
  - CTA: "Start with Basic" (outlined button, white border)

  **Gold Plan** ← highlighted card (green border + "Most Popular" badge)
  - Price: 3% of monthly revenue
  - Sub-label: "Only pay when you earn"
  - Features list (includes all Basic +):
    - Unlimited athletes
    - AI training plan generation
    - AI session feedback drafting
    - Garmin + Apple Watch + Whoop integration
    - Advanced analytics + cohort views
    - VO2 Max + race time predictions
    - Priority support
  - CTA: "Start Gold Trial" (filled #4CAF50 button)

- Note below cards: "No setup fees. Cancel anytime. PIX, credit card, or bank transfer accepted."

### 8. TESTIMONIALS
- Background: #F5F5F5
- H2: "Coaches love Lyfe Run"
- 3-column grid of testimonial cards (white bg, shadow, rounded-xl)
- 3 fake but realistic testimonials:
  1. Name: "Ricardo Mendes" — Role: "Triathlon Coach, São Paulo" — Quote: "I went from managing plans in spreadsheets to having a fully automated system. My athletes get their plans on their Garmins every Monday without me lifting a finger."
  2. Name: "Fernanda Souza" — Role: "Marathon Coach, Curitiba" — Quote: "The AI feedback feature alone saves me 2 hours a day. I review and approve — it sounds exactly like me after the first week."
  3. Name: "Bruno Alves" — Role: "Trail Running Coach, Florianópolis" — Quote: "My athletes finally have a professional app to track their runs. The VO2 and race prediction charts keep them motivated like nothing else I've tried."
- Each card: avatar (colored circle with initials), name, role, stars (5 gold), quote

### 9. FAQ
- Background: white
- H2: "Frequently asked questions"
- Accordion component (shadcn/ui Accordion or custom). 6 items:
  1. Q: "How does the Gold Plan 3% work?" A: "We calculate 3% of the total monthly subscription revenue you collect through Lyfe Run from your athletes. There is no flat fee — if you earn R$ 10,000 in a month, you pay R$ 300. If you're just starting out, you pay almost nothing."
  2. Q: "Which wearables are supported?" A: "Garmin (all GPS watches via Connect IQ), Apple Watch (via HealthKit/WorkoutKit), Whoop, and Strava. If your athlete has none of these, they can use our built-in GPS recording on iOS or Android."
  3. Q: "Can I migrate my existing athletes?" A: "Yes. You can bulk-import athletes via CSV and send them a migration invite. They complete onboarding and payment setup in under 5 minutes."
  4. Q: "How does the AI plan generation work?" A: "You fill in the athlete's profile: goal race, current fitness, weekly volume, test results. The AI (powered by Claude) returns a complete periodized training block. You review and edit before it's ever sent to the athlete."
  5. Q: "What payment methods do athletes use?" A: "Athletes can pay via credit card (Visa, Mastercard, Amex), PIX instant transfer, or bank transfer (TED). All payment processing is handled securely — you never touch card data."
  6. Q: "Is there a free trial?" A: "Yes. Both plans include a 14-day free trial with full access to all features of the selected plan. No credit card required to start."

### 10. FINAL CTA
- Background: gradient from #2D6A2B to #1A1A2E
- H2 white: "Ready to build your coaching business?"
- Subtext white/muted: "Join hundreds of coaches already using Lyfe Run to deliver better training and spend less time on admin."
- Input field + button row: email input (placeholder: "your@email.com") + "Get Early Access" button (#4CAF50)
- Below: "14-day free trial. No credit card required."

### 11. FOOTER
- Background: #1A1A2E
- 4-column layout:
  - Col 1: Logo + tagline "The coaching platform built for runners."
  - Col 2 "Product": Features, Pricing, Wearables, For Coaches
  - Col 3 "Company": About, Blog, Careers, Contact
  - Col 4 "Legal": Privacy Policy, Terms of Service, LGPD
- Bottom bar: © 2025 Lyfe Run. All rights reserved. | Social icons: Instagram, LinkedIn, Strava (use lucide or text)
- Divider line above bottom bar

---

## COMPONENT ARCHITECTURE

Create these files:

```
app/
  page.tsx                          ← root page, imports and composes all sections
  layout.tsx                        ← root layout with Inter font, metadata
  globals.css                       ← Tailwind directives + custom animations

components/
  landing/
    Navbar.tsx
    Hero.tsx
    LogoBar.tsx
    FeaturesGrid.tsx
    HowItWorks.tsx
    AthleteExperience.tsx
    Pricing.tsx
    Testimonials.tsx
    FAQ.tsx
    FinalCTA.tsx
    Footer.tsx
  ui/
    Button.tsx                      ← variants: primary | secondary | ghost | outline
    Badge.tsx
    Card.tsx
    Accordion.tsx                   ← for FAQ (implement or import from shadcn)
```

---

## ANIMATION REQUIREMENTS

Use `framer-motion` for:
- Hero elements: fade-in + slide-up on mount (staggered: badge → h1 → subheadline → CTA → social proof)
- Feature cards: fade-in-up on scroll (use `useInView` hook)
- How It Works steps: sequential reveal on scroll
- Pricing cards: subtle scale-up on hover

Install if not present: `npm install framer-motion`

---

## SEO & METADATA

In `layout.tsx` or `page.tsx`:

```typescript
export const metadata: Metadata = {
  title: "Lyfe Run — The Coaching Platform for Running Coaches",
  description: "Manage athletes, deliver AI-powered training plans, integrate Garmin and Apple Watch, and grow your running coaching business. Try free for 14 days.",
  keywords: ["running coach platform", "treinamento corrida", "plataforma treinador corrida", "Garmin coaching"],
  openGraph: {
    title: "Lyfe Run — Build Your Running Coaching Business",
    description: "The all-in-one platform for running coaches. Plans, wearables, payments, and AI — everything in one place.",
    type: "website",
    locale: "pt_BR",
  },
}
```

---

## DEPENDENCIES

Expected to already be in package.json. If missing, install:
- `next` 14.x
- `react` 18.x
- `tailwindcss` 3.x
- `framer-motion`
- `lucide-react`
- `@radix-ui/react-accordion` (for FAQ — or implement manually)
- `clsx` + `tailwind-merge` (for cn() utility)

---

## IMPLEMENTATION RULES

- NO placeholder `<img>` tags. Use styled divs to simulate UI mockups and avatars.
- NO external image URLs. All visuals must be CSS/Tailwind-based.
- All text content is final — do not use Lorem Ipsum.
- All components must be TypeScript with explicit prop types.
- Use `cn()` utility (clsx + tailwind-merge) for conditional class merging.
- The page must pass Lighthouse performance score ≥ 90 (no layout-blocking resources).
- Navbar CTA and Hero CTA must both scroll to #pricing smoothly (`scroll-behavior: smooth` in globals.css).
- Mobile breakpoint: all sections must be usable on 375px viewport width.
- Dark sections (#1A1A2E bg): use white/light text. Light sections: use #333333 body text.
- The Pricing section Gold card must be visually dominant (border: 2px solid #4CAF50, slight scale or shadow emphasis).

---

## WHAT NOT TO BUILD (out of scope for this task)

- Authentication / login pages
- Coach back-office / dashboard
- Athlete app
- API routes
- Database schema
- Payment processing logic
- Any page other than `/`
