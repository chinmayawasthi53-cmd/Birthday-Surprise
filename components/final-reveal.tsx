"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Heart, Sparkles, Star, Cake, PartyPopper, Gift } from "lucide-react"
import Confetti from "./confetti"

interface FinalRevealProps {
  onRestart: () => void
}

export default function FinalReveal({ onRestart }: FinalRevealProps) {
  const [stage, setStage] = useState(0)
  const [typedText, setTypedText] = useState("")
  const [showMessage, setShowMessage] = useState(false)
  const [showWishes, setShowWishes] = useState(false)
  const [hearts, setHearts] = useState<Array<{ id: number; x: number; delay: number }>>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const message =
    "Today is not just any day, it's the day the world was blessed with someone truly extraordinary. You bring light, laughter, and love to everyone around you. May this new chapter of your life be filled with endless happiness, beautiful adventures, and dreams coming true!"

  const russianMessage =
    "Сегодня не просто день, это день, когда мир получил кого-то по-настоящему особенного. Ты приносишь свет, смех и любовь всем вокруг. Пусть эта новая глава твоей жизни будет полна бесконечного счастья, прекрасных приключений и исполнения мечт!"

  const wishes = [
    {
      title: "Endless Dreams",
      text: "May every dream you dare to dream find its way to reality",
      ru: "Пусть каждая мечта станет реальностью",
    },
    {
      title: "Boundless Love",
      text: "May your heart overflow with love from those who cherish you",
      ru: "Пусть сердце переполняется любовью",
    },
    {
      title: "Magic & Wonder",
      text: "May every day bring magical moments that fill your soul with pure joy",
      ru: "Пусть каждый день будет волшебным",
    },
    {
      title: "Success & Joy",
      text: "May success follow you in everything you pursue",
      ru: "Пусть успех сопровождает тебя во всём",
    },
    {
      title: "Health & Happiness",
      text: "May you be blessed with health, happiness, and inner peace",
      ru: "Пусть здоровье и счастье будут с тобой",
    },
    {
      title: "Beautiful Moments",
      text: "May life gift you with moments that become cherished memories",
      ru: "Пусть жизнь дарит незабываемые моменты",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setHearts((prev) => [
        ...prev,
        {
          id: Date.now(),
          x: Math.random() * 100,
          delay: 0,
        },
      ])
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (hearts.length > 10) {
      setHearts((prev) => prev.slice(-10))
    }
  }, [hearts])

  useEffect(() => {
    const timer = setTimeout(() => setStage(1), 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (stage >= 1) {
      setTimeout(() => setShowMessage(true), 300)
    }
  }, [stage])

  useEffect(() => {
    if (!showMessage) return

    let i = 0
    const typing = setInterval(() => {
      if (i < message.length) {
        setTypedText(message.slice(0, i + 1))
        i++
      } else {
        clearInterval(typing)
        setTimeout(() => {
          setStage(2)
          setShowWishes(true)
        }, 600)
      }
    }, 20)

    return () => clearInterval(typing)
  }, [showMessage])

  return (
    <>
      <Confetti />

      {/* Floating hearts background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {hearts.map((heart) => (
          <div
            key={heart.id}
            className="absolute text-2xl animate-float opacity-20"
            style={{
              left: `${heart.x}%`,
              bottom: "-20px",
              animation: "float 8s ease-in-out forwards",
            }}
          >
            <Heart className="w-6 h-6 text-primary fill-primary" />
          </div>
        ))}
      </div>

      <div
        ref={containerRef}
        className="w-full max-w-3xl mx-auto px-4 py-8 space-y-8 overflow-y-auto max-h-[100dvh] relative z-10"
      >
        <div className="relative">
          <div
            className={`text-center transition-all duration-1000 ${stage >= 1 ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"}`}
          >
            <div className="flex justify-center gap-6 mb-6">
              <div className="p-3 rounded-full bg-pink-100 animate-bounce" style={{ animationDelay: "0s" }}>
                <Gift className="w-8 h-8 text-pink-500" />
              </div>
              <div className="p-3 rounded-full bg-amber-100 animate-bounce" style={{ animationDelay: "0.2s" }}>
                <Cake className="w-8 h-8 text-amber-500" />
              </div>
              <div className="p-3 rounded-full bg-fuchsia-100 animate-bounce" style={{ animationDelay: "0.4s" }}>
                <PartyPopper className="w-8 h-8 text-fuchsia-500" />
              </div>
            </div>

            <div className="relative inline-block">
              <div className="absolute -inset-8 bg-gradient-to-r from-primary/20 via-pink-500/20 to-amber-500/20 blur-3xl rounded-full" />

              <h1 className="relative text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-pink-500 to-amber-500 bg-clip-text text-transparent pb-2">
                Happy Birthday!
              </h1>
              <p className="text-2xl md:text-3xl text-muted-foreground font-light">С Днём Рождения!</p>

              <Sparkles className="absolute -top-4 -left-8 w-8 h-8 text-amber-400 animate-sparkle" />
              <Sparkles
                className="absolute -top-4 -right-8 w-8 h-8 text-pink-400 animate-sparkle"
                style={{ animationDelay: "0.5s" }}
              />
              <Star
                className="absolute -bottom-2 -left-6 w-6 h-6 text-primary animate-sparkle"
                style={{ animationDelay: "0.3s" }}
              />
              <Star
                className="absolute -bottom-2 -right-6 w-6 h-6 text-amber-400 animate-sparkle"
                style={{ animationDelay: "0.7s" }}
              />
            </div>
          </div>
        </div>

        {/* Main message card */}
        <div className={`transition-all duration-700 ${showMessage ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}>
          <Card className="relative overflow-hidden border-2 border-primary/20 shadow-2xl bg-gradient-to-br from-card via-card to-primary/5">
            <div className="absolute top-0 left-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent" />
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-pink-500/10 to-transparent" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-amber-500/10 to-transparent" />
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-primary/10 to-transparent" />

            <CardContent className="p-8 md:p-10 relative">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 mb-4">
                  <Heart className="w-4 h-4 text-primary fill-primary" />
                  <span className="text-sm font-medium text-primary">A Message From My Heart</span>
                  <Heart className="w-4 h-4 text-primary fill-primary" />
                </div>
                <h3 className="text-lg text-muted-foreground">Послание от всего сердца</h3>
              </div>

              <div className="min-h-[120px] mb-6">
                <p className="text-foreground text-lg md:text-xl leading-relaxed text-center">
                  {typedText}
                  {typedText.length < message.length && (
                    <span className="inline-block w-0.5 h-5 bg-primary animate-pulse ml-1" />
                  )}
                </p>
              </div>

              {stage >= 2 && (
                <div className="animate-bounce-in">
                  <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent mx-auto mb-4" />
                  <p className="text-muted-foreground text-base md:text-lg leading-relaxed text-center italic">
                    {russianMessage}
                  </p>
                </div>
              )}

              {stage >= 2 && (
                <div className="mt-8 text-center animate-bounce-in" style={{ animationDelay: "0.3s" }}>
                  <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 via-pink-500/10 to-amber-500/10 border border-primary/20">
                    <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                    <div>
                      <p className="font-semibold text-foreground">With endless love</p>
                      <p className="text-sm text-muted-foreground">С бесконечной любовью</p>
                    </div>
                    <Heart className="w-5 h-5 text-pink-500 fill-pink-500" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {showWishes && (
          <div
            className={`transition-all duration-700 ${showWishes ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <Card className="relative overflow-hidden border-2 border-amber-200/50 shadow-2xl bg-gradient-to-br from-card via-amber-50/30 to-card">
              {/* Decorative header stripe */}
              <div className="h-2 bg-gradient-to-r from-primary via-pink-500 to-amber-500" />

              <CardContent className="p-8 md:p-10">
                {/* Header with icon */}
                <div className="text-center mb-8">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-pink-500/10 to-amber-500/10 blur-xl rounded-full" />
                    <h2 className="relative text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-pink-500 to-amber-500 bg-clip-text text-transparent">
                      Wishing You a Year Full of Magic!
                    </h2>
                    <p className="text-muted-foreground mt-1">Желаю тебе год, полный волшебства!</p>
                  </div>
                  <p className="text-lg text-foreground font-medium">Wishing you a life full of happiness</p>
                  <p className="text-muted-foreground">and may all your dreams come true</p>
                  <p className="text-sm text-muted-foreground/80 italic mt-1">
                    Желаю тебе жизни полной счастья и пусть все твои мечты сбудутся
                  </p>
                </div>

                <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-primary/40 to-transparent mx-auto mb-8" />

                <h3 className="text-xl font-semibold text-center mb-6 text-foreground">My Wishes For You</h3>

                {/* Wishes as elegant paragraphs */}
                <div className="space-y-6">
                  {wishes.map((wish, index) => (
                    <div
                      key={index}
                      className="relative pl-6 border-l-2 border-primary/30 animate-bounce-in"
                      style={{ animationDelay: `${index * 0.15}s` }}
                    >
                      {/* Dot indicator */}
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gradient-to-br from-primary to-pink-500 shadow-md" />

                      <h4 className="font-bold text-lg text-foreground mb-1">{wish.title}</h4>
                      <p className="text-muted-foreground leading-relaxed">{wish.text}</p>
                      <p className="text-sm text-muted-foreground/70 italic mt-1">{wish.ru}</p>
                    </div>
                  ))}
                </div>

                {/* Footer decoration */}
                <div className="mt-8 pt-6 border-t border-primary/10 text-center">
                  <div className="flex justify-center items-center gap-4">
                    <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
                    <Sparkles className="w-6 h-6 text-primary" />
                    <Heart className="w-5 h-5 text-pink-400 fill-pink-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Final celebration card */}
        {showWishes && (
          <Card
            className="animate-bounce-in overflow-hidden border-2 border-primary/20"
            style={{ animationDelay: "1s" }}
          >
            <div className="h-1 bg-gradient-to-r from-primary via-pink-500 to-amber-500" />
            <CardContent className="p-8 text-center">
              <div className="flex justify-center gap-3 mb-4">
                {[Cake, Gift, PartyPopper, Sparkles, Heart].map((Icon, i) => {
                  const colors = [
                    "text-amber-500",
                    "text-pink-500",
                    "text-fuchsia-500",
                    "text-yellow-500",
                    "text-rose-500 fill-rose-500",
                  ]
                  return (
                    <div
                      key={i}
                      className={`p-2 rounded-full bg-muted/50 animate-bounce ${colors[i]}`}
                      style={{ animationDelay: `${i * 0.1}s` }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  )
                })}
              </div>

              {/* Personal Note Section */}
              <div className="mb-6 p-6 rounded-xl bg-gradient-to-br from-primary/5 via-pink-500/5 to-amber-500/5 border border-primary/10">
                <div className="flex justify-center mb-3">
                  <Heart className="w-6 h-6 text-pink-500 fill-pink-500 animate-pulse" />
                </div>
                <p className="text-foreground text-lg leading-relaxed mb-3">
                  This is a small surprise from my side. I hope you will like it.
                </p>
                <p className="text-foreground text-lg leading-relaxed mb-3">
                  I want next year to be there with you and give you actual surprise gifts on your special precious
                  birthday.
                </p>
                <p className="text-muted-foreground text-base italic">
                  Это маленький сюрприз от меня. Надеюсь, тебе понравится. В следующем году хочу быть рядом с тобой и
                  подарить настоящие подарки в твой особенный день рождения.
                </p>
              </div>

              <div className="relative">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Have the Most Amazing Birthday!</h2>
                <p className="text-lg text-muted-foreground">С самым прекрасным Днём Рождения!</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Restart button */}
        {showWishes && (
          <div className="text-center pb-8 animate-bounce-in" style={{ animationDelay: "1.2s" }}>
            <Button
              onClick={onRestart}
              variant="outline"
              size="lg"
              className="border-primary/30 hover:bg-primary/10 bg-card gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Experience Again / Ещё раз</span>
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
