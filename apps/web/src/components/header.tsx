import { GitBranch } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

export function Header() {
  return (
    <header className="px-8 pt-7">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <GitBranch className="size-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Git 分支批量合并工具
            </h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              同步远程分支，一键将源分支合并到所有目标分支
            </p>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
