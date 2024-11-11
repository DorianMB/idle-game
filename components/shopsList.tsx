import React from "react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Shop } from "../types/Shop";

type ShopsListProps = {
  shops: Shop[];
  gold: number;
  onBuyShop: (index: number) => void;
};

export default function ShopsList({ shops, gold, onBuyShop }: ShopsListProps) {
  return (
    <Card className="bg-stone-800 border-amber-500 border-2">
      <CardHeader>
        <CardTitle className="text-xl text-amber-300">Shops</CardTitle>
      </CardHeader>
      <CardContent>
        {shops.map((shop, index) => (
          <div key={index} className="mb-2">
            <p>{shop.name} - Cost: {shop.cost} - Boost: {shop.boost}</p>
            <Button
              onClick={() => onBuyShop(index)}
              disabled={gold < shop.cost || !shop.unlocked}
              className="w-full bg-amber-600 hover:bg-amber-700 text-stone-900 mt-1"
            >
              Buy Shop
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
