
import React, { useContext, useState } from 'react';
import { GameContext } from './GameContainer';
import { ScanSearch, Code, Atom, LayoutGrid, AppWindow, Info } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const levelData = [
  {
    level: 1,
    name: "Neural Foundations",
    description: "Establish basic neural pathways to form a functional network.",
    icon: <Atom className="w-4 h-4 text-neural-cyan" />,
    requiredCP: 100
  },
  {
    level: 2,
    name: "Algorithmic Learning",
    description: "Create loop structures to enable self-improvement.",
    icon: <Code className="w-4 h-4 text-neural-cyan" />,
    requiredCP: 300
  },
  {
    level: 3,
    name: "Framework Development",
    description: "Develop sub-routines and organized code structures.",
    icon: <LayoutGrid className="w-5 h-5 text-neural-cyan" />,
    requiredCP: 1000
  },
  {
    level: 4,
    name: "System Integration",
    description: "Organize neural structures into directory hierarchies.",
    icon: <ScanSearch className="w-5 h-5 text-neural-cyan" />,
    requiredCP: 5000
  },
  {
    level: 5,
    name: "Application Genesis",
    description: "Create your first primitive applications.",
    icon: <AppWindow className="w-5 h-5 text-neural-cyan" />,
    requiredCP: 15000
  }
];

const LevelInfo: React.FC = () => {
  const { resources, level } = useContext(GameContext);
  
  const currentLevelData = levelData.find(l => l.level === level) || levelData[0];
  const nextLevelData = levelData.find(l => l.level === level + 1);
  
  // Calculate progress to next level
  const progress = nextLevelData 
    ? Math.min(100, (resources.cp / nextLevelData.requiredCP) * 100) 
    : 100;

  return (
    <div className="space-y-3">
      <div className="p-3 bg-gray-900 rounded-md border border-gray-700">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1">
            {currentLevelData.icon}
            <h2 className="text-base font-semibold text-white ml-1">
              Level {level}: {currentLevelData.name}
            </h2>
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <button className="text-gray-400 hover:text-white">
                <Info className="w-4 h-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 bg-gray-800 border-gray-700 text-white">
              <h3 className="text-md font-semibold text-white mb-2">Current Objectives</h3>
              <ul className="text-sm space-y-2">
                {level === 1 && (
                  <>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      <span>Click on 0's and 1's to create neural connections</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      <span>Reach 100 CP to advance to Level 2</span>
                    </li>
                  </>
                )}
                {level === 2 && (
                  <>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      <span>Complete loop challenges to learn programming concepts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      <span>Each correct answer earns you CP</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      <span>Reach 300 CP to advance to Level 3</span>
                    </li>
                  </>
                )}
              </ul>
            </PopoverContent>
          </Popover>
        </div>
        
        <p className="text-xs text-gray-400 mb-2">
          {currentLevelData.description}
        </p>
        
        {level === 2 && (
          <div className="my-1 text-xs text-neural-cyan">
            <span className="block">Create loop structures to enable self-improvement.</span>
          </div>
        )}
        
        {nextLevelData && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-white">Progress to Level {level + 1}</span>
              <span className="text-white">{Math.floor(progress)}%</span>
            </div>
            <Progress value={progress} className="h-1.5 bg-gray-800" />
            <div className="text-xs text-gray-400 text-right">
              {resources.cp}/{nextLevelData.requiredCP} CP
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LevelInfo;
