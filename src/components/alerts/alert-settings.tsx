import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import {
  Bell,
  Gauge,
  Settings2,
  Volume2,
  Bot,
  Newspaper,
  Clock,
  Filter,
  Smartphone,
  Mail,
} from "lucide-react";

interface AlertSettingsProps {
  onSave?: () => void;
}

export function AlertSettings({ onSave }: AlertSettingsProps) {
  const [settings, setSettings] = useState({
    priceThreshold: 5,
    volumeThreshold: 20,
    aiSignals: true,
    newsAlerts: true,
    priority: "all",
    frequency: "instant",
    pushEnabled: true,
    emailEnabled: true,
    browserEnabled: true,
    volatilityThreshold: 15,
    timeframe: "1h",
  });

  const handleSave = () => {
    console.log("Saving settings:", settings);
    onSave?.();
  };

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="general">
          <Settings2 className="h-4 w-4 mr-2" />
          General
        </TabsTrigger>
        <TabsTrigger value="channels">
          <Bell className="h-4 w-4 mr-2" />
          Channels
        </TabsTrigger>
        <TabsTrigger value="thresholds">
          <Gauge className="h-4 w-4 mr-2" />
          Thresholds
        </TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <Card>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Alert Frequency</Label>
              <Select
                value={settings.frequency}
                onValueChange={(value) =>
                  setSettings({ ...settings, frequency: value })
                }
              >
                <SelectTrigger className="w-full">
                  <Clock className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instant">Real-time Alerts</SelectItem>
                  <SelectItem value="hourly">Hourly Digest</SelectItem>
                  <SelectItem value="daily">Daily Summary</SelectItem>
                  <SelectItem value="weekly">Weekly Report</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Timeframe</Label>
              <Select
                value={settings.timeframe}
                onValueChange={(value) =>
                  setSettings({ ...settings, timeframe: value })
                }
              >
                <SelectTrigger className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5m">5 Minutes</SelectItem>
                  <SelectItem value="15m">15 Minutes</SelectItem>
                  <SelectItem value="1h">1 Hour</SelectItem>
                  <SelectItem value="4h">4 Hours</SelectItem>
                  <SelectItem value="1d">1 Day</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Priority Level</Label>
              <Select
                value={settings.priority}
                onValueChange={(value) =>
                  setSettings({ ...settings, priority: value })
                }
              >
                <SelectTrigger className="w-full">
                  <Bell className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Alerts</SelectItem>
                  <SelectItem value="high">High Priority Only</SelectItem>
                  <SelectItem value="medium">Medium & High</SelectItem>
                  <SelectItem value="custom">Custom Filter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="channels">
        <Card>
          <CardContent className="pt-4 space-y-6">
            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive alerts via email
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.emailEnabled}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, emailEnabled: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <Smartphone className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Mobile app alerts
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.pushEnabled}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, pushEnabled: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Browser Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Desktop notifications
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.browserEnabled}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, browserEnabled: checked })
                }
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="thresholds">
        <Card>
          <CardContent className="pt-4 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Price Change Threshold (%)</Label>
                <span className="text-sm font-medium">
                  {settings.priceThreshold}%
                </span>
              </div>
              <Slider
                value={[settings.priceThreshold]}
                onValueChange={([value]) =>
                  setSettings({ ...settings, priceThreshold: value })
                }
                max={50}
                step={1}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Volume Threshold (%)</Label>
                <span className="text-sm font-medium">
                  {settings.volumeThreshold}%
                </span>
              </div>
              <Slider
                value={[settings.volumeThreshold]}
                onValueChange={([value]) =>
                  setSettings({ ...settings, volumeThreshold: value })
                }
                max={100}
                step={5}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Volatility Threshold (%)</Label>
                <span className="text-sm font-medium">
                  {settings.volatilityThreshold}%
                </span>
              </div>
              <Slider
                value={[settings.volatilityThreshold]}
                onValueChange={([value]) =>
                  setSettings({ ...settings, volatilityThreshold: value })
                }
                max={50}
                step={1}
              />
            </div>

            <div className="space-y-2 pt-4">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-2">
                  <Bot className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">AI Signals</p>
                    <p className="text-sm text-muted-foreground">
                      Smart trading alerts
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.aiSignals}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, aiSignals: checked })
                  }
                />
              </div>
            </div>

            <div className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <Newspaper className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">News Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Market news updates
                  </p>
                </div>
              </div>
              <Switch
                checked={settings.newsAlerts}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, newsAlerts: checked })
                }
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <div className="mt-6">
        <Button className="w-full" onClick={handleSave}>
          Save Configuration
        </Button>
      </div>
    </Tabs>
  );
}
