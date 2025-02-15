"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, Clock } from "lucide-react";
import { NewsAPI } from "@/lib/api/news";

interface NewsItem {
  id: string;
  title: string;
  body: string;
  url: string;
  imageUrl: string;
  source: string;
  categories: string[];
  publishedAt: string;
}

function getRelativeTime(date: string) {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (hours < 24) return `${hours} hours ago`;
  return `${Math.floor(hours / 24)} days ago`;
}

export function NewsWidget() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        setIsLoading(true);
        const data = await NewsAPI.getLatestNews();
        setNews(data.slice(0, 3)); // Only show first 3 news items
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchNews();
  }, []);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {news.map((item) => (
        <Card key={item.id} className="hover:bg-accent/50 transition-colors">
          <CardContent className="p-4">
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium line-clamp-2">{item.title}</h3>
                <ExternalLink className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>{item.source}</span>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{getRelativeTime(item.publishedAt)}</span>
                </div>
              </div>
            </a>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
