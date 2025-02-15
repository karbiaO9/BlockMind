import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PriceChart } from "@/components/dashboard/price-chart"

export default function Predictions() {
  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">Price Predictions</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>ETH Price Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <PriceChart />
        </CardContent>
      </Card>
    </div>
  )
} 