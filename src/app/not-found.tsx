"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

const circles = [
  { left: "20%", top: "30%", size: 300 },
  { left: "60%", top: "60%", size: 400 },
  { left: "40%", top: "20%", size: 500 },
];

export default function NotFound() {
  const router = useRouter();

  return (
    <>
      <div className="h-screen w-full flex items-center justify-center bg-grid-small-black/[0.2] relative">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-tr from-zinc-950/50 to-zinc-900/30 dark:from-black/50 dark:to-black/30 z-0" />

        {/* Animated circles */}
        <div className="absolute inset-0 overflow-hidden">
          {circles.map((circle, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full mix-blend-overlay dark:mix-blend-multiply filter blur-xl opacity-30"
              animate={{
                x: [0, 30, 0],
                y: [0, 50, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                delay: i * 2,
                ease: "easeInOut",
              }}
              style={{
                left: circle.left,
                top: circle.top,
                background: `hsl(0, 0%, ${90 - i * 20}%)`,
                width: `${circle.size}px`,
                height: `${circle.size}px`,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 text-center space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h1 className="text-9xl font-bold text-zinc-900/20 dark:text-white/10">
              404
            </h1>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">
                Page not found
              </h2>
              <p className="text-muted-foreground max-w-[400px] mx-auto">
                We couldn't find the page you were looking for. It might have
                been removed, renamed, or did not exist in the first place.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="group"
            >
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Go back
            </Button>

            <Button asChild>
              <Link href="/" className="flex items-center gap-2">
                Return home
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </>
  );
}
