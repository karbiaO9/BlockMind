"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Mail,
  Lock,
  User,
  Check,
  X,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/icons/logo";
import { MainNav } from "@/components/layout/main-nav";
import { FcGoogle } from "react-icons/fc";
import { MetaMaskIcon } from "@/components/icons/metamask";
import { signIn } from "next-auth/react";
import { Separator } from "@/components/ui/separator";
import { ethers } from "ethers";
import { SiweMessage } from "siwe";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const getErrorStyles = (error: string | null) => {
  if (!error) return "";
  return "mb-4 p-4 rounded-lg border text-sm font-medium dark:bg-red-900/10 bg-red-50 dark:text-red-400 text-red-500 dark:border-red-900/30 border-red-200";
};

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordChecks, setPasswordChecks] = useState({
    minLength: false,
    hasNumber: false,
    hasSpecial: false,
    hasUpper: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (formData.password !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (passwordStrength < 75) {
      setError("Password does not meet security requirements");
      toast.error("Please ensure your password meets all requirements");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        switch (data.error) {
          case "EmailExists":
            setError("Email already registered");
            toast.error("Email already registered");
            break;
          case "InvalidEmail":
            setError("Please enter a valid email address");
            toast.error("Please enter a valid email address");
            break;
          default:
            setError(data.message || "Registration failed");
            toast.error(data.message || "Registration failed");
        }
        return;
      }

      // Sign in after successful registration
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.ok) {
        toast.success("Account created successfully!");
        router.push("/dashboard");
      } else {
        setError("Failed to sign in after registration");
        toast.error("Failed to sign in after registration");
      }
    } catch (error) {
      console.error("Registration error:", error);
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMetaMaskRegister = async () => {
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
        statement: "Sign up with Ethereum to BlockMind",
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

      if (result?.ok) {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("MetaMask registration error:", error);
      if ((error as Error).message.includes("user rejected")) {
        setError("You rejected the signature request");
        toast.error("You rejected the signature request");
      } else {
        setError("Failed to connect to MetaMask");
        toast.error("Failed to connect to MetaMask");
      }
    }
  };

  const checkPasswordStrength = (password: string) => {
    const checks = {
      minLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      hasUpper: /[A-Z]/.test(password),
    };
    setPasswordChecks(checks);

    const strength = Object.values(checks).filter(Boolean).length;
    setPasswordStrength((strength / 4) * 100);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, password: newPassword });
    checkPasswordStrength(newPassword);
  };

  return (
    <>
      <MainNav />
      <div className="container relative min-h-[calc(100vh-4rem)] flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        {/* Left Panel */}
        <div className="relative hidden h-full flex-col lg:flex bg-gradient-to-br from-zinc-900/10 via-zinc-900/50 to-zinc-900/90 dark:from-zinc-900/50 dark:via-zinc-900/80 dark:to-black">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-grid-white/5" />
            <div className="absolute w-full h-full">
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full mix-blend-soft-light dark:mix-blend-overlay filter blur-2xl opacity-30 dark:opacity-20"
                  animate={{
                    x: [0, 30, 0],
                    y: [0, 50, 0],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut",
                  }}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    background: `hsl(${220 + i * 15}, ${40 + i * 5}%, ${
                      20 + i * 5
                    }%)`,
                    width: `${200 + i * 50}px`,
                    height: `${200 + i * 50}px`,
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
                    Create an Account
                  </h1>
                  <p className="text-white/80">
                    Join the future of blockchain analytics
                  </p>
                </div>
              </div>

              <div className="max-w-sm mx-auto space-y-2">
                <h2 className="text-xl font-medium text-white/90">
                  Start Your Blockchain Journey
                </h2>
                <p className="text-sm text-white/70">
                  Get access to powerful analytics tools and real-time insights
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Create an account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your details below to create your account
              </p>
            </div>

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

            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="pl-9"
                  required
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="pl-9"
                  required
                />
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handlePasswordChange}
                    className="pl-9 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">Toggle password visibility</span>
                  </Button>
                </div>

                {formData.password && (
                  <div className="space-y-2">
                    <Progress value={passwordStrength} className="h-2 w-full" />

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1">
                        {passwordChecks.minLength ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <X className="h-3 w-3 text-red-500" />
                        )}
                        <span className="text-muted-foreground">
                          At least 8 characters
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {passwordChecks.hasUpper ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <X className="h-3 w-3 text-red-500" />
                        )}
                        <span className="text-muted-foreground">
                          Uppercase letter
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {passwordChecks.hasNumber ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <X className="h-3 w-3 text-red-500" />
                        )}
                        <span className="text-muted-foreground">Number</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {passwordChecks.hasSpecial ? (
                          <Check className="h-3 w-3 text-green-500" />
                        ) : (
                          <X className="h-3 w-3 text-red-500" />
                        )}
                        <span className="text-muted-foreground">
                          Special character
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={cn("pl-9 pr-10", {
                      "border-red-500 focus-visible:ring-red-500":
                        confirmPassword &&
                        formData.password !== confirmPassword,
                      "border-green-500 focus-visible:ring-green-500":
                        confirmPassword &&
                        formData.password === confirmPassword,
                    })}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">Toggle password visibility</span>
                  </Button>
                  {confirmPassword && (
                    <div className="absolute right-10 top-3">
                      {formData.password === confirmPassword ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <X className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
              </div>
              <Button
                disabled={isLoading}
                className="h-12 relative overflow-hidden group"
              >
                <div className="absolute inset-0 w-3 bg-gradient-to-r from-primary/50 to-primary transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-20" />
                <span className="relative flex items-center justify-center">
                  {isLoading ? (
                    "Creating account..."
                  ) : (
                    <>
                      Create account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </span>
              </Button>
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
                onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
                className="relative overflow-hidden group border-zinc-200 dark:border-zinc-800 h-12"
              >
                <div className="absolute inset-0 w-3 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-20" />
                <span className="relative flex items-center justify-center gap-2">
                  <FcGoogle className="h-5 w-5" />
                  <span>Sign up with Google</span>
                </span>
              </Button>
              <Button
                variant="outline"
                onClick={handleMetaMaskRegister}
                className="relative overflow-hidden group border-zinc-200 dark:border-zinc-800 h-12"
              >
                <div className="absolute inset-0 w-3 bg-gradient-to-r from-[#E2761B] to-[#CD6116] transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-20" />
                <span className="relative flex items-center justify-center gap-2">
                  <MetaMaskIcon className="w-6 h-6" />
                  <span>Sign up with MetaMask</span>
                </span>
              </Button>
            </div>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-primary underline-offset-4 transition-colors hover:underline"
                >
                  Sign in
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
