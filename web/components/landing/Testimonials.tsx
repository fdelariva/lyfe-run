"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";

const testimonials = [
  {
    name: "Ricardo Mendes",
    role: "Treinador de Triathlon, São Paulo",
    initials: "RM",
    color: "bg-blue-500",
    quote:
      "Saí de planilhas em Excel para um sistema totalmente automatizado. Meus atletas recebem os treinos no Garmin toda segunda sem eu precisar fazer nada.",
  },
  {
    name: "Fernanda Souza",
    role: "Treinadora de Maratona, Curitiba",
    initials: "FS",
    color: "bg-purple-500",
    quote:
      "Só o recurso de feedback por IA me economiza 2 horas por dia. Eu reviso e aprovo — depois de uma semana já parece a minha voz.",
  },
  {
    name: "Bruno Alves",
    role: "Treinador de Trail, Florianópolis",
    initials: "BA",
    color: "bg-orange-500",
    quote:
      "Meus atletas finalmente têm um app profissional para acompanhar os treinos. Os gráficos de VO2 e previsão de prova mantêm eles motivados como nada que eu já testei.",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#264653] mb-4">
            Treinadores adoram o Lyfe Run
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
                    <p className="font-semibold text-[#264653]">{t.name}</p>
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
