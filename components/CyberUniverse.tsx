import React, { useRef, useEffect, useState, useMemo } from 'react';
import { UniverseNode } from '../types';
import { evolveUniverse } from '../services/geminiService';

interface CyberUniverseProps {
  hasKey: boolean;
}

export const CyberUniverse: React.FC<CyberUniverseProps> = ({ hasKey }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<UniverseNode[]>([
    {
      id: 'root',
      parentId: null,
      type: 'root',
      title: 'BIG BANG',
      description: 'The initialization of the Cyber Universe. Energy coalesces into digital matter.',
      stats: { water: 0, oxygen: 0, biomass: 0 },
      x: 0,
      y: 0,
      level: 0
    }
  ]);
  const [isEvolving, setIsEvolving] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<UniverseNode | null>(null);

  // Simulation State for Physics
  const positions = useRef<Map<string, { x: number; y: number; vx: number; vy: number }>>(new Map());

  // Initialize physics for new nodes
  useEffect(() => {
    nodes.forEach((node, index) => {
      if (!positions.current.has(node.id)) {
        // Fix: Spawn nodes near their equilibrium position to prevent "explosion" and swirling artifacts.
        // Previously spawned at parent center (0,0), causing violent repulsion.
        const parentPos = node.parentId ? positions.current.get(node.parentId) : { x: 0, y: 0 };
        
        // Distribute placement to minimize initial overlap
        const angle = Math.random() * Math.PI * 2;
        const targetDist = 100; // Start near the spring equilibrium
        
        const startX = parentPos ? parentPos.x + Math.cos(angle) * targetDist : 0;
        const startY = parentPos ? parentPos.y + Math.sin(angle) * targetDist : 0;
        
        positions.current.set(node.id, { 
          x: startX, 
          y: startY, 
          vx: 0, 
          vy: 0 
        });
      }
    });
  }, [nodes]);

  // Main Render & Physics Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    
    // Physics Constants
    const REPULSION = 3000; // Reduced for stability
    const SPRING_LENGTH = 120;
    const SPRING_STRENGTH = 0.05;
    const CENTERING = 0.005;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;

      // 1. Update Physics
      nodes.forEach(node => {
        const p1 = positions.current.get(node.id);
        if (!p1) return;

        let fx = 0;
        let fy = 0;

        // Repulsion between all nodes
        nodes.forEach(other => {
          if (node.id === other.id) return;
          const p2 = positions.current.get(other.id);
          if (!p2) return;

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx*dx + dy*dy + 1; // +1 avoids div by zero
          const force = REPULSION / distSq;
          
          const dist = Math.sqrt(distSq);
          fx += (dx / dist) * force;
          fy += (dy / dist) * force;
        });

        // Spring connection to parent
        if (node.parentId) {
          const parent = positions.current.get(node.parentId);
          if (parent) {
            const dx = p1.x - parent.x;
            const dy = p1.y - parent.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            const springForce = (dist - SPRING_LENGTH) * SPRING_STRENGTH;
            fx -= (dx / dist) * springForce;
            fy -= (dy / dist) * springForce;
          }
        }
        
        // Simple Center Gravity
        fx -= p1.x * CENTERING;
        fy -= p1.y * CENTERING;

        // Higher damping (0.75) to prevent orbiting/swirling behavior
        p1.vx = (p1.vx + fx) * 0.75; 
        p1.vy = (p1.vy + fy) * 0.75;
        p1.x += p1.vx;
        p1.y += p1.vy;
      });

      // 2. Draw
      ctx.clearRect(0, 0, width, height);
      
      // Draw Grid Background (Static)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      const gridSize = 50;
      // Removed time-based offset to prevent "moving" background distraction
      for(let x = -gridSize; x < width + gridSize; x += gridSize) {
         ctx.beginPath();
         // Align to center
         const xPos = x + (width % gridSize) / 2;
         ctx.moveTo(xPos, 0);
         ctx.lineTo(xPos, height);
         ctx.stroke();
      }
      for(let y = 0; y < height; y += gridSize) {
         ctx.beginPath();
         const yPos = y + (height % gridSize) / 2;
         ctx.moveTo(0, yPos);
         ctx.lineTo(width, yPos);
         ctx.stroke();
      }

      ctx.save();
      ctx.translate(cx, cy); // Center the camera

      // Draw Connections
      nodes.forEach(node => {
        if (node.parentId) {
          const p1 = positions.current.get(node.id);
          const p2 = positions.current.get(node.parentId);
          if (p1 && p2) {
            ctx.beginPath();
            ctx.moveTo(p2.x, p2.y);
            ctx.lineTo(p1.x, p1.y);
            ctx.strokeStyle = 'rgba(0, 255, 200, 0.3)';
            ctx.lineWidth = 2;
            ctx.stroke();
          }
        }
      });

      // Draw Nodes
      nodes.forEach(node => {
        const pos = positions.current.get(node.id);
        if (!pos) return;

        // Color based on type or stats
        let color = '#ffffff';
        let radius = 10;
        
        if (node.type === 'root') {
             color = '#FFF';
             radius = 15;
        } else if (node.type === 'splitter') {
             color = '#D946EF'; // Purple-ish
             radius = 12;
        } else {
             // Mix Blue (Water) and Green (Biomass)
             const b = node.stats.water + 50;
             const g = node.stats.biomass + 50;
             color = `rgb(0, ${Math.min(255, g)}, ${Math.min(255, b)})`;
        }

        // Glow
        const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, radius * 3);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = gradient;
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius * 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;

        // Solid Core
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
        ctx.fill();

        // Label (only if level < 2 or hovered or root)
        if (node.level < 2 || node.id === 'root' || hoveredNode?.id === node.id) {
            ctx.fillStyle = '#EEE';
            ctx.font = '10px "JetBrains Mono"';
            ctx.textAlign = 'center';
            ctx.fillText(node.title, pos.x, pos.y + radius + 15);
        }
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
       if (containerRef.current && canvas) {
           canvas.width = containerRef.current.clientWidth;
           canvas.height = containerRef.current.clientHeight;
       }
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [nodes, hoveredNode]);

  // Handle Mouse Move for Hover Interaction
  const handleMouseMove = (e: React.MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left - canvas.width / 2;
      const my = e.clientY - rect.top - canvas.height / 2;

      // Find closest node
      let closest: UniverseNode | null = null;
      let minDist = 20; // Hit radius

      nodes.forEach(node => {
          const pos = positions.current.get(node.id);
          if (pos) {
              const dx = mx - pos.x;
              const dy = my - pos.y;
              const dist = Math.sqrt(dx*dx + dy*dy);
              if (dist < minDist) {
                  closest = node;
                  minDist = dist;
              }
          }
      });
      setHoveredNode(closest);
  };

  const handleNextDay = async () => {
      if (isEvolving) return;
      setIsEvolving(true);

      // Find leaves (nodes with no children)
      const parentIds = new Set(nodes.map(n => n.parentId));
      const leaves = nodes.filter(n => !parentIds.has(n.id));

      if (leaves.length === 0) {
          setIsEvolving(false);
          return;
      }

      // Limit to random 3 leaves to prevent exponential explosion too fast if tree is huge
      const activeLeaves = leaves.sort(() => 0.5 - Math.random()).slice(0, 3);

      try {
          const newBranchData = await evolveUniverse(activeLeaves);
          
          if (newBranchData && Array.isArray(newBranchData)) {
              const newNodes: UniverseNode[] = newBranchData.map((data: any, index: number) => ({
                  id: `node-${Date.now()}-${index}`,
                  parentId: data.parentId,
                  type: data.type || 'branch',
                  title: data.title || 'Event',
                  description: data.description || 'Unknown event',
                  stats: {
                      water: data.stats?.water || 50,
                      oxygen: data.stats?.oxygen || 50,
                      biomass: data.stats?.biomass || 0
                  },
                  level: (nodes.find(n => n.id === data.parentId)?.level || 0) + 1,
                  x: 0, 
                  y: 0
              }));
              setNodes(prev => [...prev, ...newNodes]);
          }
      } catch (e) {
          console.error("Evolution failed", e);
      } finally {
          setIsEvolving(false);
      }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-[#0a0a0f] overflow-hidden group">
      <canvas 
        ref={canvasRef} 
        className="block w-full h-full cursor-crosshair"
        onMouseMove={handleMouseMove}
        onClick={() => setHoveredNode(null)}
      />
      
      {/* UI Overlay */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
         <div className="font-mono text-xs text-green-400 opacity-70 mb-1">UNIVERSE: ONLINE</div>
         <div className="font-mono text-xs text-green-400 opacity-70">NODES: {nodes.length}</div>
      </div>

      {/* Next Day Button */}
      <div className="absolute bottom-6 right-6 z-20">
         <button
            onClick={handleNextDay}
            disabled={isEvolving || !hasKey}
            className={`
                group relative px-6 py-3 font-mono font-bold text-sm tracking-wider uppercase
                transition-all duration-300 clip-path-polygon
                ${isEvolving || !hasKey 
                    ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700' 
                    : 'bg-green-500 hover:bg-green-400 text-black shadow-[0_0_20px_rgba(74,222,128,0.5)] hover:shadow-[0_0_30px_rgba(74,222,128,0.8)]'
                }
            `}
            style={{ clipPath: 'polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%)' }}
         >
            {isEvolving ? 'SIMULATING...' : 'NEXT DAY >>'}
         </button>
      </div>

      {/* Node Details Tooltip */}
      {hoveredNode && (
          <div className="absolute top-4 right-4 max-w-xs bg-black/80 border border-green-500/30 p-4 rounded backdrop-blur-md z-30 animate-in fade-in zoom-in-95 duration-200 pointer-events-none">
              <h3 className="text-green-400 font-bold font-mono text-sm mb-1">{hoveredNode.title}</h3>
              <div className="text-[10px] text-gray-500 uppercase tracking-widest mb-2">{hoveredNode.type} NODE • LEVEL {hoveredNode.level}</div>
              <p className="text-gray-300 text-xs leading-relaxed mb-3">{hoveredNode.description}</p>
              
              <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-2">
                  <div className="text-center">
                      <div className="text-[10px] text-blue-400">H2O</div>
                      <div className="text-white font-mono text-xs">{hoveredNode.stats.water}%</div>
                  </div>
                  <div className="text-center">
                      <div className="text-[10px] text-cyan-400">O2</div>
                      <div className="text-white font-mono text-xs">{hoveredNode.stats.oxygen}%</div>
                  </div>
                  <div className="text-center">
                      <div className="text-[10px] text-green-400">LIFE</div>
                      <div className="text-white font-mono text-xs">{hoveredNode.stats.biomass}%</div>
                  </div>
              </div>
          </div>
      )}
      
      {/* Decorative */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
    </div>
  );
};