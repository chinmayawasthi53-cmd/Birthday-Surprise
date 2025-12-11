"use client"

import { Heart, Star, Sparkles, Gift, Cake, PartyPopper } from "lucide-react"

const floatingItems = [
  { Icon: Heart, className: "text-primary top-[10%] left-[5%]", delay: "0s" },
  { Icon: Star, className: "text-accent top-[20%] right-[10%]", delay: "0.5s" },
  { Icon: Sparkles, className: "text-secondary-foreground top-[60%] left-[8%]", delay: "1s" },
  { Icon: Gift, className: "text-primary top-[70%] right-[5%]", delay: "1.5s" },
  { Icon: Cake, className: "text-accent top-[15%] left-[85%]", delay: "2s" },
  { Icon: PartyPopper, className: "text-primary top-[80%] left-[15%]", delay: "2.5s" },
  { Icon: Heart, className: "text-rose-400 top-[40%] right-[3%]", delay: "0.8s" },
  { Icon: Star, className: "text-yellow-500 top-[85%] right-[20%]", delay: "1.2s" },
]

export default function FloatingElements() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {floatingItems.map((item, index) => (
        <div key={index} className={`absolute animate-float ${item.className}`} style={{ animationDelay: item.delay }}>
          <item.Icon className="w-8 h-8 md:w-12 md:h-12 opacity-60" />
        </div>
      ))}
    </div>
  )
}
