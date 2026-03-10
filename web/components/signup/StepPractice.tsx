"use client";

import React, { useState, useEffect } from "react";
import { Building2, Globe, FileText, Loader2 } from "lucide-react";
import { CoachSignupData } from "@/lib/types";
import { checkSubdomainAvailability } from "@/lib/mock-api";

interface StepPracticeProps {
  data: CoachSignupData;
  onChange: (updates: Partial<CoachSignupData>) => void;
  errors: Record<string, string>;
}

export function StepPractice({ data, onChange, errors }: StepPracticeProps) {
  const [subdomainStatus, setSubdomainStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");

  useEffect(() => {
    if (!data.subdomain || data.subdomain.length < 3) {
      setSubdomainStatus("idle");
      return;
    }

    setSubdomainStatus("checking");
    const timeout = setTimeout(async () => {
      const available = await checkSubdomainAvailability(data.subdomain);
      setSubdomainStatus(available ? "available" : "taken");
    }, 500);

    return () => clearTimeout(timeout);
  }, [data.subdomain]);

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#1A1A2E] mb-2">Set up your practice</h2>
      <p className="text-[#666666] mb-6">
        This is how your athletes will see your coaching business.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#333333] mb-1.5">Practice name</label>
          <div className="relative">
            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="e.g. Silva Running Coaching"
              value={data.practiceName}
              onChange={(e) => onChange({ practiceName: e.target.value })}
              className={`w-full pl-11 pr-4 py-3 rounded-lg border ${
                errors.practiceName ? "border-red-400" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-[#4CAF50] text-[#333333] placeholder:text-gray-400`}
            />
          </div>
          {errors.practiceName && <p className="mt-1 text-sm text-red-500">{errors.practiceName}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#333333] mb-1.5">Subdomain</label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="silva-running"
              value={data.subdomain}
              onChange={(e) =>
                onChange({ subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })
              }
              className={`w-full pl-11 pr-4 py-3 rounded-lg border ${
                errors.subdomain ? "border-red-400" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-[#4CAF50] text-[#333333] placeholder:text-gray-400`}
            />
          </div>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-sm text-[#666666]">
              lyferun.com/<span className="font-medium text-[#2D6A2B]">{data.subdomain || "your-name"}</span>
            </span>
            {subdomainStatus === "checking" && (
              <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
            )}
            {subdomainStatus === "available" && (
              <span className="text-xs text-[#4CAF50] font-medium">Available!</span>
            )}
            {subdomainStatus === "taken" && (
              <span className="text-xs text-red-500 font-medium">Already taken</span>
            )}
          </div>
          {errors.subdomain && <p className="mt-1 text-sm text-red-500">{errors.subdomain}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#333333] mb-1.5">Logo</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#4CAF50] transition-colors cursor-pointer">
            <div className="w-16 h-16 bg-[#E8F5E9] rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold text-[#2D6A2B]">
                {data.practiceName ? data.practiceName[0].toUpperCase() : "L"}
              </span>
            </div>
            <p className="text-sm text-[#666666]">
              Click to upload your logo <span className="text-gray-400">(optional)</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 2MB</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#333333] mb-1.5">Bio / About</label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <textarea
              placeholder="Tell your athletes about your coaching philosophy, experience, certifications..."
              value={data.bio}
              onChange={(e) => onChange({ bio: e.target.value })}
              rows={4}
              className="w-full pl-11 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] text-[#333333] placeholder:text-gray-400 resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
