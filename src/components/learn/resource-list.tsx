import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

const RESOURCES = [
  {
    title: "Bitcoin Whitepaper",
    description: "The original Bitcoin whitepaper by Satoshi Nakamoto",
    url: "https://bitcoin.org/bitcoin.pdf",
    category: "Documentation",
  },
  {
    title: "Ethereum Documentation",
    description: "Official Ethereum developer documentation",
    url: "https://ethereum.org/developers",
    category: "Documentation",
  },
  {
    title: "CryptoZombies",
    description: "Learn to code blockchain DApps by building simple games",
    url: "https://cryptozombies.io/",
    category: "Interactive",
  },
];

export function ResourceList() {
  return (
    <div className="space-y-4">
      {RESOURCES.map((resource) => (
        <Card key={resource.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
              {resource.title}
            </CardTitle>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {resource.description}
            </p>
            <div className="mt-2">
              <span className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs">
                {resource.category}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 