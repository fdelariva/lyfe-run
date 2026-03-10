"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

const plans = [
  {
    name: "Plano Basic",
    price: "R$ 200",
    period: "/ mês",
    sublabel: null,
    badge: null,
    highlighted: false,
    features: [
      "Até 20 atletas",
      "Montador de planilha semanal",
      "Strava + gravação GPS",
      "Página personalizada",
      "PIX, cartão de crédito, transferência",
      "Análises básicas",
    ],
    cta: "Começar com Basic",
  },
  {
    name: "Plano Gold",
    price: "3%",
    period: "da receita mensal",
    sublabel: "Pague apenas quando ganhar",
    badge: "Mais Popular",
    highlighted: true,
    features: [
      "Atletas ilimitados",
      "Geração de planilha por IA",
      "Feedback de sessão por IA",
      "Integração Garmin + Apple Watch + Whoop",
      "Análises avançadas + visão por grupo",
      "VO2 Max + previsão de tempos de prova",
      "Suporte prioritário",
    ],
    cta: "Testar Plano Gold",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-[#264653]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Preços simples, feitos para treinadores
          </h2>
          <p className="text-white/60 text-lg">
            Cresça sua assessoria. Pague mais apenas quando ganhar mais.
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
                  ? "border-2 border-[#f4a261] shadow-2xl shadow-[#f4a261]/20"
                  : "border border-gray-200"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="highlight">{plan.badge}</Badge>
                </div>
              )}

              <h3 className="text-xl font-bold text-[#264653] mb-2">
                {plan.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-extrabold text-[#264653]">
                  {plan.price}
                </span>
                <span className="text-[#666666]">{plan.period}</span>
              </div>
              {plan.sublabel && (
                <p className="text-sm text-[#f4a261] font-medium mb-6">
                  {plan.sublabel}
                </p>
              )}
              {!plan.sublabel && <div className="mb-6" />}

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#f4a261] flex-shrink-0 mt-0.5" />
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
                  className="block w-full py-3 px-6 rounded-lg border-2 border-[#e76f51] text-[#e76f51] font-semibold hover:bg-[#e76f51] hover:text-white transition-all duration-200 text-center"
                >
                  {plan.cta}
                </a>
              )}
            </motion.div>
          ))}
        </div>

        <p className="text-center text-white/40 text-sm mt-8">
          Sem taxa de adesão. Cancele quando quiser. PIX, cartão de crédito ou transferência.
        </p>
      </div>
    </section>
  );
}
