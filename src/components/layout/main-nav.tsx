"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/icons/logo";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { WalletAddress } from "@/components/wallet-address";
import { ProfileDropdown } from "@/components/layout/profile-dropdown";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
];

export function MainNav() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between px-4 mx-auto">
        {/* Left Section - Logo */}
        <div className="flex items-center lg:w-[240px]">
          <Link href="/" className="flex items-center gap-2 ml-10">
            <Logo />
            <span className="text-xl font-bold">BlockMind</span>
          </Link>
        </div>

        {/* Center Section - Navigation */}
        <div className="hidden flex-1 lg:flex lg:justify-center">
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group relative rounded-md px-4 py-2 text-sm font-medium transition-colors hover:text-foreground/80",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                {item.label}
                {pathname === item.href && (
                  <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-primary/0 via-primary/70 to-primary/0" />
                )}
              </Link>
            ))}
            {session && (
              <Link
                href="/dashboard"
                className={cn(
                  "group relative rounded-md px-4 py-2 text-sm font-medium transition-colors hover:text-foreground/80",
                  pathname === "/dashboard"
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center justify-end lg:w-[240px]">
          <div className="hidden items-center gap-2 lg:flex">
            <ThemeToggle />
            {session ? (
              <ProfileDropdown session={session} />
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-[300px]">
                <div className="flex flex-col space-y-4 py-4">
                  <Link href="/" className="flex items-center gap-2">
                    <Logo />
                    <span className="text-xl font-bold">BlockMind</span>
                  </Link>
                  <Separator />
                  <div className="flex flex-col space-y-3">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "text-sm font-medium transition-colors hover:text-foreground/80",
                          pathname === item.href
                            ? "text-foreground"
                            : "text-foreground/60"
                        )}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                  <Separator />
                  <div className="flex flex-col gap-2">
                    {session ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 px-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={session.user?.image || ""}
                              alt={session.user?.name || ""}
                            />
                            <AvatarFallback>
                              {session.user?.name?.[0] || (
                                <User className="h-4 w-4" />
                              )}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col">
                            <p className="text-sm font-medium">
                              {session.user?.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {session.user?.email}
                            </p>
                            {session.user?.walletAddress && (
                              <WalletAddress
                                address={session.user.walletAddress}
                                className="mt-1"
                              />
                            )}
                          </div>
                        </div>
                        <Button asChild>
                          <Link href="/dashboard">Dashboard</Link>
                        </Button>
                        <Button variant="outline" onClick={() => signOut()}>
                          Sign out
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Button asChild variant="outline">
                          <Link href="/login">Sign in</Link>
                        </Button>
                        <Button asChild>
                          <Link href="/register">Get Started</Link>
                        </Button>
                      </div>
                    )}
                    <div className="mt-2">
                      <ThemeToggle />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
