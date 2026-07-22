"use client";

import { RefreshCw, Info, Link2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface RepoConfigProps {
  repoUrl: string;
  onRepoUrlChange: (value: string) => void;
  onSync: () => void;
  disabled: boolean;
}

export function RepoConfig({
  repoUrl,
  onRepoUrlChange,
  onSync,
  disabled,
}: RepoConfigProps) {
  return (
    <Card>
      <CardHeader>
        <Link2 className="text-primary" />
        <CardTitle>仓库配置</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="repoUrl">Git 仓库地址</Label>
          <Input
            id="repoUrl"
            value={repoUrl}
            onChange={(e) => onRepoUrlChange(e.target.value)}
            placeholder="请输入远程 Git 仓库地址"
            disabled={disabled}
          />
        </div>
        <Button
          variant="gradient"
          className="w-full"
          onClick={onSync}
          disabled={disabled}
        >
          <RefreshCw className={`size-4 ${disabled ? "animate-spin" : ""}`} />
          同步分支
        </Button>
        <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <Info className="mt-0.5 size-3.5 shrink-0 opacity-70" />
          点击「同步分支」将删除本地所有分支，获取并同步远程所有分支
        </p>
      </CardContent>
    </Card>
  );
}
