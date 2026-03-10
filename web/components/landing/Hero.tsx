"use client";

import React from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" as const },
  }),
};

function DashboardMockup() {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-2xl w-full max-w-md">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-yellow-400" />
        <div className="w-3 h-3 rounded-full bg-green-400" />
        <span className="ml-2 text-white/50 text-xs">coach-dashboard</span>
      </div>

      <div className="space-y-3">
        <div className="bg-white/10 rounded-lg p-3">
          <p className="text-white/60 text-xs mb-2 font-medium">ATLETAS</p>
          <div className="space-y-2">
            {["Ana Silva — 10K", "Carlos Rocha — Marathon", "Bia Costa — Half"].map((name) => (
              <div key={name} className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#f4a261]/40 flex items-center justify-center text-[10px] text-white font-bold">
                  {name[0]}
                </div>
                <span className="text-white/80 text-xs">{name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 rounded-lg p-3">
          <p className="text-white/60 text-xs mb-2 font-medium">PLANILHA SEMANAL — Ana Silva</p>
          <div className="grid grid-cols-7 gap-1">
            {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((d) => (
              <div key={d} className="text-center">
                <p className="text-white/40 text-[9px]">{d}</p>
                <div
                  className={`h-6 rounded text-[9px] flex items-center justify-center mt-1 ${
                    d === "Dom"
                      ? "bg-white/5 text-white/30"
                      : "bg-[#f4a261]/30 text-white/80"
                  }`}
                >
                  {d === "Dom" ? "Folga" : d === "Sáb" ? "Longo" : "Treino"}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "VO2 Max", value: "48.2" },
            { label: "Pred 5K", value: "22:30" },
            { label: "Aderência", value: "94%" },
          ].map((m) => (
            <div key={m.label} className="bg-white/10 rounded-lg p-2 text-center">
              <p className="text-[#f4a261] text-sm font-bold">{m.value}</p>
              <p className="text-white/50 text-[9px]">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-[#264653] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#e76f51]/20 via-transparent to-[#f4a261]/10" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#e76f51]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-[#f4a261]/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}>
              <Badge variant="dark" className="mb-6">
                🏃 Feito para Treinadores de Corrida
              </Badge>
            </motion.div>

            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6"
            >
              Toda a sua assessoria de corrida.{" "}
              <span className="text-[#f4a261]">Em uma plataforma.</span>
            </motion.h1>

            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-lg text-white/70 mb-8 max-w-lg"
            >
              Gerencie atletas, entregue planilhas de treino, integre com dispositivos
              e faça sua assessoria crescer — tudo pelo Lyfe Run.
            </motion.p>

            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex flex-col sm:flex-row gap-4 mb-10"
            >
              <Button variant="primary" size="lg" href="#pricing">
                Teste Grátis
              </Button>
              <Button variant="ghost" size="lg" href="#features">
                Veja Como Funciona
              </Button>
            </motion.div>

            <motion.div
              custom={4}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="flex items-center gap-4"
            >
              <div className="flex -space-x-2">
                {["R", "F", "B", "M"].map((initial, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full bg-[#f4a261] border-2 border-[#264653] flex items-center justify-center text-white text-xs font-bold"
                  >
                    {initial}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-white text-sm font-medium">
                  Usado por mais de 500 treinadores
                </p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-sm">★</span>
                  ))}
                  <span className="text-white/60 text-sm ml-1">4.9/5</span>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="hidden lg:flex justify-center"
          >
            <DashboardMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
