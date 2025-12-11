"use client"

import { useEffect, useState } from "react"

interface ConfettiPiece {
  id: number
  left: number
  delay: number
  duration: number
  color: string
  size: number
  shape: "circle" | "square" | "star"
}

export default function Confetti() {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([])

  useEffect(() => {
    const colors = [
      "bg-primary",
      "bg-accent",
      "bg-pink-400",
      "bg-yellow-400",
      "bg-purple-400",
      "bg-rose-300",
      "bg-fuchsia-400",
    ]
    const shapes: ConfettiPiece["shape"][] = ["circle", "square", "star"]

    const newPieces: ConfettiPiece[] = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 4 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 8 + Math.random() * 12,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    }))

    setPieces(newPieces)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className={`absolute ${piece.color} animate-confetti ${
            piece.shape === "circle" ? "rounded-full" : piece.shape === "square" ? "rounded-sm" : ""
          }`}
          style={{
            left: `${piece.left}%`,
            width: piece.size,
            height: piece.size,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            clipPath:
              piece.shape === "star"
                ? "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)"
                : undefined,
          }}
        />
      ))}
    </div>
  )
}
