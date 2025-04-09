
import React, { useContext, useEffect, useState, useRef } from 'react';
import { GameContext } from './GameContainer';
import { Check, X, RotateCw, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BinaryBit {
  id: string;
  value: '0' | '1';
  x: number;
  y: number;
  clicked: boolean;
}

interface LoopChallenge {
  id: number;
  code: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

const loopChallenges: LoopChallenge[] = [
  {
    id: 1,
    code: `for (let i = 0; i < 5; i++) {\n  console.log(i);\n}`,
    question: "What will this loop print to the console?",
    options: [
      "0, 1, 2, 3, 4",
      "1, 2, 3, 4, 5",
      "0, 1, 2, 3, 4, 5",
      "1, 2, 3, 4"
    ],
    correctAnswer: 0,
    explanation: "This for loop starts with i=0, runs while i<5, and increments i by 1 each time. It will print 0, 1, 2, 3, 4."
  },
  {
    id: 2,
    code: `let sum = 0;\nfor (let i = 1; i <= 10; i++) {\n  sum += i;\n}\nconsole.log(sum);`,
    question: "What value will be logged to the console?",
    options: [
      "10",
      "45",
      "55",
      "0"
    ],
    correctAnswer: 2,
    explanation: "This loop calculates the sum of numbers from 1 to 10, which is 1+2+3+4+5+6+7+8+9+10 = 55."
  },
  {
    id: 3,
    code: `let i = 0;\nwhile (i < 5) {\n  console.log(i);\n  i++;\n}`,
    question: "How many times will this while loop execute?",
    options: [
      "4 times",
      "5 times",
      "6 times",
      "Infinite loop"
    ],
    correctAnswer: 1,
    explanation: "This while loop starts with i=0 and runs while i<5, incrementing i each time. It will execute 5 times (when i is 0, 1, 2, 3, and 4)."
  },
  {
    id: 4,
    code: `let array = [];\nfor (let i = 0; i < 3; i++) {\n  for (let j = 0; j < 2; j++) {\n    array.push([i, j]);\n  }\n}`,
    question: "How many elements will the array contain after these nested loops?",
    options: [
      "3 elements",
      "5 elements",
      "6 elements",
      "9 elements"
    ],
    correctAnswer: 2,
    explanation: "The outer loop runs 3 times (i=0,1,2) and for each iteration, the inner loop runs 2 times (j=0,1). So a total of 3×2=6 elements will be pushed to the array."
  },
  {
    id: 5,
    code: `for (let i = 10; i > 0; i -= 2) {\n  console.log(i);\n}`,
    question: "What numbers will be logged to the console?",
    options: [
      "10, 8, 6, 4, 2, 0",
      "10, 8, 6, 4, 2",
      "10, 9, 8, 7, 6, 5, 4, 3, 2, 1",
      "8, 6, 4, 2"
    ],
    correctAnswer: 1,
    explanation: "This loop starts at i=10, runs while i>0, and decreases i by 2 each time. It will log 10, 8, 6, 4, 2."
  }
];

const NeuralNetwork: React.FC = () => {
  const { addCP, level, resources } = useContext(GameContext);
  const [bits, setBits] = useState<BinaryBit[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const [lastBitTime, setLastBitTime] = useState(Date.now());
  
  // Level 2 state
  const [currentChallenge, setCurrentChallenge] = useState<LoopChallenge | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [challengeComplete, setChallengeComplete] = useState(false);
  const [completedChallenges, setCompletedChallenges] = useState<number[]>([]);
  
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
  
  // Initialize bits for level 1 and set up challenge for level 2
  useEffect(() => {
    if (level === 1) {
      for (let i = 0; i < 10; i++) {
        generateRandomBits();
      }
      
      const interval = setInterval(() => {
        generateRandomBits();
      }, 1500);
      
      return () => clearInterval(interval);
    } else if (level === 2 && !currentChallenge) {
      // Filter out completed challenges
      const availableChallenges = loopChallenges.filter(
        challenge => !completedChallenges.includes(challenge.id)
      );
      
      if (availableChallenges.length > 0) {
        // Select a random challenge from available ones
        const randomIndex = Math.floor(Math.random() * availableChallenges.length);
        setCurrentChallenge(availableChallenges[randomIndex]);
      } else if (loopChallenges.length > 0) {
        // If all challenges completed, reset and start over
        setCompletedChallenges([]);
        setCurrentChallenge(loopChallenges[0]);
      }
    }
  }, [level, currentChallenge, completedChallenges]);
  
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
  
  const handleAnswerSelect = (index: number) => {
    if (!showResult) {
      setSelectedAnswer(index);
    }
  };
  
  const checkAnswer = () => {
    if (selectedAnswer !== null && currentChallenge) {
      setShowResult(true);
      
      if (selectedAnswer === currentChallenge.correctAnswer) {
        // Reward CP for correct answer
        addCP(10);
        
        setTimeout(() => {
          setChallengeComplete(true);
        }, 2000);
      }
    }
  };
  
  const nextChallenge = () => {
    if (currentChallenge) {
      // Add current challenge to completed list
      setCompletedChallenges(prev => [...prev, currentChallenge.id]);
    }
    
    // Reset state for next challenge
    setSelectedAnswer(null);
    setShowResult(false);
    setChallengeComplete(false);
    
    // Filter out completed challenges
    const availableChallenges = loopChallenges.filter(
      challenge => !completedChallenges.includes(challenge.id) && 
      (!currentChallenge || challenge.id !== currentChallenge.id)
    );
    
    if (availableChallenges.length > 0) {
      // Select a random challenge from available ones
      const randomIndex = Math.floor(Math.random() * availableChallenges.length);
      setCurrentChallenge(availableChallenges[randomIndex]);
    } else {
      // If all challenges completed, trigger level up logic if we have enough CP
      if (resources.cp >= 300) {
        // Level up is handled in GameContainer
      } else {
        // Reset challenges and start over
        setCompletedChallenges([]);
        const randomIndex = Math.floor(Math.random() * loopChallenges.length);
        setCurrentChallenge(loopChallenges[randomIndex]);
      }
    }
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
      case 2:
        if (!currentChallenge) return (
          <div className="flex items-center justify-center h-full">
            <div className="text-white text-opacity-60">
              Loading loop challenge...
            </div>
          </div>
        );
        
        return (
          <div className="flex flex-col w-full h-full p-4 overflow-y-auto">
            <div className="flex items-center mb-4">
              <Code className="w-5 h-5 text-neural-cyan mr-2" />
              <h3 className="text-lg font-semibold text-white">Loop Challenge</h3>
            </div>
            
            <div className="bg-gray-900 p-4 rounded-md mb-4 font-mono text-sm overflow-x-auto">
              <pre className="text-neural-green">{currentChallenge.code}</pre>
            </div>
            
            <p className="text-white mb-4">{currentChallenge.question}</p>
            
            <div className="space-y-3 mb-6">
              {currentChallenge.options.map((option, index) => (
                <div 
                  key={index}
                  className={`p-3 border rounded-md cursor-pointer transition-all
                    ${selectedAnswer === index ? 'border-neural-cyan bg-gray-800' : 'border-gray-700 hover:border-gray-500'}
                    ${showResult && index === currentChallenge.correctAnswer ? 'border-green-500 bg-opacity-20 bg-green-900' : ''}
                    ${showResult && selectedAnswer === index && selectedAnswer !== currentChallenge.correctAnswer ? 'border-red-500 bg-opacity-20 bg-red-900' : ''}
                  `}
                  onClick={() => handleAnswerSelect(index)}
                >
                  <div className="flex justify-between items-center">
                    <span className="text-white">{option}</span>
                    {showResult && index === currentChallenge.correctAnswer && (
                      <Check className="w-5 h-5 text-green-500" />
                    )}
                    {showResult && selectedAnswer === index && selectedAnswer !== currentChallenge.correctAnswer && (
                      <X className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            {showResult && (
              <div className={`p-4 rounded-md mb-4 ${selectedAnswer === currentChallenge.correctAnswer ? 'bg-green-900 bg-opacity-20' : 'bg-red-900 bg-opacity-20'}`}>
                <p className="text-white">
                  {currentChallenge.explanation}
                </p>
              </div>
            )}
            
            <div className="flex justify-center mt-auto">
              {!showResult ? (
                <Button 
                  onClick={checkAnswer}
                  disabled={selectedAnswer === null}
                  className="bg-neural-cyan text-black hover:bg-opacity-80"
                >
                  Check Answer
                </Button>
              ) : (
                <Button 
                  onClick={nextChallenge}
                  className="bg-gray-700 text-white hover:bg-gray-600 flex items-center gap-2"
                >
                  <RotateCw className="w-4 h-4" />
                  {challengeComplete ? "Next Challenge" : "Try Another"}
                </Button>
              )}
            </div>
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
