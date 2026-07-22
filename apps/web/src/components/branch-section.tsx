"use client";

import { motion } from "framer-motion";
import { GitBranch, Merge, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BranchSectionProps {
  branches: string[];
  sourceBranch: string;
  onSourceBranchChange: (value: string) => void;
  onMerge: () => void;
  disabled: boolean;
}

export function BranchSection({
  branches,
  sourceBranch,
  onSourceBranchChange,
  onMerge,
  disabled,
}: BranchSectionProps) {
  return (
    <div className="mt-4 space-y-4">
      {/* 分支列表 */}
      <Card>
        <CardHeader>
          <GitBranch className="text-primary" />
          <CardTitle>分支列表</CardTitle>
          <Badge>{branches.length} 个分支</Badge>
        </CardHeader>
        <CardContent>
          <div className="flex max-h-64 flex-col gap-1.5 overflow-y-auto">
            {branches.map((branch, i) => (
              <motion.div
                key={branch}
                initial={{ opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + i * 0.045, duration: 0.4 }}
                className="flex items-center gap-2.5 rounded-md border bg-input px-3.5 py-2.5 font-mono text-sm"
              >
                <span className="size-2 shrink-0 rounded-full bg-success shadow-[0_0_6px_hsl(var(--success)/0.5)]" />
                {branch}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 合并配置 */}
      <Card>
        <CardHeader>
          <Merge className="text-primary" />
          <CardTitle>合并配置</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>选择要合并的源分支</Label>
            <Select
              value={sourceBranch}
              onValueChange={onSourceBranchChange}
              disabled={disabled}
            >
              <SelectTrigger>
                <SelectValue placeholder="-- 请选择要合并的源分支 --" />
              </SelectTrigger>
              <SelectContent>
                {branches.map((branch) => (
                  <SelectItem key={branch} value={branch}>
                    {branch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="success"
            className="w-full"
            onClick={onMerge}
            disabled={disabled || !sourceBranch}
          >
            <Merge className="size-4" />
            {disabled ? "合并中..." : "开始合并到所有分支（除 master）"}
          </Button>
          <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
            <Info className="mt-0.5 size-3.5 shrink-0 opacity-70" />
            选中的源分支将被合并到 master 之外的所有分支，如有冲突将跳过并记录
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
