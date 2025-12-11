"use client"

import { useState, useRef } from "react"
import CandleBlowing from "./candle-blowing"
import GiftUnwrapping from "./gift-unwrapping"
import FinalReveal from "./final-reveal"
import MagicParticles from "./magic-particles"
import WelcomeScreen from "./welcome-screen"
import MusicPlayer from "./music-player"

export type Stage = "welcome" | "candles" | "unwrapping" | "reveal"

export default function BirthdayExperience() {
  const [stage, setStage] = useState<Stage>("welcome")
  const [showParticles, setShowParticles] = useState(false)
  const [musicStarted, setMusicStarted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const handleStart = () => {
    setMusicStarted(true)
    setStage("candles")

    const audio = new Audio("https://soundbible.com/grab.php?id=421&type=mp3")
    audio.loop = true
    audio.volume = 0.7
    audioRef.current = audio
    audio.play().catch((err) => {
      console.log("[v0] Audio play failed:", err)
    })
  }

  const handleCandlesBlown = () => {
    setShowParticles(true)
    setTimeout(() => {
      setStage("unwrapping")
      setShowParticles(false)
    }, 1500)
  }

  const handleGiftUnwrapped = () => {
    setShowParticles(true)
    setTimeout(() => {
      setStage("reveal")
    }, 500)
  }

  const handleRestart = () => {
    setShowParticles(false)
    setStage("candles")
  }

  const toggleMusic = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play().catch(() => {})
      } else {
        audioRef.current.pause()
      }
    }
  }

  return (
    <main className="min-h-screen relative overflow-hidden bg-background">
      {musicStarted && stage !== "welcome" && <MusicPlayer audioRef={audioRef} onToggle={toggleMusic} />}

      {showParticles && <MagicParticles />}

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        {stage === "welcome" && <WelcomeScreen onStart={handleStart} />}
        {stage === "candles" && <CandleBlowing onComplete={handleCandlesBlown} />}
        {stage === "unwrapping" && <GiftUnwrapping onComplete={handleGiftUnwrapped} />}
        {stage === "reveal" && <FinalReveal onRestart={handleRestart} />}
      </div>
    </main>
  )
}
