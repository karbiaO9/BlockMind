import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PatternList } from "@/components/dashboard/pattern-list"

export default function Patterns() {
  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-bold">Pattern Detection</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Suspicious Patterns</CardTitle>
        </CardHeader>
        <CardContent>
          <PatternList />
        </CardContent>
      </Card>
    </div>
  )
} 