
"use client"

import * as React from "react"
import { type PricingTier } from "@/components/ui/pricing-card"
import { PricingHeader } from "@/components/ui/pricing-header"
import { PricingGrid } from "@/components/ui/pricing-grid"
import { PricingFooter } from "@/components/ui/pricing-footer"

interface PricingSectionProps {
  title: string
  subtitle: string
  tiers: (PricingTier & {
    onSubscribe?: () => void
    isLoading?: boolean
    disabled?: boolean
  })[]
  frequencies: string[]
  organizationTierId?: string
  onFrequencyChange?: (frequency: string) => void
}

export function PricingSection({
  title,
  subtitle,
  tiers,
  frequencies,
  organizationTierId,
  onFrequencyChange,
}: PricingSectionProps) {
  // Only use the first two frequencies (monthly and yearly)
  const limitedFrequencies = frequencies.slice(0, 2);
  const [selectedFrequency, setSelectedFrequency] = React.useState(limitedFrequencies[0])

  const handleFrequencyChange = (frequency: string) => {
    setSelectedFrequency(frequency)
    if (onFrequencyChange) {
      onFrequencyChange(frequency)
    }
  }

  return (
    <section className="flex flex-col items-center gap-10 py-10">
      <PricingHeader
        title={title}
        subtitle={subtitle}
        frequencies={limitedFrequencies}
        selectedFrequency={selectedFrequency}
        onFrequencyChange={handleFrequencyChange}
      />

      <PricingGrid
        tiers={tiers}
        paymentFrequency={selectedFrequency}
        organizationTierId={organizationTierId}
      />

      <PricingFooter />
    </section>
  )
}
