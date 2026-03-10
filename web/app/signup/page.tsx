"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { StepIndicator } from "@/components/signup/StepIndicator";
import { StepAccount } from "@/components/signup/StepAccount";
import { StepPractice } from "@/components/signup/StepPractice";
import { StepPlanConfirm } from "@/components/signup/StepPlanConfirm";
import { StepPayment } from "@/components/signup/StepPayment";
import { StepSuccess } from "@/components/signup/StepSuccess";
import { CoachSignupData, PlanType } from "@/lib/types";
import { createCoachAccount } from "@/lib/mock-api";

const STEP_LABELS = ["Conta", "Assessoria", "Plano", "Pagamento"];

function getInitialPlan(params: URLSearchParams): PlanType {
  const plan = params.get("plan");
  return plan === "basic" || plan === "gold" ? plan : "gold";
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#2D6A2B]" />
      </div>
    }>
      <SignupFlow />
    </Suspense>
  );
}

function SignupFlow() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [coachId, setCoachId] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [data, setData] = useState<CoachSignupData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    practiceName: "",
    subdomain: "",
    bio: "",
    plan: getInitialPlan(searchParams),
    paymentMethod: "credit_card",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
  });

  const updateData = (updates: Partial<CoachSignupData>) => {
    setData((prev) => ({ ...prev, ...updates }));
    const clearedErrors = { ...errors };
    Object.keys(updates).forEach((key) => delete clearedErrors[key]);
    setErrors(clearedErrors);
  };

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (currentStep === 1) {
      if (!data.firstName.trim()) newErrors.firstName = "Nome é obrigatório";
      if (!data.lastName.trim()) newErrors.lastName = "Sobrenome é obrigatório";
      if (!data.email.trim()) newErrors.email = "E-mail é obrigatório";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
        newErrors.email = "E-mail inválido";
      if (!data.phone.trim()) newErrors.phone = "Telefone é obrigatório";
      if (!data.password.trim()) newErrors.password = "Senha é obrigatória";
      else if (data.password.length < 8)
        newErrors.password = "A senha deve ter pelo menos 8 caracteres";
    }

    if (currentStep === 2) {
      if (!data.practiceName.trim()) newErrors.practiceName = "Nome da assessoria é obrigatório";
      if (!data.subdomain.trim()) newErrors.subdomain = "Subdomínio é obrigatório";
      else if (data.subdomain.length < 3)
        newErrors.subdomain = "O subdomínio deve ter pelo menos 3 caracteres";
    }

    if (currentStep === 4 && data.paymentMethod === "credit_card") {
      if (!data.cardNumber || data.cardNumber.replace(/\s/g, "").length < 16)
        newErrors.cardNumber = "Informe um número de cartão válido";
      if (!data.cardName?.trim()) newErrors.cardName = "Nome no cartão é obrigatório";
      if (!data.cardExpiry || data.cardExpiry.length < 5)
        newErrors.cardExpiry = "Informe a validade";
      if (!data.cardCvv || data.cardCvv.length < 3)
        newErrors.cardCvv = "Informe o CVV";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateStep(step)) return;

    if (step === 4) {
      setLoading(true);
      try {
        const result = await createCoachAccount(data);
        setCoachId(result.coachId);
        setStep(5);
      } catch {
        setErrors({ submit: "Algo deu errado. Tente novamente." });
      } finally {
        setLoading(false);
      }
      return;
    }

    setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  const isSuccess = step === 5;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="text-xl font-extrabold text-[#2D6A2B]">
            Lyfe Run
          </a>
          {!isSuccess && (
            <span className="text-sm text-[#666666]">
              Passo {step} de 4
            </span>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {!isSuccess && (
          <StepIndicator currentStep={step} totalSteps={4} labels={STEP_LABELS} />
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {step === 1 && <StepAccount data={data} onChange={updateData} errors={errors} />}
              {step === 2 && <StepPractice data={data} onChange={updateData} errors={errors} />}
              {step === 3 && <StepPlanConfirm data={data} onChange={updateData} />}
              {step === 4 && <StepPayment data={data} onChange={updateData} errors={errors} />}
              {step === 5 && <StepSuccess data={data} coachId={coachId} />}
            </motion.div>
          </AnimatePresence>

          {errors.submit && (
            <p className="mt-4 text-sm text-red-500 text-center">{errors.submit}</p>
          )}

          {!isSuccess && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              {step > 1 ? (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 text-[#666666] hover:text-[#333333] font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Voltar
                </button>
              ) : (
                <a
                  href="/"
                  className="flex items-center gap-2 text-[#666666] hover:text-[#333333] font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Início
                </a>
              )}

              <button
                onClick={handleNext}
                disabled={loading}
                className="flex items-center gap-2 bg-[#2D6A2B] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#1A1A2E] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Processando...
                  </>
                ) : step === 4 ? (
                  <>
                    Finalizar Cadastro <ArrowRight className="w-4 h-4" />
                  </>
                ) : (
                  <>
                    Continuar <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
