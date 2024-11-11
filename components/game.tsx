'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Rocket, Users, Zap, Globe, Mouse } from 'lucide-react';

export default function Game() {
  const [resources, setResources] = useState(100);
  const [energy, setEnergy] = useState(0);
  const [scientists, setScientists] = useState(1);
  const [explorers, setExplorers] = useState(0);
  const [solarPanels, setSolarPanels] = useState(0);
  const [exploredPlanets, setExploredPlanets] = useState(0);
  const [currentMission, setCurrentMission] = useState<String | null>(null);
  const [missionProgress, setMissionProgress] = useState(0);
  const [clickPower, setClickPower] = useState(1);

  const SCIENTIST_COST = 50;
  const EXPLORER_COST = 100;
  const SOLAR_PANEL_COST = 75;
  const CLICK_UPGRADE_COST = 200;

  useEffect(() => {
    const timer = setInterval(() => {
      setResources((prev) => prev + scientists);
      setEnergy((prev) => Math.min(prev + solarPanels, 100));

      if (currentMission) {
        setMissionProgress((prev) => {
          if (prev >= 100) {
            setExploredPlanets((prevPlanets) => prevPlanets + 1);
            setCurrentMission(null);
            return 0;
          }
          return prev + explorers;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [scientists, solarPanels, explorers, currentMission]);

  const handleClick = () => {
    setResources((prev) => prev + clickPower);
  };

  const hireScientist = () => {
    if (resources >= SCIENTIST_COST) {
      setResources((prev) => prev - SCIENTIST_COST);
      setScientists((prev) => prev + 1);
    }
  };

  const hireExplorer = () => {
    if (resources >= EXPLORER_COST) {
      setResources((prev) => prev - EXPLORER_COST);
      setExplorers((prev) => prev + 1);
    }
  };

  const buildSolarPanel = () => {
    if (resources >= SOLAR_PANEL_COST) {
      setResources((prev) => prev - SOLAR_PANEL_COST);
      setSolarPanels((prev) => prev + 1);
    }
  };

  const upgradeClickPower = () => {
    if (resources >= CLICK_UPGRADE_COST) {
      setResources((prev) => prev - CLICK_UPGRADE_COST);
      setClickPower((prev) => prev + 1);
    }
  };

  const startMission = () => {
    if (energy >= 50 && explorers > 0 && !currentMission) {
      setEnergy((prev) => prev - 50);
      setCurrentMission('Exploring new planet');
      setMissionProgress(0);
    }
  };

  return (
    <TooltipProvider>
      <div className="container mx-auto p-4 bg-gray-900 text-blue-100 min-h-screen">
        <Card className="mb-4 bg-gray-800 border-blue-500 border-2">
          <CardHeader>
            <CardTitle className="text-2xl text-blue-300">
              Galactic Exploration Command
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-lg font-semibold text-blue-200">
                  Resources: {resources}
                </p>
                <p className="text-sm text-blue-300">+{scientists}/s</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-blue-200">
                  Energy: {energy}/100
                </p>
                <Progress value={energy} className="w-full bg-blue-900" />
              </div>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={handleClick}
                  className="w-full mb-4 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Mouse className="mr-2 h-4 w-4" /> Generate Resources (+
                  {clickPower})
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Click to generate resources. Upgrade to increase click power.
                </p>
              </TooltipContent>
            </Tooltip>
            <div className="grid grid-cols-2 gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={hireScientist}
                    disabled={resources < SCIENTIST_COST}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Users className="mr-2 h-4 w-4" /> Hire Scientist (
                    {SCIENTIST_COST})
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Scientists generate resources automatically.</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={hireExplorer}
                    disabled={resources < EXPLORER_COST}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Rocket className="mr-2 h-4 w-4" /> Hire Explorer (
                    {EXPLORER_COST})
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Explorers are needed for space missions.</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={buildSolarPanel}
                    disabled={resources < SOLAR_PANEL_COST}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    <Zap className="mr-2 h-4 w-4" /> Build Solar Panel (
                    {SOLAR_PANEL_COST})
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Solar panels generate energy for missions.</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={upgradeClickPower}
                    disabled={resources < CLICK_UPGRADE_COST}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Mouse className="mr-2 h-4 w-4" /> Upgrade Click Power (
                    {CLICK_UPGRADE_COST})
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Increase the resources generated per click.</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-gray-800 border-blue-500 border-2">
            <CardHeader>
              <CardTitle className="text-xl text-blue-300">
                Base Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="text-blue-100">
              <p>Scientists: {scientists}</p>
              <p>Explorers: {explorers}</p>
              <p>Solar Panels: {solarPanels}</p>
              <p>Planets Explored: {exploredPlanets}</p>
              <p>Click Power: {clickPower}</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-blue-500 border-2">
            <CardHeader>
              <CardTitle className="text-xl text-blue-300">
                Space Missions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentMission ? (
                <div>
                  <p className="text-blue-200">{currentMission}</p>
                  <Progress
                    value={missionProgress}
                    className="w-full mt-2 bg-blue-900"
                  />
                </div>
              ) : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={startMission}
                      disabled={energy < 50 || explorers === 0}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      <Globe className="mr-2 h-4 w-4" /> Launch Exploration
                      Mission
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Start a mission to explore new planets. Requires 50 energy
                      and at least 1 explorer.
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
