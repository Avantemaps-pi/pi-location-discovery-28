
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
  children?: React.ReactNode // Add children as an optional prop
}

export function PricingSection({
  title,
  subtitle,
  tiers,
  frequencies,
  organizationTierId,
  onFrequencyChange,
  children, // Include children in the destructured props
}: PricingSectionProps) {
  const [selectedFrequency, setSelectedFrequency] = React.useState(frequencies[0])

  const handleFrequencyChange = (frequency: string) => {
    setSelectedFrequency(frequency)
    if (onFrequencyChange) {
      onFrequencyChange(frequency)
    }
  }

  // Filter to only include monthly and yearly frequencies
  const filteredFrequencies = frequencies.filter(freq => 
    freq === 'monthly' || freq === 'yearly'
  );

  return (
    <section className="flex flex-col items-center gap-10 py-10">
      {/* Render children before the header if provided */}
      {children}

      <PricingHeader
        title={title}
        subtitle={subtitle}
        frequencies={filteredFrequencies}
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
