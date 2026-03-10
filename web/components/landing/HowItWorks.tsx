"use client";

import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    step: "1",
    title: "Configure sua assessoria",
    description: "Logo, marca, subdomínio, perfil do treinador — pronto em minutos.",
  },
  {
    step: "2",
    title: "Convide seus atletas",
    description:
      "Eles se cadastram, pagam e fazem auto-avaliação pela sua página personalizada.",
  },
  {
    step: "3",
    title: "Entregue planilhas",
    description:
      "Monte planilhas semanais ou deixe a IA gerá-las. Envie para wearables automaticamente.",
  },
  {
    step: "4",
    title: "Treine de forma mais inteligente",
    description:
      "Revise feedbacks gerados por IA, acompanhe aderência e veja os índices de fitness melhorarem.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-[#fdf2e9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#264653] mb-4">
            Do cadastro à primeira planilha em menos de 10 minutos
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
              <div className="w-14 h-14 bg-[#e76f51] rounded-full flex items-center justify-center text-white text-xl font-bold mx-auto mb-4">
                {step.step}
              </div>
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute" />
              )}
              <h3 className="text-lg font-bold text-[#264653] mb-2">
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
