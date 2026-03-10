"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, CalendarDays, Brain, Watch, BarChart2, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/Card";

const features = [
  {
    icon: Users,
    title: "Athlete Management",
    description:
      "Onboard new runners, manage subscriptions, and track every athlete's progress from a single back-office.",
  },
  {
    icon: CalendarDays,
    title: "Weekly Training Plans",
    description:
      "Build personalized weekly plans with a drag-and-drop calendar. Push updates anytime — athletes get notified instantly.",
  },
  {
    icon: Brain,
    title: "AI-Powered Plans (Gold)",
    description:
      "Generate a complete training block in seconds. Claude AI creates periodized plans based on the athlete's goals, fitness level, and race calendar.",
  },
  {
    icon: Watch,
    title: "Wearable Integration",
    description:
      "Sync with Garmin, Apple Watch, Whoop, and Strava. Plans land on the athlete's device automatically.",
  },
  {
    icon: BarChart2,
    title: "Performance Analytics",
    description:
      "Planned vs. actual, VO2 Max estimation, predicted race times for 5K to marathon — updated after every run.",
  },
  {
    icon: MessageSquare,
    title: "AI Feedback (Gold)",
    description:
      "After each session, AI drafts a coaching message. You review, edit, or approve with one click. Offload the repetitive work.",
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A2E] mb-4">
            Everything you need to coach at scale
          </h2>
          <p className="text-[#666666] text-lg max-w-2xl mx-auto">
            From athlete onboarding to AI-powered feedback, Lyfe Run handles the platform so you can focus on coaching.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Card hover className="h-full">
                <div className="w-12 h-12 bg-[#E8F5E9] rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-[#2D6A2B]" />
                </div>
                <h3 className="text-xl font-bold text-[#1A1A2E] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[#666666] leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
