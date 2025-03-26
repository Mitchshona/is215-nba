import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { type NBAPlayer, fetchNBAPlayerData } from "@/data/nba-api";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface NBAPlayerValuationCardProps {
  player: NBAPlayer;
}

export function NBAPlayerValuationCard({
  player,
}: NBAPlayerValuationCardProps) {
  const valueDiff = player.predictedValue - player.marketValue;
  const valueDiffPercent = (valueDiff / player.marketValue) * 100;

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    } else {
      return `$${value}`;
    }
  };

  const getValueDifferenceColor = () => {
    if (valueDiffPercent > 15) return "text-green-600";
    if (valueDiffPercent < -15) return "text-red-600";
    if (valueDiffPercent > 5) return "text-green-500";
    if (valueDiffPercent < -5) return "text-red-500";
    return "text-amber-500";
  };

  const getValueDifferenceIcon = () => {
    if (valueDiffPercent > 5)
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (valueDiffPercent < -5)
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-amber-500" />;
  };

  const getProgressValue = () => {
    // Calculate how close the market value is to the predicted value
    // 100% means market value = predicted value
    const ratio = player.marketValue / player.predictedValue;
    return Math.min(Math.max(ratio * 100, 0), 200);
  };

  const getProgressColor = () => {
    if (valueDiffPercent > 15) return "bg-green-600";
    if (valueDiffPercent < -15) return "bg-red-600";
    if (valueDiffPercent > 5) return "bg-green-500";
    if (valueDiffPercent < -5) return "bg-red-500";
    return "bg-amber-500";
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="p-4 pb-0 flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={player.avatar} alt={player.name} />
            <AvatarFallback>{player.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">{player.name}</h3>
            <p className="text-sm text-muted-foreground">
              {player.position} • {player.team}
            </p>
          </div>
        </div>
        <Badge
          variant={
            player.valuationStatus === "undervalued"
              ? "success"
              : player.valuationStatus === "overvalued"
              ? "destructive"
              : "outline"
          }
          className={
            player.valuationStatus === "overvalued"
              ? "text-white bg-red-600"
              : ""
          }
        >
          {player.valuationStatus === "undervalued"
            ? "Undervalued"
            : player.valuationStatus === "overvalued"
            ? "Overvalued"
            : "Fair Value"}
        </Badge>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">PPG</span>
            <span className="font-medium">{player.ppg.toFixed(1)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">RPG</span>
            <span className="font-medium">{player.rpg.toFixed(1)}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">APG</span>
            <span className="font-medium">{player.apg.toFixed(1)}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Contract Value
            </span>
            <span className="font-medium">
              {formatCurrency(player.marketValue)}/yr
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Predicted Value
            </span>
            <span className="font-medium">
              {formatCurrency(player.predictedValue)}/yr
            </span>
          </div>

          <Progress
            value={getProgressValue()}
            className="h-2"
            indicatorClassName={getProgressColor()}
          />

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Difference</span>
            <div
              className={`flex items-center font-semibold ${getValueDifferenceColor()}`}
            >
              {getValueDifferenceIcon()}
              <span className="ml-1">
                {valueDiff >= 0 ? "+" : ""}
                {formatCurrency(valueDiff)} ({valueDiffPercent >= 0 ? "+" : ""}
                {valueDiffPercent.toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <div className="flex space-x-1">
          {player.skills.slice(0, 2).map((skill, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>
        <div className="text-sm text-muted-foreground">Age: {player.age}</div>
      </CardFooter>
    </Card>
  );
}
