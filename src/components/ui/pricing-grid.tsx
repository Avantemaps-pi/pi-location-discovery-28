
import React from "react"
import { PricingCard, type PricingTier } from "@/components/ui/pricing-card"

interface PricingGridProps {
  tiers: (PricingTier & {
    onSubscribe?: () => void
    isLoading?: boolean
    disabled?: boolean
  })[]
  paymentFrequency: string
  organizationTierId?: string
}

export function PricingGrid({
  tiers,
  paymentFrequency,
  organizationTierId,
}: PricingGridProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-3 lg:gap-6">
      {tiers.map((tier) => (
        <PricingCard
          key={tier.name}
          tier={tier}
          paymentFrequency={paymentFrequency}
          id={tier.id === organizationTierId ? `tier-${tier.id}` : undefined}
          onSubscribe={tier.onSubscribe}
          isLoading={tier.isLoading}
          disabled={tier.disabled}
        />
      ))}
    </div>
  )
}
