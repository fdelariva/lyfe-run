"use client";

import React from "react";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";

const faqs = [
  {
    q: "How does the Gold Plan 3% work?",
    a: "We calculate 3% of the total monthly subscription revenue you collect through Lyfe Run from your athletes. There is no flat fee — if you earn R$ 10,000 in a month, you pay R$ 300. If you're just starting out, you pay almost nothing.",
  },
  {
    q: "Which wearables are supported?",
    a: "Garmin (all GPS watches via Connect IQ), Apple Watch (via HealthKit/WorkoutKit), Whoop, and Strava. If your athlete has none of these, they can use our built-in GPS recording on iOS or Android.",
  },
  {
    q: "Can I migrate my existing athletes?",
    a: "Yes. You can bulk-import athletes via CSV and send them a migration invite. They complete onboarding and payment setup in under 5 minutes.",
  },
  {
    q: "How does the AI plan generation work?",
    a: "You fill in the athlete's profile: goal race, current fitness, weekly volume, test results. The AI (powered by Claude) returns a complete periodized training block. You review and edit before it's ever sent to the athlete.",
  },
  {
    q: "What payment methods do athletes use?",
    a: "Athletes can pay via credit card (Visa, Mastercard, Amex), PIX instant transfer, or bank transfer (TED). All payment processing is handled securely — you never touch card data.",
  },
  {
    q: "Is there a free trial?",
    a: "Yes. Both plans include a 14-day free trial with full access to all features of the selected plan. No credit card required to start.",
  },
];

export function FAQ() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#264653] mb-4">
            Frequently asked questions
          </h2>
        </div>

        <Accordion>
          {faqs.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              question={faq.q}
              answer={faq.a}
            />
          ))}
        </Accordion>
      </div>
    </section>
  );
}
