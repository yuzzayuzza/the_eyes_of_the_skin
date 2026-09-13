import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Eye, ChevronRight, VolumeX } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export const Act1Eye: React.FC<Props> = ({ onComplete }) => {
  const [rotation, setRotation] = useState({ x: 12, y: -18 });
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    setRotation((prev) => ({
      x: Math.max(-50, Math.min(50, prev.x - dy * 0.25)),
      y: prev.y + dx * 0.3,
    }));
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const handleTriggerNext = () => {
    onComplete();
  };

  return (
    <div
      id="act1-eye-container"
      className="relative w-full h-full bg-[#f4f4f2] text-[#1c1d1f] flex flex-col justify-between overflow-hidden cursor-crosshair select-none transition-colors duration-1000"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      {/* CAD Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              'linear-gradient(to right, #00000012 1px, transparent 1px), linear-gradient(to bottom, #00000012 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Top Header info - Minimal Architectural CAD Aesthetic */}
      <header className="relative z-10 p-6 md:p-8 flex items-center justify-between border-b border-[#00000010]">
        <div className="flex items-center space-x-3">
          <div className="w-2.5 h-2.5 bg-[#1c1d1f] rounded-none"></div>
          <div>
            <span className="font-cinzel text-xs tracking-widest uppercase text-[#737578]">Act I / Retinal Space</span>
            <h2 className="font-garamond text-xl md:text-2xl tracking-wide font-normal">视网膜建筑 · 纯粹的观看</h2>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-xs font-mono text-[#8a8c90]">
          <span className="flex items-center gap-1.5 bg-[#eae9e5] px-2.5 py-1">
            <VolumeX className="w-3.5 h-3.5 text-[#9a9c9f]" />
            SILENT (0.0 dB)
          </span>
          <span className="hidden sm:inline-block border border-[#d5d4ce] px-2.5 py-1">
            ROT: {rotation.y.toFixed(1)}° / {rotation.x.toFixed(1)}°
          </span>
        </div>
      </header>

      {/* Mathematically Closed, Standard, Pristine Architectural Gallery Pavilion (No Clipping) */}
      <main className="relative flex-1 flex items-center justify-center perspective-[1200px] overflow-hidden">
        <div
          className="relative w-[440px] h-[300px] transition-transform duration-75 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          }}
        >
          {/* Back Wall (Width 440px, Height 300px, Z: -180px) */}
          <div
            className="absolute inset-0 bg-gradient-to-b from-[#fbfbf9] via-[#f0efe9] to-[#e4e2da] border border-[#cfcdc3] flex flex-col justify-between p-6"
            style={{
              transform: 'translateZ(-180px)',
              backfaceVisibility: 'hidden',
            }}
          >
            <div className="w-full flex justify-between text-[9px] font-mono text-[#a5a39a] tracking-widest">
              <span>ELEVATION NORTH</span>
              <span>GRID A-1..A-4</span>
            </div>
            <div className="w-48 h-36 self-center border border-[#00000010] bg-[#eae8df]/40 flex items-center justify-center text-[10px] font-mono text-[#949289] tracking-widest">
              NICHE DISPLAY
            </div>
            <div className="text-[9px] font-mono tracking-widest text-[#a8a69d] text-center">
              MIESIAN GALLERY PLAN / 1:50
            </div>
          </div>

          {/* Floor Plane (Width 440px, Depth 360px, Y: +150px, rotateX(90deg)) */}
          <div
            className="absolute left-0 w-[440px] h-[360px] bg-[#e6e4dc] border border-[#c4c1b5]"
            style={{
              top: '-30px',
              transform: 'translateY(150px) rotateX(90deg)',
              boxShadow: 'inset 0 0 50px rgba(0,0,0,0.06)',
            }}
          >
            <div
              className="w-full h-full"
              style={{
                backgroundImage:
                  'linear-gradient(to right, #b4b1a5 1px, transparent 1px), linear-gradient(to bottom, #b4b1a5 1px, transparent 1px)',
                backgroundSize: '44px 45px',
              }}
            />
          </div>

          {/* Ceiling Plane (Width 440px, Depth 360px, Y: -150px, rotateX(-90deg)) */}
          <div
            className="absolute left-0 w-[440px] h-[360px] bg-[#faf9f6] border border-[#d6d4c8]"
            style={{
              top: '-30px',
              transform: 'translateY(-150px) rotateX(-90deg)',
            }}
          >
            {/* Flush linear architectural skylight recess */}
            <div className="absolute inset-x-12 top-10 bottom-10 bg-[#ffffff] border border-[#c2bfb2] shadow-inner flex items-center justify-center">
              <div className="w-full h-2 bg-[#eae8de] opacity-60" />
            </div>
          </div>

          {/* Left Colonnade Screen (Width 360px, Height 300px, X: -220px, rotateY(90deg)) */}
          <div
            className="absolute top-0 w-[360px] h-[300px] border-y border-l border-[#c8c5b9] flex justify-between items-stretch px-2 pointer-events-none"
            style={{
              left: '40px',
              transform: 'translateX(-220px) rotateY(90deg)',
              background: 'linear-gradient(to right, rgba(240,238,232,0.6), rgba(240,238,232,0.1))',
            }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-5 h-full bg-gradient-to-r from-[#ffffff] via-[#eeede7] to-[#d3d0c4] border-x border-[#bcb8a9] shadow-sm"
              />
            ))}
          </div>

          {/* Right Glazing Screen (Width 360px, Height 300px, X: +220px, rotateY(-90deg)) */}
          <div
            className="absolute top-0 w-[360px] h-[300px] border-y border-r border-[#c8c5b9] flex flex-col justify-between p-3 pointer-events-none"
            style={{
              left: '40px',
              transform: 'translateX(220px) rotateY(-90deg)',
              background: 'linear-gradient(to left, rgba(248,247,243,0.7), rgba(240,238,232,0.15))',
            }}
          >
            <div className="w-full h-full border border-[#00000010] grid grid-cols-3 grid-rows-2 gap-1 p-1">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border border-[#b8b5a7]/40 bg-[#ffffff]/30" />
              ))}
            </div>
          </div>

          {/* Center Pedestal & Geometric Form firmly grounded on floor plane */}
          <div
            className="absolute left-1/2 -ml-16 w-32 flex flex-col items-center pointer-events-none"
            style={{
              bottom: 0,
              transform: 'translateZ(0px)',
            }}
          >
            {/* Pure Platonic Minimalist Sculpture Cube */}
            <div
              className="w-16 h-16 bg-gradient-to-tr from-[#ebe9df] via-[#ffffff] to-[#d6d3c7] border border-[#aba798] shadow-md mb-0 flex items-center justify-center text-[9px] font-mono text-[#8a877c]"
              style={{
                transform: 'rotateX(15deg) rotateY(25deg)',
              }}
            >
              FORM
            </div>

            {/* Pedestal Stand cleanly touching floor */}
            <div className="w-24 h-24 bg-gradient-to-b from-[#eeece4] to-[#dedbd0] border border-[#bdbab0] shadow-md flex items-center justify-center text-[8px] font-mono text-[#9b988d]">
              PEDESTAL
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Architectural Bar & Transition */}
      <footer className="relative z-10 p-6 md:p-8 bg-[#ebeae6]/90 border-t border-[#00000010] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 text-xs font-mono text-[#828079] mb-1">
            <Eye className="w-3.5 h-3.5 text-[#1c1d1f]" />
            <span>JUHANI PALLASMAA · 《THE EYES OF THE SKIN》</span>
          </div>
          <p className="font-garamond text-base sm:text-lg leading-relaxed text-[#2a2b2e]">
            “视觉将世界变成一件对象，我们退后观看它。没有声音，没有体温，没有磨损。完美的无菌效果图剥夺了身体的居留权。”
          </p>
        </div>

        {/* Right Action: Pure minimal arrow button */}
        <div className="flex items-center justify-end w-full sm:w-auto">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            onClick={handleTriggerNext}
            className="w-12 h-12 rounded-full border border-[#00000018] bg-[#1c1d1f] text-[#f4f4f2] hover:bg-[#34363a] flex items-center justify-center shadow-md transition-colors cursor-pointer"
            aria-label="下一步"
            title="下一步"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>
      </footer>
    </div>
  );
};
