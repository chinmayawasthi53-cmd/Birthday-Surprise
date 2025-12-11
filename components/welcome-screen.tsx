"use client"

import { useState } from "react"
import { Gift } from "lucide-react"

interface WelcomeScreenProps {
  onStart: () => void
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [isPressed, setIsPressed] = useState(false)

  return (
    <div className="flex flex-col items-center justify-center text-center px-6">
      {/* Main content */}
      <div className="space-y-8">
        {/* Gift icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-pink-500/20 blur-3xl rounded-full scale-150" />
            <div className="relative bg-gradient-to-br from-pink-100 to-pink-50 p-8 rounded-full border border-pink-200 shadow-lg">
              <Gift className="w-16 h-16 text-pink-500" />
            </div>
          </div>
        </div>

        {/* Greeting */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">You Have a Surprise!</h1>
          <p className="text-xl text-muted-foreground">У тебя есть сюрприз!</p>
        </div>

        {/* Start button */}
        <button
          onClick={onStart}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
          className={`
            px-12 py-4 rounded-full font-semibold text-lg
            bg-pink-500 text-white
            shadow-lg shadow-pink-500/30
            transition-all duration-200
            hover:bg-pink-600 hover:shadow-xl hover:shadow-pink-500/40
            active:scale-95
            ${isPressed ? "scale-95" : ""}
          `}
        >
          Open
        </button>

        <p className="text-sm text-muted-foreground">Tap to begin</p>
      </div>
    </div>
  )
}
