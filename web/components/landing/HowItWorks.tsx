"use client";

import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    step: "1",
    title: "Set up your practice",
    description: "Logo, branding, subdomain, coach profile — ready in minutes.",
  },
  {
    step: "2",
    title: "Invite your athletes",
    description:
      "They onboard, pay, and self-assess through your custom landing page.",
  },
  {
    step: "3",
    title: "Deliver plans",
    description:
      "Build weekly plans or let AI generate them. Push to wearables automatically.",
  },
  {
    step: "4",
    title: "Coach smarter",
    description:
      "Review AI-generated feedback, track compliance, watch fitness scores improve.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-[#E8F5E9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A2E] mb-4">
            From sign-up to first plan in under 10 minutes
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="text-center"
            >
              <div className="w-14 h-14 bg-[#2D6A2B] rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                {step.step}
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute" />
              )}
              <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">
                {step.title}
              </h3>
              <p className="text-[#666666] text-sm leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
