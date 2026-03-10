"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, ExternalLink, Headphones } from "lucide-react";
import { CoachSignupData, PLAN_DETAILS } from "@/lib/types";
import { Button } from "@/components/ui/Button";

interface StepSuccessProps {
  data: CoachSignupData;
  coachId: string;
}

export function StepSuccess({ data, coachId }: StepSuccessProps) {
  const plan = PLAN_DETAILS[data.plan];

  return (
    <div className="text-center py-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
      >
        <CheckCircle className="w-20 h-20 text-[#f4a261] mx-auto mb-6" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-3xl font-extrabold text-[#264653] mb-2">
          Cadastro realizado com sucesso!
        </h2>
        <p className="text-[#666666] text-lg mb-4">
          Obrigado pelo interesse no Lyfe Run, {data.firstName}!
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-[#fdf2e9] rounded-xl p-6 mb-6 max-w-md mx-auto"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Headphones className="w-8 h-8 text-[#e76f51]" />
          <h3 className="font-bold text-[#264653] text-lg">Próximos passos</h3>
        </div>
        <p className="text-[#333333] leading-relaxed">
          Um especialista da nossa equipe entrará em contato em breve para finalizar a configuração da sua conta e acertar os detalhes de pagamento e faturamento.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-gray-50 rounded-xl p-6 mb-8 max-w-md mx-auto text-left"
      >
        <h3 className="font-bold text-[#264653] mb-3">Seus dados</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[#666666]">Assessoria</span>
            <span className="font-medium text-[#333333]">{data.practiceName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#666666]">Sua página</span>
            <span className="font-medium text-[#e76f51] flex items-center gap-1">
              lyferun.com/{data.subdomain}
              <ExternalLink className="w-3 h-3" />
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#666666]">Plano</span>
            <span className="font-medium text-[#333333]">{plan.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#666666]">E-mail</span>
            <span className="font-medium text-[#333333]">{data.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#666666]">Telefone</span>
            <span className="font-medium text-[#333333]">{data.phone}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#666666]">ID</span>
            <span className="font-mono text-xs text-gray-400">{coachId}</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="max-w-sm mx-auto"
      >
        <Button variant="ghost" size="md" href="/" className="w-full text-[#e76f51] border-[#e76f51] hover:bg-[#e76f51] hover:text-white">
          Voltar para a página inicial
        </Button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1 }}
        className="text-sm text-[#666666] mt-8"
      >
        Um e-mail de confirmação foi enviado para <span className="font-medium">{data.email}</span>
      </motion.p>
    </div>
  );
}
