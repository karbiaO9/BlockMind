"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ethers } from "ethers";
import { SiweMessage } from "siwe";
import { Logo } from "@/components/icons/logo";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { MainNav } from "@/components/layout/main-nav";
import { FcGoogle } from "react-icons/fc";
import { MetaMaskIcon } from "@/components/icons/metamask";
import { motion } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";

interface Block {
  left: string;
  top: string;
  size: number;
  rotation: number;
}

const blocks: Block[] = [
  { left: "10%", top: "20%", size: 120, rotation: 15 },
  { left: "65%", top: "40%", size: 150, rotation: -20 },
  { left: "25%", top: "65%", size: 180, rotation: 25 },
  { left: "80%", top: "25%", size: 140, rotation: -15 },
  { left: "45%", top: "85%", size: 160, rotation: 10 },
];

const getErrorStyles = (error: string | null) => {
  if (!error) return "";
  return "mb-4 p-4 rounded-lg border text-sm font-medium dark:bg-red-900/10 bg-red-50 dark:text-red-400 text-red-500 dark:border-red-900/30 border-red-200";
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        switch (result.error) {
          case "CredentialsSignin":
            setError("Invalid email or password");
            toast.error("Invalid email or password");
            break;
          case "2FARequired":
            router.push(`/2fa?email=${encodeURIComponent(email)}`);
            break;
          case "AccountDisabled":
            setError("Your account has been disabled");
            toast.error("Your account has been disabled");
            break;
          default:
            setError("An error occurred during sign in");
            toast.error("An error occurred during sign in");
        }
        return;
      }

      if (result?.ok) {
        toast.success("Successfully signed in!");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMetaMaskLogin = async () => {
    setError(null);
    try {
      if (!window.ethereum) {
        setError("MetaMask is not installed");
        toast.error("Please install MetaMask to continue");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: "Sign in with Ethereum to BlockMind",
        uri: window.location.origin,
        version: "1",
        chainId: 1,
        nonce: Math.random().toString(36).slice(2),
      });

      const signature = await signer.signMessage(message.prepareMessage());

      const result = await signIn("metamask", {
        message: JSON.stringify(message),
        signature,
        redirect: false,
      });

      if (result?.error) {
        switch (result.error) {
          case "WalletNotLinked":
            setError("This wallet is not linked to any account");
            toast.error("This wallet is not linked to any account");
            break;
          case "SignatureInvalid":
            setError("Invalid signature");
            toast.error("Invalid signature");
            break;
          default:
            setError("Failed to sign in with MetaMask");
            toast.error("Failed to sign in with MetaMask");
        }
        return;
      }

      if (result?.ok) {
        toast.success("Successfully signed in with MetaMask!");
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("MetaMask login error:", error);
      if ((error as Error).message.includes("user rejected")) {
        setError("You rejected the signature request");
        toast.error("You rejected the signature request");
      } else {
        setError("Failed to connect to MetaMask");
        toast.error("Failed to connect to MetaMask");
      }
    }
  };

  return (
    <>
      <MainNav />
      <div className="container relative min-h-[calc(100vh-4rem)] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col lg:flex bg-gradient-to-br from-zinc-900/10 via-zinc-900/50 to-zinc-900/90 dark:from-zinc-900/50 dark:via-zinc-900/80 dark:to-black">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/5" />
            <div className="absolute w-full h-full">
              {blocks.map((block, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-xl mix-blend-multiply dark:mix-blend-plus-lighter filter blur-md opacity-40 dark:opacity-30"
                  animate={{
                    rotate: [
                      block.rotation - 5,
                      block.rotation + 5,
                      block.rotation - 5,
                    ],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    delay: i * 1.5,
                    ease: "easeInOut",
                  }}
                  style={{
                    left: block.left,
                    top: block.top,
                    width: `${block.size}px`,
                    height: `${block.size}px`,
                    backgroundImage: `linear-gradient(${45 + i * 45}deg, 
                      ${
                        i % 2 === 0
                          ? "hsl(210, 40%, 85%), hsl(210, 40%, 75%)"
                          : "hsl(250, 40%, 85%), hsl(250, 40%, 75%)"
                      })`,
                    transform: `rotate(${block.rotation}deg)`,
                    borderRadius: "1rem",
                  }}
                />
              ))}
            </div>
          </div>

          <div className="relative z-20 flex flex-col items-center justify-center h-full p-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-6"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-full bg-black/20 dark:bg-white/10 p-4 backdrop-blur-sm">
                  <Logo />
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter text-white">
                    Welcome Back
                  </h1>
                  <p className="text-white/80">Blockchain Analytics Platform</p>
                </div>
              </div>

              <div className="max-w-sm mx-auto space-y-2">
                <h2 className="text-xl font-medium text-white/90">
                  Access Your Analytics
                </h2>
                <p className="text-sm text-white/70">
                  Get back to monitoring your blockchain insights and real-time
                  analytics
                </p>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Welcome back
              </h1>
              <p className="text-sm text-muted-foreground">
                Sign in to your account to continue
              </p>
            </div>
            <div className="grid gap-6">
              <form onSubmit={handleEmailLogin}>
                {error && (
                  <div className={getErrorStyles(error)}>
                    <div className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      {error}
                    </div>
                  </div>
                )}
                <div className="grid gap-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9 pr-9"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <Button
                    disabled={isLoading}
                    className="h-12 relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 w-3 bg-gradient-to-r from-primary/50 to-primary transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-20" />
                    <span className="relative flex items-center justify-center">
                      {isLoading ? (
                        "Signing in..."
                      ) : (
                        <>
                          Sign in with Email
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </span>
                  </Button>
                </div>
              </form>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <div className="grid gap-4">
                <Button
                  variant="outline"
                  onClick={() => signIn("google")}
                  className="relative overflow-hidden group border-zinc-200 dark:border-zinc-800 h-12"
                >
                  <div className="absolute inset-0 w-3 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-20" />
                  <span className="relative flex items-center justify-center gap-2">
                    <FcGoogle className="h-5 w-5" />
                    <span>Sign in with Google</span>
                  </span>
                </Button>
                <Button
                  variant="outline"
                  onClick={handleMetaMaskLogin}
                  className="relative overflow-hidden group border-zinc-200 dark:border-zinc-800 h-12"
                >
                  <div className="absolute inset-0 w-3 bg-gradient-to-r from-[#E2761B] to-[#CD6116] transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-20" />
                  <span className="relative flex items-center justify-center gap-2">
                    <MetaMaskIcon className="w-6 h-6" />
                    <span>Sign in with MetaMask</span>
                  </span>
                </Button>
              </div>
              <div className="text-center text-sm">
                <span className="text-muted-foreground">
                  Don't have an account?{" "}
                  <Link
                    href="/register"
                    className="text-primary underline-offset-4 transition-colors hover:underline"
                  >
                    Sign up for free
                  </Link>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
