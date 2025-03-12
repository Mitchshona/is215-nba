"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { ChevronUp, ChevronDown, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { useState } from "react"
import type { NBAPlayer } from "@/data/nba-players"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface NBAPlayerValuationTableProps {
    players: NBAPlayer[];
    sortBy: keyof NBAPlayer | "valueDifference" | "valueDifferencePercent"; // Allowing valueDifference and valueDifferencePercent
    sortOrder: "asc" | "desc";
    onSort: (column: keyof NBAPlayer | "valueDifference" | "valueDifferencePercent") => void;
}
  
export function NBAPlayerValuationTable({ players, sortBy, sortOrder, onSort }: NBAPlayerValuationTableProps) {
  const [page, setPage] = useState(1)
  const playersPerPage = 10

  const startIndex = (page - 1) * playersPerPage
  const paginatedPlayers = players.slice(startIndex, startIndex + playersPerPage)
  const totalPages = Math.ceil(players.length / playersPerPage)

  const renderSortIcon = (column: keyof NBAPlayer | "valueDifference" | "valueDifferencePercent") => {
    if (sortBy !== column) return null
    return sortOrder === "asc" ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
  }

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`
    } else {
      return `$${value}`
    }
  }

  const getValueDifferenceColor = (player: NBAPlayer) => {
    const diff = player.predictedValue - player.marketValue
    const diffPercent = (diff / player.marketValue) * 100

    if (diffPercent > 15) return "text-green-600"
    if (diffPercent < -15) return "text-red-600"
    if (diffPercent > 5) return "text-green-500"
    if (diffPercent < -5) return "text-red-500"
    return "text-amber-500"
  }

  const getValueDifferenceIcon = (player: NBAPlayer) => {
    const diff = player.predictedValue - player.marketValue
    const diffPercent = (diff / player.marketValue) * 100

    if (diffPercent > 5) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (diffPercent < -5) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-amber-500" />
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Player</TableHead>
              <TableHead className="cursor-pointer" onClick={() => onSort("name")}>
                <div className="flex items-center">Name {renderSortIcon("name")}</div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => onSort("position")}>
                <div className="flex items-center">Pos {renderSortIcon("position")}</div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => onSort("team")}>
                <div className="flex items-center">Team {renderSortIcon("team")}</div>
              </TableHead>
              <TableHead className="cursor-pointer text-right" onClick={() => onSort("ppg")}>
                <div className="flex items-center justify-end">PPG {renderSortIcon("ppg")}</div>
              </TableHead>
              <TableHead className="cursor-pointer text-right" onClick={() => onSort("rpg")}>
                <div className="flex items-center justify-end">RPG {renderSortIcon("rpg")}</div>
              </TableHead>
              <TableHead className="cursor-pointer text-right" onClick={() => onSort("apg")}>
                <div className="flex items-center justify-end">APG {renderSortIcon("apg")}</div>
              </TableHead>
              <TableHead className="cursor-pointer text-right" onClick={() => onSort("marketValue")}>
                <div className="flex items-center justify-end">Contract {renderSortIcon("marketValue")}</div>
              </TableHead>
              <TableHead className="cursor-pointer text-right" onClick={() => onSort("predictedValue")}>
                <div className="flex items-center justify-end">Predicted {renderSortIcon("predictedValue")}</div>
              </TableHead>
              <TableHead className="cursor-pointer text-right" onClick={() => onSort("valueDifference")}>
                <div className="flex items-center justify-end">Diff {renderSortIcon("valueDifference")}</div>
              </TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPlayers.length > 0 ? (
              paginatedPlayers.map((player) => {
                const valueDiff = player.predictedValue - player.marketValue
                const valueDiffPercent = (valueDiff / player.marketValue) * 100

                return (
                  <TableRow key={player.id}>
                    <TableCell>
                      <Avatar>
                        <AvatarImage src={player.avatar} alt={player.name} />
                        <AvatarFallback>{player.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{player.name}</TableCell>
                    <TableCell>{player.position}</TableCell>
                    <TableCell>{player.team}</TableCell>
                    <TableCell className="text-right">{player.ppg.toFixed(1)}</TableCell>
                    <TableCell className="text-right">{player.rpg.toFixed(1)}</TableCell>
                    <TableCell className="text-right">{player.apg.toFixed(1)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(player.marketValue)}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(player.predictedValue)}</TableCell>
                    <TableCell className="text-right">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              className={`flex items-center justify-end font-semibold ${getValueDifferenceColor(player)}`}
                            >
                              {getValueDifferenceIcon(player)}
                              <span className="ml-1">
                                {valueDiff >= 0 ? "+" : ""}
                                {formatCurrency(valueDiff)} ({valueDiffPercent >= 0 ? "+" : ""}
                                {valueDiffPercent.toFixed(1)}%)
                              </span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {player.valuationStatus === "undervalued"
                                ? "This player is undervalued based on our model"
                                : player.valuationStatus === "overvalued"
                                  ? "This player is overvalued based on our model"
                                  : "This player is fairly valued based on our model"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={player.valuationStatus === "undervalued"
                          ? "success"
                          : player.valuationStatus === "overvalued"
                            ? "destructive"
                            : "outline"}
                      >
                        {player.valuationStatus === "undervalued"
                          ? "Undervalued"
                          : player.valuationStatus === "overvalued"
                            ? "Overvalued"
                            : "Fair Value"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                  No players found matching your criteria
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {players.length > playersPerPage && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Show pages around the current page
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (page <= 3) {
                pageNum = i + 1
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = page - 2 + i
              }

              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink onClick={() => setPage(pageNum)} isActive={page === pageNum}>
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              )
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
