"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Star, Heart, Flower2, Sun, Sparkles } from "lucide-react"

const wishes = [
  { icon: Star, text: "Успехов во всём!", color: "text-yellow-500" },
  { icon: Heart, text: "Любви и счастья!", color: "text-primary" },
  { icon: Flower2, text: "Красоты и здоровья!", color: "text-pink-400" },
  { icon: Sun, text: "Солнечных дней!", color: "text-amber-500" },
  { icon: Sparkles, text: "Волшебных моментов!", color: "text-accent" },
]

export default function WishesSection() {
  return (
    <Card className="bg-card/90 backdrop-blur-sm border-2 border-accent/20 shadow-xl">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold text-center mb-6 text-foreground">✨ Мои пожелания тебе ✨</h3>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {wishes.map((wish, index) => (
            <div
              key={index}
              className="flex flex-col items-center p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors animate-bounce-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <wish.icon className={`w-8 h-8 ${wish.color} mb-2`} />
              <span className="text-sm text-center text-muted-foreground font-medium">{wish.text}</span>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-2xl md:text-3xl">🎉🎁🎈🎀🌟</p>
          <p className="mt-4 text-muted-foreground italic">"Пусть этот год будет самым лучшим!"</p>
        </div>
      </CardContent>
    </Card>
  )
}
