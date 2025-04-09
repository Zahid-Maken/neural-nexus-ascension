
import React, { useState, useEffect } from 'react';
import NeuralNetwork from './NeuralNetwork';
import ResourceDashboard from './ResourceDashboard';
import UpgradePanel from './UpgradePanel';
import StoryPanel from './StoryPanel';
import LevelInfo from './LevelInfo';
import { Settings, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';

// Initial game state
const initialGameState = {
  resources: { cp: 10, it: 0, ne: 10 },
  level: 1,
  storyQueue: [],
  lastSaved: new Date().toISOString()
};

// Game context to manage global state
export const GameContext = React.createContext<{
  resources: {
    cp: number;
    it: number;
    ne: number;
  };
  level: number;
  setResources: React.Dispatch<React.SetStateAction<{
    cp: number;
    it: number;
    ne: number;
  }>>;
  setLevel: React.Dispatch<React.SetStateAction<number>>;
  addCP: (amount: number) => void;
  storyQueue: string[];
  addStory: (text: string) => void;
  saveGame: () => void;
}>({
  resources: initialGameState.resources,
  level: initialGameState.level,
  setResources: () => {},
  setLevel: () => {},
  addCP: () => {},
  storyQueue: [],
  addStory: () => {},
  saveGame: () => {},
});

const GameContainer: React.FC = () => {
  // Load saved game from local storage or use initial state
  const loadSavedGame = () => {
    const saved = localStorage.getItem('neural-nexus-game');
    if (saved) {
      try {
        const parsedState = JSON.parse(saved);
        return {
          resources: parsedState.resources || initialGameState.resources,
          level: parsedState.level || initialGameState.level,
          storyQueue: parsedState.storyQueue || [],
          lastSaved: new Date().toISOString()
        };
      } catch (e) {
        console.error("Error loading saved game:", e);
        return initialGameState;
      }
    }
    return initialGameState;
  };

  const savedState = loadSavedGame();
  const [resources, setResources] = useState(savedState.resources);
  const [level, setLevel] = useState(savedState.level);
  const [storyQueue, setStoryQueue] = useState<string[]>(savedState.storyQueue);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Save game state to local storage
  const saveGame = () => {
    const gameState = {
      resources,
      level,
      storyQueue,
      lastSaved: new Date().toISOString()
    };
    
    localStorage.setItem('neural-nexus-game', JSON.stringify(gameState));
    
    toast({
      title: "Game Saved",
      description: "",
      duration: 4000,
    });
  };

  // Auto-save every 30 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      saveGame();
    }, 30000);
    
    return () => clearInterval(autoSaveInterval);
  }, [resources, level, storyQueue]);

  // Function to add Computation Points
  const addCP = (amount: number) => {
    setResources(prev => {
      const newCP = prev.cp + amount;
      
      // Level up logic
      if (newCP >= 100 && level === 1) {
        toast({
          title: "Level Up!",
          description: "You've advanced to Level 2 - Algorithmic Learning",
          duration: 4000,
        });
        setLevel(2);
        addStory("Alex: \"That's strange... I don't remember adding these loop structures to my code. Must be tired.\"");
      }
      
      return { ...prev, cp: newCP };
    });
  };

  // Function to add a story message
  const addStory = (text: string) => {
    setStoryQueue(prev => [...prev, text]);
  };

  return (
    <GameContext.Provider 
      value={{ 
        resources, 
        level, 
        setResources, 
        setLevel, 
        addCP,
        storyQueue,
        addStory,
        saveGame
      }}
    >
      <div className="flex flex-col w-full min-h-screen bg-black text-white">
        {/* Resource Dashboard at the top */}
        <div className="flex justify-between items-center">
          <ResourceDashboard />
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={saveGame} 
            className="flex items-center gap-1 text-gray-400 hover:text-white mr-4"
          >
            <Save className="w-4 h-4" />
            <span className="text-xs hidden sm:inline">Save</span>
          </Button>
        </div>
        
        <main className="flex flex-1 overflow-hidden h-[calc(100vh-52px)]">
          {/* Level Info on the left */}
          <div className={`${isMobile ? 'w-full' : 'w-1/4 max-w-xs'} p-4 bg-gray-900 overflow-y-auto`}>
            <LevelInfo />

            {/* Upgrade button at bottom of sidebar */}
            <div className="mt-4">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="flex items-center space-x-2 p-2 bg-gray-800 hover:bg-gray-700 rounded-md w-full">
                    <Settings className="w-5 h-5" />
                    <span>Upgrades</span>
                  </button>
                </SheetTrigger>
                <SheetContent side={isMobile ? "bottom" : "right"} className="w-full max-w-md bg-gray-900 border-gray-700 p-0">
                  <UpgradePanel />
                </SheetContent>
              </Sheet>
            </div>
          </div>
          
          <div className="flex flex-col flex-1 h-full overflow-hidden">
            {/* Neural Network takes most of the space */}
            <div className="flex-1 p-4 flex items-center justify-center overflow-hidden">
              <NeuralNetwork />
            </div>
            
            {/* Story Panel at the bottom */}
            <div className="p-4 bg-gray-900 border-t border-gray-800">
              <StoryPanel />
            </div>
          </div>
        </main>
      </div>
    </GameContext.Provider>
  );
};

export default GameContainer;
