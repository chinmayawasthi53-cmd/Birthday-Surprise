"use client"

import { useState } from "react"
import { Heart, Sparkles, Gift } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import BirthdayMessage from "./birthday-message"
import WishesSection from "./wishes-section"

export default function BirthdayCard() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!isOpen ? (
        <Card className="bg-card/90 backdrop-blur-sm border-2 border-primary/20 shadow-2xl animate-bounce-in">
          <CardContent className="p-8 md:p-12 text-center">
            <div className="mb-6">
              <span className="text-6xl md:text-8xl animate-heart-beat inline-block">🎂</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 text-balance">С Днём Рождения!</h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-2">Happy Birthday!</p>

            <div className="flex justify-center gap-2 my-6">
              {[...Array(5)].map((_, i) => (
                <Sparkles
                  key={i}
                  className="w-5 h-5 text-accent animate-sparkle"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>

            <p className="text-muted-foreground mb-8 text-pretty">
              У тебя есть особенный сюрприз! ✨
              <br />
              <span className="text-sm">You have a special surprise!</span>
            </p>

            <Button
              onClick={() => setIsOpen(true)}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              <Gift className="w-5 h-5 mr-2" />
              Открыть подарок
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6 animate-bounce-in">
          <BirthdayMessage />
          <WishesSection />

          <div className="text-center">
            <Button
              onClick={() => setIsOpen(false)}
              variant="outline"
              className="border-primary/30 hover:bg-primary/10"
            >
              <Heart className="w-4 h-4 mr-2 text-primary" />
              Ещё раз!
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
