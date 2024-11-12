import { Upgrade } from "../../types/Upgrade";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type UpgradesListProps = {
  upgrades: Upgrade[];
  gold: number;
  onBuyUpgrade: (index: number) => void;
};

export default function UpgradesList({ upgrades, gold, onBuyUpgrade }: UpgradesListProps) {
  return (
    <Card className="bg-stone-800 border-amber-500 border-2">
      <CardHeader>
        <CardTitle className="text-xl text-amber-300">Upgrades</CardTitle>
      </CardHeader>
      <CardContent>
        {upgrades.map((upgrade, index) => (
          <div key={index} className="mb-2">
            <p>{upgrade.name} - Cost: {upgrade.cost} - Effect: {upgrade.tooltip}</p>
            <Button
              onClick={() => onBuyUpgrade(index)}
              disabled={gold < upgrade.cost || !upgrade.unlocked || upgrade.purchased}
              className="w-full bg-amber-600 hover:bg-amber-700 text-stone-900 mt-1"
            >
              {upgrade.purchased ? "Purchased" : "Buy Upgrade"}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
