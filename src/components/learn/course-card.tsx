import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Clock, BarChart } from "lucide-react";

interface CourseCardProps {
  title: string;
  description: string;
  progress: number;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
}

export function CourseCard({
  title,
  description,
  progress,
  duration,
  level,
}: CourseCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} />
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {duration}
            </div>
            <div className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              {level}
            </div>
          </div>
          <Button className="w-full">
            {progress === 0 ? "Start Course" : "Continue Learning"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 