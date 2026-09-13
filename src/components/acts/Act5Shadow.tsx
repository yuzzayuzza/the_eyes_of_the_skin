import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Moon } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export const Act5Shadow: React.FC<Props> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [distanceToCenter, setDistanceToCenter] = useState(0.8);
  const [pageStayedSec, setPageStayedSec] = useState(0);
  const [hasDiscoveredRule, setHasDiscoveredRule] = useState(false);

  // Default cursor to edge
  useEffect(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCursorPos({ x: rect.width * 0.15, y: rect.height * 0.15 });
    }
  }, []);

  // Track page stay duration in seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setPageStayedSec((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCursorPos({ x, y });

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const dist = Math.hypot(x - centerX, y - centerY);
    const maxDist = Math.hypot(centerX, centerY);
    const norm = Math.min(1, Math.max(0, dist / (maxDist * 0.75)));
    setDistanceToCenter(norm);
  };

  // Rule discovery: unlocks the next button after exploring the page and moving around
  useEffect(() => {
    if (pageStayedSec >= 4 && (distanceToCenter >= 0.35 || distanceToCenter <= 0.28)) {
      setHasDiscoveredRule(true);
    }
  }, [pageStayedSec, distanceToCenter]);

  // Object visibility is inverted: closer to center = darker, further away = brighter & richer
  const visibility = Math.pow(distanceToCenter, 1.8);

  // Logic: Stayed at least 3 seconds, and mouse is in the penumbra boundary
  const hasStayedEnough = pageStayedSec >= 3;
  const isDirectCenter = distanceToCenter < 0.28;
  const isPenumbraZone = hasStayedEnough && distanceToCenter >= 0.35 && distanceToCenter <= 0.68;

  return (
    <div
      ref={containerRef}
      id="act5-shadow-container"
      onMouseMove={handleMouseMove}
      className="relative w-full h-full bg-[#070809] text-[#ded9ce] flex flex-col justify-between overflow-hidden cursor-default select-none"
    >
      {/* Dynamic Chiaroscuro & Penumbra Shadow Ambient */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle 380px at 50% 50%, rgba(195, 175, 140, ${visibility * 0.15}) 0%, rgba(7, 8, 9, 0.95) 75%)`,
        }}
      />

      {/* Header */}
      <header className="relative z-20 p-6 md:p-8 flex items-center justify-between border-b border-[#ffffff0e]">
        <div>
          <span className="font-cinzel text-xs tracking-widest uppercase text-[#8c8475]">Act V / Penumbra</span>
          <h2 className="font-garamond text-xl md:text-2xl tracking-wide font-normal text-[#f4efe4]">
            阴影的栖居 · 移开目光的凝视
          </h2>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono text-[#9b9385]">
          <span className="flex items-center gap-1.5 border border-[#ffffff15] px-2.5 py-1">
            <Moon className="w-3.5 h-3.5 text-[#dedad1]" />
            SHADOW FLUX: {(visibility * 100).toFixed(0)}%
          </span>
        </div>
      </header>

      {/* Center Sacred Artifact / Niche */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center pointer-events-none px-6">
        <div className="relative w-72 h-96 sm:w-80 sm:h-[420px] flex items-center justify-center">
          {/* Architectural Arch & Weathered Monolith */}
          <div
            className="absolute inset-0 rounded-t-full border border-[#8f8471]/30 transition-all duration-700 p-8 flex flex-col items-center justify-center"
            style={{
              opacity: Math.max(0.03, visibility),
              filter: `blur(${(1 - visibility) * 10}px)`,
              transform: `scale(${0.92 + visibility * 0.08})`,
              boxShadow: `inset 0 0 60px rgba(210, 185, 145, ${visibility * 0.2})`,
            }}
          >
            {/* Fine classical inner niche details */}
            <div className="w-full h-full rounded-t-full border border-[#d2c4aa]/40 flex flex-col items-center justify-center relative p-6">
              <div className="w-28 h-44 rounded-t-full bg-gradient-to-b from-[#e3d7be]/40 to-transparent border border-[#d6c7ab]/60 shadow-lg relative flex items-center justify-center">
                <div className="w-16 h-28 rounded-t-full border border-dashed border-[#ffffff40] opacity-70" />
                <div
                  className="absolute bottom-4 w-12 h-1 bg-[#c9bba1]/60"
                  style={{ boxShadow: '0 0 12px rgba(201, 187, 161, 0.4)' }}
                />
              </div>

              <div className="mt-6 text-center">
                <span className="font-cinzel text-xs tracking-widest text-[#d5c7ac]">
                  SACRED PENUMBRA
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Right-side Poetic Verses Column */}
      <div className="absolute right-6 sm:right-12 md:right-16 lg:right-28 top-1/2 -translate-y-1/2 pointer-events-none z-20 max-w-xs sm:max-w-sm text-left">
        <AnimatePresence mode="wait">
          {isDirectCenter && (
            <motion.div
              key="direct-stare"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8, filter: 'blur(2px)' }}
              transition={{ duration: 1.1, ease: 'easeInOut' }}
              className="font-garamond text-xl sm:text-2xl text-[#b8b09f] tracking-widest leading-relaxed text-left border-l border-[#ffffff18] pl-4 sm:pl-6 py-2"
            >
              <div className="text-[#ded6c5]">你试图直视</div>
              <div className="mt-2 text-[#99907f] text-lg sm:text-xl">浓烈的凝视将他掩埋于黑暗</div>
            </motion.div>
          )}

          {isPenumbraZone && !isDirectCenter && (
            <motion.div
              key="penumbra-verse"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8, filter: 'blur(2px)' }}
              transition={{ duration: 1.3, ease: 'easeInOut' }}
              className="font-garamond text-xl sm:text-2xl text-[#b8b09f] tracking-widest leading-relaxed text-left border-l border-[#ffffff18] pl-4 sm:pl-6 py-2"
            >
              <div className="text-[#ded6c5]">在半明半暗之间</div>
              <div className="mt-2 text-[#99907f] text-lg sm:text-xl">世界开始容纳想象</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cursor tracking faint indicator */}
      <div
        className="absolute w-3 h-3 -ml-1.5 -mt-1.5 pointer-events-none rounded-full border border-[#ded9ce]/40 transition-transform duration-75"
        style={{
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`,
        }}
      />

      {/* Footer */}
      <footer className="relative z-20 p-6 md:p-8 bg-[#070809]/90 border-t border-[#ffffff10] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="max-w-xl">
          <p className="font-garamond text-base sm:text-lg leading-relaxed text-[#c7c2b6]">
            “现代视觉文化追求亮、清楚、高清、无死角。但当一切都被完全暴露时，想象力就失去了居所。阴影不是信息的缺失，而是空间给予心灵的深邃呼吸。”
          </p>
        </div>

        {/* Minimal arrow button */}
        <div className="flex items-center justify-end w-full sm:w-auto">
          {hasDiscoveredRule && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={onComplete}
              className="w-12 h-12 rounded-full border border-[#ffffff20] bg-[#ded9ce] text-[#070809] hover:bg-[#ebe6db] flex items-center justify-center shadow-lg transition-colors cursor-pointer"
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
