import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarClock, ShieldCheck, Sparkles } from "lucide-react";

const Billing = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Billing & subscriptions</h3>
        <p className="text-sm text-muted-foreground">
          Spendly is currently free to use. Billing tools will be introduced in a future version.
        </p>
      </div>
      <Separator />

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-none bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm">
          <CardHeader className="space-y-3">
            <Badge className="w-fit border-white/20 bg-white/15 text-white hover:bg-white/15">
              Current access
            </Badge>
            <CardTitle className="text-2xl">Free to use today</CardTitle>
            <CardDescription className="text-emerald-50">
              Spendly is focused on helping you track spending, review trends, and stay organized without paywalls in the current release.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-white/10 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <ShieldCheck className="size-4" />
                  Available now
                </div>
                <p className="text-sm text-emerald-50">
                  Budget tracking, recurring transactions, imports, and reporting remain available in the free experience.
                </p>
              </div>
              <div className="rounded-xl bg-white/10 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                  <Sparkles className="size-4" />
                  On the roadmap
                </div>
                <p className="text-sm text-emerald-50">
                  Billing, subscriptions, and account management tools will appear here once they are part of a future release.
                </p>
              </div>
            </div>
            <p className="text-sm text-emerald-50">
              This page is reserved for future account billing controls, but there is nothing to manage yet.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CalendarClock className="size-4 text-emerald-600" />
              Coming soon
            </CardTitle>
            <CardDescription>
              A dedicated billing workspace will be added when Spendly introduces subscriptions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
              For now, your account has full access to the current product experience at no cost.
            </div>
            <div className="rounded-lg border border-dashed bg-background p-4">
              <p className="text-sm font-medium">What this section will cover later</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Plan details, billing history, and subscription settings will live here when those features are ready.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Billing;
