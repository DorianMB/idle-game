// ItemList.js
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"

type Item = {
    name: string;
    cost: number;
    gain: number;
    owned: number;
    unlocked: boolean;
  }

type Props = { items: Item[], onBuyItem: (index: number) => void, gold: number }

export default function ItemList({ items, onBuyItem, gold }: Props) {
  return (
    <Card className="bg-stone-800 border-amber-500 border-2">
      <CardHeader>
        <CardTitle className="text-xl text-amber-300">Adventuring Gear</CardTitle>
      </CardHeader>
      <CardContent>
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center p-2 bg-stone-900 rounded mb-2">
            <span>{item.name} - Cost: {item.cost} - Gain: {item.gain} - Owned: {item.owned}</span>
            <Button onClick={() => onBuyItem(index)} disabled={!item.unlocked || item.cost > gold} className="bg-amber-600 hover:bg-amber-700 text-stone-900">
              Buy
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
