import { Apple } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type Props = { title: string, items: any[], onBuy: (index: number) => void, gold: number, config: any }

export default function BuyCard({ title, items, onBuy, gold, config }: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl text-amber-300">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {items.map((item, index) => (
                    <div key={index} className="flex justify-start items-center p-2 bg-stone-900 rounded mb-2">
                        <div className='scale-[1.7] p-3'><Apple /></div>
                        <div className='w-3/4 flex flex-col ps-5'>
                            <div className='bg-stone-800 border-amber-500 border-2'>TEST</div>
                            <Button onClick={() => onBuy(index)} disabled={!item.unlocked || item.cost > gold} className="bg-amber-600 hover:bg-amber-700 text-stone-900">
                                Buy
                            </Button>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
