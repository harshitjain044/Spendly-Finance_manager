import Logo from "@/components/logo/logo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/context/theme-provider";
import { cn } from "@/lib/utils";
import { ArrowRight, ChartPie, Moon, Sparkles, Sun, Wallet2 } from "lucide-react";
import FloatingPreviewCard from "./_component/floating-preview-card";
import SignInForm from "./_component/signin-form";

const SignIn = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="relative min-h-svh overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_32%),linear-gradient(180deg,_rgba(248,250,252,0.96),_rgba(241,245,249,0.88))] px-4 py-6 dark:bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_28%),linear-gradient(180deg,_rgba(2,6,23,1),_rgba(15,23,42,0.96))] sm:px-6 lg:px-8">
      <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_center,_rgba(16,185,129,0.14),_transparent_70%)]" />
      <div className="absolute left-[8%] top-32 hidden size-64 rounded-full bg-emerald-400/10 blur-3xl lg:block" />
      <div className="absolute bottom-16 right-[10%] hidden size-72 rounded-full bg-cyan-400/10 blur-3xl lg:block" />

      <div className="relative mx-auto flex min-h-[calc(100svh-3rem)] max-w-6xl flex-col">
        {/* Top brand row */}
        <header className="flex items-center justify-between">
          <Logo url="/" />
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full border-white/60 bg-background/70 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-950/60"
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
        </header>

        {/* Centered auth experience */}
        <main className="relative flex flex-1 items-center justify-center py-10 lg:py-14">
          <FloatingPreviewCard title="Recent Transactions" rotate={-3} className="left-4 top-20 xl:left-14">
            <div className="space-y-3">
              {[
                { label: "Salary", amount: "+$4,200", tone: "text-emerald-600 dark:text-emerald-400" },
                { label: "Groceries", amount: "-$120", tone: "text-foreground" },
                { label: "Netflix", amount: "-$15", tone: "text-foreground" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/70 px-3 py-2 dark:bg-white/5"
                >
                  <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Wallet2 className="size-4" />
                    </div>
                    <span className="text-sm text-foreground">{item.label}</span>
                  </div>
                  <span className={cn("text-sm font-medium", item.tone)}>{item.amount}</span>
                </div>
              ))}
            </div>
          </FloatingPreviewCard>

          <FloatingPreviewCard title="Expense Breakdown" rotate={3} className="right-4 top-24 xl:right-16">
            <div className="flex items-center gap-4">
              <div className="relative size-20 rounded-full bg-[conic-gradient(#10b981_0deg_140deg,#0f172a_140deg_230deg,#14b8a6_230deg_360deg)] dark:bg-[conic-gradient(#34d399_0deg_140deg,#e2e8f0_140deg_230deg,#2dd4bf_230deg_360deg)]">
                <div className="absolute inset-3 rounded-full bg-background/90 dark:bg-slate-950/90" />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="size-2 rounded-full bg-emerald-500" />
                  Housing
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="size-2 rounded-full bg-slate-900 dark:bg-slate-200" />
                  Food
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <span className="size-2 rounded-full bg-teal-500" />
                  Savings
                </div>
              </div>
            </div>
          </FloatingPreviewCard>

          <FloatingPreviewCard title="Smart Insights" rotate={-2} className="bottom-2 left-[calc(50%-8rem)] xl:bottom-6">
            <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/10 p-3 dark:border-emerald-400/10 dark:bg-emerald-400/10">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-9 items-center justify-center rounded-full bg-background/80 dark:bg-slate-950/70">
                  <Sparkles className="size-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">You spent 18% less on dining this week.</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Spendly highlights patterns early so small wins stay visible.
                  </p>
                </div>
              </div>
            </div>
          </FloatingPreviewCard>

          <div className="w-full max-w-xl">
            <div className="mx-auto max-w-lg text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
                <ChartPie className="size-3.5" />
                Personal finance, simplified
              </div>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Take control of your money with Spendly
              </h1>
              <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">
                Track spending, analyze trends, and stay ahead with smart financial insights.
              </p>
            </div>

            <Card className="mx-auto mt-8 w-full max-w-[420px] rounded-3xl border-white/60 bg-background/80 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.45)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/75">
              <CardContent className="p-6 sm:p-8">
                <SignInForm />
              </CardContent>
            </Card>

            {/* Bottom feature grid */}
            <div className="mx-auto mt-8 grid max-w-3xl gap-3 text-sm text-muted-foreground sm:grid-cols-3">
              {[
                "Smart spending analytics",
                "Recurring transaction tracking",
                "CSV imports and monthly reports",
              ].map((feature) => (
                <div
                  key={feature}
                  className="rounded-2xl border border-white/50 bg-background/60 px-4 py-3 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-950/50"
                >
                  <div className="flex items-center gap-2">
                    <ArrowRight className="size-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{feature}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SignIn;
