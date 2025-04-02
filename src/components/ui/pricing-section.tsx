
"use client"

import * as React from "react"
import { PricingCard, type PricingTier } from "@/components/ui/pricing-card"
import { Tab } from "@/components/ui/pricing-tab"

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
      <div className="space-y-7 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-medium md:text-5xl">{title}</h1>
          <p className="text-muted-foreground">{subtitle}</p>
        </div>
        <div className="mx-auto flex w-fit rounded-full bg-muted p-1">
          {frequencies.map((freq) => (
            <Tab
              key={freq}
              text={freq}
              selected={selectedFrequency === freq}
              setSelected={handleFrequencyChange}
              discount={freq === "yearly"}
            />
          ))}
        </div>
      </div>

      <div className="grid w-full max-w-6xl gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {tiers.map((tier) => (
          <PricingCard
            key={tier.name}
            tier={tier}
            paymentFrequency={selectedFrequency}
            id={tier.id === organizationTierId ? `tier-${tier.id}` : undefined}
            onSubscribe={tier.onSubscribe}
            isLoading={tier.isLoading}
            disabled={tier.disabled}
          />
        ))}
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>All prices are in Pi cryptocurrency</p>
        <p className="mt-1">Save 20% with yearly billing</p>
      </div>
    </section>
  )
}
