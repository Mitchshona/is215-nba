// Define the API response type based on the sample data
export interface NBAPlayerAPIResponse {
    count: number
    data: {
      AST: number
      Age: number
      BLK: number
      Diff: number
      GP: number
      PLAYER: string
      PTS: number
      Predicted_Salary: number
      Salary: number
      TEAM: string
      TRB: number
      "TS%": number
      Valuation: string
    }[]
  }
  
  // Define the transformed player type that matches our application's expected format
  export interface NBAPlayer {
    id: string
    name: string
    team: string
    position: string // We'll use a placeholder since it's not in the API
    age: number
    ppg: number // Points per game (PTS)
    rpg: number // Rebounds per game (TRB)
    apg: number // Assists per game (AST)
    bpg: number // Blocks per game (BLK)
    gp: number // Games played
    ts: number // True shooting percentage
    marketValue: number // Current salary
    predictedValue: number // Predicted salary
    valuationStatus: "undervalued" | "overvalued" | "fair"
    avatar: string // We'll generate a placeholder
    skills: string[] // We'll use basic skills based on stats
  }
  
  // Function to fetch NBA player data from the API
  export async function fetchNBAPlayerData(): Promise<NBAPlayer[]> {
    try {
      const response = await fetch("https://nba-regression-service-24550290265.asia-southeast1.run.app/allplayers")
  
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`)
      }
  
      const data: NBAPlayerAPIResponse = await response.json()
  
      // Transform the API data to match our application's expected format
      return data.data.map((player, index) => {
        return {
          id: `player-${index}`,
          name: player.PLAYER,
          team: player.TEAM,
          position: "N/A", // Not provided in the API
          age: player.Age,
          ppg: player.PTS,
          rpg: player.TRB,
          apg: player.AST,
          bpg: player.BLK,
          gp: player.GP,
          ts: player["TS%"],
          marketValue: player.Salary,
          predictedValue: player.Predicted_Salary,
          valuationStatus: getValuationStatus(player.Valuation),
          avatar: `/placeholder.svg?height=40&width=40&text=${player.PLAYER.substring(0, 2)}`,
          skills: getBasicSkills(player.PTS, player.AST, player.TRB),
        }
      })
    } catch (error) {
      console.error("Error fetching NBA player data:", error)
      return []
    }
  }
  
  // Helper function to convert the API valuation status to our application's format
  function getValuationStatus(valuation: string): "undervalued" | "overvalued" | "fair" {
    if (valuation === "Undervalued") return "undervalued"
    if (valuation === "Overvalued") return "overvalued"
    return "fair"
  }
  
  // Simple function to generate basic skills
  function getBasicSkills(pts: number, ast: number, reb: number): string[] {
    const skills: string[] = []
  
    if (pts > 20) skills.push("Scorer")
    if (ast > 5) skills.push("Playmaker")
    if (reb > 7) skills.push("Rebounder")
  
    if (skills.length === 0) {
      skills.push("Role Player")
    }
  
    return skills
  }
  
  