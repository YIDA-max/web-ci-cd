"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "@/components/header";
import { StepIndicator } from "@/components/step-indicator";
import { RepoConfig } from "@/components/repo-config";
import { LoadingSection } from "@/components/loading-section";
import { BranchSection } from "@/components/branch-section";
import { ResultsSection } from "@/components/results-section";
import { syncBranches, mergeBranches, cleanup } from "@/lib/api";
import type {
  GitResult,
  GitConflict,
  GitSummary,
} from "@gitcicd/shared";

type Step = 1 | 2 | 3;
type LoadingState = "idle" | "syncing" | "merging";

export default function Home() {
  const [repoUrl, setRepoUrl] = useState("");
  const [branches, setBranches] = useState<string[]>([]);
  const [tempDir, setTempDir] = useState("");
  const [sourceBranch, setSourceBranch] = useState("");
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");

  const [results, setResults] = useState<GitResult[]>([]);
  const [summary, setSummary] = useState<GitSummary | undefined>(undefined);
  const [conflicts, setConflicts] = useState<GitConflict[]>([]);

  const [error, setError] = useState("");

  const handleSync = useCallback(async () => {
    const url = repoUrl.trim();
    if (!url) {
      setError("请输入 Git 仓库地址");
      return;
    }

    setError("");
    setLoadingState("syncing");
    setCurrentStep(1);

    try {
      const res = await syncBranches(url);

      if (res.success && res.branches && res.branches.length > 0) {
        setTempDir(res.tempDir || "");
        setBranches(res.branches);
        setSourceBranch("");
        setCurrentStep(2);
      } else if (res.success && (!res.branches || res.branches.length === 0)) {
        setError("没有找到任何分支");
      } else {
        setError("同步分支失败: " + (res.error || "未知错误"));
      }
    } catch (err) {
      setError("请求失败: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoadingState("idle");
    }
  }, [repoUrl]);

  const handleMerge = useCallback(async () => {
    if (!sourceBranch) {
      setError("请选择要合并的源分支");
      return;
    }

    const masterBranch = branches.includes("master")
      ? "master"
      : branches.includes("main")
        ? "main"
        : null;

    const targetBranches = branches.filter(
      (b) => b !== masterBranch && b !== sourceBranch,
    );

    if (targetBranches.length === 0) {
      setError("没有可合并的目标分支（已排除 master/main 和源分支本身）");
      return;
    }

    const confirmed = window.confirm(
      `确定要将 "${sourceBranch}" 合并到 ${targetBranches.length} 个分支吗？\n\n目标分支：${targetBranches.join(", ")}`,
    );
    if (!confirmed) return;

    setError("");
    setLoadingState("merging");

    try {
      const res = await mergeBranches({
        tempDir,
        sourceBranch,
        allBranches: branches,
      });

      if (res.success && res.results) {
        setResults(res.results);
        setSummary(res.summary);
        setConflicts(res.conflicts || []);
        setCurrentStep(3);

        // 清理临时目录
        if (tempDir) {
          cleanup(tempDir).catch(() => {});
        }
      } else {
        setError("合并过程出错: " + (res.error || "未知错误"));
      }
    } catch (err) {
      setError("请求失败: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoadingState("idle");
    }
  }, [sourceBranch, branches, tempDir]);

  const handleReset = useCallback(() => {
    setRepoUrl("");
    setBranches([]);
    setTempDir("");
    setSourceBranch("");
    setResults([]);
    setSummary(undefined);
    setConflicts([]);
    setError("");
    setCurrentStep(1);
  }, []);

  const isLoading = loadingState !== "idle";

  return (
    <div className="flex min-h-full flex-col">
      <Header />

      <main className="mx-auto w-full max-w-2xl flex-1 px-8 py-6">
        <StepIndicator currentStep={currentStep} />

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
              <RepoConfig
                repoUrl={repoUrl}
                onRepoUrlChange={setRepoUrl}
                onSync={handleSync}
                disabled={isLoading}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* 加载状态 */}
        {isLoading && (
          <LoadingSection
            text={
              loadingState === "syncing"
                ? "正在同步分支：删除本地分支、获取远程分支..."
                : `正在合并 "${sourceBranch}" 到目标分支...`
            }
          />
        )}

        {/* Step 2: 分支选择 + 合并配置 */}
        <AnimatePresence mode="wait">
          {currentStep === 2 && !isLoading && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <BranchSection
                branches={branches}
                sourceBranch={sourceBranch}
                onSourceBranchChange={setSourceBranch}
                onMerge={handleMerge}
                disabled={isLoading}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step 3: 结果展示 */}
        <AnimatePresence mode="wait">
          {currentStep === 3 && !isLoading && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <ResultsSection
                results={results}
                summary={summary}
                conflicts={conflicts}
                onReset={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="px-8 py-4 text-center text-xs text-muted-foreground">
        Git 分支批量合并工具 · Monorepo + Next.js + NestJS
      </footer>
    </div>
  );
}
