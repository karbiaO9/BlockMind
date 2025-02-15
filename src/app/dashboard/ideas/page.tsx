"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, Clock, Loader2, UserCircle2 } from "lucide-react";
import { IdeaCard } from "@/components/ideas/idea-card";
import { TrendingIdeas } from "@/components/ideas/trending-ideas";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ShareIdeaDialog } from "@/components/ideas/share-idea-dialog";
import { useSession } from "next-auth/react";
import { getProfileImage } from "@/lib/utils";

interface TradingIdea {
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
  likes: number;
  views: number;
  createdAt: string;
  tags: { id: string; name: string }[];
  _count: {
    comments: number;
    likedBy: number;
  };
  isLiked: boolean;
}

interface IdeasResponse {
  ideas: TradingIdea[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  error?: string;
}

interface TopContributor {
  id: string;
  name: string | null;
  image: string | null;
  walletAddress: string | null;
  ideasCount: number;
  _count: {
    ideas: number;
  };
}

interface PopularTag {
  id: string;
  name: string;
  _count: {
    ideas: number;
  };
}

export default function IdeasPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("latest");
  const [ideas, setIdeas] = useState<TradingIdea[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { data: session } = useSession();
  const [topContributors, setTopContributors] = useState<TopContributor[]>([]);
  const [isLoadingContributors, setIsLoadingContributors] = useState(true);
  const [popularTags, setPopularTags] = useState<PopularTag[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(true);

  useEffect(() => {
    if (filter === "my-ideas") {
      fetchMyIdeas();
    } else {
      fetchIdeas();
    }
  }, [filter]);

  useEffect(() => {
    // Reset page when search changes
    if (filter !== "my-ideas") {
      // Only apply search to non-my-ideas tabs
      setPage(1);
      const debounce = setTimeout(() => {
        fetchIdeas(true);
      }, 300);
      return () => clearTimeout(debounce);
    }
  }, [searchQuery, filter]);

  useEffect(() => {
    fetchTopContributors();
  }, []);

  useEffect(() => {
    fetchPopularTags();
  }, []);

  const fetchIdeas = async (reset = false) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/ideas?page=${page}&filter=${filter}&search=${searchQuery}`
      );
      const data: IdeasResponse = await response.json();

      if (!response.ok) throw new Error(data.error as string);

      setIdeas((prev) => (reset ? data.ideas : [...prev, ...data.ideas]));
      setHasMore(page < data.metadata.pages);
    } catch (error) {
      toast.error("Failed to load ideas");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMyIdeas = async () => {
    if (!session?.user) {
      setIdeas([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/ideas/my-ideas`);
      const data = await response.json();

      if (!response.ok) throw new Error("Failed to fetch ideas");

      setIdeas(data.ideas);
      setHasMore(false); // No pagination for my ideas
    } catch (error) {
      toast.error("Failed to load your ideas");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleIdeaUpdated = async (ideaId: string) => {
    // Optionally refresh the ideas list when a like status changes
    await fetchIdeas(true);
  };

  const fetchTopContributors = async () => {
    try {
      setIsLoadingContributors(true);
      const response = await fetch("/api/users/top-contributors");
      if (!response.ok) throw new Error("Failed to fetch top contributors");

      const data = await response.json();
      setTopContributors(data);
    } catch (error) {
      console.error("Error fetching top contributors:", error);
      toast.error("Failed to load top contributors");
    } finally {
      setIsLoadingContributors(false);
    }
  };

  const fetchPopularTags = async () => {
    try {
      setIsLoadingTags(true);
      const response = await fetch("/api/ideas/popular-tags");
      if (!response.ok) throw new Error("Failed to fetch popular tags");

      const data = await response.json();
      setPopularTags(data);
    } catch (error) {
      console.error("Error fetching popular tags:", error);
      toast.error("Failed to load popular tags");
    } finally {
      setIsLoadingTags(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Trading Ideas</h1>
        <ShareIdeaDialog
          onIdeaShared={() => {
            setPage(1);
            fetchIdeas(true);
          }}
        />
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search ideas..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={filter === "my-ideas"} // Disable search for my ideas
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Tabs
            defaultValue="latest"
            className="space-y-6"
            onValueChange={(value) => {
              setFilter(value);
              setPage(1);
              setSearchQuery(""); // Clear search when changing tabs
            }}
          >
            <TabsList>
              <TabsTrigger value="latest">
                <Clock className="mr-2 h-4 w-4" />
                Latest
              </TabsTrigger>
              <TabsTrigger value="trending">
                <TrendingUp className="mr-2 h-4 w-4" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="my-ideas">
                <UserCircle2 className="mr-2 h-4 w-4" />
                My Ideas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="latest" className="space-y-4">
              {isLoading && page === 1 ? (
                [...Array(3)].map((_, i) => (
                  <IdeaSkeleton key={`skeleton-${i}`} />
                ))
              ) : (
                <>
                  {ideas.map((idea, index) => (
                    <IdeaCard
                      key={`${idea.id}-${index}`}
                      idea={idea}
                      onIdeaUpdated={handleIdeaUpdated}
                    />
                  ))}
                  {hasMore && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Loading...
                        </>
                      ) : (
                        "Load More"
                      )}
                    </Button>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="trending">
              <TrendingIdeas />
            </TabsContent>

            <TabsContent value="my-ideas" className="space-y-4">
              {!session?.user ? (
                <Card className="p-6">
                  <CardHeader>
                    <CardTitle>Sign in to view your ideas</CardTitle>
                    <CardDescription>
                      You need to be signed in to view and manage your trading
                      ideas.
                    </CardDescription>
                  </CardHeader>
                </Card>
              ) : isLoading ? (
                [...Array(3)].map((_, i) => (
                  <IdeaSkeleton key={`skeleton-${i}`} />
                ))
              ) : ideas.length === 0 ? (
                <Card className="p-6">
                  <CardHeader>
                    <CardTitle>No ideas yet</CardTitle>
                    <CardDescription>
                      You haven't shared any trading ideas yet. Click the "Share
                      Idea" button to get started.
                    </CardDescription>
                  </CardHeader>
                </Card>
              ) : (
                <>
                  {ideas.map((idea, index) => (
                    <IdeaCard
                      key={`${idea.id}-${index}`}
                      idea={idea}
                      onIdeaUpdated={() => fetchMyIdeas()}
                    />
                  ))}
                </>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Popular Tags</CardTitle>
              <CardDescription>
                Trending topics in trading ideas
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingTags ? (
                <div className="flex flex-wrap gap-2">
                  {[...Array(8)].map((_, i) => (
                    <Skeleton key={i} className="h-8 w-20" />
                  ))}
                </div>
              ) : popularTags.length === 0 ? (
                <div className="text-center text-muted-foreground py-4">
                  No tags yet
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Button
                      key={tag.id}
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setSearchQuery(tag.name);
                        setFilter("latest"); // Switch to latest tab to show search results
                      }}
                      className="flex items-center gap-1"
                    >
                      {tag.name}
                      <span className="text-xs text-muted-foreground ml-1">
                        ({tag._count.ideas})
                      </span>
                    </Button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Contributors</CardTitle>
              <CardDescription>
                Most active members sharing trading ideas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoadingContributors ? (
                // Loading skeleton
                [...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </div>
                ))
              ) : topContributors.length === 0 ? (
                <div className="text-center text-muted-foreground py-4">
                  No contributors yet
                </div>
              ) : (
                topContributors.map((contributor, index) => (
                  <div key={contributor.id} className="flex items-center gap-3">
                    <img
                      src={getProfileImage(contributor.image)}
                      alt={contributor.name || "Anonymous"}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">
                        {contributor.name ||
                          `${contributor.walletAddress?.slice(
                            0,
                            6
                          )}...${contributor.walletAddress?.slice(-4)}`}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {contributor._count.ideas} ideas shared
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

const IdeaSkeleton = () => (
  <Card>
    <CardContent className="p-6 space-y-4">
      <div className="flex gap-4">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
      <Skeleton className="h-24 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
    </CardContent>
  </Card>
);
