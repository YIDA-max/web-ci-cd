"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Rocket, GitBranch, RefreshCw, Link2, Info } from "lucide-react";
import { Header } from "@/components/header";
import { RepoConfig } from "@/components/repo-config";
import { LoadingSection } from "@/components/loading-section";
import { EnvironmentDialog } from "@/components/deploy/environment-dialog";
import { DeployProgress } from "@/components/deploy/deploy-progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { syncBranches, getDeployEnvironments, deployBuild } from "@/lib/api";
import type {
  DeployEnvironment,
  DeployLogEntry,
  DeployBuildResponse,
} from "@gitcicd/shared";

type DeployStep = 1 | 2 | 3;
type DeployStatus = "building" | "success" | "error";

export default function DeployPage() {
  const [repoUrl, setRepoUrl] = useState("");
  const [branches, setBranches] = useState<string[]>([]);
  const [tempDir, setTempDir] = useState("");
  const [currentStep, setCurrentStep] = useState<DeployStep>(1);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState("");

  // 环境选择
  const [environments, setEnvironments] = useState<DeployEnvironment[]>([]);
  const [envDialogOpen, setEnvDialogOpen] = useState(false);
  const [selectedPort, setSelectedPort] = useState<string | null>(null);
  const [deployBranch, setDeployBranch] = useState("");

  // 部署进度
  const [deployStatus, setDeployStatus] = useState<DeployStatus>("building");
  const [deployLogs, setDeployLogs] = useState<DeployLogEntry[]>([]);
  const [deployError, setDeployError] = useState("");

  // 加载环境列表
  useEffect(() => {
    getDeployEnvironments()
      .then((res) => {
        if (res.success) setEnvironments(res.environments);
      })
      .catch(() => {});
  }, []);

  const handleSync = useCallback(async () => {
    const url = repoUrl.trim();
    if (!url) {
      setError("请输入 Git 仓库地址");
      return;
    }

    setError("");
    setIsSyncing(true);
    setCurrentStep(1);

    try {
      const res = await syncBranches(url);

      if (res.success && res.branches && res.branches.length > 0) {
        setTempDir(res.tempDir || "");
        setBranches(res.branches);
        setCurrentStep(2);
      } else if (res.success && (!res.branches || res.branches.length === 0)) {
        setError("没有找到任何分支");
      } else {
        setError("同步分支失败: " + (res.error || "未知错误"));
      }
    } catch (err) {
      setError("请求失败: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setIsSyncing(false);
    }
  }, [repoUrl]);

  const handleDeployClick = useCallback((branch: string) => {
    setDeployBranch(branch);
    setSelectedPort(null);
    setEnvDialogOpen(true);
  }, []);

  const handleDeployConfirm = useCallback(async () => {
    if (!selectedPort || !deployBranch) return;

    setEnvDialogOpen(false);
    setCurrentStep(3);
    setDeployStatus("building");
    setDeployLogs([]);
    setDeployError("");

    try {
      const res: DeployBuildResponse = await deployBuild({
        repoUrl: repoUrl.trim(),
        branch: deployBranch,
        environmentPort: selectedPort,
        tempDir,
      });

      setDeployLogs(res.logs || []);

      if (res.success) {
        setDeployStatus("success");
      } else {
        setDeployStatus("error");
        setDeployError(res.error || "发版失败");
      }
    } catch (err) {
      setDeployStatus("error");
      setDeployError(err instanceof Error ? err.message : String(err));
    }
  }, [selectedPort, deployBranch, repoUrl, tempDir]);

  const handleReset = useCallback(() => {
    setRepoUrl("");
    setBranches([]);
    setTempDir("");
    setCurrentStep(1);
    setDeployLogs([]);
    setDeployError("");
    setDeployBranch("");
    setSelectedPort(null);
    setError("");
  }, []);

  return (
    <div className="flex min-h-full flex-col">
      <Header />

      <main className="mx-auto w-full max-w-2xl flex-1 px-8 py-6">
        {/* 发版步骤指示器 */}
        <DeployStepIndicator currentStep={currentStep} />

        {/* 错误提示 */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            >
              <span className="flex-1">{error}</span>
              <button
                onClick={() => setError("")}
                className="text-destructive/60 hover:text-destructive"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 1: 仓库配置 */}
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
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
                      onChange={(e) => setRepoUrl(e.target.value)}
                      placeholder="请输入远程 Git 仓库地址"
                      disabled={isSyncing}
                    />
                  </div>
                  <Button
                    variant="gradient"
                    className="w-full"
                    onClick={handleSync}
                    disabled={isSyncing}
                  >
                    <RefreshCw className={`size-4 ${isSyncing ? "animate-spin" : ""}`} />
                    同步分支
                  </Button>
                  <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
                    <Info className="mt-0.5 size-3.5 shrink-0 opacity-70" />
                    克隆仓库并同步所有远程分支，选择目标分支后一键发版部署
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 加载状态 */}
        {isSyncing && (
          <LoadingSection text="正在同步分支：克隆仓库、获取远程分支..." />
        )}

        {/* Step 2: 分支列表 + 发版按钮 */}
        <AnimatePresence mode="wait">
          {currentStep === 2 && !isSyncing && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <GitBranch className="text-primary" />
                  <CardTitle>分支列表</CardTitle>
                  <Badge>{branches.length} 个分支</Badge>
                </CardHeader>
                <CardContent>
                  <div className="flex max-h-80 flex-col gap-2 overflow-y-auto">
                    {branches.map((branch, i) => (
                      <motion.div
                        key={branch}
                        initial={{ opacity: 0, x: -14 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.08 + i * 0.04, duration: 0.35 }}
                        className="flex items-center justify-between gap-3 rounded-md border bg-input px-3.5 py-2.5"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="size-2 shrink-0 rounded-full bg-success shadow-[0_0_6px_hsl(var(--success)/0.5)]" />
                          <span className="font-mono text-sm">{branch}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="gradient"
                          onClick={() => handleDeployClick(branch)}
                        >
                          <Rocket className="size-3.5" />
                          发版
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 3: 部署进度 */}
        <AnimatePresence mode="wait">
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <DeployProgress
                status={deployStatus}
                logs={deployLogs}
                error={deployError}
                onReset={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="px-8 py-4 text-center text-xs text-muted-foreground">
        发版部署工具 · 自动构建 + Nginx 部署
      </footer>

      {/* 环境选择弹窗 */}
      <EnvironmentDialog
        open={envDialogOpen}
        environments={environments}
        selectedPort={selectedPort}
        onSelect={setSelectedPort}
        onConfirm={handleDeployConfirm}
        onClose={() => setEnvDialogOpen(false)}
        loading={false}
      />
    </div>
  );
}

/** 发版步骤指示器 */
function DeployStepIndicator({ currentStep }: { currentStep: number }) {
  const steps = [
    { num: 1, label: "同步仓库" },
    { num: 2, label: "选择分支" },
    { num: 3, label: "发版部署" },
  ];

  return (
    <div className="mb-7 flex items-center justify-center rounded-lg border bg-card p-4">
      {steps.map((step, i) => (
        <div key={step.num} className="flex items-center">
          <div
            className={`flex items-center gap-2 transition-opacity duration-200 ${
              currentStep === step.num ? "opacity-100" : currentStep > step.num ? "opacity-75" : "opacity-40"
            }`}
          >
            <motion.div
              className={`flex size-7 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors ${
                currentStep === step.num
                  ? "border-primary bg-primary text-primary-foreground shadow-[0_0_16px_hsl(var(--primary)/0.4)]"
                  : currentStep > step.num
                    ? "border-success bg-success text-success-foreground"
                    : "border-border bg-muted"
              }`}
              animate={currentStep === step.num ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.5 }}
            >
              {currentStep > step.num ? "✓" : step.num}
            </motion.div>
            <span className={`whitespace-nowrap text-sm font-medium ${currentStep === step.num ? "text-foreground" : "text-muted-foreground"}`}>
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && <div className="mx-3 h-0.5 min-w-6 flex-1 bg-border" />}
        </div>
      ))}
    </div>
  );
}
