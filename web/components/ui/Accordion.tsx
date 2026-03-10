"use client";

import React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Accordion({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <AccordionPrimitive.Root type="single" collapsible className={cn("w-full", className)}>
      {children}
    </AccordionPrimitive.Root>
  );
}

export function AccordionItem({
  value,
  question,
  answer,
}: {
  value: string;
  question: string;
  answer: string;
}) {
  return (
    <AccordionPrimitive.Item value={value} className="border-b border-gray-200">
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger className="flex w-full items-center justify-between py-5 text-left text-lg font-semibold text-[#1A1A2E] hover:text-[#2D6A2B] transition-colors group">
          {question}
          <ChevronDown className="h-5 w-5 text-[#666666] transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
      <AccordionPrimitive.Content className="overflow-hidden data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
        <p className="pb-5 text-[#666666] leading-relaxed">{answer}</p>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
}
