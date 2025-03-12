"use client"

import { useState } from "react"
import { Search, Filter, ArrowUpDown, RefreshCw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { NBAPlayerValuationTable } from "@/components/nba-player-valuation-table"
import { NBAPlayerValuationCard } from "@/components/nba-player-valuation-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NBAValuationStats } from "@/components/nba-valuation-stats"
import { type NBAPlayer, nbaPlayers } from "@/data/nba-players"

export function NBAPlayerValuationDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [position, setPosition] = useState<string>("all")
  const [team, setTeam] = useState<string>("all")
  const [valuationStatus, setValuationStatus] = useState<string>("all")
  const [sortBy, setSortBy] = useState<keyof NBAPlayer | "valueDifference" | "valueDifferencePercent">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [isLoading, setIsLoading] = useState(false)

  // Get unique teams and positions for filters
  const teams = Array.from(new Set(nbaPlayers.map((player) => player.team)))
  const positions = Array.from(new Set(nbaPlayers.map((player) => player.position)))

  // Filter players based on search query and filters
  const filteredPlayers = nbaPlayers.filter((player) => {
    const matchesSearch = player.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPosition = position === "all" || player.position === position
    const matchesTeam = team === "all" || player.team === team
    const matchesValuation = valuationStatus === "all" || player.valuationStatus === valuationStatus
    return matchesSearch && matchesPosition && matchesTeam && matchesValuation
  })

  // Sort players
  const sortedPlayers = [...filteredPlayers].sort((a, b) => {
    if (sortBy === "valueDifference") {
      const aValue = a.predictedValue - a.marketValue
      const bValue = b.predictedValue - b.marketValue
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue
    } else if (sortBy === "valueDifferencePercent") {
      const aValue = ((a.predictedValue - a.marketValue) / a.marketValue) * 100
      const bValue = ((b.predictedValue - b.marketValue) / b.marketValue) * 100
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue
    } else if (typeof a[sortBy] === "number" && typeof b[sortBy] === "number") {
      return sortOrder === "asc"
        ? (a[sortBy] as number) - (b[sortBy] as number)
        : (b[sortBy] as number) - (a[sortBy] as number)
    } else {
      const aValue = String(a[sortBy]).toLowerCase()
      const bValue = String(b[sortBy]).toLowerCase()
      return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }
  })

  const handleSort = (column: keyof NBAPlayer | "valueDifference" | "valueDifferencePercent") => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };
  

  const handleRefresh = () => {
    setIsLoading(true)
    // Simulate data refresh
    setTimeout(() => {
      setIsLoading(false)
    }, 800)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">NBA Player Valuation Dashboard</h1>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <NBAValuationStats players={filteredPlayers} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search players..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={position} onValueChange={setPosition}>
              <SelectTrigger>
                <SelectValue placeholder="Position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                {positions.map((pos) => (
                  <SelectItem key={pos} value={pos}>
                    {pos}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={team} onValueChange={setTeam}>
              <SelectTrigger>
                <SelectValue placeholder="Team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teams</SelectItem>
                {teams.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={valuationStatus} onValueChange={setValuationStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Valuation Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Valuations</SelectItem>
                <SelectItem value="undervalued">Undervalued</SelectItem>
                <SelectItem value="overvalued">Overvalued</SelectItem>
                <SelectItem value="fair">Fair Value</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <Select
            value={`${String(sortBy)}-${sortOrder}`}
            onValueChange={(value) => {
              const [column, order] = value.split("-")
              setSortBy(column as keyof NBAPlayer)
              setSortOrder(order as "asc" | "desc")
            }}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="marketValue-desc">Contract Value (High-Low)</SelectItem>
              <SelectItem value="marketValue-asc">Contract Value (Low-High)</SelectItem>
              <SelectItem value="predictedValue-desc">Predicted Value (High-Low)</SelectItem>
              <SelectItem value="predictedValue-asc">Predicted Value (Low-High)</SelectItem>
              <SelectItem value="valueDifference-desc">Value Difference (High-Low)</SelectItem>
              <SelectItem value="valueDifference-asc">Value Difference (Low-High)</SelectItem>
              <SelectItem value="ppg-desc">PPG (High-Low)</SelectItem>
              <SelectItem value="ppg-asc">PPG (Low-High)</SelectItem>
              <SelectItem value="age-asc">Age (Young-Old)</SelectItem>
              <SelectItem value="age-desc">Age (Old-Young)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs defaultValue="table" className="w-full">
          <TabsList className="grid w-[200px] grid-cols-2">
            <TabsTrigger value="table">Table</TabsTrigger>
            <TabsTrigger value="cards">Cards</TabsTrigger>
          </TabsList>
          <TabsContent value="table" className="mt-4">
            <NBAPlayerValuationTable
              players={sortedPlayers}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
            />
          </TabsContent>
          <TabsContent value="cards" className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sortedPlayers.map((player) => (
                <NBAPlayerValuationCard key={player.id} player={player} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

