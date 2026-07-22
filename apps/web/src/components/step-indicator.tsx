"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const steps = [
  { num: 1, label: "同步仓库" },
  { num: 2, label: "选择分支" },
  { num: 3, label: "查看结果" },
];

export function StepIndicator({
  currentStep,
}: {
  currentStep: number;
}) {
  return (
    <div className="mb-7 flex items-center justify-center rounded-lg border bg-card p-4">
      {steps.map((step, i) => (
        <div key={step.num} className="flex items-center">
          <div
            className={cn(
              "flex items-center gap-2 transition-opacity duration-200",
              currentStep === step.num && "opacity-100",
              currentStep > step.num && "opacity-75",
              currentStep < step.num && "opacity-40",
            )}
          >
            <motion.div
              className={cn(
                "flex size-7 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors",
                currentStep === step.num &&
                  "border-primary bg-primary text-primary-foreground shadow-[0_0_16px_hsl(var(--primary)/0.4)]",
                currentStep > step.num &&
                  "border-success bg-success text-success-foreground",
                currentStep < step.num && "border-border bg-muted",
              )}
              animate={currentStep === step.num ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              {currentStep > step.num ? (
                <Check className="size-3.5" />
              ) : (
                step.num
              )}
            </motion.div>
            <span
              className={cn(
                "whitespace-nowrap text-sm font-medium",
                currentStep === step.num
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className="mx-3 h-0.5 min-w-6 flex-1 bg-border" />
          )}
        </div>
      ))}
    </div>
  );
}
