import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';
import { Apple } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type Props = { title: string, items: any[], onBuy: (index: number) => void, money: number }

export default function BuyCard({ title, items, onBuy, money }: Props) {

    const multiply = 1

    return (
        <Card className='bg-stone-800 border-amber-500 border-2 rounded-lg mt-2'>
            <CardHeader>
                <CardTitle className="text-xl text-amber-300">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                {items.map((item, index) => (
                    <div key={index} className="flex justify-center items-center p-2 rounded mb-[40px]">
                        <div className='scale-[1.7] p-3 bg-stone-800 border-amber-500 border-[1px] rounded-lg relative'>
                            <Apple />
                            {
                                item.hasOwnProperty('owned') &&
                                <div className='badge-count rounded-lg'>{item.owned}</div>
                            }
                        </div>
                        <div className='w-3/4 flex flex-col ps-5'>
                            <div className='flex justify-around items-center bg-stone-700 border-amber-500 h-[40px] rounded-lg'>
                                {
                                    item.gain &&
                                    <span>génère {Math.floor(item.gain * item.owned)} gold/s</span>
                                }
                                {
                                    item.boost &&
                                    <span>boost {Math.floor(item.boost * item.owned * 100)}% </span>
                                }
                                <span className={item.purchased ? 'line-through' : ''}>prix : {item.cost} {item.hasOwnProperty('purchased') ? 'prestige' : 'gold'}</span>
                            </div>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button onClick={() => onBuy(index)} disabled={!item.unlocked || item.cost > money || item.purchased} className="bg-amber-600 hover:bg-amber-700 text-stone-900 rounded-lg">
                                            Buy x{multiply} {item.name}
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side='bottom'>
                                        <p>{item.tooltip}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
