"use client";

import Link from "next/link";
import {
  User,
  Settings,
  LogOut,
  ChevronDown,
  Wallet,
  LightbulbIcon,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { WalletAddress } from "@/components/wallet-address";
import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";

export function ProfileDropdown() {
  const { user, isLoading } = useAuth();
  const [avatarKey, setAvatarKey] = useState(0);
  console.log(user);
  // Force re-render when user or image changes
  useEffect(() => {
    if (user) {
      setAvatarKey((prev) => prev + 1);
    }
  }, [user, user?.image]);

  if (isLoading || !user) return null;

  const userInitials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="flex items-center" key={avatarKey}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative flex items-center gap-2 h-10 px-3 rounded-full hover:bg-accent/50 transition-all"
          >
            <Avatar
              className="h-7 w-7 ring-2 ring-primary/10 hover:ring-primary/20 transition-all"
              key={`avatar-${avatarKey}`}
            >
              <AvatarImage
                src={
                  user.image ||
                  "https://api.dicebear.com/7.x/pixel-art/svg?seed=default"
                }
                alt={user.name || "User avatar"}
              />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            {user.walletAddress ? (
              <WalletAddress
                address={user.walletAddress}
                className="bg-transparent hover:bg-transparent text-sm"
                asChild
              />
            ) : (
              <span className="text-sm font-medium">{user.name}</span>
            )}
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[320px] p-3 rounded-xl" align="end">
          <div className="flex items-start gap-3 pb-3">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={
                  user.image ||
                  "https://api.dicebear.com/7.x/pixel-art/svg?seed=default"
                }
                alt={user.name || "User avatar"}
              />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
              {user.walletAddress && (
                <WalletAddress
                  address={user.walletAddress}
                  className="bg-accent hover:bg-accent/80 mt-1"
                />
              )}
            </div>
          </div>
          <DropdownMenuSeparator className="-mx-3" />
          <div className="py-2">
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/wallets">
                  <Wallet className="mr-2 h-4 w-4" />
                  Wallet
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/ideas">
                  <LightbulbIcon className="mr-2 h-4 w-4" />
                  My Ideas
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuItem
              className="flex items-center gap-2.5 px-3 py-2.5 text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg mt-1"
              onClick={() => signOut()}
            >
              <LogOut className="h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
