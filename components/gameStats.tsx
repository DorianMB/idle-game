// GameStats.js
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress"

type Props = { gold: number, reputation: number, salesCount: number, prestigePoints: number, currentEvent: string | null, eventTimer: number }

export default function GameStats({ gold, reputation, salesCount, prestigePoints, currentEvent, eventTimer }: Props) {
  return (
    <Card className="mb-4 bg-stone-800 border-amber-500 border-2">
      <CardHeader>
        <CardTitle className="text-3xl text-amber-300">Merchant's Guild of the Realm</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-4 mb-4">
          <p className="text-lg font-semibold text-amber-200">Gold: {Math.floor(gold)}</p>
          <p className="text-lg font-semibold text-amber-200">Reputation: {reputation}</p>
          <p className="text-lg font-semibold text-amber-200">Sales: {salesCount}</p>
          <p className="text-lg font-semibold text-amber-200">Prestige Points: {prestigePoints}</p>
        </div>
        {currentEvent && (
          <div className="mb-4 p-2 bg-amber-900 rounded">
            <p className="text-lg font-semibold">{currentEvent}</p>
            <Progress value={(eventTimer / 300) * 100} className="mt-2" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
