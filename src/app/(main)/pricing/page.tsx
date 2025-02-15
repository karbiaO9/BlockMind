import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="container max-w-7xl py-16 space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            Choose Your Plan
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start with our Basic plan for free, or unlock advanced features with
            Pro
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Basic Plan */}
          <div className="relative rounded-2xl border bg-background p-8 hover:border-primary/50 transition-colors">
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold">Basic</h3>
                <p className="text-muted-foreground mt-1">
                  Perfect for getting started
                </p>
              </div>

              <div className="flex items-baseline justify-center">
                <span className="text-4xl font-bold">$0</span>
                <span className="text-muted-foreground ml-2">/month</span>
              </div>

              <ul className="space-y-3">
                {[
                  "Real-time market data",
                  "Basic token analysis",
                  "Market overview",
                  "Educational resources",
                  "Community access",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-center">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/register" className="block">
                <Button className="w-full" variant="outline">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="relative rounded-2xl border bg-gradient-to-b from-primary/10 via-primary/5 to-background p-8 hover:border-primary/50 transition-colors">
            <div className="absolute top-4 right-4">
              <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                Coming Soon
              </div>
            </div>

            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold">Pro</h3>
                <p className="text-muted-foreground mt-1">
                  For serious traders and analysts
                </p>
              </div>

              <div className="flex items-baseline justify-center">
                <span className="text-4xl font-bold">$60</span>
                <span className="text-muted-foreground ml-2">/month</span>
              </div>

              <ul className="space-y-3">
                {[
                  "Everything in Basic",
                  "Advanced technical analysis",
                  "AI-powered predictions",
                  "Custom alerts and notifications",
                  "Priority API access",
                  "Unlimited token tracking",
                  "Advanced portfolio analytics",
                  "24/7 Priority support",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-center">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button className="w-full" disabled>
                Coming Soon
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center space-y-6 max-w-5xl mx-auto pt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center">
              <h2 className="text-2xl font-bold bg-background px-6">
                All Plans Include
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            {[
              "No credit card required",
              "SSL encryption",
              "Regular updates",
              "Email support",
            ].map((feature) => (
              <div
                key={feature}
                className="p-6 rounded-xl border bg-muted/50 hover:border-primary/50 transition-colors flex items-center justify-center text-center font-medium"
              >
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
