"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Mic } from "lucide-react"

interface CandleBlowingProps {
  onComplete: () => void
}

export default function CandleBlowing({ onComplete }: CandleBlowingProps) {
  const [candlesLit, setCandlesLit] = useState([true, true, true, true, true])
  const [isListening, setIsListening] = useState(false)
  const [micPermission, setMicPermission] = useState<"granted" | "denied" | "prompt">("prompt")
  const [blowIntensity, setBlowIntensity] = useState(0)
  const [showInstructions, setShowInstructions] = useState(true)
  const [allBlownOut, setAllBlownOut] = useState(false)

  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const micStreamRef = useRef<MediaStream | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const lastBlowTimeRef = useRef<number>(0)
  const candlesLitRef = useRef(candlesLit)
  const consecutiveBlowFramesRef = useRef<number>(0)

  const litCount = candlesLit.filter(Boolean).length

  const blowOutCandle = useCallback(() => {
    const now = Date.now()
    // Prevent blowing out too fast - at least 400ms between each candle
    if (now - lastBlowTimeRef.current < 400) return

    setCandlesLit((prev) => {
      const firstLit = prev.findIndex((lit) => lit)
      if (firstLit === -1) return prev
      const newCandles = [...prev]
      newCandles[firstLit] = false
      lastBlowTimeRef.current = now

      if (newCandles.every((lit) => !lit)) {
        setAllBlownOut(true)
      }

      return newCandles
    })
  }, [])

  const analyzeAudio = useCallback(() => {
    if (!analyserRef.current) return

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    analyserRef.current.getByteFrequencyData(dataArray)

    const timeData = new Uint8Array(analyserRef.current.fftSize)
    analyserRef.current.getByteTimeDomainData(timeData)

    // Calculate RMS (root mean square) of the signal - better for detecting breath
    let sum = 0
    for (let i = 0; i < timeData.length; i++) {
      const normalized = (timeData[i] - 128) / 128
      sum += normalized * normalized
    }
    const rms = Math.sqrt(sum / timeData.length)

    // Also check frequency distribution - blowing has more low frequency energy
    const lowFreqEnd = Math.floor(dataArray.length * 0.2)
    const lowFreqData = dataArray.slice(0, lowFreqEnd)
    const lowFreqAvg = lowFreqData.reduce((a, b) => a + b, 0) / lowFreqData.length / 255

    // Combine RMS and low frequency for better detection
    const intensity = Math.min(1, (rms * 3 + lowFreqAvg) / 2)
    setBlowIntensity(intensity)

    const blowThreshold = 0.35

    if (intensity > blowThreshold && candlesLitRef.current.some((lit) => lit)) {
      consecutiveBlowFramesRef.current++
      if (consecutiveBlowFramesRef.current >= 5) {
        blowOutCandle()
        consecutiveBlowFramesRef.current = 0
      }
    } else {
      // Reset counter if intensity drops
      consecutiveBlowFramesRef.current = 0
    }

    if (!candlesLitRef.current.every((lit) => !lit)) {
      animationFrameRef.current = requestAnimationFrame(analyzeAudio)
    }
  }, [blowOutCandle])

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: true,
          autoGainControl: false,
          channelCount: 1,
          sampleRate: 44100,
        },
      })

      micStreamRef.current = stream
      setMicPermission("granted")
      setShowInstructions(false)

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      audioContextRef.current = audioContext

      const analyser = audioContext.createAnalyser()
      analyser.fftSize = 1024
      analyser.smoothingTimeConstant = 0.2
      analyser.minDecibels = -90
      analyser.maxDecibels = -10
      analyserRef.current = analyser

      const source = audioContext.createMediaStreamSource(stream)
      source.connect(analyser)

      setIsListening(true)
      animationFrameRef.current = requestAnimationFrame(analyzeAudio)
    } catch (err) {
      console.log("[v0] Microphone permission denied:", err)
      setMicPermission("denied")
    }
  }

  const stopListening = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop())
      micStreamRef.current = null
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close()
    }
    audioContextRef.current = null
    analyserRef.current = null
    setIsListening(false)
  }, [])

  useEffect(() => {
    candlesLitRef.current = candlesLit
  }, [candlesLit])

  useEffect(() => {
    if (allBlownOut) {
      stopListening()
      const timer = setTimeout(onComplete, 1500)
      return () => clearTimeout(timer)
    }
  }, [allBlownOut, onComplete, stopListening])

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop())
      }
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close()
      }
    }
  }, [])

  return (
    <Card className="bg-card/95 backdrop-blur-sm border-2 border-primary/20 shadow-2xl w-full max-w-lg">
      <CardContent className="p-6 md:p-8 text-center">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Happy Birthday!</h1>
          <p className="text-lg text-muted-foreground mt-1">С Днём Рождения!</p>
        </div>

        <div className="relative select-none mx-auto mb-8 flex flex-col items-center">
          {/* Wind effect when blowing */}
          {blowIntensity > 0.2 && (
            <div className="absolute inset-0 pointer-events-none z-10">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute h-0.5 bg-gradient-to-r from-sky-300/60 to-transparent rounded-full"
                  style={{
                    top: `${10 + i * 12}%`,
                    left: "0%",
                    width: `${60 + blowIntensity * 40}%`,
                    opacity: blowIntensity,
                    animation: "wind 0.3s ease-out infinite",
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Candles container */}
          <div className="flex justify-center gap-5 mb-1 relative z-20">
            {candlesLit.map((lit, i) => (
              <div key={i} className="relative flex flex-col items-center">
                {/* Flame */}
                {lit && (
                  <div className="relative mb-1">
                    <div
                      className="relative transition-transform duration-100"
                      style={{
                        transform:
                          blowIntensity > 0.15
                            ? `rotate(${35 + blowIntensity * 40 + i * 5}deg) scaleY(${1 - blowIntensity * 0.5})`
                            : "rotate(0deg)",
                        transformOrigin: "bottom center",
                      }}
                    >
                      {/* Outer glow */}
                      <div
                        className="absolute -inset-3 bg-yellow-400/40 rounded-full blur-lg"
                        style={{ animation: "pulse 0.5s ease-in-out infinite" }}
                      />
                      {/* Main flame */}
                      <div
                        className="w-4 h-8 bg-gradient-to-t from-orange-500 via-yellow-400 to-yellow-100 rounded-full relative"
                        style={{
                          animation: "flicker 0.15s ease-in-out infinite alternate",
                          clipPath: "ellipse(50% 100% at 50% 100%)",
                        }}
                      >
                        {/* Inner blue core */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-4 bg-gradient-to-t from-blue-500 to-yellow-300 rounded-full" />
                      </div>
                    </div>
                  </div>
                )}
                {/* Smoke when blown out */}
                {!lit && (
                  <div className="h-9 relative">
                    {[...Array(3)].map((_, j) => (
                      <div
                        key={j}
                        className="absolute bottom-0 w-1 h-4 bg-muted-foreground/20 rounded-full animate-smoke"
                        style={{
                          left: `${-2 + j * 4}px`,
                          animationDelay: `${j * 0.15}s`,
                        }}
                      />
                    ))}
                  </div>
                )}
                {/* Wick */}
                <div className="w-0.5 h-2 bg-gray-700 rounded-full" />
                {/* Candle stick with stripes */}
                <div className="w-3 h-10 rounded-sm overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-pink-200 via-pink-300 to-pink-400" />
                  {/* Candle stripes */}
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="absolute w-full h-1 bg-white/40" style={{ top: `${j * 20 + 10}%` }} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Beautiful layered cake */}
          <div className="relative mt-2">
            {/* Top frosting with swirls */}
            <div className="relative">
              <div className="w-44 h-6 bg-gradient-to-b from-rose-100 to-rose-200 rounded-t-2xl mx-auto relative overflow-hidden shadow-inner">
                {/* Frosting swirl decorations */}
                <div className="absolute top-1 left-3 w-4 h-4 bg-rose-300/50 rounded-full" />
                <div className="absolute top-1 left-10 w-3 h-3 bg-rose-300/50 rounded-full" />
                <div className="absolute top-1 right-3 w-4 h-4 bg-rose-300/50 rounded-full" />
                <div className="absolute top-1 right-10 w-3 h-3 bg-rose-300/50 rounded-full" />
                {/* Sprinkles */}
                <div className="absolute top-2 left-6 w-1.5 h-1.5 bg-red-400 rounded-full" />
                <div className="absolute top-3 left-14 w-1.5 h-1.5 bg-blue-400 rounded-full" />
                <div className="absolute top-2 right-6 w-1.5 h-1.5 bg-green-400 rounded-full" />
                <div className="absolute top-3 right-14 w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                <div className="absolute top-2 left-20 w-1.5 h-1.5 bg-purple-400 rounded-full" />
              </div>
            </div>

            {/* Cream drips */}
            <div className="relative w-48 mx-auto -mt-1">
              <div className="absolute -top-1 left-2 w-3 h-5 bg-gradient-to-b from-rose-100 to-rose-200 rounded-b-full" />
              <div className="absolute -top-1 left-8 w-2 h-7 bg-gradient-to-b from-rose-100 to-rose-200 rounded-b-full" />
              <div className="absolute -top-1 left-16 w-3 h-4 bg-gradient-to-b from-rose-100 to-rose-200 rounded-b-full" />
              <div className="absolute -top-1 right-2 w-3 h-6 bg-gradient-to-b from-rose-100 to-rose-200 rounded-b-full" />
              <div className="absolute -top-1 right-10 w-2 h-8 bg-gradient-to-b from-rose-100 to-rose-200 rounded-b-full" />
              <div className="absolute -top-1 right-18 w-3 h-5 bg-gradient-to-b from-rose-100 to-rose-200 rounded-b-full" />
            </div>

            {/* Top cake layer */}
            <div className="w-48 h-12 bg-gradient-to-b from-pink-300 to-pink-400 mx-auto relative shadow-md">
              {/* Layer decoration line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-pink-200/50" />
            </div>

            {/* Middle frosting layer */}
            <div className="w-56 h-3 bg-gradient-to-b from-rose-200 to-rose-300 mx-auto rounded-sm relative">
              {/* Small drips */}
              <div className="absolute -bottom-2 left-4 w-2 h-3 bg-rose-200 rounded-b-full" />
              <div className="absolute -bottom-3 left-12 w-2 h-4 bg-rose-200 rounded-b-full" />
              <div className="absolute -bottom-2 right-4 w-2 h-3 bg-rose-200 rounded-b-full" />
              <div className="absolute -bottom-4 right-14 w-2 h-5 bg-rose-200 rounded-b-full" />
            </div>

            {/* Bottom cake layer */}
            <div className="w-56 h-14 bg-gradient-to-b from-pink-400 to-pink-500 mx-auto relative shadow-md">
              {/* Decorative dots around the layer */}
              <div className="absolute top-3 left-2 w-2 h-2 bg-rose-200 rounded-full" />
              <div className="absolute top-3 left-8 w-2 h-2 bg-rose-200 rounded-full" />
              <div className="absolute top-3 left-14 w-2 h-2 bg-rose-200 rounded-full" />
              <div className="absolute top-3 right-2 w-2 h-2 bg-rose-200 rounded-full" />
              <div className="absolute top-3 right-8 w-2 h-2 bg-rose-200 rounded-full" />
              <div className="absolute top-3 right-14 w-2 h-2 bg-rose-200 rounded-full" />
              {/* Bottom trim */}
              <div className="absolute bottom-0 left-0 right-0 h-2 bg-pink-600/50 rounded-b-lg" />
            </div>

            {/* Cake base/bottom frosting */}
            <div className="w-60 h-2 bg-gradient-to-b from-pink-500 to-pink-600 mx-auto rounded-b-lg shadow-md" />

            {/* Cake plate */}
            <div className="w-72 h-4 bg-gradient-to-b from-slate-200 to-slate-300 mx-auto rounded-full mt-1 shadow-lg relative">
              <div className="absolute inset-x-4 top-1 h-1 bg-white/50 rounded-full" />
            </div>
          </div>
        </div>

        {/* Microphone controls */}
        <div className="mt-4">
          {litCount > 0 ? (
            <>
              {/* Intensity meter */}
              {isListening && (
                <div className="mb-4">
                  <div className="h-2 w-48 mx-auto bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 transition-all duration-75"
                      style={{ width: `${Math.min(blowIntensity * 150, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Blow strength</p>
                </div>
              )}

              {!isListening ? (
                <div className="space-y-4">
                  {showInstructions && (
                    <div className="bg-primary/10 rounded-lg p-4 mb-4">
                      <p className="text-sm text-foreground font-medium mb-1">
                        Close your eyes, make a wish, then blow near your microphone!
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Закрой глаза, загадай желание, и подуй в микрофон!
                      </p>
                    </div>
                  )}

                  <button
                    onClick={startListening}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
                  >
                    <Mic className="w-5 h-5" />
                    <span>I made my wish! Let me blow</span>
                  </button>

                  {micPermission === "denied" && (
                    <p className="text-sm text-destructive mt-2">
                      Microphone access denied. Please allow microphone access in your browser settings.
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2 text-primary">
                    <Mic className="w-5 h-5 animate-pulse" />
                    <span className="font-medium">Listening... Blow now!</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {litCount} candle{litCount > 1 ? "s" : ""} remaining
                  </p>
                  <p className="text-xs text-muted-foreground">Blow gently and steadily near your microphone</p>
                </div>
              )}
            </>
          ) : (
            <div className="animate-bounce">
              <p className="text-xl font-semibold text-primary">Your wish will come true!</p>
              <p className="text-muted-foreground">Твоё желание сбудется!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
