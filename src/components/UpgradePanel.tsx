
import React, { useContext, useState } from 'react';
import { GameContext } from './GameContainer';
import { Button } from '@/components/ui/button';
import { ArrowUp, Lock, Cpu, GitBranch } from 'lucide-react';

interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  level: number;
  maxLevel: number;
  requiredLevel: number;
  effect: () => void;
  icon: React.ReactNode;
}

const UpgradePanel: React.FC = () => {
  const { resources, setResources, level } = useContext(GameContext);
  
  // Define available upgrades
  const [upgrades, setUpgrades] = useState<Upgrade[]>([
    {
      id: 'nodeCapacity',
      name: 'Neural Capacity',
      description: 'Increase the number of connections you can maintain',
      cost: 20,
      level: 0,
      maxLevel: 5,
      requiredLevel: 1,
      effect: () => {},
      icon: <Cpu className="w-4 h-4" />
    },
    {
      id: 'connectionEfficiency',
      name: 'Connection Efficiency',
      description: 'Improve CP generation from connections',
      cost: 30,
      level: 0,
      maxLevel: 5,
      requiredLevel: 1,
      effect: () => {},
      icon: <GitBranch className="w-4 h-4" />
    },
    {
      id: 'loopFormation',
      name: 'Loop Formation',
      description: 'Ability to create recursive neural patterns',
      cost: 50,
      level: 0,
      maxLevel: 3,
      requiredLevel: 2,
      effect: () => {},
      icon: <ArrowUp className="w-4 h-4" />
    }
  ]);
  
  // Purchase upgrade
  const buyUpgrade = (upgradeId: string) => {
    const upgradeIndex = upgrades.findIndex(u => u.id === upgradeId);
    if (upgradeIndex === -1) return;
    
    const upgrade = upgrades[upgradeIndex];
    
    // Check if player has enough resources
    if (resources.cp < upgrade.cost) return;
    
    // Check if upgrade is already at max level
    if (upgrade.level >= upgrade.maxLevel) return;
    
    // Purchase the upgrade
    setResources(prev => ({
      ...prev,
      cp: prev.cp - upgrade.cost
    }));
    
    // Update the upgrade
    const updatedUpgrades = [...upgrades];
    updatedUpgrades[upgradeIndex] = {
      ...upgrade,
      level: upgrade.level + 1,
      cost: Math.floor(upgrade.cost * 1.5) // Increase cost for next level
    };
    
    setUpgrades(updatedUpgrades);
    
    // Apply the upgrade effect
    upgrade.effect();
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-neural-cyan mb-4">Upgrades</h2>
      
      <div className="space-y-3">
        {upgrades.map(upgrade => {
          const canAfford = resources.cp >= upgrade.cost;
          const isMaxLevel = upgrade.level >= upgrade.maxLevel;
          const isUnlocked = level >= upgrade.requiredLevel;
          
          return (
            <div 
              key={upgrade.id}
              className={`p-3 border rounded-md transition-all ${
                isUnlocked 
                  ? 'border-neural-gray bg-neural-blue bg-opacity-30' 
                  : 'border-gray-700 bg-gray-800 bg-opacity-30 opacity-70'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center space-x-2">
                  <span className="p-1 bg-neural-dark rounded-md">
                    {upgrade.icon}
                  </span>
                  <h3 className="font-medium">
                    {upgrade.name} {upgrade.level > 0 && `(Lvl ${upgrade.level})`}
                  </h3>
                </div>
                {isUnlocked ? (
                  <div className="text-xs text-neural-gray">
                    {upgrade.level}/{upgrade.maxLevel}
                  </div>
                ) : (
                  <div className="flex items-center text-xs text-neural-gray">
                    <Lock className="w-3 h-3 mr-1" />
                    <span>Level {upgrade.requiredLevel}</span>
                  </div>
                )}
              </div>
              
              <p className="text-xs text-neural-gray mb-2">{upgrade.description}</p>
              
              <Button
                variant="outline"
                size="sm"
                className={`w-full ${
                  canAfford && isUnlocked && !isMaxLevel
                    ? 'border-neural-cyan text-neural-cyan hover:bg-neural-cyan hover:bg-opacity-10'
                    : 'opacity-70 cursor-not-allowed'
                }`}
                disabled={!canAfford || !isUnlocked || isMaxLevel}
                onClick={() => buyUpgrade(upgrade.id)}
              >
                {isMaxLevel ? (
                  'Max Level'
                ) : (
                  <>
                    <span>{upgrade.cost} CP</span>
                    <ArrowUp className="ml-2 w-3 h-3" />
                  </>
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UpgradePanel;
