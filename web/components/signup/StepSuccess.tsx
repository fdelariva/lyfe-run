"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, ExternalLink } from "lucide-react";
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
        <CheckCircle className="w-20 h-20 text-[#4CAF50] mx-auto mb-6" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-3xl font-extrabold text-[#1A1A2E] mb-2">
          Welcome to Lyfe Run!
        </h2>
        <p className="text-[#666666] text-lg mb-8">
          Your coaching practice is live. Let&apos;s get your first athlete on board.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-[#E8F5E9] rounded-xl p-6 mb-8 max-w-md mx-auto text-left"
      >
        <h3 className="font-bold text-[#1A1A2E] mb-3">Your details</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-[#666666]">Practice</span>
            <span className="font-medium text-[#333333]">{data.practiceName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#666666]">Your page</span>
            <span className="font-medium text-[#2D6A2B] flex items-center gap-1">
              lyferun.com/{data.subdomain}
              <ExternalLink className="w-3 h-3" />
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#666666]">Plan</span>
            <span className="font-medium text-[#333333]">{plan.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#666666]">Trial ends</span>
            <span className="font-medium text-[#333333]">
              {new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toLocaleDateString("pt-BR")}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#666666]">Coach ID</span>
            <span className="font-mono text-xs text-gray-400">{coachId}</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="space-y-3 max-w-sm mx-auto"
      >
        <Button variant="primary" size="lg" className="w-full gap-2">
          Go to Dashboard <ArrowRight className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="md" href="/" className="w-full text-[#2D6A2B] border-[#2D6A2B] hover:bg-[#2D6A2B] hover:text-white">
          Back to Homepage
        </Button>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="text-sm text-[#666666] mt-8"
      >
        A confirmation email has been sent to <span className="font-medium">{data.email}</span>
      </motion.p>
    </div>
  );
}
