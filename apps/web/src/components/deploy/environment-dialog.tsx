"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Server, X, CheckCircle2 } from "lucide-react";
import type { DeployEnvironment } from "@gitcicd/shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface EnvironmentDialogProps {
  open: boolean;
  environments: DeployEnvironment[];
  selectedPort: string | null;
  onSelect: (port: string) => void;
  onConfirm: () => void;
  onClose: () => void;
  loading: boolean;
}

export function EnvironmentDialog({
  open,
  environments,
  selectedPort,
  onSelect,
  onConfirm,
  onClose,
  loading,
}: EnvironmentDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-lg rounded-xl border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 头部 */}
            <div className="flex items-center justify-between border-b px-5 py-4">
              <div className="flex items-center gap-2.5">
                <Server className="size-5 text-primary" />
                <h2 className="text-base font-semibold">选择部署环境</h2>
              </div>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* 环境列表 */}
            <div className="max-h-[60vh] overflow-y-auto p-4">
              <div className="space-y-2">
                {environments.map((env, i) => {
                  const isSelected = env.port === selectedPort;
                  return (
                    <motion.button
                      key={env.port}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03, duration: 0.2 }}
                      onClick={() => onSelect(env.port)}
                      disabled={loading}
                      className={cn(
                        "flex w-full items-center justify-between gap-3 rounded-lg border p-3.5 text-left transition-all",
                        isSelected
                          ? "border-primary bg-primary/10 shadow-md"
                          : "border-border hover:border-primary/50 hover:bg-muted/50",
                        loading && "cursor-not-allowed opacity-60",
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "flex size-5 items-center justify-center rounded-full border-2",
                            isSelected
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-muted-foreground/30",
                          )}
                        >
                          {isSelected && <CheckCircle2 className="size-3.5" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{env.description}</p>
                          <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                            端口 {env.port} · {env.backendUrl}
                          </p>
                        </div>
                      </div>
                      <Badge variant="default" className="shrink-0 font-mono">
                        :{env.port}
                      </Badge>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* 底部操作 */}
            <div className="flex items-center justify-end gap-2 border-t px-5 py-4">
              <Button variant="outline" onClick={onClose} disabled={loading}>
                取消
              </Button>
              <Button
                variant="gradient"
                onClick={onConfirm}
                disabled={!selectedPort || loading}
              >
                确认发版
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
