import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  BarChart2,
  Shield,
  Cpu,
  Network,
  LineChart,
  Wallet,
  CheckCircle2,
  TrendingUp,
  Lock,
  Zap,
  Users,
} from "lucide-react";

const testimonials = [
  {
    name: "David Chen",
    role: "Crypto Trader",
    company: "BlockTrade Capital",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200",
    content:
      "Blockmind's predictive analytics have transformed our trading strategy. The accuracy is remarkable.",
  },
  {
    name: "Sarah Williams",
    role: "Data Analyst",
    company: "CryptoMetrics",
    image:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200",
    content:
      "The platform's transaction analysis tools are invaluable for our research and monitoring needs.",
  },
  {
    name: "Michael Park",
    role: "Security Expert",
    company: "SecureChain",
    image:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&h=200",
    content:
      "Best-in-class security features and pattern detection. Essential for our compliance monitoring.",
  },
];

const benefits = [
  {
    title: "Real-time Analysis",
    description:
      "Get instant insights into blockchain transactions and market movements",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&h=400",
  },
  {
    title: "AI-Powered Predictions",
    description:
      "Leverage machine learning for accurate price forecasting and trend analysis",
    image:
      "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?auto=format&fit=crop&w=600&h=400",
  },
  {
    title: "Advanced Security",
    description:
      "Enterprise-grade security features to protect your data and transactions",
    image:
      "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?auto=format&fit=crop&w=600&h=400",
  },
];

const stats = [
  { number: "2M+", label: "Transactions Analyzed", trend: "+25% this month" },
  { number: "100K+", label: "Active Users", trend: "+40% growth" },
  { number: "99.9%", label: "Accuracy Rate", trend: "Industry Leading" },
  { number: "24/7", label: "Real-time Monitoring", trend: "Always Online" },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section - Enhanced with Animation */}
      <section className="relative min-h-[90vh] overflow-hidden border-b bg-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container relative z-10 mx-auto flex min-h-[90vh] px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
            <div className="flex flex-col justify-center pt-20 lg:pt-0">
              <div className="animate-fade-in-up">
                <Badge className="mb-4 w-fit" variant="secondary">
                  Next Generation Analytics
                </Badge>
                <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl">
                  Transform Your{" "}
                  <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                    Blockchain Analysis
                  </span>
                </h1>
                <p className="mb-8 text-lg text-muted-foreground">
                  Experience the future of blockchain analytics with real-time
                  insights, AI-powered predictions, and advanced security
                  features.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Button size="lg" className="group" asChild>
                    <a href="/dashboard">
                      Launch Dashboard
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" className="group" asChild>
                    <a href="/docs">
                      Explore Features
                      <TrendingUp className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-[-2px]" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="animate-fade-in-left relative">
                <Image
                  src="https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=1200&h=800"
                  alt="Analytics Dashboard"
                  width={600}
                  height={400}
                  className="rounded-lg object-cover shadow-2xl"
                  priority
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-background/50 via-transparent to-transparent" />
              </div>
              {/* Floating Stats Cards */}
              <div className="absolute -right-12 top-1/4 animate-float">
                <Card className="w-48 bg-background/95 backdrop-blur">
                  <CardContent className="p-4">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    <p className="mt-2 text-sm font-medium">
                      Transaction Volume
                    </p>
                    <p className="text-2xl font-bold text-green-500">+127%</p>
                  </CardContent>
                </Card>
              </div>
              <div className="absolute -left-12 bottom-1/4 animate-float-delayed">
                <Card className="w-48 bg-background/95 backdrop-blur">
                  <CardContent className="p-4">
                    <Lock className="h-5 w-5 text-primary" />
                    <p className="mt-2 text-sm font-medium">Security Score</p>
                    <p className="text-2xl font-bold text-primary">98.5%</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      </section>

      {/* Stats Section - With Animation */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card
                key={stat.label}
                className="group overflow-hidden transition-all hover:shadow-lg"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold text-primary">
                        {stat.number}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                    <div className="rounded-full bg-primary/10 p-3 transition-transform group-hover:scale-110">
                      {index === 0 ? (
                        <BarChart2 className="h-6 w-6 text-primary" />
                      ) : index === 1 ? (
                        <Users className="h-6 w-6 text-primary" />
                      ) : index === 2 ? (
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                      ) : (
                        <Zap className="h-6 w-6 text-primary" />
                      )}
                    </div>
                  </div>
                  <p className="mt-2 text-xs font-medium text-primary">
                    {stat.trend}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold">Powerful Features</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Everything you need to analyze blockchain transactions and predict
              market movements
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={BarChart2}
              title="Real-time Monitoring"
              description="Track transactions and market movements as they happen with our advanced monitoring system"
            />
            <FeatureCard
              icon={Network}
              title="Pattern Detection"
              description="Identify complex trading patterns and suspicious activities using AI"
            />
            <FeatureCard
              icon={LineChart}
              title="Price Predictions"
              description="ML-powered price forecasting for better decision making"
            />
            <FeatureCard
              icon={Shield}
              title="Security Analysis"
              description="Detect and prevent suspicious activities with advanced security features"
            />
            <FeatureCard
              icon={Cpu}
              title="AI-Powered Insights"
              description="Get intelligent insights powered by our advanced machine learning models"
            />
            <FeatureCard
              icon={Wallet}
              title="Wallet Tracking"
              description="Monitor multiple wallets and track their activities in real-time"
            />
          </div>
        </div>
      </section>

      {/* Benefits Section - With Parallax Effect */}
      <section className="relative border-y bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              Blockmind
            </span>
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className="group relative overflow-hidden rounded-lg bg-background transition-all hover:shadow-xl"
              >
                <div className="aspect-video overflow-hidden">
                  <Image
                    src={benefit.image}
                    alt={benefit.title}
                    width={600}
                    height={400}
                    className="scale-105 object-cover transition-all duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                </div>
                <div className="relative p-6">
                  <h3 className="mb-2 text-xl font-semibold">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Trusted by Industry Leaders
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name} className="relative">
                <CardContent className="pt-6">
                  <div className="mb-4 flex items-center gap-4">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role} at {testimonial.company}
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">{testimonial.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-2xl bg-primary p-8 text-primary-foreground sm:p-12">
            <div className="relative z-10 mx-auto max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold">
                Start Analyzing Blockchain Data Today
              </h2>
              <p className="mb-8 text-primary-foreground/80">
                Join thousands of traders and analysts who trust our platform
                for their blockchain analysis needs
              </p>
              <Button size="lg" variant="secondary" asChild>
                <a href="/dashboard">Get Started Now</a>
              </Button>
            </div>
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639322537228-f710d846310a?auto=format&fit=crop&w=2000&h=1000')] opacity-10" />
          </div>
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

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="mb-2 text-3xl font-bold text-primary">{number}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
