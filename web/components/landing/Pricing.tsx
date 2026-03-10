"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const plans = [
  {
    name: "Basic Plan",
    price: "R$ 200",
    period: "/ month",
    sublabel: null,
    badge: null,
    highlighted: false,
    features: [
      "Up to 20 athletes",
      "Weekly plan builder",
      "Strava + GPS recording",
      "Custom landing page",
      "PIX, credit card, bank transfer",
      "Basic analytics",
    ],
    cta: "Start with Basic",
  },
  {
    name: "Gold Plan",
    price: "3%",
    period: "of monthly revenue",
    sublabel: "Only pay when you earn",
    badge: "Most Popular",
    highlighted: true,
    features: [
      "Unlimited athletes",
      "AI training plan generation",
      "AI session feedback drafting",
      "Garmin + Apple Watch + Whoop integration",
      "Advanced analytics + cohort views",
      "VO2 Max + race time predictions",
      "Priority support",
    ],
    cta: "Start Gold Trial",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-[#1A1A2E]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Simple, coach-friendly pricing
          </h2>
          <p className="text-white/60 text-lg">
            Grow your practice. Only pay more when you earn more.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ scale: 1.02 }}
              className={`relative bg-white rounded-2xl p-8 ${
                plan.highlighted
                  ? "border-2 border-[#4CAF50] shadow-2xl shadow-[#4CAF50]/20"
                  : "border border-gray-200"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="highlight">{plan.badge}</Badge>
                </div>
              )}

              <h3 className="text-xl font-bold text-[#1A1A2E] mb-2">
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-extrabold text-[#1A1A2E]">
                  {plan.price}
                </span>
                <span className="text-[#666666]">{plan.period}</span>
              </div>
              {plan.sublabel && (
                <p className="text-sm text-[#4CAF50] font-medium mb-6">
                  {plan.sublabel}
                </p>
              )}
              {!plan.sublabel && <div className="mb-6" />}

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#4CAF50] flex-shrink-0 mt-0.5" />
                    <span className="text-[#333333] text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.highlighted ? (
                <Button variant="primary" size="lg" className="w-full" href="/signup?plan=gold">
                  {plan.cta}
                </Button>
              ) : (
                <a
                  href="/signup?plan=basic"
                  className="block w-full py-3 px-6 rounded-lg border-2 border-[#2D6A2B] text-[#2D6A2B] font-semibold hover:bg-[#2D6A2B] hover:text-white transition-all duration-200 text-center"
                >
                  {plan.cta}
                </a>
              )}
            </motion.div>
          ))}
        </div>

        <p className="text-center text-white/40 text-sm mt-8">
          No setup fees. Cancel anytime. PIX, credit card, or bank transfer accepted.
        </p>
      </div>
    </section>
  );
}
