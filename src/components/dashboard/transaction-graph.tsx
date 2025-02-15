"use client"

import { useEffect, useRef } from "react"
import { Network } from "lucide-react"

export function TransactionGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  return (
    <div className="relative aspect-square w-full rounded-lg border">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <Network className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-2 text-sm text-muted-foreground">
            Transaction graph visualization will appear here
          </p>
        </div>
      </div>
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  )
} 