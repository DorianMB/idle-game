// GameActions.js
import { Coins, Download, RefreshCw, Upload } from 'lucide-react';
import React from "react";
import { Button } from "../components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";

type Props = { manualSale: () => void, importSave: () => void, exportSave: () => void, resetGame: () => void }

export default function GameActions({ manualSale, importSave, exportSave, resetGame }: Props) {
  return (
    <TooltipProvider>
      <div className="grid grid-cols-4 gap-2 mb-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={manualSale} className="w-full bg-amber-600 hover:bg-amber-700 text-stone-900">
              <Coins className="mr-2 h-4 w-4" /> Make a Sale
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Manually sell items from your inventory</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={importSave} className="w-full bg-green-600 hover:bg-green-700 text-stone-900">
              <Upload className="mr-2 h-4 w-4" /> Import Save
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Import a saved game file</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={exportSave} className="w-full bg-blue-600 hover:bg-blue-700 text-stone-900">
              <Download className="mr-2 h-4 w-4" /> Export Save
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Download your current game progress</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button onClick={resetGame} className="w-full bg-red-600 hover:bg-red-700 text-stone-900">
              <RefreshCw className="mr-2 h-4 w-4" /> Reset Game
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Start a new game from scratch</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
