
import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"

export interface PricingTier {
  id: string
  name: string
  description: string
  price: {
    monthly: number | string
    yearly: number | string
  }
  features: string[]
  cta: string
  highlighted?: boolean
  popular?: boolean
}

interface PricingCardProps {
  tier: PricingTier
  paymentFrequency: string
}

export function PricingCard({ tier, paymentFrequency }: PricingCardProps) {
  const price = tier.price[paymentFrequency as keyof typeof tier.price]
  const isCustom = typeof price === "string"

  return (
    <div
      className={cn(
        "flex flex-col justify-between rounded-lg border bg-card p-6 text-card-foreground shadow",
        tier.highlighted &&
          "border-avante-purple bg-gradient-to-br from-avante-blue/10 to-avante-purple/20",
        tier.popular && "border-avante-blue"
      )}
    >
      {tier.popular && (
        <div className="mb-4 rounded-full bg-avante-blue/10 px-3 py-1 text-xs font-medium text-avante-blue w-fit">
          Most popular
        </div>
      )}

      <div>
        <h3 className="text-lg font-medium">{tier.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{tier.description}</p>
        <div className="mt-6 flex items-baseline gap-1">
          {!isCustom && <span className="text-3xl font-medium">π</span>}
          <span className="text-4xl font-bold">{price}</span>
          {!isCustom && (
            <span className="text-sm text-muted-foreground">/{paymentFrequency}</span>
          )}
        </div>
        {!isCustom && (
          <p className="mt-1 text-xs text-muted-foreground">
            (Tethered to ${price} USDT)
          </p>
        )}
      </div>

      <div className="mt-6 space-y-4">
        {tier.features.map((feature) => (
          <div key={feature} className="flex items-center gap-2">
            <Check className="h-4 w-4 text-avante-blue" />
            <span className="text-sm">{feature}</span>
          </div>
        ))}
      </div>

      <Button
        className={cn(
          "mt-8 w-full",
          tier.highlighted && "bg-avante-purple hover:bg-avante-purple/90",
          tier.popular && "bg-avante-blue hover:bg-avante-blue/90"
        )}
      >
        {tier.cta}
      </Button>
    </div>
  )
}
