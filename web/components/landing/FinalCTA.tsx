"use client";

import React from "react";
import { motion } from "framer-motion";

export function FinalCTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#e76f51] to-[#264653]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Pronto para construir sua assessoria?
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
            Junte-se a centenas de treinadores que já usam o Lyfe Run para
            entregar treinos melhores e gastar menos tempo com administração.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto mb-4">
            <input
              type="email"
              placeholder="seu@email.com"
              className="flex-1 px-5 py-3 rounded-lg text-[#333333] bg-white focus:outline-none focus:ring-2 focus:ring-[#f4a261]"
            />
            <button className="px-6 py-3 bg-[#f4a261] text-white font-semibold rounded-lg hover:bg-[#e76f51] transition-colors shadow-lg">
              Acesso Antecipado
            </button>
          </div>

          <p className="text-white/40 text-sm">
            14 dias grátis. Sem necessidade de cartão de crédito.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
