
import React from "react"
import { Tab } from "@/components/ui/pricing-tab"

interface PricingHeaderProps {
  title: string
  subtitle: string
  frequencies: string[]
  selectedFrequency: string
  onFrequencyChange: (frequency: string) => void
}

export function PricingHeader({
  title,
  subtitle,
  frequencies,
  selectedFrequency,
  onFrequencyChange,
}: PricingHeaderProps) {
  return (
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
            setSelected={onFrequencyChange}
            discount={freq === "yearly"}
          />
        ))}
      </div>
    </div>
  )
}
