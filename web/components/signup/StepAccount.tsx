"use client";

import React from "react";
import { User, Mail, Phone, Lock } from "lucide-react";
import { CoachSignupData } from "@/lib/types";

interface StepAccountProps {
  data: CoachSignupData;
  onChange: (updates: Partial<CoachSignupData>) => void;
  errors: Record<string, string>;
}

function InputField({
  icon: Icon,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
}: {
  icon: React.ElementType;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#333333] mb-1.5">{label}</label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full pl-11 pr-4 py-3 rounded-lg border ${
            error ? "border-red-400 focus:ring-red-400" : "border-gray-300 focus:ring-[#4CAF50]"
          } focus:outline-none focus:ring-2 text-[#333333] placeholder:text-gray-400`}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
}

export function StepAccount({ data, onChange, errors }: StepAccountProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#1A1A2E] mb-2">Crie sua conta</h2>
      <p className="text-[#666666] mb-6">Vamos configurar seu perfil de treinador no Lyfe Run.</p>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            icon={User}
            label="Nome"
            placeholder="João"
            value={data.firstName}
            onChange={(val) => onChange({ firstName: val })}
            error={errors.firstName}
          />
          <InputField
            icon={User}
            label="Sobrenome"
            placeholder="Silva"
            value={data.lastName}
            onChange={(val) => onChange({ lastName: val })}
            error={errors.lastName}
          />
        </div>
        <InputField
          icon={Mail}
          label="E-mail"
          type="email"
          placeholder="joao@exemplo.com"
          value={data.email}
          onChange={(val) => onChange({ email: val })}
          error={errors.email}
        />
        <InputField
          icon={Phone}
          label="Telefone (WhatsApp)"
          type="tel"
          placeholder="+55 11 99999-9999"
          value={data.phone}
          onChange={(val) => onChange({ phone: val })}
          error={errors.phone}
        />
        <InputField
          icon={Lock}
          label="Senha"
          type="password"
          placeholder="Mínimo 8 caracteres"
          value={data.password}
          onChange={(val) => onChange({ password: val })}
          error={errors.password}
        />
      </div>
    </div>
  );
}
