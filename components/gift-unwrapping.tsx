"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Gift, Sparkles, Star, Heart } from "lucide-react"

interface GiftUnwrappingProps {
  onComplete: () => void
}

export default function GiftUnwrapping({ onComplete }: GiftUnwrappingProps) {
  const [layer, setLayer] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string; delay: number }>>(
    [],
  )
  const [showHint, setShowHint] = useState(true)

  const layers = [
    {
      color: "from-rose-400 to-rose-500",
      ribbon: "bg-rose-600",
      text: "What could it be?",
      ruText: "Что там внутри?",
    },
    {
      color: "from-pink-400 to-pink-500",
      ribbon: "bg-pink-600",
      text: "Getting closer...",
      ruText: "Уже близко...",
    },
    {
      color: "from-fuchsia-400 to-fuchsia-500",
      ribbon: "bg-fuchsia-600",
      text: "Almost there!",
      ruText: "Почти готово!",
    },
    {
      color: "from-amber-400 to-amber-500",
      ribbon: "bg-amber-600",
      text: "One more tap!",
      ruText: "Ещё один раз!",
    },
  ]

  const handleUnwrap = () => {
    if (isAnimating) return

    setIsAnimating(true)
    setShowHint(false)

    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 360 - 180,
      y: Math.random() * 360 - 180,
      color: ["bg-rose-400", "bg-pink-400", "bg-amber-400", "bg-fuchsia-400"][Math.floor(Math.random() * 4)],
      delay: Math.random() * 0.3,
    }))
    setParticles(newParticles)

    setTimeout(() => {
      setParticles([])
      if (layer < layers.length - 1) {
        setLayer((prev) => prev + 1)
        setIsAnimating(false)
        setShowHint(true)
      } else {
        onComplete()
      }
    }, 800)
  }

  useEffect(() => {
    const timer = setTimeout(() => setShowHint(true), 1500)
    return () => clearTimeout(timer)
  }, [layer])

  const currentLayer = layers[layer]

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => {
          const icons = [Gift, Sparkles, Star, Heart]
          const IconComponent = icons[i % 4]
          const colors = ["text-rose-300", "text-amber-300", "text-pink-300", "text-fuchsia-300"]
          return (
            <div
              key={i}
              className={`absolute ${colors[i % 4]} opacity-20 animate-float`}
              style={{
                left: `${(i % 4) * 25 + 5}%`,
                top: `${Math.floor(i / 4) * 35 + 5}%`,
                animationDelay: `${i * 0.4}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
              }}
            >
              <IconComponent className="w-8 h-8 md:w-10 md:h-10" />
            </div>
          )
        })}
      </div>

      <div className="text-center mb-8 relative z-10">
        <div className="relative inline-block">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-2">A Special Gift For You!</h2>
          <div className="absolute -inset-4 bg-primary/10 blur-2xl rounded-full -z-10" />
        </div>
        <p className="text-lg md:text-xl text-muted-foreground">Особенный подарок для тебя!</p>

        <div
          className={`mt-4 transition-all duration-500 ${showHint ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"}`}
        >
          <p className="text-primary font-medium text-lg">{currentLayer.text}</p>
          <p className="text-muted-foreground text-sm">{currentLayer.ruText}</p>
        </div>
      </div>

      <div
        className="relative cursor-pointer select-none group"
        onClick={handleUnwrap}
        style={{ width: 200, height: 220 }}
      >
        {/* Glow effect */}
        <div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${currentLayer.color} blur-2xl opacity-30 scale-125`}
        />

        {/* Explosion particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`absolute top-1/2 left-1/2 w-3 h-3 rounded-full ${particle.color}`}
            style={
              {
                transform: `translate(-50%, -50%)`,
                animation: `explode 0.8s ease-out forwards`,
                animationDelay: `${particle.delay}s`,
                "--random-x": particle.x / 180 + 0.5,
                "--random-y": particle.y / 180 + 0.5,
              } as React.CSSProperties
            }
          />
        ))}

        <div
          className={`relative w-full h-full transition-all duration-300 ${isAnimating ? "animate-shake scale-105" : "group-hover:scale-105"}`}
        >
          {/* Box body */}
          <div
            className={`absolute bottom-0 left-0 right-0 h-40 rounded-xl bg-gradient-to-b ${currentLayer.color} shadow-2xl overflow-hidden`}
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/10" />

            {/* Vertical ribbon */}
            <div className={`absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 ${currentLayer.ribbon}`}>
              <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-white/20 to-black/10" />
            </div>

            {/* Horizontal ribbon */}
            <div className={`absolute left-0 right-0 top-1/2 -translate-y-1/2 h-8 ${currentLayer.ribbon}`}>
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-white/20 to-black/10" />
            </div>
          </div>

          {/* Box lid */}
          <div
            className={`absolute top-8 left-0 right-0 h-14 rounded-t-xl bg-gradient-to-b ${currentLayer.color} shadow-lg`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent rounded-t-xl" />
            {/* Lid edge */}
            <div
              className={`absolute -bottom-1 -left-2 -right-2 h-4 rounded-lg bg-gradient-to-b ${currentLayer.color}`}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-black/10 rounded-lg" />
            </div>
            {/* Horizontal ribbon on lid */}
            <div className={`absolute left-0 right-0 top-1/2 -translate-y-1/2 h-6 ${currentLayer.ribbon}`}>
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-white/20 to-black/10" />
            </div>
          </div>

          {/* Bow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
            {/* Left loop */}
            <div className={`absolute -left-8 top-2 w-9 h-7 ${currentLayer.ribbon} rounded-full -rotate-12 shadow-md`}>
              <div className="absolute inset-1 bg-gradient-to-br from-white/40 to-transparent rounded-full" />
            </div>
            {/* Right loop */}
            <div className={`absolute -right-8 top-2 w-9 h-7 ${currentLayer.ribbon} rounded-full rotate-12 shadow-md`}>
              <div className="absolute inset-1 bg-gradient-to-br from-white/40 to-transparent rounded-full" />
            </div>
            {/* Center knot */}
            <div className={`relative w-6 h-6 ${currentLayer.ribbon} rounded-full shadow-lg z-10 top-3`}>
              <div className="absolute inset-1 bg-gradient-to-br from-white/50 to-transparent rounded-full" />
            </div>
            {/* Tails */}
            <div
              className={`absolute top-8 left-0 w-3 h-10 ${currentLayer.ribbon} rotate-[20deg] rounded-b-full -translate-x-1`}
            />
            <div
              className={`absolute top-8 right-0 w-3 h-10 ${currentLayer.ribbon} -rotate-[20deg] rounded-b-full translate-x-1`}
            />
          </div>

          {/* Shimmer */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </div>
        </div>

        {/* Tap indicator */}
        {showHint && !isAnimating && (
          <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="w-10 h-10 rounded-full border-2 border-primary/50 flex items-center justify-center animate-bounce">
              <div className="w-5 h-5 rounded-full bg-primary/30" />
            </div>
            <span className="text-xs text-muted-foreground mt-2">Tap to unwrap</span>
          </div>
        )}
      </div>

      {/* Progress indicators */}
      <div className="mt-24 flex flex-col items-center gap-3">
        <div className="flex items-center gap-3">
          {layers.map((_, i) => (
            <div key={i} className="relative">
              <div
                className={`w-3 h-3 rounded-full transition-all duration-500 ${
                  i < layer
                    ? "bg-primary scale-100"
                    : i === layer
                      ? "bg-primary scale-125 ring-4 ring-primary/30"
                      : "bg-muted"
                }`}
              />
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Layer {layer + 1} of {layers.length}
        </p>
      </div>
    </div>
  )
}
