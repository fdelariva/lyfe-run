"use client";

import React from "react";
import { motion } from "framer-motion";

export function FinalCTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#2D6A2B] to-[#1A1A2E]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to build your coaching business?
          </h2>
          <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
            Join hundreds of coaches already using Lyfe Run to deliver better
            training and spend less time on admin.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto mb-4">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-5 py-3 rounded-lg text-[#333333] bg-white focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
            />
            <button className="px-6 py-3 bg-[#4CAF50] text-white font-semibold rounded-lg hover:bg-[#2D6A2B] transition-colors shadow-lg">
              Get Early Access
            </button>
          </div>

          <p className="text-white/40 text-sm">
            14-day free trial. No credit card required.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
