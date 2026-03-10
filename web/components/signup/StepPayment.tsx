"use client";

import React from "react";
import { CreditCard, Building, Smartphone } from "lucide-react";
import { CoachSignupData, PLAN_DETAILS } from "@/lib/types";
import { cn } from "@/lib/utils";

interface StepPaymentProps {
  data: CoachSignupData;
  onChange: (updates: Partial<CoachSignupData>) => void;
  errors: Record<string, string>;
}

const paymentMethods = [
  { key: "credit_card" as const, label: "Cartão de Crédito", sublabel: "Visa, Mastercard, Amex", icon: CreditCard },
  { key: "pix" as const, label: "PIX", sublabel: "Transferência instantânea", icon: Smartphone },
  { key: "bank_transfer" as const, label: "Transferência", sublabel: "TED / DOC", icon: Building },
];

export function StepPayment({ data, onChange, errors }: StepPaymentProps) {
  const plan = PLAN_DETAILS[data.plan];

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#1A1A2E] mb-2">Forma de pagamento</h2>
      <p className="text-[#666666] mb-6">
        Você não será cobrado durante os 14 dias de teste.
      </p>

      <div className="bg-[#E8F5E9] rounded-lg p-4 mb-6 flex items-center justify-between">
        <div>
          <p className="font-semibold text-[#1A1A2E]">{plan.name}</p>
          <p className="text-sm text-[#666666]">14 dias grátis, depois {plan.price} {plan.period}</p>
        </div>
        <span className="text-2xl font-extrabold text-[#2D6A2B]">{plan.price}</span>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-[#333333] mb-3">Método de pagamento preferido</label>
        <div className="grid grid-cols-3 gap-3">
          {paymentMethods.map((method) => {
            const selected = data.paymentMethod === method.key;
            return (
              <button
                key={method.key}
                onClick={() => onChange({ paymentMethod: method.key })}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all",
                  selected
                    ? "border-[#4CAF50] bg-[#E8F5E9]/50"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <method.icon className={cn("w-6 h-6", selected ? "text-[#2D6A2B]" : "text-gray-400")} />
                <span className={cn("text-sm font-medium", selected ? "text-[#1A1A2E]" : "text-gray-500")}>
                  {method.label}
                </span>
                <span className="text-[10px] text-gray-400">{method.sublabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {data.paymentMethod === "credit_card" && (
        <div className="space-y-4 border-t border-gray-100 pt-6">
          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1.5">Número do cartão</label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={data.cardNumber || ""}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").substring(0, 16);
                  const formatted = val.replace(/(\d{4})/g, "$1 ").trim();
                  onChange({ cardNumber: formatted });
                }}
                className={`w-full pl-11 pr-4 py-3 rounded-lg border ${
                  errors.cardNumber ? "border-red-400" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-[#4CAF50] text-[#333333] placeholder:text-gray-400`}
              />
            </div>
            {errors.cardNumber && <p className="mt-1 text-sm text-red-500">{errors.cardNumber}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#333333] mb-1.5">Nome no cartão</label>
            <input
              type="text"
              placeholder="JOAO DA SILVA"
              value={data.cardName || ""}
              onChange={(e) => onChange({ cardName: e.target.value.toUpperCase() })}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.cardName ? "border-red-400" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-[#4CAF50] text-[#333333] placeholder:text-gray-400`}
            />
            {errors.cardName && <p className="mt-1 text-sm text-red-500">{errors.cardName}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-1.5">Validade</label>
              <input
                type="text"
                placeholder="MM/AA"
                value={data.cardExpiry || ""}
                onChange={(e) => {
                  let val = e.target.value.replace(/\D/g, "").substring(0, 4);
                  if (val.length > 2) val = val.substring(0, 2) + "/" + val.substring(2);
                  onChange({ cardExpiry: val });
                }}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.cardExpiry ? "border-red-400" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-[#4CAF50] text-[#333333] placeholder:text-gray-400`}
              />
              {errors.cardExpiry && <p className="mt-1 text-sm text-red-500">{errors.cardExpiry}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#333333] mb-1.5">CVV</label>
              <input
                type="text"
                placeholder="123"
                value={data.cardCvv || ""}
                onChange={(e) => onChange({ cardCvv: e.target.value.replace(/\D/g, "").substring(0, 4) })}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.cardCvv ? "border-red-400" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-[#4CAF50] text-[#333333] placeholder:text-gray-400`}
              />
              {errors.cardCvv && <p className="mt-1 text-sm text-red-500">{errors.cardCvv}</p>}
            </div>
          </div>
        </div>
      )}

      {data.paymentMethod === "pix" && (
        <div className="border-t border-gray-100 pt-6">
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <Smartphone className="w-10 h-10 text-[#2D6A2B] mx-auto mb-3" />
            <p className="text-sm text-[#333333] font-medium mb-1">
              Os dados do PIX serão enviados após a confirmação
            </p>
            <p className="text-xs text-[#666666]">
              Você receberá um QR code e chave PIX para completar o pagamento.
            </p>
          </div>
        </div>
      )}

      {data.paymentMethod === "bank_transfer" && (
        <div className="border-t border-gray-100 pt-6">
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <Building className="w-10 h-10 text-[#2D6A2B] mx-auto mb-3" />
            <p className="text-sm text-[#333333] font-medium mb-1">
              Os dados bancários serão fornecidos após a confirmação
            </p>
            <p className="text-xs text-[#666666]">
              Transferência via TED ou DOC. Seu período de teste começa imediatamente.
            </p>
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        <span>Seus dados de pagamento são criptografados e seguros. Nunca armazenamos dados do cartão.</span>
      </div>
    </div>
  );
}
