"use client";

import React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels: string[];
}

export function StepIndicator({ currentStep, totalSteps, labels }: StepIndicatorProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => {
          const step = i + 1;
          const isComplete = step < currentStep;
          const isCurrent = step === currentStep;

          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
                    isComplete && "bg-[#4CAF50] text-white",
                    isCurrent && "bg-[#2D6A2B] text-white ring-4 ring-[#2D6A2B]/20",
                    !isComplete && !isCurrent && "bg-gray-200 text-gray-500"
                  )}
                >
                  {isComplete ? <Check className="w-5 h-5" /> : step}
                </div>
                <span
                  className={cn(
                    "text-xs font-medium hidden sm:block",
                    isCurrent ? "text-[#2D6A2B]" : isComplete ? "text-[#4CAF50]" : "text-gray-400"
                  )}
                >
                  {labels[i]}
                </span>
              </div>
              {i < totalSteps - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2 transition-all duration-300",
                    step < currentStep ? "bg-[#4CAF50]" : "bg-gray-200"
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
