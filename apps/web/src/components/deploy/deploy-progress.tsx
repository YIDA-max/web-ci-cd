"use client";

import { motion } from "framer-motion";
import {
  Loader2,
  CheckCircle2,
  XCircle,
  Terminal,
  RotateCcw,
} from "lucide-react";
import type { DeployLogEntry } from "@gitcicd/shared";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DeployProgressProps {
  status: "building" | "success" | "error";
  logs: DeployLogEntry[];
  error?: string;
  onReset: () => void;
}

const stepIcons: Record<string, string> = {
  准备: "📁",
  克隆: "⬇️",
  切换分支: "🔀",
  安装依赖: "📦",
  构建: "🔨",
  构建产物: "📂",
  部署目标: "🎯",
  清理: "🧹",
  部署: "📋",
  验证: "✅",
  完成: "🎉",
  错误: "❌",
};

export function DeployProgress({
  status,
  logs,
  error,
  onReset,
}: DeployProgressProps) {
  const isBuilding = status === "building";

  return (
    <div className="mt-4 space-y-4">
      {/* 状态卡片 */}
      <Card>
        <CardHeader>
          {isBuilding ? (
            <Loader2 className="size-5 animate-spin text-primary" />
          ) : status === "success" ? (
            <CheckCircle2 className="size-5 text-success" />
          ) : (
            <XCircle className="size-5 text-destructive" />
          )}
          <CardTitle>
            {isBuilding
              ? "正在构建部署..."
              : status === "success"
                ? "发版成功"
                : "发版失败"}
          </CardTitle>
          {status === "success" && (
            <Badge variant="success">部署完成</Badge>
          )}
          {status === "error" && <Badge variant="destructive">失败</Badge>}
        </CardHeader>
        {error && status === "error" && (
          <CardContent>
            <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* 构建日志 */}
      <Card>
        <CardHeader>
          <Terminal className="size-5 text-primary" />
          <CardTitle>构建日志</CardTitle>
          <Badge>{logs.length} 条</Badge>
        </CardHeader>
        <CardContent>
          <div className="max-h-80 space-y-1.5 overflow-y-auto rounded-md bg-zinc-950/80 p-4 font-mono text-xs dark:bg-zinc-950/80">
            {logs.length === 0 && isBuilding && (
              <p className="text-muted-foreground">等待构建日志...</p>
            )}
            {logs.map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-start gap-2"
              >
                <span className="shrink-0 text-muted-foreground">
                  {stepIcons[log.step] || "•"}
                </span>
                <span className="shrink-0 text-cyan-400/80">[{log.step}]</span>
                <span
                  className={
                    log.step === "错误"
                      ? "text-red-400"
                      : log.step === "完成"
                        ? "text-green-400"
                        : "text-zinc-300"
                  }
                >
                  {log.message}
                </span>
              </motion.div>
            ))}
            {isBuilding && (
              <motion.div
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="mt-1 text-cyan-400"
              >
                ▋
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 重新开始 */}
      {!isBuilding && (
        <Button variant="outline" className="w-full" onClick={onReset}>
          <RotateCcw className="size-4" />
          重新发版
        </Button>
      )}
    </div>
  );
}
