"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, CalendarDays, Brain, Watch, BarChart2, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/Card";

const features = [
  {
    icon: Users,
    title: "Gestão de Atletas",
    description:
      "Cadastre novos corredores, gerencie assinaturas e acompanhe o progresso de cada atleta em um único painel.",
  },
  {
    icon: CalendarDays,
    title: "Planilhas Semanais",
    description:
      "Monte planilhas personalizadas com calendário drag-and-drop. Envie atualizações a qualquer momento — atletas são notificados na hora.",
  },
  {
    icon: Brain,
    title: "Planilhas com IA (Gold)",
    description:
      "Gere um bloco completo de treino em segundos. A IA cria planilhas periodizadas com base nos objetivos, nível e calendário de provas do atleta.",
  },
  {
    icon: Watch,
    title: "Integração com Wearables",
    description:
      "Sincronize com Garmin, Apple Watch, Whoop e Strava. As planilhas chegam no dispositivo do atleta automaticamente.",
  },
  {
    icon: BarChart2,
    title: "Análise de Desempenho",
    description:
      "Planejado vs. realizado, estimativa de VO2 Max, previsão de tempos de prova de 5K a maratona — atualizado a cada treino.",
  },
  {
    icon: MessageSquare,
    title: "Feedback com IA (Gold)",
    description:
      "Após cada sessão, a IA rascunha uma mensagem de coaching. Você revisa, edita ou aprova com um clique. Delegue o trabalho repetitivo.",
  },
];

export function FeaturesGrid() {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#264653] mb-4">
            Tudo o que você precisa para treinar em escala
          </h2>
          <p className="text-[#666666] text-lg max-w-2xl mx-auto">
            Do cadastro de atletas ao feedback com IA, o Lyfe Run cuida da plataforma para que você foque no coaching.
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
                <div className="w-12 h-12 bg-[#fdf2e9] rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-[#e76f51]" />
                </div>
                <h3 className="text-xl font-bold text-[#264653] mb-2">
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
