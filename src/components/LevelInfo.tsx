
import React, { useContext } from 'react';
import { GameContext } from './GameContainer';
import { ScanSearch, Code, Atom, LayoutGrid, AppWindow } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const levelData = [
  {
    level: 1,
    name: "Neural Foundations",
    description: "Establish basic neural pathways to form a functional network.",
    icon: <Atom className="w-5 h-5 text-neural-cyan" />,
    requiredCP: 100
  },
  {
    level: 2,
    name: "Algorithmic Learning",
    description: "Create loop structures to enable self-improvement.",
    icon: <Code className="w-5 h-5 text-neural-cyan" />,
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
    <div className="space-y-4">
      <div className="p-4 bg-neural-blue bg-opacity-40 rounded-md border border-neural-gray border-opacity-30">
        <div className="flex items-center gap-2 mb-3">
          {currentLevelData.icon}
          <h2 className="text-lg font-semibold text-neural-cyan">
            Level {level}: {currentLevelData.name}
          </h2>
        </div>
        
        <p className="text-sm text-neural-gray mb-4">
          {currentLevelData.description}
        </p>
        
        {nextLevelData && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-neural-light">Progress to Level {level + 1}</span>
              <span className="text-neural-cyan">{Math.floor(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-neural-dark" />
            <div className="text-xs text-neural-gray text-right">
              {resources.cp}/{nextLevelData.requiredCP} CP
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-neural-blue bg-opacity-40 rounded-md border border-neural-gray border-opacity-30">
        <h3 className="text-md font-semibold text-neural-cyan mb-2">Current Objectives</h3>
        <ul className="text-sm space-y-2">
          {level === 1 && (
            <>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-neural-cyan" />
                <span>Create neural connections</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-neural-cyan" />
                <span>Reach 100 CP to advance</span>
              </li>
            </>
          )}
          {level === 2 && (
            <>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-neural-cyan" />
                <span>Form closed-loop connections</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-neural-cyan" />
                <span>Purchase Loop Formation upgrade</span>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default LevelInfo;
