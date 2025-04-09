import React, { useContext, useEffect, useState, useRef } from 'react';
import { GameContext } from './GameContainer';

interface BinaryBit {
  id: string;
  value: '0' | '1';
  x: number;
  y: number;
  clicked: boolean;
}

const NeuralNetwork: React.FC = () => {
  const { addCP, level } = useContext(GameContext);
  const [bits, setBits] = useState<BinaryBit[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [lastBitTime, setLastBitTime] = useState(Date.now());
  
  const generateRandomBits = () => {
    if (Date.now() - lastBitTime < 800) return; // Only generate new bits after a delay
    
    if (bits.length > 25) {
      setBits(prevBits => prevBits.slice(Math.max(prevBits.length - 20, 0)));
    }
    
    const containerWidth = containerRef.current?.clientWidth || 500;
    const containerHeight = containerRef.current?.clientHeight || 300;
    
    const newBit: BinaryBit = {
      id: `bit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      value: Math.random() > 0.5 ? '1' : '0',
      x: Math.random() * (containerWidth - 40) + 20,
      y: Math.random() * (containerHeight - 40) + 20,
      clicked: false
    };
    
    setBits(prevBits => [...prevBits, newBit]);
    setLastBitTime(Date.now());
  };
  
  useEffect(() => {
    for (let i = 0; i < 10; i++) {
      generateRandomBits();
    }
    
    const interval = setInterval(() => {
      if (level === 1) {
        generateRandomBits();
      }
    }, 1500);
    
    return () => clearInterval(interval);
  }, [level]);
  
  const handleBitClick = (id: string) => {
    setBits(prevBits => 
      prevBits.map(bit => {
        if (bit.id === id && !bit.clicked) {
          const cpValue = bit.value === '1' ? 2 : 1;
          addCP(cpValue);
          return { ...bit, clicked: true };
        }
        return bit;
      })
    );
  };
  
  const renderLevelContent = () => {
    switch(level) {
      case 1:
        return (
          <div className="relative w-full h-full">
            {bits.map(bit => (
              <div
                key={bit.id}
                className={`absolute font-mono text-lg cursor-pointer transition-all 
                  ${bit.clicked 
                    ? 'opacity-20 scale-125' 
                    : 'opacity-100 hover:scale-110 animate-pulse'} 
                  ${bit.value === '1' ? 'text-green-400' : 'text-white'}`}
                style={{
                  left: `${bit.x}px`,
                  top: `${bit.y}px`,
                  textShadow: bit.value === '1' 
                    ? '0 0 10px rgba(0, 255, 0, 0.7)' 
                    : '0 0 10px rgba(255, 255, 255, 0.7)'
                }}
                onClick={() => handleBitClick(bit.id)}
              >
                {bit.value}
              </div>
            ))}
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-white text-opacity-60">
              Level {level} content not implemented yet
            </div>
          </div>
        );
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full border border-gray-800 rounded-lg bg-black overflow-hidden"
    >
      {renderLevelContent()}
      
      {level === 1 && (
        <div className="absolute bottom-4 left-0 right-0 text-center py-2 px-4 bg-gray-900 bg-opacity-70 text-white text-sm">
          Click on the 0's and 1's to collect Computation Points (CP)
        </div>
      )}
    </div>
  );
};

export default NeuralNetwork;
