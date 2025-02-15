"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, MessageSquare, Bookmark } from "lucide-react";
import Image from "next/image";
import { getProfileImage, defaultImages } from "@/lib/utils";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { IdeaDetailDialog } from "./idea-detail-dialog";

interface IdeaCardProps {
  idea: {
    id: string;
    title: string;
    author: {
      id: string;
      name: string;
      walletAddress: string;
      image: string;
    };
    symbol: string;
    type: "LONG" | "SHORT";
    timeframe: string;
    description: string;
    image: string | null;
    likes: number;
    views: number;
    createdAt: string;
    tags: { id: string; name: string }[];
    _count: {
      comments: number;
      likedBy: number;
    };
    isLiked: boolean;
  };
  onIdeaUpdated?: (ideaId: string) => void;
}

export function IdeaCard({ idea, onIdeaUpdated }: IdeaCardProps) {
  const { data: session } = useSession();
  const [isLiked, setIsLiked] = useState(idea.isLiked);
  const [likeCount, setLikeCount] = useState(idea._count.likedBy);
  const [commentCount, setCommentCount] = useState(idea._count.comments);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const handleLike = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();

    if (!session?.user) {
      toast.error("Please sign in to like ideas");
      return;
    }

    try {
      const response = await fetch(`/api/ideas/${idea.id}/like`, {
        method: isLiked ? "DELETE" : "POST",
      });

      if (!response.ok) throw new Error("Failed to update like");

      setIsLiked(!isLiked);
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    } catch (error) {
      toast.error("Failed to update like");
      console.error(error);
    }
  };

  const handleCardClick = () => {
    setDetailDialogOpen(true);
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer">
      <div className="grid md:grid-cols-2 gap-4">
        <div
          onClick={handleCardClick}
          className="relative h-[200px] md:h-full overflow-hidden rounded-l-lg"
        >
          <Image
            src={idea.image || defaultImages.idea}
            alt={idea.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 space-y-2">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className={`${
                  idea.type === "LONG"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-rose-600 hover:bg-rose-700"
                } text-white font-medium shadow-sm`}
              >
                {idea.type}
              </Button>
              <Button size="sm" variant="secondary">
                {idea.timeframe.replace(/_/g, " ")}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4 p-4">
          <div className="flex items-center gap-3">
            <img
              src={getProfileImage(idea.author.image)}
              alt={idea.author.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-primary/10"
            />
            <div>
              <p className="font-medium">
                {idea.author.name ||
                  `${idea.author.walletAddress.slice(
                    0,
                    6
                  )}...${idea.author.walletAddress.slice(-4)}`}
              </p>
              <p className="text-sm text-muted-foreground">
                {new Date(idea.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold">{idea.title}</h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {idea.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {idea.tags.map(
              (tag) =>
                tag.name && (
                  <Button
                    key={tag.id}
                    variant="outline"
                    size="sm"
                    className="hover:bg-primary hover:text-primary-foreground"
                  >
                    #{tag.name}
                  </Button>
                )
            )}
          </div>

          <div className="flex items-center gap-4 pt-4 border-t">
            <Button
              variant={isLiked ? "default" : "ghost"}
              size="sm"
              onClick={handleLike}
              className={
                isLiked
                  ? "bg-green-500/10 hover:bg-green-500/20 dark:bg-green-500/20 dark:hover:bg-green-500/30"
                  : "hover:bg-green-500/10 dark:hover:bg-green-500/20"
              }
            >
              <ThumbsUp
                className={`mr-2 h-4 w-4 ${
                  isLiked
                    ? "fill-green-500 text-green-500 dark:fill-green-400 dark:text-green-400"
                    : "text-foreground/70"
                }`}
              />
              <span
                className={
                  isLiked
                    ? "text-green-500 dark:text-green-400"
                    : "text-foreground/70"
                }
              >
                {likeCount}
              </span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleCardClick}
              className="hover:bg-blue-500/10 dark:hover:bg-blue-500/20"
            >
              <MessageSquare className="mr-2 h-4 w-4 text-foreground/70" />
              <span className="text-foreground/70">{commentCount}</span>
            </Button>
          </div>
        </div>
      </div>
      <IdeaDetailDialog
        idea={{
          ...idea,
          isLiked,
          _count: {
            ...idea._count,
            likedBy: likeCount,
          },
        }}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        onIdeaUpdated={() => {
          setCommentCount((prev) => prev + 1);
        }}
        onLikeToggle={handleLike}
      />
    </Card>
  );
}
