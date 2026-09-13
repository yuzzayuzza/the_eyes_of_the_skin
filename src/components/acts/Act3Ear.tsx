import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEngine } from '../../audio/soundEngine';
import { ChevronRight, Radio } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

interface MaterialNode {
  id: string;
  nameZh: string;
  nameEn: string;
  material: 'stone' | 'wood' | 'water' | 'fabric';
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  discovered: boolean;
}

interface AcousticPulse {
  id: number;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  opacity: number;
  material: 'stone' | 'wood' | 'water' | 'fabric';
}

export const Act3Ear: React.FC<Props> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pulses, setPulses] = useState<AcousticPulse[]>([]);
  const [activeMaterial, setActiveMaterial] = useState<'stone' | 'wood' | 'water' | 'fabric'>('stone');
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 50 });
  const [showInitialPrompt, setShowInitialPrompt] = useState(true);
  const nextPulseId = useRef(0);

  const [nodes, setNodes] = useState<MaterialNode[]>([
    {
      id: 'stone-pillar',
      nameZh: '粗粝石柱群',
      nameEn: 'Monolithic Stone Arcade',
      material: 'stone',
      x: 24,
      y: 35,
      discovered: false,
    },
    {
      id: 'timber-bridge',
      nameZh: '老杉木拱梁',
      nameEn: 'Ancient Timber Truss',
      material: 'wood',
      x: 75,
      y: 32,
      discovered: false,
    },
    {
      id: 'cistern',
      nameZh: '地下静水池',
      nameEn: 'Subterranean Cistern',
      material: 'water',
      x: 35,
      y: 72,
      discovered: false,
    },
    {
      id: 'linen-screen',
      nameZh: '重磅亚麻帷幕',
      nameEn: 'Heavy Linen Portiere',
      material: 'fabric',
      x: 78,
      y: 75,
      discovered: false,
    },
  ]);

  const allDiscovered = useMemo(() => nodes.every((n) => n.discovered), [nodes]);

  // Initial prompt auto-fades out after 2.5s
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowInitialPrompt(false);
    }, 2600);
    return () => clearTimeout(timer);
  }, []);

  // Pulse animation loop
  useEffect(() => {
    let animId: number;
    const loop = () => {
      setPulses((prev) =>
        prev
          .map((p) => ({
            ...p,
            radius: p.radius + 4.8,
            opacity: Math.max(0, p.opacity - 0.012),
          }))
          .filter((p) => p.opacity > 0 && p.radius < p.maxRadius)
      );
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, []);

  const emitSoundAt = (xPct: number, yPct: number, forcedMaterial?: 'stone' | 'wood' | 'water' | 'fabric') => {
    setShowInitialPrompt(false);
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pixelX = (xPct / 100) * rect.width;
    const pixelY = (yPct / 100) * rect.height;

    // Detect closest node
    let closestNode = nodes[0];
    let minDist = 999;
    nodes.forEach((n) => {
      const dist = Math.hypot(n.x - xPct, n.y - yPct);
      if (dist < minDist) {
        minDist = dist;
        closestNode = n;
      }
    });

    const mat = forcedMaterial || (minDist < 18 ? closestNode.material : activeMaterial);
    setActiveMaterial(mat);

    // Procedural sound
    const pan = (xPct / 100) * 2 - 1;
    soundEngine.playFootstep(mat, pan);

    // Reveal node if within reach
    if (minDist < 18) {
      setNodes((prev) =>
        prev.map((n) => (n.id === closestNode.id ? { ...n, discovered: true } : n))
      );
    }

    // Add acoustic wave
    setPulses((prev) => [
      ...prev,
      {
        id: nextPulseId.current++,
        x: pixelX,
        y: pixelY,
        radius: 12,
        maxRadius: Math.max(rect.width, rect.height) * 0.75,
        opacity: 0.85,
        material: mat,
      },
    ]);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;

    setPlayerPos({ x: xPct, y: yPct });
    emitSoundAt(xPct, yPct);
  };

  return (
    <div
      ref={containerRef}
      id="act3-ear-container"
      onClick={handleClick}
      className="relative w-full h-full bg-[#08090a] text-[#dfdcd5] flex flex-col justify-between overflow-hidden cursor-crosshair select-none"
    >
      {/* Background Architectural Plan in darkness */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
        <g stroke="#6e685e" strokeWidth="0.75" fill="none">
          <line x1="15%" y1="20%" x2="85%" y2="20%" strokeDasharray="3 6" />
          <line x1="15%" y1="50%" x2="85%" y2="50%" strokeDasharray="3 6" />
          <line x1="15%" y1="82%" x2="85%" y2="82%" strokeDasharray="3 6" />
          <line x1="50%" y1="10%" x2="50%" y2="90%" strokeDasharray="2 4" />
          <path d="M 200,200 A 60,60 0 0,0 320,200" />
          <path d="M 600,400 A 80,80 0 0,1 760,400" />
        </g>
      </svg>

      {/* Acoustic Wavefront Layers */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {pulses.map((p) => {
          const color =
            p.material === 'stone'
              ? '#eae6dc'
              : p.material === 'wood'
              ? '#cbb898'
              : p.material === 'water'
              ? '#9db2b8'
              : '#958d86';

          return (
            <g key={p.id}>
              <circle
                cx={p.x}
                cy={p.y}
                r={p.radius}
                fill="none"
                stroke={color}
                strokeWidth="1.6"
                strokeOpacity={p.opacity * 0.8}
              />
              <circle
                cx={p.x}
                cy={p.y}
                r={p.radius * 0.7}
                fill="none"
                stroke={color}
                strokeWidth="0.8"
                strokeOpacity={p.opacity * 0.35}
              />
            </g>
          );
        })}
      </svg>

      {/* Material Discovery Nodes: Initially ONLY subtle dots, name appears ONLY upon sound activation */}
      {nodes.map((node) => {
        return (
          <div
            key={node.id}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer"
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
            onClick={(e) => {
              e.stopPropagation();
              setPlayerPos({ x: node.x, y: node.y });
              emitSoundAt(node.x, node.y, node.material);
            }}
          >
            {/* Minimalist dot/ring */}
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-700 ${
                node.discovered
                  ? 'border border-[#d0c9bd]/50 bg-[#16181b]/70 shadow-[0_0_18px_rgba(208,201,189,0.2)]'
                  : 'border border-dashed border-[#34322d] bg-transparent'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  node.discovered ? 'bg-[#dfdcd5] scale-125' : 'bg-[#48443c]'
                }`}
              />
            </div>

            {/* Name label appears ONLY after sound has reached / discovered this node */}
            <AnimatePresence>
              {node.discovered && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute top-12 left-1/2 -translate-x-1/2 whitespace-nowrap text-center pointer-events-none"
                >
                  <div className="font-garamond text-xs sm:text-sm text-[#ece8e0] tracking-wider">
                    {node.nameZh}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {/* Player Location Marker */}
      <div
        className="absolute w-5 h-5 -ml-2.5 -mt-2.5 pointer-events-none rounded-full border border-[#dedbd3]/70 flex items-center justify-center transition-all duration-150 ease-out"
        style={{
          left: `${playerPos.x}%`,
          top: `${playerPos.y}%`,
          boxShadow: '0 0 15px rgba(222, 219, 211, 0.25)',
        }}
      >
        <div className="w-1.5 h-1.5 bg-[#dedbd3] rounded-full" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 md:p-8 flex items-center justify-between border-b border-[#ffffff10]">
        <div>
          <span className="font-cinzel text-xs tracking-widest uppercase text-[#8c867b]">Act III / Acoustics</span>
          <h2 className="font-garamond text-xl md:text-2xl tracking-wide font-normal text-[#f2efe9]">
            声音的建筑 · 材质的共振
          </h2>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono text-[#a59e92]">
          <span className="flex items-center gap-1.5 border border-[#ffffff15] px-2.5 py-1">
            <Radio className="w-3.5 h-3.5 text-[#dedbd3]" />
            FOUND: {nodes.filter((n) => n.discovered).length} / {nodes.length}
          </span>
        </div>
      </header>

      {/* Brief initial prompt: only appears momentarily, then vanishes */}
      <main className="relative flex-1 flex flex-col items-center justify-center pointer-events-none px-6 text-center">
        <AnimatePresence>
          {showInitialPrompt && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.6 }}
              className="text-xs font-mono tracking-widest text-[#a8a396]"
            >
              点击各处散发声波
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 md:p-8 bg-[#08090a]/90 border-t border-[#ffffff10] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="max-w-xl">
          <p className="font-garamond text-base sm:text-lg leading-relaxed text-[#c7c3b8]">
            “一个脚步声的回响，就可以告诉身体：房间有多大、墙离你多远、材料是软还是硬。声音是看不见的建筑绘图工具。”
          </p>
        </div>

        {/* Minimal arrow button */}
        <div className="flex items-center justify-end w-full sm:w-auto">
          {allDiscovered && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={onComplete}
              className="w-12 h-12 rounded-full border border-[#ffffff20] bg-[#dfdcd5] text-[#08090a] hover:bg-[#ece8df] flex items-center justify-center shadow-lg transition-colors cursor-pointer"
              aria-label="下一步"
              title="下一步"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </footer>
    </div>
  );
};
