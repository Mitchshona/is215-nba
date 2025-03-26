import { PlayerValuationCalculator } from "@/components/player-valuation-calculator"

export default function ValuationCalculator() {
  return (
    <main className="min-h-screen bg-background p-6">
      <h1 className="text-3xl font-bold mb-6">NBA Player Valuation Calculator</h1>
      <PlayerValuationCalculator />
    </main>
  )
}

