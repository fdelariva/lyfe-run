"use client";

import React from "react";
import { Accordion, AccordionItem } from "@/components/ui/Accordion";

const faqs = [
  {
    q: "Como funciona o Plano Gold de 3%?",
    a: "Calculamos 3% da receita total de assinaturas mensais que você coleta pelo Lyfe Run dos seus atletas. Não há taxa fixa — se você faturar R$ 10.000 no mês, paga R$ 300. Se está começando, paga quase nada.",
  },
  {
    q: "Quais wearables são suportados?",
    a: "Garmin (todos os relógios GPS via Connect IQ), Apple Watch (via HealthKit/WorkoutKit), Whoop e Strava. Se seu atleta não tiver nenhum desses, pode usar nossa gravação GPS integrada no iOS ou Android.",
  },
  {
    q: "Posso migrar meus atletas atuais?",
    a: "Sim. Você pode importar atletas em massa via CSV e enviar um convite de migração. Eles completam o cadastro e configuração de pagamento em menos de 5 minutos.",
  },
  {
    q: "Como funciona a geração de planilha por IA?",
    a: "Você preenche o perfil do atleta: prova objetivo, condicionamento atual, volume semanal, resultados de testes. A IA (powered by Claude) retorna um bloco completo de treino periodizado. Você revisa e edita antes de enviar ao atleta.",
  },
  {
    q: "Quais formas de pagamento os atletas podem usar?",
    a: "Os atletas podem pagar via cartão de crédito (Visa, Mastercard, Amex), PIX ou transferência bancária (TED). Todo o processamento é feito de forma segura — você nunca toca nos dados do cartão.",
  },
  {
    q: "Existe teste grátis?",
    a: "Sim. Ambos os planos incluem 14 dias de teste grátis com acesso completo a todos os recursos do plano selecionado. Não é necessário cartão de crédito para começar.",
  },
];

export function FAQ() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#264653] mb-4">
            Perguntas frequentes
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
