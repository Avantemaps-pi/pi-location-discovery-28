
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
  const [selectedFrequency, setSelectedFrequency] = React.useState(frequencies[0])

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
        frequencies={frequencies}
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
