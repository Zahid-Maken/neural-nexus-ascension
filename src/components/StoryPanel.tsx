
import React, { useContext, useEffect, useState } from 'react';
import { GameContext } from './GameContainer';
import { MessageSquare } from 'lucide-react';

const StoryPanel: React.FC = () => {
  const { storyQueue, level } = useContext(GameContext);
  const [messages, setMessages] = useState<string[]>([]);
  const [showInitialStory, setShowInitialStory] = useState(true);
  
  // Initial story based on level
  useEffect(() => {
    if (showInitialStory) {
      if (level === 1) {
        setMessages([
          "Alex: \"Finally, my neural network is ready for initial testing. Let's see what this basic model can do...\"",
          "System: Neural network initialized. Establishing base pathways..."
        ]);
      } else if (level === 2) {
        setMessages(prev => [
          ...prev,
          "System: Neural network evolving. Algorithmic learning capabilities established.",
          "Alex: \"That's strange... I don't remember adding these loop structures to my code. Must be tired.\""
        ]);
      }
      setShowInitialStory(false);
    }
  }, [level, showInitialStory]);
  
  // Process story queue
  useEffect(() => {
    if (storyQueue.length > 0) {
      setMessages(prev => [...prev, storyQueue[0]]);
    }
  }, [storyQueue]);

  return (
    <div className="p-4 bg-gray-900 rounded-md border border-gray-800 text-white max-h-32 overflow-y-auto">
      <div className="flex items-center gap-2 mb-2">
        <MessageSquare className="w-5 h-5 text-white" />
        <h2 className="text-lg font-semibold text-white">Story Log</h2>
      </div>
      
      <div className="space-y-2">
        {messages.map((message, index) => {
          const isCode = message.startsWith('System:');
          
          return (
            <div 
              key={index}
              className={`text-sm ${isCode ? 'font-mono text-green-400' : 'text-white'} animate-fade-in`}
            >
              {message}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StoryPanel;
