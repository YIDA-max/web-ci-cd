"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GitBranch, Rocket } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "合并工具", icon: GitBranch },
  { href: "/deploy", label: "发版工具", icon: Rocket },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="px-8 pt-7">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <GitBranch className="size-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">
                Git CI/CD 工具箱
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                分支合并 · 自动发版部署
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        {/* 页签导航 */}
        <nav className="mt-5 flex gap-1.5">
          {tabs.map((tab) => {
            const isActive =
              tab.href === "/"
                ? pathname === "/"
                : pathname.startsWith(tab.href);
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
