import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, TrendingUp, AlertTriangle, Newspaper, MoreVertical, Check, X, Volume2 } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AlertsListProps {
  type?: "price" | "ai" | "news";
}

const MOCK_ALERTS = [
  {
    id: 1,
    type: "price",
    title: "BTC Price Alert",
    description: "BTC/USD has crossed above $45,000",
    timestamp: "2 minutes ago",
    priority: "high",
    icon: TrendingUp,
  },
  {
    id: 2,
    type: "ai",
    title: "AI Signal Alert",
    description: "Strong buy signal detected for ETH/USD",
    timestamp: "15 minutes ago",
    priority: "medium",
    icon: AlertTriangle,
  },
  {
    id: 3,
    type: "news",
    title: "Breaking News",
    description: "Major protocol upgrade announced for Ethereum",
    timestamp: "1 hour ago",
    priority: "low",
    icon: Newspaper,
  },
  {
    id: 4,
    type: "price",
    title: "ETH Volume Alert",
    description: "Unusual volume detected on ETH/USD",
    timestamp: "30 minutes ago",
    priority: "medium",
    icon: Volume2,
  },
  {
    id: 5,
    type: "ai",
    title: "Market Sentiment Change",
    description: "AI detected shift in market sentiment for BTC",
    timestamp: "45 minutes ago",
    priority: "high",
    icon: AlertTriangle,
  },
];

export function AlertsList({ type }: AlertsListProps) {
  const [dismissedAlerts, setDismissedAlerts] = useState<number[]>([]);

  const handleDismiss = (id: number) => {
    setDismissedAlerts([...dismissedAlerts, id]);
  };

  const filteredAlerts = type 
    ? MOCK_ALERTS.filter(alert => alert.type === type)
    : MOCK_ALERTS;

  const activeAlerts = filteredAlerts.filter(
    alert => !dismissedAlerts.includes(alert.id)
  );

  return (
    <div className="space-y-4">
      {activeAlerts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-6 text-center">
            <Bell className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No active alerts</p>
          </CardContent>
        </Card>
      ) : (
        activeAlerts.map((alert) => (
          <Card key={alert.id} className="group">
            <CardHeader className="flex flex-row items-center space-y-0 pb-2">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <alert.icon className={`h-4 w-4 ${
                    alert.priority === "high" ? "text-red-500" :
                    alert.priority === "medium" ? "text-yellow-500" :
                    "text-blue-500"
                  }`} />
                  <CardTitle className="text-base">{alert.title}</CardTitle>
                  <Badge
                    variant={
                      alert.priority === "high"
                        ? "destructive"
                        : alert.priority === "medium"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {alert.priority}
                  </Badge>
                </div>
                <CardDescription>{alert.timestamp}</CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleDismiss(alert.id)}>
                    <X className="mr-2 h-4 w-4" />
                    Dismiss
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Check className="mr-2 h-4 w-4" />
                    Mark as read
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {alert.description}
              </p>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
} 