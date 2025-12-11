"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Heart, Cake, PartyPopper } from "lucide-react"

export default function BirthdayMessage() {
  return (
    <Card className="bg-card/95 backdrop-blur-sm border-2 border-primary/20 shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 p-4">
        <div className="flex items-center justify-center gap-3">
          <PartyPopper className="w-6 h-6 text-primary" />
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Дорогая подруга!</h2>
          <PartyPopper className="w-6 h-6 text-primary scale-x-[-1]" />
        </div>
      </div>

      <CardContent className="p-6 md:p-10">
        <div className="text-center mb-8">
          <Cake className="w-16 h-16 mx-auto text-primary mb-4" />
        </div>

        <div className="space-y-4 text-foreground text-center leading-relaxed">
          <p className="text-lg md:text-xl">🌸 Поздравляю тебя с Днём Рождения! 🌸</p>

          <p className="text-muted-foreground">
            Желаю тебе счастья, здоровья и любви! Пусть каждый день приносит радость и улыбки.
          </p>

          <p className="text-muted-foreground">Ты замечательный человек, и я так рада, что ты есть в моей жизни!</p>

          <div className="py-4">
            <div className="flex justify-center gap-1">
              {[...Array(7)].map((_, i) => (
                <Heart
                  key={i}
                  className="w-6 h-6 text-primary animate-heart-beat"
                  style={{ animationDelay: `${i * 0.1}s` }}
                  fill="currentColor"
                />
              ))}
            </div>
          </div>

          <p className="text-lg font-medium text-foreground">С любовью и наилучшими пожеланиями! 💕</p>
        </div>
      </CardContent>
    </Card>
  )
}
