import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundEngine } from '../../audio/soundEngine';
import { ChevronRight, Volume2 } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

interface Wave {
  id: number;
  x: number;
  y: number;
  radius: number;
  opacity: number;
}

export const Act2Blindness: React.FC<Props> = ({ onComplete }) => {
  const [playerPos, setPlayerPos] = useState({ x: 0, y: 0 });
  const [stepsCount, setStepsCount] = useState(0);
  const [waves, setWaves] = useState<Wave[]>([]);
  const [poeticStage, setPoeticStage] = useState<'none' | 'first' | 'gap' | 'second' | 'done'>('none');
  const containerRef = useRef<HTMLDivElement>(null);
  const nextWaveId = useRef(0);

  // Initialize center position on mount
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPlayerPos({ x: rect.width / 2, y: rect.height / 2 });
    }
  }, []);

  const sequenceTriggeredRef = useRef(false);
  const timeoutIdsRef = useRef<number[]>([]);

  // Sequence: sentence 1 appears -> stays several seconds -> slowly fades out -> gap -> sentence 2 appears -> stays -> slowly fades out -> pure darkness
  useEffect(() => {
    if (stepsCount >= 4 && !sequenceTriggeredRef.current) {
      sequenceTriggeredRef.current = true;
      setPoeticStage('first');

      // Sentence 1 stays for 3.6s, then fades out into gap
      const t1 = window.setTimeout(() => {
        setPoeticStage('gap');
      }, 3600);

      // Sentence 2 appears after gap
      const t2 = window.setTimeout(() => {
        setPoeticStage('second');
      }, 5400);

      // Sentence 2 stays for 3.6s, then fades out completely
      const t3 = window.setTimeout(() => {
        setPoeticStage('done');
      }, 9200);

      timeoutIdsRef.current = [t1, t2, t3];
    }
  }, [stepsCount]);

  useEffect(() => {
    return () => {
      timeoutIdsRef.current.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  // Wave expansion animation loop
  useEffect(() => {
    let animId: number;
    const updateWaves = () => {
      setWaves((prev) =>
        prev
          .map((w) => ({
            ...w,
            radius: w.radius + 5.5,
            opacity: w.opacity - 0.012,
          }))
          .filter((w) => w.opacity > 0)
      );
      animId = requestAnimationFrame(updateWaves);
    };
    animId = requestAnimationFrame(updateWaves);
    return () => cancelAnimationFrame(animId);
  }, []);

  const triggerStep = (x: number, y: number) => {
    setPlayerPos({ x, y });
    setStepsCount((c) => c + 1);

    // Audio step
    const pan = containerRef.current
      ? (x / containerRef.current.clientWidth) * 2 - 1
      : 0;
    soundEngine.playFootstep('stone', pan);

    // Haptic vibration on mobile
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(20);
      } catch {
        // Safe fallback
      }
    }

    // Add acoustic wave
    setWaves((prev) => [
      ...prev,
      {
        id: nextWaveId.current++,
        x,
        y,
        radius: 10,
        opacity: 0.9,
      },
    ]);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    triggerStep(x, y);
  };

  return (
    <div
      ref={containerRef}
      id="act2-blindness-container"
      onClick={handleClick}
      className="relative w-full h-full bg-[#0a0b0c] text-[#dedbd3] flex flex-col justify-between overflow-hidden cursor-pointer select-none"
    >
      {/* Deep Shadow Vignette Layer */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-300"
        style={{
          background: `radial-gradient(circle 130px at ${playerPos.x}px ${playerPos.y}px, rgba(16,18,20,0.12) 0%, rgba(9,10,12,0.94) 85%, rgba(6,7,8,0.98) 100%)`,
        }}
      />

      {/* Hidden Architectural Contours in the Stone Chamber */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
        <g stroke="#807a6f" strokeWidth="1" fill="none" strokeDasharray="4 6">
          <rect x="8%" y="15%" width="84%" height="70%" />
          <rect x="25%" y="30%" width="50%" height="40%" />
          <circle cx="20%" cy="30%" r="22" />
          <circle cx="80%" cy="30%" r="22" />
          <circle cx="20%" cy="70%" r="22" />
          <circle cx="80%" cy="70%" r="22" />
          <circle cx="50%" cy="50%" r="35" strokeDasharray="2 3" />
        </g>
      </svg>

      {/* Dynamic Acoustic Sound Waves */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {waves.map((w) => (
          <g key={w.id}>
            <circle
              cx={w.x}
              cy={w.y}
              r={w.radius}
              fill="none"
              stroke="#dedad2"
              strokeWidth="1.5"
              strokeOpacity={w.opacity * 0.75}
            />
            <circle
              cx={w.x}
              cy={w.y}
              r={w.radius * 0.8}
              fill="none"
              stroke="#b5ad9e"
              strokeWidth="0.8"
              strokeOpacity={w.opacity * 0.4}
            />
          </g>
        ))}
      </svg>

      {/* Player presence aura */}
      <div
        className="absolute w-6 h-6 -ml-3 -mt-3 pointer-events-none rounded-full border border-[#f0eee9]/60 flex items-center justify-center transition-transform duration-75"
        style={{
          left: `${playerPos.x}px`,
          top: `${playerPos.y}px`,
          boxShadow: '0 0 25px rgba(240, 238, 233, 0.25)',
        }}
      >
        <div className="w-1.5 h-1.5 bg-[#f0eee9] rounded-full" />
      </div>

      {/* Header */}
      <header className="relative z-10 p-6 md:p-8 flex items-center justify-between border-b border-[#ffffff10]">
        <div>
          <span className="font-cinzel text-xs tracking-widest uppercase text-[#878278]">Act II / Dissolution</span>
          <h2 className="font-garamond text-xl md:text-2xl tracking-wide font-normal text-[#f0eee9]">
            失明与初醒 · 听觉的诞生
          </h2>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono text-[#a19c90]">
          <span className="flex items-center gap-1.5 border border-[#ffffff15] px-2.5 py-1">
            <Volume2 className="w-3.5 h-3.5 text-[#dedbd3]" />
            STEP: {stepsCount}
          </span>
        </div>
      </header>

      {/* Main Interactive Space: Two sentences sequentially appear, slowly fade away, then vanish */}
      <main className="relative flex-1 flex flex-col items-center justify-center pointer-events-none px-6 text-center">
        <AnimatePresence mode="wait">
          {poeticStage === 'first' && (
            <motion.p
              key="sentence-1"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6, filter: 'blur(2px)' }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="font-garamond text-xl sm:text-2xl text-[#eceae5] tracking-widest max-w-lg"
            >
              脚步声碰到了看不见的石墙。
            </motion.p>
          )}

          {poeticStage === 'second' && (
            <motion.p
              key="sentence-2"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6, filter: 'blur(2px)' }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              className="font-garamond text-xl sm:text-2xl text-[#dfdbd0] tracking-widest max-w-lg"
            >
              声音是一把绘制空间的尺。
            </motion.p>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 md:p-8 bg-[#0a0b0c]/90 border-t border-[#ffffff10] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="max-w-xl">
          <p className="font-garamond text-base sm:text-lg leading-relaxed text-[#c7c4bb]">
            “在极度的清晰中，想象力沉睡了。唯有当视觉受阻，整个身体的毛孔与骨骼才开始重新聆听空间的轮廓。”
          </p>
        </div>

        {/* Minimal arrow button, revealed once sufficient steps are made */}
        <div className="flex items-center justify-end w-full sm:w-auto">
          {stepsCount >= 3 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={(e) => {
                e.stopPropagation();
                onComplete();
              }}
              className="w-12 h-12 rounded-full border border-[#ffffff20] bg-[#dedbd3] text-[#0a0b0c] hover:bg-[#eae8e1] flex items-center justify-center shadow-lg transition-colors cursor-pointer"
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
