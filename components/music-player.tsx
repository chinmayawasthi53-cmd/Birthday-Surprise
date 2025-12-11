"use client"

import { useState, useEffect, type MutableRefObject } from "react"
import { Volume2, VolumeX } from "lucide-react"

interface MusicPlayerProps {
  audioRef: MutableRefObject<HTMLAudioElement | null>
  onToggle: () => void
}

export default function MusicPlayer({ audioRef, onToggle }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    audio.addEventListener("play", handlePlay)
    audio.addEventListener("pause", handlePause)

    // Check initial state
    setIsPlaying(!audio.paused)

    return () => {
      audio.removeEventListener("play", handlePlay)
      audio.removeEventListener("pause", handlePause)
    }
  }, [audioRef])

  return (
    <button
      onClick={onToggle}
      className="fixed top-4 right-4 z-50 p-3 rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-lg hover:bg-background transition-colors"
      aria-label={isPlaying ? "Mute music" : "Unmute music"}
    >
      {isPlaying ? <Volume2 className="w-5 h-5 text-primary" /> : <VolumeX className="w-5 h-5 text-muted-foreground" />}
    </button>
  )
}
