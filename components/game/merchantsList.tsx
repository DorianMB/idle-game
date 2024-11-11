import { Merchant } from "../../types/Merchant";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type MerchantsListProps = {
  merchants: Merchant[];
  gold: number;
  onBuyMerchant: (index: number) => void;
};

export default function MerchantsList({ merchants, gold, onBuyMerchant }: MerchantsListProps) {
  return (
    <Card className="bg-stone-800 border-amber-500 border-2">
      <CardHeader>
        <CardTitle className="text-xl text-amber-300">Merchants</CardTitle>
      </CardHeader>
      <CardContent>
        {merchants.map((merchant, index) => (
          <div key={index} className="mb-2">
            <p>{merchant.name} - Cost: {merchant.cost} - Boost: {merchant.boost}</p>
            <Button
              onClick={() => onBuyMerchant(index)}
              disabled={gold < merchant.cost || !merchant.unlocked}
              className="w-full bg-amber-600 hover:bg-amber-700 text-stone-900 mt-1"
            >
              Buy Merchant
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
