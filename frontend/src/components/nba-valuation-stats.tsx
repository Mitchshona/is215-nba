import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { NBAPlayer } from "@/data/nba-api"
import { TrendingUp, TrendingDown, DollarSign, BarChart3 } from "lucide-react"

interface NBAValuationStatsProps {
  players: NBAPlayer[]
}

export function NBAValuationStats({ players }: NBAValuationStatsProps) {
  // Calculate stats
  const totalPlayers = players.length

  const undervaluedCount = players.filter((player) => player.valuationStatus === "undervalued").length
  const overvaluedCount = players.filter((player) => player.valuationStatus === "overvalued").length
  const fairValueCount = players.filter((player) => player.valuationStatus === "fair").length

  const undervaluedPercentage = totalPlayers > 0 ? Math.round((undervaluedCount / totalPlayers) * 100) : 0
  const overvaluedPercentage = totalPlayers > 0 ? Math.round((overvaluedCount / totalPlayers) * 100) : 0

  const totalMarketValue = players.reduce((sum, player) => sum + player.marketValue, 0)
  const totalPredictedValue = players.reduce((sum, player) => sum + player.predictedValue, 0)
  const valueDifference = totalPredictedValue - totalMarketValue
  const valueDifferencePercentage =
    totalMarketValue > 0 ? ((totalPredictedValue - totalMarketValue) / totalMarketValue) * 100 : 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Undervalued Players</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {undervaluedCount}{" "}
            <span className="text-sm font-normal text-muted-foreground">({undervaluedPercentage}%)</span>
          </div>
          <p className="text-xs text-muted-foreground">Players worth more than their contract</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overvalued Players</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {overvaluedCount}{" "}
            <span className="text-sm font-normal text-muted-foreground">({overvaluedPercentage}%)</span>
          </div>
          <p className="text-xs text-muted-foreground">Players worth less than their contract</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Value Difference</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${valueDifference > 0 ? "text-green-500" : valueDifference < 0 ? "text-red-500" : ""}`}
          >
            {valueDifference > 0 ? "+" : ""}
            {(valueDifference / 1000000).toFixed(1)}M
          </div>
          <p className="text-xs text-muted-foreground">
            {valueDifferencePercentage > 0 ? "+" : ""}
            {valueDifferencePercentage.toFixed(1)}% from contract value
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Value Distribution</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {fairValueCount} <span className="text-sm font-normal text-muted-foreground">Fair</span>
          </div>
          <p className="text-xs text-muted-foreground">
            {undervaluedCount} undervalued, {overvaluedCount} overvalued
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

