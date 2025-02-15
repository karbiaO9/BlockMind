import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Code2, ArrowLeft } from "lucide-react";

export default function ApiPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="container max-w-3xl text-center space-y-8">
        <div className="rounded-full bg-primary/10 w-16 h-16 mx-auto flex items-center justify-center">
          <Code2 className="w-8 h-8 text-primary" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            API Documentation Coming Soon
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our API documentation is under development. Stay tuned for comprehensive API access to BlockMind's features.
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-6 max-w-lg mx-auto space-y-4">
          <p className="text-sm text-muted-foreground">
            The upcoming API will provide programmatic access to:
          </p>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li>• Real-time market data</li>
            <li>• Token analytics</li>
            <li>• Historical price data</li>
            <li>• Market indicators</li>
          </ul>
        </div>

        <div className="pt-4">
          <Link href="/">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 