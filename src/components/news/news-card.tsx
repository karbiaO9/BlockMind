import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

interface NewsCardProps {
  news: {
    title: string;
    body: string;
    url: string;
    imageUrl: string;
    source: string;
    publishedAt: string;
  };
}

export function NewsCard({ news }: NewsCardProps) {
  return (
    <a
      href={news.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block transition-transform hover:-translate-y-1"
    >
      <Card className="overflow-hidden h-full">
        <div className="relative h-48 w-full">
          <Image
            src={news.imageUrl}
            alt={news.title}
            fill
            className="object-cover"
          />
        </div>
        <CardHeader>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{news.source}</span>
            <span className="text-sm text-muted-foreground">
              {new Date(news.publishedAt).toLocaleDateString()}
            </span>
          </div>
          <CardTitle className="line-clamp-2">{news.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-3">{news.body}</p>
        </CardContent>
      </Card>
    </a>
  );
} 