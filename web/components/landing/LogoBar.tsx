"use client";

import React from "react";
import { motion } from "framer-motion";

const integrations = ["Garmin", "Apple Watch", "Strava", "Whoop", "Google Fit", "PIX"];

export function LogoBar() {
  return (
    <section className="bg-[#F9F9F9] py-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-[#666666] font-medium mb-6">
          Integrates with the tools your athletes already use
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {integrations.map((name, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-full px-6 py-2.5 shadow-sm border border-gray-100 text-sm font-semibold text-[#333333]"
            >
              {name}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
