"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { IdeaCard } from "./idea-card";
import { toast } from "sonner";

interface TrendingIdea {
  id: string;
  title: string;
  author: {
    id: string;
    name: string;
    image: string;
    walletAddress: string;
  };
  symbol: string;
  type: "LONG" | "SHORT";
  timeframe: string;
  description: string;
  image: string | null;
  createdAt: string;
  likes: number;
  views: number;
  tags: { id: string; name: string }[];
  _count: {
    comments: number;
    likedBy: number;
  };
  isLiked: boolean;
}

export function TrendingIdeas() {
  const [ideas, setIdeas] = useState<TrendingIdea[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTrendingIdeas();
  }, []);

  const fetchTrendingIdeas = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/ideas/trending");
      if (!response.ok) throw new Error("Failed to fetch trending ideas");

      const data = await response.json();
      setIdeas(data);
    } catch (error) {
      console.error("Error fetching trending ideas:", error);
      toast.error("Failed to load trending ideas");
    } finally {
      setIsLoading(false);
    }
  };

  const handleIdeaUpdated = async (ideaId: string) => {
    await fetchTrendingIdeas();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={`skeleton-${i}`} className="p-6 space-y-4">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {ideas.map((idea, index) => (
        <IdeaCard
          key={`${idea.id}-${index}`}
          idea={idea}
          onIdeaUpdated={handleIdeaUpdated}
        />
      ))}
    </div>
  );
}
