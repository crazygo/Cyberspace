
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { WorldLocation, TerrainType, WorldView, WorldRegion } from '../types';

interface HexMapProps {
  locations: WorldLocation[];
  activeLocationId: string | null;
  activeWorld: WorldView;
  onLocationHover?: (loc: WorldLocation | null) => void;
}

export const HexMap: React.FC<HexMapProps> = ({ locations, activeLocationId, activeWorld, onLocationHover }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredHex, setHoveredHex] = useState<{ q: number, r: number, data: WorldLocation | null } | null>(null);

  // Camera State
  const [scale, setScale] = useState(0.8); // Start zoomed out a bit
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  // Constants
  const HEX_SIZE = 40;
  const GAP = 2;
  const MAP_RADIUS = 15; // Increased map size

  // Hex Helper Math (Pointy Top)
  const hexToPixel = (q: number, r: number) => {
    const x = HEX_SIZE * (Math.sqrt(3) * q + Math.sqrt(3)/2 * r);
    const y = HEX_SIZE * (3/2 * r);
    return { x, y };
  };

  const pixelToHex = (x: number, y: number) => {
      const q = (Math.sqrt(3)/3 * x - 1/3 * y) / HEX_SIZE;
      const r = (2/3 * y) / HEX_SIZE;
      return hexRound(q, r);
  };

  const hexRound = (q: number, r: number) => {
      let rq = Math.round(q);
      let rr = Math.round(r);
      let rs = Math.round(-q - r);
      
      const q_diff = Math.abs(rq - q);
      const r_diff = Math.abs(rr - r);
      const s_diff = Math.abs(rs - (-q - r));

      if (q_diff > r_diff && q_diff > s_diff) {
          rq = -rr - rs;
      } else if (r_diff > s_diff) {
          rr = -rq - rs;
      }
      return { q: rq, r: rr };
  };

  const hexDistance = (q1: number, r1: number, q2: number, r2: number) => {
      return (Math.abs(q1 - q2) + Math.abs(q1 + r1 - q2 - r2) + Math.abs(r1 - r2)) / 2;
  };

  // Color Mapping
  const getTerrainColor = (type: TerrainType) => {
    switch (type) {
      // Fantasy / Earth
      case 'citadel': return '#94a3b8'; // Slate
      case 'plain': return '#4ADE80'; // Green
      case 'forest': return '#15803d'; // Dark Green
      case 'mountain': return '#475569'; // Grey
      case 'swamp': return '#365314'; // Murky Green
      case 'desert': return '#FDE047'; // Yellow
      case 'ashland': return '#18181B'; // Black
      case 'coast': return '#38bdf8'; // Light Blue
      case 'ocean': return '#1e3a8a'; // Dark Blue
      
      // Historical/Eastern
      case 'palace': return '#ef4444'; // Red
      case 'temple': return '#fbbf24'; // Amber
      case 'village': return '#bef264'; // Lime Green
      case 'battlefield': return '#7f1d1d'; // Blood Red/Brown
      case 'river': return '#60a5fa'; // Blue

      // Sci-Fi
      case 'base': return '#cbd5e1'; // Metallic Grey
      case 'station': return '#818cf8'; // Indigo
      case 'planet': return '#a855f7'; // Purple
      case 'nebula': return '#db2777'; // Pink
      case 'ruins': return '#57534E'; // Stone Grey
      case 'city': return '#2DD4BF'; // Teal/Neon
      case 'deep_space': return '#020617'; // Very Dark Blue/Black

      default: return '#333';
    }
  };

  // Deterministic "Random" for Procedural Generation
  const hash = (q: number, r: number) => {
      const str = `${q},${r}`;
      let h = 0;
      for (let i = 0; i < str.length; i++) {
          h = Math.imul(31, h) + str.charCodeAt(i) | 0;
      }
      return ((h >>> 0) / 4294967296);
  };

  // Logic: Location > Region > Global
  const getProceduralTerrain = (q: number, r: number): TerrainType => {
      // 1. Check if specific location exists
      const existing = locations.find(l => l.q === q && l.r === r);
      if (existing) return existing.type;

      // 2. Check if inside a Region
      if (activeWorld.regions) {
          for (const region of activeWorld.regions) {
              const dist = hexDistance(q, r, region.center.q, region.center.r);
              if (dist <= region.radius) {
                  // Add some noise at edges
                  const h = hash(q, r);
                  if (dist > region.radius - 1 && h > 0.7) continue; // Noise edge
                  return region.biome;
              }
          }
      }

      // 3. Global Fallback
      const isSpace = ['three_body'].includes(activeWorld.id);
      if (isSpace) return 'deep_space';
      
      return 'ocean';
  };

  const drawHex = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, isActive: boolean, isHovered: boolean, opacity: number = 1) => {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle_deg = 60 * i - 30;
      const angle_rad = Math.PI / 180 * angle_deg;
      ctx.lineTo(x + size * Math.cos(angle_rad), y + size * Math.sin(angle_rad));
    }
    ctx.closePath();

    // Fill
    ctx.globalAlpha = opacity;
    ctx.fillStyle = color;
    ctx.fill();
    ctx.globalAlpha = 1.0;

    // Stroke
    ctx.lineWidth = isActive ? 3 : 1;
    ctx.strokeStyle = isActive ? '#FFF' : (isHovered ? '#FFF' : 'rgba(255,255,255,0.05)');
    ctx.stroke();

    // Inner Glow for Active
    if (isActive) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#FFF';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fill();
        ctx.shadowBlur = 0;
    }
  };

  // Rendering Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle resize
    const resize = () => {
        if (containerRef.current) {
            canvas.width = containerRef.current.clientWidth;
            canvas.height = containerRef.current.clientHeight;
        }
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
        const width = canvas.width;
        const height = canvas.height;
        const cx = width / 2 + offset.x;
        const cy = height / 2 + offset.y;

        ctx.clearRect(0, 0, width, height);

        // Fill background based on world type
        const isSpace = ['three_body'].includes(activeWorld.id);
        ctx.fillStyle = isSpace ? '#020617' : '#0f172a'; // Deep space or dark ocean
        ctx.fillRect(0,0, width, height);

        // Loop grid
        for (let q = -MAP_RADIUS; q <= MAP_RADIUS; q++) {
            const r1 = Math.max(-MAP_RADIUS, -q - MAP_RADIUS);
            const r2 = Math.min(MAP_RADIUS, -q + MAP_RADIUS);
            for (let r = r1; r <= r2; r++) {
                const pos = hexToPixel(q, r);
                const screenX = cx + pos.x * scale;
                const screenY = cy + pos.y * scale;

                // Viewport Culling
                if (screenX < -100 || screenX > width + 100 || screenY < -100 || screenY > height + 100) continue;

                const existingLoc = locations.find(l => l.q === q && l.r === r);
                const type = getProceduralTerrain(q, r);
                const isActive = existingLoc ? existingLoc.id === activeLocationId : false;
                const isHovered = hoveredHex?.q === q && hoveredHex?.r === r;

                // Opacity drop for "Void" tiles to look nicer
                const opacity = (type === 'deep_space' || type === 'ocean') ? 0.8 : 1.0;

                drawHex(
                    ctx, 
                    screenX, 
                    screenY, 
                    (HEX_SIZE - GAP) * scale, 
                    getTerrainColor(type), 
                    isActive, 
                    isHovered,
                    opacity
                );

                // Icons for Locations
                if (existingLoc) {
                     ctx.fillStyle = 'rgba(255,255,255,0.9)';
                     const fontSize = Math.max(10, 14 * scale);
                     ctx.font = `bold ${fontSize}px "Inter"`;
                     ctx.textAlign = 'center';
                     ctx.textBaseline = 'middle';
                     
                     // Icon mapping
                     let icon = '•';
                     if (['citadel', 'palace'].includes(existingLoc.type)) icon = '♕';
                     else if (['base', 'station'].includes(existingLoc.type)) icon = '⌖';
                     else if (['temple', 'ruins'].includes(existingLoc.type)) icon = '▲';
                     else if (['forest'].includes(existingLoc.type)) icon = '♣';
                     else if (['mountain'].includes(existingLoc.type)) icon = '◭';
                     else if (['planet'].includes(existingLoc.type)) icon = '●';
                     
                     ctx.fillText(icon, screenX, screenY);
                }
            }
        }

        // Draw Region Labels
        if (activeWorld.regions) {
            activeWorld.regions.forEach(region => {
                const pos = hexToPixel(region.center.q, region.center.r);
                const screenX = cx + pos.x * scale;
                const screenY = cy + pos.y * scale;
                
                // Only draw if roughly onscreen
                if (screenX > -200 && screenX < width + 200 && screenY > -200 && screenY < height + 200) {
                    ctx.save();
                    ctx.translate(screenX, screenY);
                    
                    ctx.font = `900 ${24 * scale}px "Inter"`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.strokeStyle = 'rgba(0,0,0,0.8)';
                    ctx.lineWidth = 4;
                    ctx.strokeText(region.name, 0, 0);
                    ctx.fillStyle = region.color;
                    ctx.fillText(region.name, 0, 0);
                    
                    ctx.restore();
                }
            });
        }

        // Draw Cursor Ring
        if (activeLocationId) {
             const loc = locations.find(l => l.id === activeLocationId);
             if (loc) {
                const pos = hexToPixel(loc.q, loc.r);
                const screenX = cx + pos.x * scale;
                const screenY = cy + pos.y * scale;

                ctx.beginPath();
                ctx.arc(screenX, screenY, HEX_SIZE * 2 * scale, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(255, 255, 255, ${0.4 + Math.sin(Date.now() / 200) * 0.2})`;
                ctx.lineWidth = 2 * scale;
                ctx.stroke();
             }
        }
    };

    let animationId: number;
    const loop = () => {
        render();
        animationId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
        window.removeEventListener('resize', resize);
        cancelAnimationFrame(animationId);
    };
  }, [activeLocationId, hoveredHex, locations, offset, scale, activeWorld]);


  // Interaction Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
      setIsDragging(true);
      lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    
    // Pan Logic
    if (isDragging) {
        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;
        setOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
        lastMousePos.current = { x: e.clientX, y: e.clientY };
    }

    // Hover Logic
    const rect = canvasRef.current.getBoundingClientRect();
    const cx = canvasRef.current.width / 2 + offset.x;
    const cy = canvasRef.current.height / 2 + offset.y;
    
    // Mouse Pos relative to Center, descaled
    const mx = (e.clientX - rect.left - cx) / scale;
    const my = (e.clientY - rect.top - cy) / scale;

    const { q, r } = pixelToHex(mx, my);
    
    if (Math.abs(q) <= MAP_RADIUS && Math.abs(r) <= MAP_RADIUS && Math.abs(-q-r) <= MAP_RADIUS) {
        const existing = locations.find(l => l.q === q && l.r === r);
        setHoveredHex({ q, r, data: existing || null });
        if (onLocationHover) onLocationHover(existing || null);
    } else {
        setHoveredHex(null);
        if (onLocationHover) onLocationHover(null);
    }
  };

  const handleMouseUp = () => {
      setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
      const zoomSensitivity = 0.001;
      const newScale = Math.min(Math.max(0.3, scale - e.deltaY * zoomSensitivity), 3.0);
      setScale(newScale);
  };

  // Generate Legend Items based on current world context
  const legendItems = useMemo(() => {
      const items = new Set<TerrainType>();
      // Always include types from defined regions
      activeWorld.regions?.forEach(r => items.add(r.biome));
      // Add existing location types
      locations.forEach(l => items.add(l.type));
      return Array.from(items).sort();
  }, [locations, activeWorld]);

  return (
    <div ref={containerRef} className="relative w-full h-full bg-[#1e1e24] overflow-hidden group select-none">
      <canvas
        ref={canvasRef}
        className={`block w-full h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => { setIsDragging(false); setHoveredHex(null); }}
        onWheel={handleWheel}
      />
      
      {/* Legend Sidebar */}
      <div className="absolute top-20 right-4 bg-black/80 border border-white/10 p-4 rounded-lg backdrop-blur-md shadow-2xl max-h-[70%] overflow-y-auto scrollbar-hide z-10 w-40">
          <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 border-b border-white/10 pb-2">Topography</h3>
          <div className="flex flex-col gap-2">
              {legendItems.map(type => (
                  <div key={type} className="flex items-center gap-2 group/item">
                      <div className="w-3 h-3 rounded-sm border border-white/20 shadow-sm transition-transform group-hover/item:scale-125" style={{ backgroundColor: getTerrainColor(type) }}></div>
                      <span className="text-[10px] text-gray-300 uppercase tracking-wider">{type.replace('_', ' ')}</span>
                  </div>
              ))}
          </div>
      </div>

      {/* Controls Hint */}
      <div className="absolute bottom-4 left-4 text-[10px] text-gray-500 font-mono pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
          LMB: PAN • SCROLL: ZOOM
      </div>

      {/* Hover Tooltip */}
      {hoveredHex && hoveredHex.data && (
        <div className="absolute top-4 left-4 z-20 bg-black/90 border border-white/20 p-4 rounded-lg backdrop-blur-md shadow-2xl max-w-xs pointer-events-none animate-in fade-in zoom-in-95 duration-200">
            <div className="text-white font-bold text-sm uppercase tracking-wider mb-1 flex items-center gap-2">
               {hoveredHex.data.name}
            </div>
            <div 
              className="text-[10px] font-bold px-2 py-0.5 rounded inline-block mb-2 uppercase"
              style={{ backgroundColor: getTerrainColor(hoveredHex.data.type), color: 'rgba(0,0,0,0.7)' }}
            >
              {hoveredHex.data.type}
            </div>
            <div className="text-gray-300 text-xs leading-relaxed border-t border-white/10 pt-2">
               {hoveredHex.data.description}
            </div>
        </div>
      )}
    </div>
  );
};
