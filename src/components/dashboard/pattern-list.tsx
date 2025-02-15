import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

const patterns = [
  {
    id: 1,
    type: "Circular Transaction",
    description: "Multiple transactions forming a cycle detected",
    severity: "high",
  },
  {
    id: 2,
    type: "Rapid Transfers",
    description: "Multiple small transfers in short time period",
    severity: "medium",
  },
]

export function PatternList() {
  return (
    <ScrollArea className="h-[400px] rounded-md border">
      <div className="p-4">
        <h3 className="mb-4 text-sm font-medium">Detected Patterns</h3>
        <div className="grid gap-4">
          {patterns.map((pattern) => (
            <Alert key={pattern.id} variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{pattern.type}</AlertTitle>
              <AlertDescription>{pattern.description}</AlertDescription>
            </Alert>
          ))}
        </div>
      </div>
    </ScrollArea>
  )
} 