
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
  children?: React.ReactNode
}

export function PricingSection({
  title,
  subtitle,
  tiers,
  frequencies,
  organizationTierId,
  onFrequencyChange,
  children,
}: PricingSectionProps) {
  const [selectedFrequency, setSelectedFrequency] = React.useState(frequencies[0])

  const handleFrequencyChange = (frequency: string) => {
    setSelectedFrequency(frequency)
    if (onFrequencyChange) {
      onFrequencyChange(frequency)
    }
  }

  const filteredFrequencies = frequencies.filter(freq => 
    freq === 'monthly' || freq === 'yearly'
  )

  return (
    <section className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="space-y-12">
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
      </div>
    </section>
  )
}
