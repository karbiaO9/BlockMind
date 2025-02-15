"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";

const AVATAR_STYLES = [
  "pixel-art",
  "adventurer",
  "adventurer-neutral",
  "avataaars",
  "bottts",
  "fun-emoji",
  "icons",
  "identicon",
  "initials",
  "lorelei",
  "micah",
  "miniavs",
  "personas",
];

export function AvatarPickerDialog() {
  const [selectedStyle, setSelectedStyle] = useState("pixel-art");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { updateUserImage } = useAuth();

  const generateAvatars = (style: string) => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      url: `https://api.dicebear.com/7.x/${style}/svg?seed=${i}`,
    }));
  };

  const handleAvatarSelect = async (avatarUrl: string) => {
    try {
      setIsLoading(true);
      await updateUserImage(avatarUrl);
      setIsOpen(false);
      toast.success("Avatar updated successfully");
    } catch (error) {
      toast.error("Failed to update avatar");
      console.error("Error updating avatar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Change Avatar</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Choose an Avatar</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {AVATAR_STYLES.map((style) => (
              <Button
                key={style}
                variant={selectedStyle === style ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStyle(style)}
              >
                {style
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </Button>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-4">
            {generateAvatars(selectedStyle).map((avatar) => (
              <Button
                key={avatar.id}
                variant="outline"
                className="p-0 h-auto aspect-square"
                onClick={() => handleAvatarSelect(avatar.url)}
                disabled={isLoading}
              >
                <Avatar className="h-full w-full">
                  <AvatarImage src={avatar.url} />
                </Avatar>
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
