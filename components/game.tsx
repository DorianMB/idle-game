'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Coins, Users, Building2, Award, TrendingUp, Sword, Shield, Beaker, Target, Shirt, Download, Upload, RefreshCw } from 'lucide-react'

type Item = {
  name: string;
  cost: number;
  gain: number;
  owned: number;
  unlocked: boolean;
}

type Merchant = {
  name: string;
  cost: number;
  boost: number;
  owned: number;
  unlocked: boolean;
}

type Shop = {
  name: string;
  cost: number;
  boost: number;
  owned: number;
  unlocked: boolean;
}

type Upgrade = {
  name: string;
  cost: number;
  effect: string;
  unlocked: boolean;
  purchased: boolean;
}

export default function Game() {
  const [gold, setGold] = useState(100)
  const [reputation, setReputation] = useState(0)
  const [salesCount, setSalesCount] = useState(0)
  const [prestigePoints, setPrestigePoints] = useState(0)
  const [items, setItems] = useState<Item[]>([
    { name: "Iron Sword", cost: 10, gain: 1, owned: 0, unlocked: true },
    { name: "Wooden Shield", cost: 15, gain: 2, owned: 0, unlocked: false },
    { name: "Healing Potion", cost: 20, gain: 3, owned: 0, unlocked: false },
    { name: "Oak Bow", cost: 25, gain: 4, owned: 0, unlocked: false },
    { name: "Leather Armor", cost: 30, gain: 5, owned: 0, unlocked: false },
  ])
  const [merchants, setMerchants] = useState<Merchant[]>([
    { name: "Apprentice Merchant", cost: 50, boost: 0.1, owned: 0, unlocked: false },
    { name: "Experienced Merchant", cost: 100, boost: 0.2, owned: 0, unlocked: false },
    { name: "Master Merchant", cost: 200, boost: 0.3, owned: 0, unlocked: false },
  ])
  const [shops, setShops] = useState<Shop[]>([
    { name: "Village Shop", cost: 100, boost: 0.05, owned: 0, unlocked: false },
    { name: "City Shop", cost: 200, boost: 0.1, owned: 0, unlocked: false },
    { name: "Capital Shop", cost: 500, boost: 0.2, owned: 0, unlocked: false },
  ])
  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    { name: "Advertising", cost: 300, effect: "Increases shop traffic by 10%", unlocked: false, purchased: false },
    { name: "Partnerships", cost: 1000, effect: "Increases earnings by 15% for each sale", unlocked: false, purchased: false },
    { name: "Merchant Training", cost: 1500, effect: "Increases merchant efficiency by 20%", unlocked: false, purchased: false },
  ])
  const [currentEvent, setCurrentEvent] = useState<string | null>(null)
  const [eventTimer, setEventTimer] = useState(0)
  const [stopSave, setStopSave] = useState(true)

  useEffect(() => {
    const timer = setInterval(() => {
      generateSales()
      checkUnlocks()
      handleEvents()
    }, 1000)

    return () => clearInterval(timer)
  }, [items, merchants, shops, upgrades, currentEvent, eventTimer])

  useEffect(() => {
    // Load saved data from localStorage when the component mounts
    const savedData = localStorage.getItem('dungeonMerchantSave')
    setStopSave(true)
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      setGold(parsedData.gold)
      setReputation(parsedData.reputation)
      setSalesCount(parsedData.salesCount)
      setPrestigePoints(parsedData.prestigePoints)
      setItems(parsedData.items)
      setMerchants(parsedData.merchants)
      setShops(parsedData.shops)
      setUpgrades(parsedData.upgrades)
      setCurrentEvent(parsedData.currentEvent)
      setEventTimer(parsedData.eventTimer)
    }
    setStopSave(false)
  }, [])

  useEffect(() => {
    // Save data to localStorage whenever the game state changes
    const saveData = {
      gold,
      reputation,
      salesCount,
      prestigePoints,
      items,
      merchants,
      shops,
      upgrades,
      currentEvent,
      eventTimer
    }
    if (!stopSave) {
      localStorage.setItem('dungeonMerchantSave', JSON.stringify(saveData))
    } 
  }, [gold, reputation, salesCount, prestigePoints, items, merchants, shops, upgrades, currentEvent, eventTimer])

  const generateSales = () => {
    let totalGain = 0
    let totalReputation = 0
    const merchantBoost = merchants.reduce((acc, merchant) => acc + merchant.boost * merchant.owned, 1)
    const shopBoost = shops.reduce((acc, shop) => acc + shop.boost * shop.owned, 1)

    items.forEach(item => {
      const itemSales = Math.floor(Math.random() * item.owned)
      totalGain += item.gain * itemSales * merchantBoost * shopBoost
      totalReputation += itemSales
    })

    if (upgrades[1].purchased) totalGain *= 1.15 // Partnerships upgrade
    if (currentEvent === 'Trade Fair') totalGain *= 2
    if (currentEvent === 'Bandit Attack') totalGain *= 0.5

    setGold(prev => prev + totalGain)
    setReputation(prev => prev + totalReputation)
    setSalesCount(prev => prev + totalReputation)
  }

  const checkUnlocks = () => {
    if (salesCount >= 1 && items[0].owned >= 1) {
      setItems(prev => prev.map((item) => item ? { ...item, unlocked: true } : item))
      setMerchants(prev => prev.map((merchant) => merchant ? { ...merchant, unlocked: true } : merchant))
      setShops(prev => prev.map((shop) => shop ? { ...shop, unlocked: true } : shop))
    }
    if (salesCount >= 500 && !upgrades[0].unlocked) {
      setUpgrades(prev => prev.map((upgrade, index) => index === 0 ? { ...upgrade, unlocked: true } : upgrade))
    }
    if (salesCount >= 1000 && !upgrades[1].unlocked) {
      setUpgrades(prev => prev.map((upgrade, index) => index === 1 ? { ...upgrade, unlocked: true } : upgrade))
    }
    if (salesCount >= 1500 && !upgrades[2].unlocked) {
      setUpgrades(prev => prev.map((upgrade, index) => index === 2 ? { ...upgrade, unlocked: true } : upgrade))
    }
  }

  const handleEvents = () => {
    if (currentEvent) {
      setEventTimer(prev => {
        if (prev <= 1) {
          setCurrentEvent(null)
          return 0
        }
        return prev - 1
      })
    } else if (salesCount >= 200 && Math.random() < 0.01) {
      setCurrentEvent(Math.random() < 0.5 ? 'Trade Fair' : 'Bandit Attack')
      setEventTimer(300) // 5 minutes
    }
  }

  const buyItem = (index: number) => {
    const item = items[index]
    if (gold >= item.cost) {
      setGold(prev => prev - item.cost)
      setItems(prev => prev.map((i, idx) => idx === index ? { ...i, owned: i.owned + 1 } : i))
    }
  }

  const buyMerchant = (index: number) => {
    const merchant = merchants[index]
    if (gold >= merchant.cost) {
      setGold(prev => prev - merchant.cost)
      setMerchants(prev => prev.map((m, idx) => idx === index ? { ...m, owned: m.owned + 1 } : m))
    }
  }

  const buyShop = (index: number) => {
    const shop = shops[index]
    if (gold >= shop.cost) {
      setGold(prev => prev - shop.cost)
      setShops(prev => prev.map((s, idx) => idx === index ? { ...s, owned: s.owned + 1 } : s))
    }
  }

  const buyUpgrade = (index: number) => {
    const upgrade = upgrades[index]
    if (gold >= upgrade.cost && upgrade.unlocked && !upgrade.purchased) {
      setGold(prev => prev - upgrade.cost)
      setUpgrades(prev => prev.map((u, idx) => idx === index ? { ...u, purchased: true } : u))
    }
  }

  const manualSale = () => {
    let totalGain = 0;
    let totalReputation = 0;
    const merchantBoost = merchants.reduce((acc, merchant) => acc + merchant.boost * merchant.owned, 1);
    const shopBoost = shops.reduce((acc, shop) => acc + shop.boost * shop.owned, 1);

    items.forEach(item => {
      if (item.owned > 0) {
        totalGain += item.gain * merchantBoost * shopBoost;
        totalReputation += 1;
      }
    });

    if (upgrades[1].purchased) totalGain *= 1.15; // Partnerships upgrade
    if (currentEvent === 'Trade Fair') totalGain *= 2;
    if (currentEvent === 'Bandit Attack') totalGain *= 0.5;

    setGold(prev => prev + totalGain);
    setReputation(prev => prev + totalReputation);
    setSalesCount(prev => prev + totalReputation);
  };

  const importSave = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (event) => {
      const file = (event.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const contents = e.target?.result as string
          const parsedData = JSON.parse(contents)
          setGold(parsedData.gold)
          setReputation(parsedData.reputation)
          setSalesCount(parsedData.salesCount)
          setPrestigePoints(parsedData.prestigePoints)
          setItems(parsedData.items)
          setMerchants(parsedData.merchants)
          setShops(parsedData.shops)
          setUpgrades(parsedData.upgrades)
          setCurrentEvent(parsedData.currentEvent)
          setEventTimer(parsedData.eventTimer)
        }
        reader.readAsText(file)
      }
    }
    input.click()
  }

  const exportSave = () => {
    const saveData = {
      gold,
      reputation,
      salesCount,
      prestigePoints,
      items,
      merchants,
      shops,
      upgrades,
      currentEvent,
      eventTimer
    }
    const dataStr = JSON.stringify(saveData)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = 'dungeon_merchant_save.json'

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const resetGame = () => {
    setGold(100)
    setReputation(0)
    setSalesCount(0)
    setPrestigePoints(0)
    setCurrentEvent(null)
    setEventTimer(0)
    setItems([
      { name: "Iron Sword", cost: 10, gain: 1, owned: 0, unlocked: true },
      { name: "Wooden Shield", cost: 15, gain: 2, owned: 0, unlocked: false },
      { name: "Healing Potion", cost: 20, gain: 3, owned: 0, unlocked: false },
      { name: "Oak Bow", cost: 25, gain: 4, owned: 0, unlocked: false },
      { name: "Leather Armor", cost: 30, gain: 5, owned: 0, unlocked: false },
    ])
    setMerchants([
      { name: "Apprentice Merchant", cost: 50, boost: 0.1, owned: 0, unlocked: false },
      { name: "Experienced Merchant", cost: 100, boost: 0.2, owned: 0, unlocked: false },
      { name: "Master Merchant", cost: 200, boost: 0.3, owned: 0, unlocked: false },
    ])
    setShops([
      { name: "Village Shop", cost: 100, boost: 0.05, owned: 0, unlocked: false },
      { name: "City Shop", cost: 200, boost: 0.1, owned: 0, unlocked: false },
      { name: "Capital Shop", cost: 500, boost: 0.2, owned: 0, unlocked: false },
    ])
    setUpgrades([
      { name: "Advertising", cost: 300, effect: "Increases shop traffic by 10%", unlocked: false, purchased: false },
      { name: "Partnerships", cost: 1000, effect: "Increases earnings by 15% for each sale", unlocked: false, purchased: false },
      { name: "Merchant Training", cost: 1500, effect: "Increases merchant efficiency by 20%", unlocked: false, purchased: false },
    ])
  }

  return (
    <TooltipProvider>
      <div className="container mx-auto p-4 bg-stone-900 text-amber-100 min-h-screen font-serif">
        <Card className="mb-4 bg-stone-800 border-amber-500 border-2">
          <CardHeader>
            <CardTitle className="text-3xl text-amber-300">Merchant's Guild of the Realm</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-lg font-semibold text-amber-200">Gold: {Math.floor(gold)}</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-amber-200">Reputation: {reputation}</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-amber-200">Prestige Points: {prestigePoints}</p>
              </div>
            </div>
            {currentEvent && (
              <div className="mb-4 p-2 bg-amber-900 rounded">
                <p className="text-lg font-semibold">{currentEvent}</p>
                <Progress value={(eventTimer / 300) * 100} className="mt-2" />
              </div>
            )}
            <div className="grid grid-cols-4 gap-2 mb-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    onClick={manualSale} 
                    className="w-full bg-amber-600 hover:bg-amber-700 text-stone-900"
                  >
                    <Coins className="mr-2 h-4 w-4" /> Make a Sale
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Manually sell items from your inventory</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    onClick={importSave} 
                    className="w-full bg-green-600 hover:bg-green-700 text-stone-900"
                  >
                    <Upload className="mr-2 h-4 w-4" /> Import Save
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Import a saved game file</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    onClick={exportSave} 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-stone-900"
                  >
                    <Download className="mr-2 h-4 w-4" /> Export Save
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download your current game progress</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    onClick={resetGame} 
                    className="w-full bg-red-600 hover:bg-red-700 text-stone-900"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" /> Reset Game
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Start a new game from scratch</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <Card className="bg-stone-800 border-amber-500 border-2">
            <CardHeader>
              <CardTitle className="text-xl text-amber-300">Adventuring Gear</CardTitle>
            </CardHeader>
            <CardContent>
              {items.map((item, index) => (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={() => buyItem(index)} 
                      disabled={gold < item.cost || !item.unlocked} 
                      className="w-full mb-2 bg-stone-700 hover:bg-stone-600 text-amber-100 disabled:bg-stone-800 disabled:text-stone-500"
                    >
                      {index === 0 && <Sword className="mr-2 h-4 w-4" />}
                      {index === 1 && <Shield className="mr-2 h-4 w-4" />}
                      {index === 2 && <Beaker className="mr-2 h-4 w-4" />}
                      {index === 3 && <Target className="mr-2 h-4 w-4" />}
                      {index === 4 && <Shirt className="mr-2 h-4 w-4" />}
                      {item.name} (Owned: {item.owned}) - Cost: {item.cost}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Gain: {item.gain} gold per sale</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-stone-800 border-amber-500 border-2">
            <CardHeader>
              <CardTitle className="text-xl text-amber-300">Guild Members</CardTitle>
            </CardHeader>
            <CardContent>
              {merchants.map((merchant, index) => (
                <Tooltip key={merchant.name}>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={() => buyMerchant(index)} 
                      disabled={gold < merchant.cost || !merchant.unlocked} 
                      className="w-full mb-2 bg-stone-700 hover:bg-stone-600 text-amber-100 disabled:bg-stone-800 disabled:text-stone-500"
                    >
                      <Users className="mr-2 h-4 w-4" /> 
                      {merchant.name} (Hired: {merchant.owned}) - Cost: {merchant.cost}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Boost: +{merchant.boost * 100}% sales</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <Card className="bg-stone-800 border-amber-500 border-2">
            <CardHeader>
              <CardTitle className="text-xl text-amber-300">Guild Outposts</CardTitle>
            </CardHeader>
            <CardContent>
              {shops.map((shop, index) => (
                <Tooltip key={shop.name}>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={() => buyShop(index)} 
                      disabled={gold < shop.cost || !shop.unlocked} 
                      className="w-full mb-2 bg-stone-700 hover:bg-stone-600 text-amber-100 disabled:bg-stone-800 disabled:text-stone-500"
                    >
                      <Building2 className="mr-2 h-4 w-4" /> 
                      {shop.name} (Owned: {shop.owned}) - Cost: {shop.cost}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Boost: +{shop.boost * 100}% sales</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-stone-800 border-amber-500 border-2">
            <CardHeader>
              <CardTitle className="text-xl text-amber-300">Guild Enhancements</CardTitle>
            </CardHeader>
            <CardContent>
              {upgrades.map((upgrade, index) => (
                <Tooltip key={upgrade.name}>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={() => buyUpgrade(index)} 
                      disabled={!upgrade.unlocked || upgrade.purchased || gold < upgrade.cost} 
                      className="w-full mb-2 bg-stone-700 hover:bg-stone-600 text-amber-100 disabled:bg-stone-800 disabled:text-stone-500"
                    >
                      <TrendingUp className="mr-2 h-4 w-4" /> 
                      {upgrade.name} - Cost: {upgrade.cost}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{upgrade.effect}</p>
                    {!upgrade.unlocked && <p>Unlocks at {index === 0 ? 500 : index === 1 ? 1000 : 1500} sales</p>}
                  </TooltipContent>
                </Tooltip>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-stone-800 border-amber-500 border-2">
          <CardHeader>
            <CardTitle className="text-xl text-amber-300">Legendary Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  onClick={() => {
                    if (reputation >= 1000) {
                      setPrestigePoints(prev => prev + 1)
                      resetGame()
                    }
                  }} 
                  disabled={reputation < 1000} 
                  className="w-full bg-red-900 hover:bg-red-800 text-amber-100 disabled:bg-stone-800 disabled:text-stone-500"
                >
                  <Award className="mr-2 h-4 w-4" /> Ascend to Legendary Merchant
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reset your progress to gain a Prestige Point. Each point provides permanent bonuses.</p>
              </TooltipContent>
            </Tooltip>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}