import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart2,
  Shield,
  Cpu,
  Network,
  LineChart,
  Wallet,
  Bell,
  Zap,
} from "lucide-react";

export default function FeaturesPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <section className="mb-20 text-center">
        <h1 className="mb-6 text-4xl font-bold sm:text-5xl">
          Powerful Features for{" "}
          <span className="text-primary">Advanced Analytics</span>
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
          Discover all the tools and features that make BlockMind the leading
          platform for blockchain analysis and price prediction.
        </p>
      </section>

      {/* Features Grid */}
      <section className="mb-20">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={BarChart2}
            title="Real-time Analytics"
            description="Monitor blockchain transactions and market movements as they happen with our advanced tracking system"
          />
          <FeatureCard
            icon={Network}
            title="Pattern Detection"
            description="Identify complex trading patterns and suspicious activities using our AI-powered analysis tools"
          />
          <FeatureCard
            icon={LineChart}
            title="Price Predictions"
            description="Get accurate price forecasts powered by machine learning and historical data analysis"
          />
          <FeatureCard
            icon={Shield}
            title="Security Analysis"
            description="Detect and prevent suspicious activities with advanced security features and alerts"
          />
          <FeatureCard
            icon={Cpu}
            title="AI Insights"
            description="Leverage artificial intelligence to uncover hidden patterns and market opportunities"
          />
          <FeatureCard
            icon={Wallet}
            title="Wallet Tracking"
            description="Monitor multiple wallets and track their activities in real-time with detailed analytics"
          />
          <FeatureCard
            icon={Bell}
            title="Smart Alerts"
            description="Set up customized notifications for specific blockchain events and price movements"
          />
          <FeatureCard
            icon={Zap}
            title="Fast Processing"
            description="Experience lightning-fast data processing and real-time updates for all your analytics"
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) {
  return (
    <Card className="transition-all hover:shadow-lg">
      <CardHeader>
        <Icon className="h-10 w-10 text-primary" />
        <CardTitle className="mt-4">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
} 