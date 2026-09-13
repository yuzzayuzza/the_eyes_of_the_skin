import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { soundEngine } from '../../audio/soundEngine';
import { ChevronRight, Sparkle, History, Flame } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

interface MemoryTrace {
  id: number;
  x: number;
  y: number;
  type: 'step' | 'touch' | 'pause';
  intensity: number; // 0 to 1
  createdTime: number;
}

export const Act6Memory: React.FC<Props> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [traces, setTraces] = useState<MemoryTrace[]>([]);
  const [stats, setStats] = useState({ steps: 0, touches: 0, pauses: 0 });
  const [moveScore, setMoveScore] = useState(0);
  const nextId = useRef(0);
  const lastPos = useRef({ x: 0, y: 0 });
  const pauseTimer = useRef<number | null>(null);

  // Canvas render loop for thermal persistence and slow patina aging
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      // Clear with slight persistence
      ctx.fillStyle = '#08090b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render traces
      const now = Date.now();
      traces.forEach((t) => {
        const ageSec = (now - t.createdTime) / 1000;
        // Thermal decay: slowly settles into a warm permanent patina
        const alpha = Math.max(0.22, 1 - ageSec * 0.05);

        ctx.save();
        if (t.type === 'step') {
          // Footprint impression: small delicate circular stone imprint
          ctx.beginPath();
          ctx.arc(t.x, t.y, 4, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(215, 200, 175, ${alpha * 0.65})`;
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.fillStyle = `rgba(195, 175, 145, ${alpha * 0.2})`;
          ctx.fill();
        } else if (t.type === 'touch') {
          // Thermal warmth: soft radiating amber heat
          const grad = ctx.createRadialGradient(t.x, t.y, 2, t.x, t.y, 45);
          grad.addColorStop(0, `rgba(225, 150, 80, ${alpha * 0.85})`);
          grad.addColorStop(0.4, `rgba(195, 120, 50, ${alpha * 0.35})`);
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(t.x, t.y, 45, 0, Math.PI * 2);
          ctx.fill();
        } else if (t.type === 'pause') {
          // Pause beacon: lingering golden lantern
          const pulse = Math.sin(now * 0.003 + t.id) * 4;
          const grad = ctx.createRadialGradient(t.x, t.y, 4, t.x, t.y, 70 + pulse);
          grad.addColorStop(0, `rgba(240, 215, 160, ${alpha * 0.9})`);
          grad.addColorStop(0.3, `rgba(210, 175, 110, ${alpha * 0.4})`);
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(t.x, t.y, 70 + pulse, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [traces]);

  // Handle movements & steps
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dist = Math.hypot(x - lastPos.current.x, y - lastPos.current.y);
    if (dist > 4) {
      setMoveScore((prev) => Math.min(100, prev + dist * 0.04));
    }

    if (dist > 35) {
      lastPos.current = { x, y };

      // Play soft footstep
      soundEngine.playFootstep('stone', (x / rect.width) * 2 - 1);

      setTraces((prev) => [
        ...prev.slice(-70), // Keep memory history bounded
        {
          id: nextId.current++,
          x,
          y,
          type: 'step',
          intensity: 1,
          createdTime: Date.now(),
        },
      ]);
      setStats((s) => ({ ...s, steps: s.steps + 1 }));

      // Reset pause timer
      if (pauseTimer.current) clearTimeout(pauseTimer.current);
      pauseTimer.current = window.setTimeout(() => {
        // Player paused: deposit lingering memory beacon
        setTraces((prev) => [
          ...prev,
          {
            id: nextId.current++,
            x,
            y,
            type: 'pause',
            intensity: 1,
            createdTime: Date.now(),
          },
        ]);
        setStats((s) => ({ ...s, pauses: s.pauses + 1 }));
        soundEngine.playFootstep('wood', (x / rect.width) * 2 - 1);
      }, 1200);
    }
  };

  // Clicking / Touching leaves thermal handprint
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setTraces((prev) => [
      ...prev,
      {
        id: nextId.current++,
        x,
        y,
        type: 'touch',
        intensity: 1,
        createdTime: Date.now(),
      },
    ]);
    setStats((s) => ({ ...s, touches: s.touches + 1 }));
    setMoveScore((prev) => Math.min(100, prev + 8));
    soundEngine.playFootstep('clay', (x / rect.width) * 2 - 1);

    if ('vibrate' in navigator) {
      try { navigator.vibrate(25); } catch {}
    }
  };

  // Resize canvas
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvasRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth;
        canvasRef.current.height = containerRef.current.clientHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Steps, pauses (驻留), and touches kindle the warm candlelight illuminating the carved stone words
  // Progression is significantly restrained, requiring substantial footsteps and dwelling before text becomes noticeably brighter
  const rawScore = stats.steps * 0.7 + stats.pauses * 2.6 + stats.touches * 1.0 + moveScore * 0.04;
  const candleProgress = Math.min(
    1,
    Math.max(0.02, Math.pow(Math.min(1, rawScore / 100), 1.4))
  );
  const isSufficient = candleProgress >= 0.52;

  return (
    <div
      ref={containerRef}
      id="act6-memory-container"
      onPointerMove={handlePointerMove}
      onPointerDown={handlePointerDown}
      className="relative w-full h-full bg-[#08090b] text-[#e0dbcf] flex flex-col justify-between overflow-hidden cursor-crosshair select-none"
    >
      {/* Living Memory Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Header */}
      <header className="relative z-10 p-6 md:p-8 flex items-center justify-between border-b border-[#ffffff10] bg-[#08090b]/80 backdrop-blur-sm">
        <div>
          <span className="font-cinzel text-xs tracking-widest uppercase text-[#8f887a]">Act VI / Temporal Trace</span>
          <h2 className="font-garamond text-xl md:text-2xl tracking-wide font-normal text-[#f4efe4]">
            记忆与时间 · 身体重构的空间
          </h2>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono text-[#a1998b]">
          <span className="flex items-center gap-1.5 border border-[#ffffff15] px-2.5 py-1">
            <Flame className="w-3.5 h-3.5 text-[#e18e47]" />
            体温: {stats.touches}
          </span>
          <span className="flex items-center gap-1.5 border border-[#ffffff15] px-2.5 py-1">
            <History className="w-3.5 h-3.5 text-[#c8b99f]" />
            足迹: {stats.steps}
          </span>
          <span className="flex items-center gap-1.5 border border-[#ffffff15] px-2.5 py-1">
            <Sparkle className="w-3.5 h-3.5 text-[#f2d184]" />
            驻留: {stats.pauses}
          </span>
        </div>
      </header>

      {/* Center Guidance: "我曾来过这里" emerges like candlelight gradually illuminating chiseled stone */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center pointer-events-none px-6 text-center">
        <div className="flex flex-col items-center justify-center transition-all duration-700 max-w-lg">
          {/* Carved stone letters illuminated by grazing candlelight */}
          <p
            className="font-garamond text-xl sm:text-2xl md:text-3xl tracking-[0.25em] sm:tracking-[0.35em] font-normal transition-all duration-500 select-none"
            style={{
              opacity: Math.max(0.04, candleProgress),
              color:
                candleProgress > 0.72
                  ? '#fff8ee'
                  : candleProgress > 0.48
                  ? '#dfc8a8'
                  : candleProgress > 0.28
                  ? '#967d5e'
                  : candleProgress > 0.14
                  ? '#504537'
                  : '#242019',
              filter: `blur(${Math.max(0, (1 - candleProgress) * 2.2)}px)`,
              textShadow:
                candleProgress > 0.22
                  ? `0 -1px 2px rgba(0,0,0,0.95), 0 1px 2px rgba(255,225,170,${(candleProgress - 0.22) * 0.95}), 0 0 ${10 + candleProgress * 24}px rgba(240,165,70,${(candleProgress - 0.18) * 0.6})`
                  : '0 -1px 1px rgba(0,0,0,0.95)',
              transform: `scale(${0.96 + candleProgress * 0.04})`,
            }}
          >
            “我曾来过这里”
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 md:p-8 bg-[#08090b]/90 border-t border-[#ffffff10] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="max-w-xl">
          <p className="font-garamond text-base sm:text-lg leading-relaxed text-[#c7c1b5]">
            “有时候你忘记了一间房子的布局，却记得下午的光、门把手冰凉的触感、楼梯踩上去的声音。人记住的往往不是空间本身，而是‘自己曾怎样存在于那个空间里’。”
          </p>
        </div>

        {/* Minimal arrow button */}
        <div className="flex items-center justify-end w-full sm:w-auto">
          {isSufficient && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={onComplete}
              className="w-12 h-12 rounded-full border border-[#ffffff20] bg-[#dfd9cc] text-[#08090b] hover:bg-[#ede8dc] flex items-center justify-center shadow-lg transition-colors cursor-pointer"
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
