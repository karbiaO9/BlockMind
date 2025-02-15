"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { getProfileImage, defaultImages } from "@/lib/utils";
import { Loader2, ThumbsUp, MessageSquare, X } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    image: string;
    walletAddress: string;
  };
}

interface IdeaDetailDialogProps {
  idea: {
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
    tags: { id: string; name: string }[];
    _count: {
      comments: number;
      likedBy: number;
    };
    isLiked: boolean;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIdeaUpdated?: () => void;
  onLikeToggle?: () => Promise<void>;
}

export function IdeaDetailDialog({
  idea,
  open,
  onOpenChange,
  onIdeaUpdated,
  onLikeToggle,
}: IdeaDetailDialogProps) {
  const { data: session } = useSession();
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isLiked, setIsLiked] = useState(idea.isLiked);
  const [likeCount, setLikeCount] = useState(idea._count.likedBy);

  // Fetch comments when dialog opens
  useEffect(() => {
    if (open) {
      fetchComments();
    } else {
      // Reset states when dialog closes
      setComments([]);
      setNewComment("");
      setIsLoadingComments(false);
    }
  }, [open, idea.id]);

  const fetchComments = async () => {
    setIsLoadingComments(true);
    try {
      const response = await fetch(`/api/ideas/${idea.id}/comments`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to fetch comments");
      }
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to load comments");
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      toast.error("Please sign in to comment");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/ideas/${idea.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      const newCommentData = await response.json();

      // Optimistically update comments list
      setComments((prevComments) => [
        {
          ...newCommentData,
          author: {
            id: session.user.id,
            name: session.user.name || "",
            image: session.user.image || "",
            walletAddress: session.user.walletAddress || "",
          },
        },
        ...prevComments,
      ]);

      setNewComment("");
      toast.success("Comment added successfully");
    } catch (error) {
      toast.error("Failed to add comment");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session?.user) {
      toast.error("Please sign in to like ideas");
      return;
    }

    try {
      await onLikeToggle?.();
      setIsLiked(!isLiked);
      setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
    } catch (error) {
      toast.error("Failed to update like");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[1100px] h-[90vh] p-0 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main Grid Layout */}
        <div className="grid grid-cols-[1fr,400px] h-full">
          {/* Left Side - Idea Details */}
          <div className="p-6 overflow-y-auto">
            <DialogHeader className="flex flex-row items-center justify-between">
              <DialogTitle className="text-2xl font-bold">
                {idea.title}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 mt-6">
              {/* Author Info */}
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 ring-2 ring-primary/10">
                  <AvatarImage src={getProfileImage(idea.author.image)} />
                  <AvatarFallback>
                    {idea.author.name?.[0] ||
                      idea.author.walletAddress.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {idea.author.name ||
                      `${idea.author.walletAddress.slice(
                        0,
                        6
                      )}...${idea.author.walletAddress.slice(-4)}`}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(idea.createdAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
              </div>

              {/* Idea Image */}
              <div className="relative aspect-video w-full rounded-lg overflow-hidden">
                <Image
                  src={idea.image || defaultImages.idea}
                  alt={idea.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Trading Info & Actions */}
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
              </div>

              {/* Description */}
              <p className="text-sm whitespace-pre-wrap">{idea.description}</p>

              {/* Tags */}
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
            </div>
          </div>

          {/* Right Side - Comments */}
          <div className="border-l relative h-full flex flex-col">
            {/* Comments Header */}
            <div className="p-4 border-b sticky top-0 bg-background z-10">
              <h4 className="font-medium flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Comments ({comments.length})
              </h4>
            </div>

            {/* Comments List - Scrollable Area */}
            <div className="flex-1 overflow-y-auto max-h-[calc(100vh-100px)]">
              <div className="p-4 space-y-4">
                {isLoadingComments ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : comments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No comments yet. Be the first to comment!
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="flex gap-4 p-4 bg-muted/50 rounded-lg"
                    >
                      <Avatar className="h-8 w-8 ring-2 ring-primary/10">
                        <AvatarImage
                          src={getProfileImage(comment.author.image)}
                        />
                        <AvatarFallback>
                          {comment.author.name?.[0] ||
                            comment.author.walletAddress.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {comment.author.name ||
                              `${comment.author.walletAddress.slice(
                                0,
                                6
                              )}...${comment.author.walletAddress.slice(-4)}`}
                          </span>
                          <span className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        <p className="text-sm mt-1 whitespace-pre-wrap">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Comment Input - Fixed at Bottom */}
            <div className="border-t p-4 bg-background sticky bottom-0">
              {session?.user ? (
                <form
                  onSubmit={handleSubmitComment}
                  className="space-y-2"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.metaKey) {
                      e.preventDefault();
                      handleSubmitComment(e);
                    }
                  }}
                >
                  <Textarea
                    placeholder="Share your thoughts..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                    className="resize-none"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      "Post Comment"
                    )}
                  </Button>
                </form>
              ) : (
                <div className="text-center py-2 text-muted-foreground">
                  Please sign in to comment
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
