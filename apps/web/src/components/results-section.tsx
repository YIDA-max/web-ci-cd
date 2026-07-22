"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RotateCcw,
  ClipboardList,
  FileWarning,
} from "lucide-react";
import type {
  GitResult,
  GitConflict,
  GitSummary,
} from "@gitcicd/shared";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

interface ResultsSectionProps {
  results: GitResult[];
  summary?: GitSummary;
  conflicts?: GitConflict[];
  onReset: () => void;
}

export function ResultsSection({
  results,
  summary,
  conflicts,
  onReset,
}: ResultsSectionProps) {
  return (
    <div className="mt-4 space-y-4">
      {/* 合并汇总 */}
      {summary && (
        <Card>
          <CardHeader>
            <ClipboardList className="text-primary" />
            <CardTitle>合并汇总</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-3">
              <SummaryStat label="总计" value={summary.total} />
              <SummaryStat
                label="成功"
                value={summary.success}
                variant="success"
              />
              <SummaryStat
                label="失败"
                value={summary.failed}
                variant="destructive"
              />
              <SummaryStat
                label="冲突"
                value={summary.conflicts}
                variant="warning"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* 冲突记录 */}
      {conflicts && conflicts.length > 0 && (
        <Card>
          <CardHeader>
            <FileWarning className="text-warning" />
            <CardTitle>冲突记录</CardTitle>
            <Badge variant="warning">{conflicts.length}</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {conflicts.map((conflict, i) => (
                <motion.div
                  key={conflict.branch}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
                  className="rounded-md border border-warning/30 bg-warning/5 p-3"
                >
                  <p className="font-mono text-sm font-semibold text-warning">
                    {conflict.branch}
                  </p>
                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                    {conflict.conflicts.join(", ")}
                  </p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 逐分支结果 */}
      <Card>
        <CardHeader>
          <CheckCircle2 className="text-primary" />
          <CardTitle>合并结果</CardTitle>
          <Badge>{results.length} 个分支</Badge>
        </CardHeader>
        <CardContent>
          <div className="flex max-h-96 flex-col gap-2 overflow-y-auto">
            {results.map((result, i) => (
              <motion.div
                key={result.branch}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + i * 0.04, duration: 0.35 }}
                className={`flex items-center justify-between gap-3 rounded-md border p-3 ${
                  result.success
                    ? "border-success/30 bg-success/5"
                    : result.isConflict
                      ? "border-warning/30 bg-warning/5"
                      : "border-destructive/30 bg-destructive/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  {result.success ? (
                    <CheckCircle2 className="size-5 shrink-0 text-success" />
                  ) : result.isConflict ? (
                    <AlertTriangle className="size-5 shrink-0 text-warning" />
                  ) : (
                    <XCircle className="size-5 shrink-0 text-destructive" />
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-mono text-sm font-medium">
                      {result.branch}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {result.message}
                    </p>
                  </div>
                </div>
                <Badge
                  variant={
                    result.success
                      ? "success"
                      : result.isConflict
                        ? "warning"
                        : "destructive"
                  }
                  className="shrink-0"
                >
                  {result.success ? "成功" : result.isConflict ? "冲突" : "失败"}
                </Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 重新开始 */}
      <Button
        variant="outline"
        className="w-full"
        onClick={onReset}
      >
        <RotateCcw className="size-4" />
        重新开始
      </Button>
    </div>
  );
}

function SummaryStat({
  label,
  value,
  variant = "default",
}: {
  label: string;
  value: number;
  variant?: "default" | "success" | "destructive" | "warning";
}) {
  const colorMap = {
    default: "text-foreground",
    success: "text-success",
    destructive: "text-destructive",
    warning: "text-warning",
  };

  return (
    <div className="flex flex-col items-center rounded-md border bg-muted/30 py-3">
      <span className={`text-2xl font-bold ${colorMap[variant]}`}>
        {value}
      </span>
      <span className="mt-1 text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
