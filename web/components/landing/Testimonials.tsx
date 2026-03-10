"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";

const testimonials = [
  {
    name: "Ricardo Mendes",
    role: "Triathlon Coach, São Paulo",
    initials: "RM",
    color: "bg-blue-500",
    quote:
      "I went from managing plans in spreadsheets to having a fully automated system. My athletes get their plans on their Garmins every Monday without me lifting a finger.",
  },
  {
    name: "Fernanda Souza",
    role: "Marathon Coach, Curitiba",
    initials: "FS",
    color: "bg-purple-500",
    quote:
      "The AI feedback feature alone saves me 2 hours a day. I review and approve — it sounds exactly like me after the first week.",
  },
  {
    name: "Bruno Alves",
    role: "Trail Running Coach, Florianópolis",
    initials: "BA",
    color: "bg-orange-500",
    quote:
      "My athletes finally have a professional app to track their runs. The VO2 and race prediction charts keep them motivated like nothing else I've tried.",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1A1A2E] mb-4">
            Coaches love Lyfe Run
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <Card className="h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-11 h-11 rounded-full ${t.color} flex items-center justify-center text-white text-sm font-bold`}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A1A2E]">{t.name}</p>
                    <p className="text-sm text-[#666666]">{t.role}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-[#333333] leading-relaxed italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
