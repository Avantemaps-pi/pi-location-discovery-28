
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
  comingSoon?: boolean
}

interface PricingCardProps {
  tier: PricingTier
  paymentFrequency: string
  id?: string
  onSubscribe?: () => void
  isLoading?: boolean
  disabled?: boolean
}

export function PricingCard({ 
  tier, 
  paymentFrequency, 
  id,
  onSubscribe,
  isLoading,
  disabled
}: PricingCardProps) {
  const price = tier.price[paymentFrequency as keyof typeof tier.price]
  const isCustom = typeof price === "string"
  const isComingSoon = tier.comingSoon

  return (
    <div
      id={id}
      className={cn(
        "relative flex flex-col rounded-2xl bg-white p-8 shadow-sm",
        tier.highlighted && "bg-blue-50/50",
        tier.popular && "border-2 border-blue-500"
      )}
    >
      {tier.popular && (
        <div className="absolute -top-3 left-8 rounded-full bg-blue-500 px-3 py-1 text-xs font-semibold text-white">
          Most popular
        </div>
      )}

      {isComingSoon && (
        <div className="absolute inset-0 bg-gray-700/70 backdrop-blur-sm rounded-2xl flex items-center justify-center overflow-hidden z-10">
          <div className="absolute transform rotate-[-35deg] bg-secondary/90 py-2 px-1 w-[150%] text-center">
            <span className="text-white font-bold text-xl tracking-wider">Coming Soon</span>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">{tier.name}</h3>
          <p className="mt-2 text-gray-500">{tier.description}</p>
        </div>
        
        <div className="flex items-baseline">
          {!isCustom && <span className="text-3xl text-gray-900">π</span>}
          <span className="text-5xl font-bold tracking-tight text-gray-900">{price}</span>
          {!isCustom && paymentFrequency && (
            <span className="ml-1 text-base font-normal text-gray-500">
              /{paymentFrequency}
            </span>
          )}
        </div>

        <ul className="space-y-4">
          {tier.features.map((feature) => (
            <li key={feature} className="flex items-center gap-3">
              <Check className="h-5 w-5 flex-shrink-0 text-blue-500" />
              <span className="text-gray-600">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <Button
        className={cn(
          "mt-8 w-full text-base py-6",
          tier.highlighted && "bg-avante-purple hover:bg-avante-purple/90",
          tier.popular && "bg-blue-500 hover:bg-blue-600"
        )}
        onClick={onSubscribe}
        disabled={isLoading || disabled || isComingSoon}
      >
        {isLoading ? "Processing..." : tier.cta}
      </Button>
    </div>
  )
}
