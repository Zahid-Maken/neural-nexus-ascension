
import React, { useContext, useEffect, useState, useRef } from 'react';
import { GameContext } from './GameContainer';
import { Brain, Zap } from 'lucide-react';

interface NeuralNode {
  id: string;
  x: number;
  y: number;
  type: 'input' | 'processing' | 'output';
  connections: string[];
}

const NeuralNetwork: React.FC = () => {
  const { addCP, level } = useContext(GameContext);
  const [nodes, setNodes] = useState<NeuralNode[]>([]);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [connectionInProgress, setConnectionInProgress] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Initialize nodes based on level
  useEffect(() => {
    const newNodes: NeuralNode[] = [];
    
    // Level 1 setup: Basic nodes
    if (level === 1) {
      newNodes.push(
        { id: 'input1', x: 20, y: 30, type: 'input', connections: [] },
        { id: 'processing1', x: 50, y: 20, type: 'processing', connections: [] },
        { id: 'processing2', x: 50, y: 40, type: 'processing', connections: [] },
        { id: 'output1', x: 80, y: 30, type: 'output', connections: [] }
      );
    }
    // Level 2 setup: Add more nodes in a loop pattern
    else if (level === 2) {
      newNodes.push(
        { id: 'input1', x: 20, y: 30, type: 'input', connections: [] },
        { id: 'processing1', x: 40, y: 15, type: 'processing', connections: [] },
        { id: 'processing2', x: 60, y: 15, type: 'processing', connections: [] },
        { id: 'processing3', x: 60, y: 45, type: 'processing', connections: [] },
        { id: 'processing4', x: 40, y: 45, type: 'processing', connections: [] },
        { id: 'output1', x: 80, y: 30, type: 'output', connections: [] }
      );
    }
    
    setNodes(newNodes);
  }, [level]);

  // Handle node click
  const handleNodeClick = (nodeId: string) => {
    // If no active node, set the clicked node as active
    if (!activeNode) {
      setActiveNode(nodeId);
      setConnectionInProgress(true);
      return;
    }
    
    // If clicking the same node, deactivate it
    if (activeNode === nodeId) {
      setActiveNode(null);
      setConnectionInProgress(false);
      return;
    }
    
    // Try to create a connection
    const sourceNode = nodes.find(n => n.id === activeNode);
    const targetNode = nodes.find(n => n.id === nodeId);
    
    if (sourceNode && targetNode) {
      // Check if connection is valid
      if (isValidConnection(sourceNode, targetNode)) {
        // Update nodes with new connection
        setNodes(prevNodes => 
          prevNodes.map(node => {
            if (node.id === activeNode) {
              return { ...node, connections: [...node.connections, nodeId] };
            }
            return node;
          })
        );
        
        // Award CP for successful connection
        addCP(5);
        
        // Connection complete
        setActiveNode(null);
        setConnectionInProgress(false);
      } else {
        // Invalid connection
        setActiveNode(null);
        setConnectionInProgress(false);
      }
    }
  };
  
  // Check if connection is valid based on node types
  const isValidConnection = (source: NeuralNode, target: NeuralNode) => {
    // Input nodes can only connect to processing nodes
    if (source.type === 'input' && target.type !== 'processing') {
      return false;
    }
    
    // Processing nodes can connect to other processing nodes or output nodes
    if (source.type === 'processing' && target.type === 'input') {
      return false;
    }
    
    // Output nodes can't initiate connections
    if (source.type === 'output') {
      return false;
    }
    
    // Check if connection already exists
    if (source.connections.includes(target.id)) {
      return false;
    }
    
    return true;
  };
  
  // Calculate connection line properties
  const getConnectionStyle = (sourceNode: NeuralNode, targetNode: NeuralNode) => {
    const sourceX = sourceNode.x;
    const sourceY = sourceNode.y;
    const targetX = targetNode.x;
    const targetY = targetNode.y;
    
    // Calculate distance and angle
    const dx = targetX - sourceX;
    const dy = targetY - sourceY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const angle = Math.atan2(dy, dx) * (180 / Math.PI);
    
    return {
      width: `${distance}%`,
      left: `${sourceX}%`,
      top: `${sourceY}%`,
      transform: `rotate(${angle}deg)`,
    };
  };
  
  // Return node color based on type
  const getNodeColor = (type: string) => {
    switch (type) {
      case 'input':
        return 'bg-blue-500';
      case 'processing':
        return 'bg-purple-500';
      case 'output':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full border border-neural-gray border-opacity-30 rounded-lg bg-neural-blue bg-opacity-30 overflow-hidden"
    >
      {/* Render connections */}
      {nodes.map(sourceNode => 
        sourceNode.connections.map(targetId => {
          const targetNode = nodes.find(n => n.id === targetId);
          if (targetNode) {
            return (
              <div 
                key={`${sourceNode.id}-${targetId}`}
                className="neural-connection"
                style={getConnectionStyle(sourceNode, targetNode)}
              />
            );
          }
          return null;
        })
      )}
      
      {/* Render nodes */}
      {nodes.map(node => (
        <div
          key={node.id}
          className={`neural-node ${node.id === activeNode ? 'ring-2 ring-neural-green' : ''}`}
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
          onClick={() => handleNodeClick(node.id)}
        >
          {node.type === 'input' && <Zap className="w-5 h-5 text-neural-green" />}
          {node.type === 'processing' && <div className="w-5 h-5 rounded-sm border border-neural-cyan" />}
          {node.type === 'output' && <Brain className="w-5 h-5 text-neural-cyan" />}
        </div>
      ))}
      
      {/* Connection in progress indicator */}
      {connectionInProgress && activeNode && (
        <div className="absolute top-0 left-0 right-0 text-center py-2 bg-neural-blue bg-opacity-70 text-neural-green">
          Select a node to connect with {nodes.find(n => n.id === activeNode)?.type} node
        </div>
      )}
      
      {/* Level 1 instructions */}
      {level === 1 && nodes.length > 0 && !nodes.some(n => n.connections.length > 0) && (
        <div className="absolute bottom-4 left-0 right-0 text-center py-2 px-4 bg-neural-blue bg-opacity-70 text-neural-light">
          Click on a node to start a connection, then click another node to complete it
        </div>
      )}
    </div>
  );
};

export default NeuralNetwork;
