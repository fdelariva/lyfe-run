"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const features = [
  "Receive weekly plans directly on Garmin or Apple Watch",
  "GPS run recording when no device is available",
  "Real-time pace, HR zones, and distance tracking",
  "Post-run analysis: planned vs. actual performance",
  "Race calendar with ticket purchasing and goal pace prediction",
];

function PhoneMockup() {
  return (
    <div className="w-72 mx-auto">
      <div className="bg-[#264653] rounded-[2.5rem] p-3 shadow-2xl">
        <div className="bg-white rounded-[2rem] overflow-hidden">
          <div className="bg-[#e76f51] px-5 pt-10 pb-4">
            <p className="text-white/70 text-xs">Monday, March 10</p>
            <h3 className="text-white text-lg font-bold">Today&apos;s Run</h3>
          </div>
          <div className="px-5 py-4 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Distance", value: "8.0 km" },
                { label: "Target Pace", value: "5:30/km" },
                { label: "HR Zone", value: "Z2-Z3" },
              ].map((m) => (
                <div key={m.label} className="text-center">
                  <p className="text-[#e76f51] text-base font-bold">{m.value}</p>
                  <p className="text-[#666666] text-[10px]">{m.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-[#fdf2e9] rounded-xl p-3">
              <p className="text-[10px] text-[#666666] mb-1">WORKOUT</p>
              <div className="space-y-1.5">
                {[
                  { seg: "Warm-up", val: "1km @ 6:00" },
                  { seg: "Tempo", val: "5km @ 5:15" },
                  { seg: "Easy", val: "1km @ 6:00" },
                  { seg: "Cool-down", val: "1km @ 6:30" },
                ].map((s) => (
                  <div key={s.seg} className="flex justify-between text-xs">
                    <span className="text-[#333333] font-medium">{s.seg}</span>
                    <span className="text-[#e76f51]">{s.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-100 rounded-xl h-24 flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 mx-auto mb-1 rounded-full bg-[#f4a261]/20 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-[#f4a261]" />
                </div>
                <p className="text-[10px] text-[#666666]">Route Map</p>
              </div>
            </div>

            <button className="w-full bg-[#f4a261] text-white text-sm font-semibold py-3 rounded-xl">
              Start Run
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AthleteExperience() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#264653] mb-6">
              Everything your athletes need.{" "}
              <span className="text-[#f4a261]">Right in their pocket.</span>
            </h2>
            <div className="space-y-4">
              {features.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#fdf2e9] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3.5 h-3.5 text-[#e76f51]" />
                  </div>
                  <p className="text-[#333333] leading-relaxed">{feature}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <PhoneMockup />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
