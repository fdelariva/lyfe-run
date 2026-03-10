"use client";

import React from "react";
import { Check, Star } from "lucide-react";
import { CoachSignupData, PLAN_DETAILS, PlanType } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StepPlanConfirmProps {
  data: CoachSignupData;
  onChange: (updates: Partial<CoachSignupData>) => void;
}

export function StepPlanConfirm({ data, onChange }: StepPlanConfirmProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#1A1A2E] mb-2">Confirme seu plano</h2>
      <p className="text-[#666666] mb-6">
        Você pode trocar de plano a qualquer momento. Ambos incluem 14 dias grátis.
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {(["basic", "gold"] as PlanType[]).map((planKey) => {
          const plan = PLAN_DETAILS[planKey];
          const selected = data.plan === planKey;

          return (
            <button
              key={planKey}
              onClick={() => onChange({ plan: planKey })}
              className={cn(
                "text-left rounded-xl p-6 border-2 transition-all duration-200",
                selected
                  ? "border-[#4CAF50] bg-[#E8F5E9]/50 shadow-lg"
                  : "border-gray-200 bg-white hover:border-gray-300"
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  {planKey === "gold" && (
                    <div className="inline-flex items-center gap-1 bg-[#4CAF50] text-white text-xs font-medium px-2 py-0.5 rounded-full mb-2">
                      <Star className="w-3 h-3" /> Mais Popular
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-[#1A1A2E]">{plan.name}</h3>
                </div>
                <div
                  className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center",
                    selected ? "border-[#4CAF50] bg-[#4CAF50]" : "border-gray-300"
                  )}
                >
                  {selected && <Check className="w-4 h-4 text-white" />}
                </div>
              </div>

              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-2xl font-extrabold text-[#1A1A2E]">{plan.price}</span>
                <span className="text-sm text-[#666666]">{plan.period}</span>
              </div>

              <ul className="space-y-2">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-[#4CAF50] flex-shrink-0 mt-0.5" />
                    <span className="text-[#333333]">{feature}</span>
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <div className="mt-6 bg-gray-50 rounded-lg p-4 text-center">
        <p className="text-sm text-[#666666]">
          🎉 <span className="font-medium text-[#333333]">14 dias grátis</span> — sem necessidade de cartão de crédito.
          A cobrança só começa após o período de teste.
        </p>
      </div>
    </div>
  );
}
