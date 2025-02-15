"use client";

import { useState } from "react";
import {
  Key,
  Copy,
  Terminal,
  Code2,
  RefreshCcw,
  AlertCircle,
  CheckCircle,
  LockIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";

// API Usage type
type ApiUsage = {
  total: number;
  limit: number;
  remaining: number;
  resetDate: string;
};

// Code examples for different languages
const CODE_EXAMPLES = {
  curl: `curl -X POST "https://api.blockmind.com/v1/analyze" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "address": "0x1234...5678",
    "chain": "ethereum"
  }'`,
  javascript: `const response = await fetch('https://api.blockmind.com/v1/analyze', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    address: '0x1234...5678',
    chain: 'ethereum',
  }),
});

const data = await response.json();`,
  python: `import requests

response = requests.post(
    'https://api.blockmind.com/v1/analyze',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json',
    },
    json={
        'address': '0x1234...5678',
        'chain': 'ethereum',
    },
)

data = response.json()`,
};

export default function ApiPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [codeLanguage, setCodeLanguage] = useState("curl");
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Mock API usage data
  const apiUsage: ApiUsage = {
    total: 1250,
    limit: 5000,
    remaining: 3750,
    resetDate: "2024-03-01",
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const regenerateApiKey = async () => {
    setIsRegenerating(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsRegenerating(false);
    toast.success("API key regenerated successfully!");
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">API Documentation</h1>
        <p className="text-muted-foreground">
          Integrate blockchain analysis into your applications
        </p>
      </div>

      {/* Main Content with Coming Soon Overlay */}
      <div className="relative">
        {/* Coming Soon Overlay */}
        <div className="absolute inset-0 z-50 backdrop-blur-sm bg-background/80 flex items-center justify-center rounded-lg">
          <div className="text-center space-y-4 p-8 rounded-lg bg-card border shadow-lg">
            <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
              <LockIcon className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Coming Soon</h2>
            <p className="text-muted-foreground max-w-sm">
              Our API documentation is currently under development. Stay tuned
              for updates!
            </p>
            <Button variant="outline" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </div>

        {/* API Content */}
        <div className="pointer-events-none">
          <div className="grid gap-6 md:grid-cols-2">
            {/* API Key Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  API Key
                </CardTitle>
                <CardDescription>
                  Your API authentication credentials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <code className="flex-1 p-2 rounded bg-muted font-mono text-sm">
                      sk_live_123456789abcdef
                    </code>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => copyToClipboard("sk_live_123456789abcdef")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={regenerateApiKey}
                      disabled={isRegenerating}
                    >
                      <RefreshCcw className="h-4 w-4" />
                    </Button>
                  </div>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Important</AlertTitle>
                    <AlertDescription>
                      Keep your API key secure and never share it publicly.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>

            {/* Usage Stats Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="h-5 w-5" />
                  API Usage
                </CardTitle>
                <CardDescription>
                  Current billing period: {new Date().toLocaleDateString()} -{" "}
                  {apiUsage.resetDate}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span>API Calls</span>
                      <span className="font-mono">
                        {apiUsage.total}/{apiUsage.limit}
                      </span>
                    </div>
                    <Progress value={(apiUsage.total / apiUsage.limit) * 100} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Remaining Calls
                      </div>
                      <div className="font-mono">{apiUsage.remaining}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Reset Date
                      </div>
                      <div>{apiUsage.resetDate}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>API Reference</CardTitle>
              <CardDescription>
                Complete documentation for the BlockMind API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="authentication">
                    Authentication
                  </TabsTrigger>
                  <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
                  <TabsTrigger value="examples">Examples</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="prose dark:prose-invert max-w-none">
                    <h3>Introduction</h3>
                    <p>
                      The BlockMind API provides programmatic access to our
                      blockchain analysis tools. You can integrate token
                      analysis, risk assessment, and market data directly into
                      your applications.
                    </p>

                    <h3>Base URL</h3>
                    <code className="block p-2 rounded bg-muted">
                      https://api.blockmind.com/v1
                    </code>

                    <h3>Rate Limits</h3>
                    <ul>
                      <li>Free tier: 1,000 requests per month</li>
                      <li>Pro tier: 10,000 requests per month</li>
                      <li>Enterprise tier: Custom limits</li>
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="authentication" className="space-y-4">
                  <div className="prose dark:prose-invert max-w-none">
                    <h3>Authentication</h3>
                    <p>
                      All API requests require authentication using your API
                      key. Include it in the Authorization header:
                    </p>
                    <code className="block p-2 rounded bg-muted">
                      Authorization: Bearer YOUR_API_KEY
                    </code>

                    <h3>Security Best Practices</h3>
                    <ul>
                      <li>Never expose your API key in client-side code</li>
                      <li>Rotate your API key periodically</li>
                      <li>Use environment variables to store your API key</li>
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="endpoints" className="space-y-4">
                  <div className="space-y-6">
                    {/* Token Analysis Endpoint */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge>POST</Badge>
                        <code>/analyze</code>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        Analyze a token contract for risks and patterns
                      </p>
                      <div className="space-y-2">
                        <h4 className="font-medium">Parameters</h4>
                        <div className="grid gap-2">
                          <div className="grid grid-cols-3 p-2 rounded bg-muted">
                            <div>address</div>
                            <div>string</div>
                            <div>Token contract address</div>
                          </div>
                          <div className="grid grid-cols-3 p-2 rounded bg-muted">
                            <div>chain</div>
                            <div>string</div>
                            <div>Blockchain network</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Market Data Endpoint */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge>GET</Badge>
                        <code>/market-data/{"{address}"}</code>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        Get market data for a specific token
                      </p>
                    </div>

                    {/* Historical Data Endpoint */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge>GET</Badge>
                        <code>/historical/{"{address}"}</code>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        Get historical trading data and patterns
                      </p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="examples" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Button
                        variant={
                          codeLanguage === "curl" ? "default" : "outline"
                        }
                        onClick={() => setCodeLanguage("curl")}
                      >
                        cURL
                      </Button>
                      <Button
                        variant={
                          codeLanguage === "javascript" ? "default" : "outline"
                        }
                        onClick={() => setCodeLanguage("javascript")}
                      >
                        JavaScript
                      </Button>
                      <Button
                        variant={
                          codeLanguage === "python" ? "default" : "outline"
                        }
                        onClick={() => setCodeLanguage("python")}
                      >
                        Python
                      </Button>
                    </div>

                    <div className="relative">
                      <pre className="p-4 rounded bg-muted font-mono text-sm">
                        {
                          CODE_EXAMPLES[
                            codeLanguage as keyof typeof CODE_EXAMPLES
                          ]
                        }
                      </pre>
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() =>
                          copyToClipboard(
                            CODE_EXAMPLES[
                              codeLanguage as keyof typeof CODE_EXAMPLES
                            ]
                          )
                        }
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
