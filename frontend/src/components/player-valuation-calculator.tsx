"use client"

import type React from "react"

import { useState, type FormEvent } from "react"
import { ShoppingBasketIcon as Basketball } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function PlayerValuationCalculator() {
  const [formData, setFormData] = useState({
    "Age": 25,
    "GP": 82,
    "TRB": 5,
    "AST": 5,
    "PTS": 15,
    "BLK": 1,
    "TS%": 0.55,
  })
  const [valuation, setValuation] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: Number.parseFloat(value) || 0,
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("https://nba-regression-service-24550290265.asia-southeast1.run.app/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to get valuation")
      }

      const result = await response.json()
      setValuation(result.predicted_salary)
      toast.success("Valuation Complete", {
        description: "Your player valuation has been calculated.",
      })
    } catch (error) {
      console.error("Error calculating valuation:", error)
      toast.error("Error", {
        description: "Failed to calculate valuation. Please try again.",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Basketball className="h-6 w-6" />
          Player Stats Valuation
        </CardTitle>
        <CardDescription>Enter your basketball stats to see your estimated NBA valuation</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="AGE">Age</Label>
              <Input
                id="AGE"
                name="AGE"
                type="number"
                placeholder="25"
                value={formData.Age}
                onChange={handleChange}
                min={18}
                max={45}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="GP">Games Played (GP)</Label>
              <Input
                id="GP"
                name="GP"
                type="number"
                placeholder="82"
                value={formData.GP}
                onChange={handleChange}
                min={1}
                max={82}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="TRB">Total Rebounds (TRB)</Label>
              <Input
                id="TRB"
                name="TRB"
                type="number"
                placeholder="5"
                value={formData.TRB}
                onChange={handleChange}
                step="0.1"
                min={0}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="AST">Assists (AST)</Label>
              <Input
                id="AST"
                name="AST"
                type="number"
                placeholder="5"
                value={formData.AST}
                onChange={handleChange}
                step="0.1"
                min={0}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="PTS">Points (PTS)</Label>
              <Input
                id="PTS"
                name="PTS"
                type="number"
                placeholder="15"
                value={formData.PTS}
                onChange={handleChange}
                step="0.1"
                min={0}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="BLK">Blocks (BLK)</Label>
              <Input
                id="BLK"
                name="BLK"
                type="number"
                placeholder="1"
                value={formData.BLK}
                onChange={handleChange}
                step="0.1"
                min={0}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="TS%">True Shooting % (TS%)</Label>
              <Input
                id="TS%"
                name="TS%"
                type="number"
                placeholder="0.55"
                value={formData["TS%"]}
                onChange={handleChange}
                step="0.01"
                min={0}
                max={1}
              />
              <p className="text-sm text-muted-foreground">Enter as a decimal between 0 and 1 (e.g., 0.55 for 55%)</p>
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Calculating..." : "Calculate Valuation"}
          </Button>
        </form>
      </CardContent>
      {valuation !== null && (
        <CardFooter className="flex flex-col">
          <div className="w-full p-4 bg-primary/10 rounded-lg text-center">
            <h3 className="text-lg font-medium mb-1">Estimated Valuation</h3>
            <p className="text-3xl font-bold">${valuation.toLocaleString()}</p>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}

