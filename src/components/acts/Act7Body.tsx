import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { soundEngine } from '../../audio/soundEngine';
import { RotateCcw, BookOpen, Compass } from 'lucide-react';

interface Props {
  onRestart: () => void;
  onOpenPhilosophy: () => void;
}

interface Pulse {
  id: number;
  x: number;
  y: number;
  svgX: number;
  svgY: number;
}

export const Act7Body: React.FC<Props> = ({ onRestart, onOpenPhilosophy }) => {
  const [pulses, setPulses] = useState<Pulse[]>([]);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const nextPulseId = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  // Play final harmonic chord on enter
  useEffect(() => {
    soundEngine.playFinalRevelationChord();
  }, []);

  // Atmospheric dust motes and soft raking light drift
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const motes = Array.from({ length: 36 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.8 + 0.6,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -Math.random() * 0.35 - 0.1,
      alpha: Math.random() * 0.45 + 0.15,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Warm diagonal light beam
      const lightGrad = ctx.createLinearGradient(0, 0, canvas.width * 0.8, canvas.height);
      lightGrad.addColorStop(0, 'rgba(235, 215, 175, 0.08)');
      lightGrad.addColorStop(0.35, 'rgba(215, 185, 140, 0.03)');
      lightGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = lightGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Floating motes
      motes.forEach((m) => {
        m.x += m.speedX;
        m.y += m.speedY;
        if (m.y < 0) m.y = canvas.height;
        if (m.x < 0) m.x = canvas.width;
        if (m.x > canvas.width) m.x = 0;

        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 230, 200, ${m.alpha * 0.5})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

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

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseOffset({ x: nx * 18, y: ny * 12 });
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let svgX = 180;
    let svgY = 260;
    if (svgRef.current) {
      const svgRect = svgRef.current.getBoundingClientRect();
      svgX = ((e.clientX - svgRect.left) / svgRect.width) * 360;
      svgY = ((e.clientY - svgRect.top) / svgRect.height) * 520;
    }

    const id = nextPulseId.current++;
    setPulses((prev) => [...prev.slice(-4), { id, x, y, svgX, svgY }]);
    soundEngine.playSensoryResonance('pulse');
  };

  return (
    <div
      ref={containerRef}
      id="act7-body-container"
      onPointerMove={handlePointerMove}
      onClick={handleContainerClick}
      className="relative w-full h-full bg-[#08090b] text-[#e0dbd1] flex flex-col justify-between overflow-hidden select-none cursor-pointer"
    >
      {/* Background Architectural Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

      {/* Ripple pulses created on click */}
      <div className="absolute inset-0 pointer-events-none z-15 overflow-hidden">
        {pulses.map((p) => (
          <motion.div
            key={p.id}
            initial={{ scale: 0.1, opacity: 0.75 }}
            animate={{ scale: 3.6, opacity: 0 }}
            transition={{ duration: 2.4, ease: [0.1, 0.9, 0.2, 1] }}
            className="absolute -ml-16 -mt-16 w-32 h-32 rounded-full border border-[#d9cdb8]/40 pointer-events-none"
            style={{ left: p.x, top: p.y }}
          />
        ))}
      </div>

      {/* Top Header */}
      <header className="relative z-30 p-6 md:p-8 flex items-center justify-between border-b border-[#ffffff10] bg-[#08090b]/75 backdrop-blur-sm">
        <div>
          <span className="font-cinzel text-xs tracking-widest uppercase text-[#968e7e]">Act VII / Corporeal Space</span>
          <h2 className="font-garamond text-xl md:text-2xl tracking-wide font-normal text-[#f4efe4]">
            身体即空间 · 栖居之终章
          </h2>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono text-[#a39b8c]">
          <span className="flex items-center gap-1.5 border border-[#ffffff15] px-2.5 py-1">
            <Compass className="w-3.5 h-3.5 text-[#dedad1]" />
            THE LIVING MEMBRANE
          </span>
        </div>
      </header>

      {/* Main Interactive Stage: Abstract Poetic Spatial Figure & Epiphany */}
      <main className="relative z-20 flex-1 flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16 px-6 py-6 overflow-y-auto max-w-6xl mx-auto w-full">
        {/* Left: Minimal Abstract Spatial Axis / Writing of Dwelling (写意抽象形态) */}
        <div className="relative w-full max-w-[320px] sm:max-w-[360px] aspect-[360/520] flex items-center justify-center shrink-0">
          <svg
            ref={svgRef}
            viewBox="0 0 360 520"
            className="w-full h-full overflow-visible drop-shadow-[0_0_25px_rgba(215,195,160,0.06)]"
          >
            <defs>
              {/* Base Faint Axis Gradient (稍微变淡一点点点) */}
              <linearGradient id="axisGradFaint" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ded5c4" stopOpacity="0.45" />
                <stop offset="45%" stopColor="#b2a692" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#7a7061" stopOpacity="0.15" />
              </linearGradient>

              {/* Radiant Illuminated Axis Gradient for Click Wave */}
              <linearGradient id="axisGradLuminous" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
                <stop offset="45%" stopColor="#fbf3e2" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#e5d4b8" stopOpacity="0.85" />
              </linearGradient>

              {/* Dynamic Radial Light Mask created by clicks */}
              <mask id="clickWaveMask">
                <rect width="360" height="520" fill="black" />
                {pulses.map((p) => (
                  <motion.circle
                    key={`mask-circ-${p.id}`}
                    cx={p.svgX}
                    cy={p.svgY}
                    initial={{ r: 12, opacity: 1 }}
                    animate={{ r: 240, opacity: 0 }}
                    transition={{ duration: 2.5, ease: [0.1, 0.9, 0.2, 1] }}
                    fill="white"
                  />
                ))}
              </mask>
            </defs>

            {/* Subtle Vitruvian Proportion Arcs (Very faint) */}
            <g stroke="#ffffff08" strokeWidth="0.8" fill="none">
              <circle cx="180" cy="260" r="210" strokeDasharray="4 8" />
              <circle cx="180" cy="260" r="130" strokeDasharray="3 6" />
              <line x1="30" y1="260" x2="330" y2="260" strokeDasharray="2 6" />
            </g>

            {/* ================= 1. Faint Base Body Figure (整体颜色轻柔淡雅) ================= */}
            <g
              className="transition-transform duration-500 ease-out"
              style={{
                transform: `translate(${mouseOffset.x * 0.4}px, ${mouseOffset.y * 0.4}px)`,
              }}
            >
              {/* Vertical Spine Axis of Presence (淡雅中轴) */}
              <motion.path
                d={`M 180 75 Q ${180 + mouseOffset.x * 0.6} 260 180 470`}
                stroke="url(#axisGradFaint)"
                strokeWidth="1.3"
                strokeLinecap="round"
                fill="none"
              />

              {/* Faint Parallel Vibration of the Axis */}
              <line
                x1="180"
                y1="90"
                x2="180"
                y2="455"
                stroke="#ffffff0d"
                strokeWidth="0.8"
                strokeDasharray="4 6"
              />

              {/* Cranial Aperture / The Observatory Eye */}
              <circle
                cx="180"
                cy="70"
                r="16"
                stroke="#b8ad96"
                strokeWidth="0.9"
                strokeOpacity="0.4"
                fill="none"
              />
              <circle cx="180" cy="70" r="2.5" fill="#cfc5b4" opacity="0.45" />

              {/* Horizon Bar of Shoulders / Embrace of Space */}
              <path
                d={`M 115 175 Q 180 ${170 + mouseOffset.y * 0.3} 245 175`}
                stroke="#bdae97"
                strokeWidth="1"
                strokeOpacity="0.35"
                strokeLinecap="round"
                fill="none"
              />

              {/* Resonant Core / Sanctuary of the Heart */}
              <circle
                cx="180"
                cy="235"
                r="24"
                stroke="#baa98e"
                strokeWidth="0.8"
                strokeDasharray="2 4"
                strokeOpacity="0.3"
                fill="none"
              />
              <motion.circle
                cx="180"
                cy="235"
                r={12}
                stroke="#cfc3ab"
                strokeWidth="0.8"
                strokeOpacity="0.3"
                fill="none"
                animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.08, 0.35] }}
                transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut' }}
              />

              {/* Spatial Envelope Hairlines */}
              <path
                d="M 140 185 C 130 270 135 380 160 470"
                stroke="#a69984"
                strokeWidth="0.7"
                strokeDasharray="3 5"
                strokeOpacity="0.25"
                fill="none"
              />
              <path
                d="M 220 185 C 230 270 225 380 200 470"
                stroke="#a69984"
                strokeWidth="0.7"
                strokeDasharray="3 5"
                strokeOpacity="0.25"
                fill="none"
              />

              {/* Ground Horizon Bar */}
              <line x1="140" y1="472" x2="220" y2="472" stroke="#a89a83" strokeWidth="1" strokeOpacity="0.3" strokeLinecap="round" />
              <line x1="120" y1="480" x2="240" y2="480" stroke="#756b5d" strokeWidth="0.8" strokeOpacity="0.25" strokeDasharray="3 4" />
            </g>

            {/* ================= 2. Illuminated Overlay (点击处光圈波及身体局部高亮) ================= */}
            <g
              mask="url(#clickWaveMask)"
              className="transition-transform duration-500 ease-out"
              style={{
                transform: `translate(${mouseOffset.x * 0.4}px, ${mouseOffset.y * 0.4}px)`,
              }}
            >
              {/* Vertical Spine Axis of Presence (高亮中轴) */}
              <motion.path
                d={`M 180 75 Q ${180 + mouseOffset.x * 0.6} 260 180 470`}
                stroke="url(#axisGradLuminous)"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                filter="drop-shadow(0 0 6px rgba(255,245,225,0.75))"
              />

              {/* Cranial Aperture / The Observatory Eye */}
              <circle
                cx="180"
                cy="70"
                r="16"
                stroke="#fffbf2"
                strokeWidth="1.6"
                fill="none"
                filter="drop-shadow(0 0 8px rgba(255,240,210,0.8))"
              />
              <circle cx="180" cy="70" r="3.5" fill="#ffffff" filter="drop-shadow(0 0 4px rgba(255,255,255,0.9))" />

              {/* Horizon Bar of Shoulders / Embrace of Space */}
              <path
                d={`M 115 175 Q 180 ${170 + mouseOffset.y * 0.3} 245 175`}
                stroke="#fffaf0"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
                filter="drop-shadow(0 0 6px rgba(255,245,225,0.7))"
              />

              {/* Resonant Core / Sanctuary of the Heart */}
              <circle
                cx="180"
                cy="235"
                r="24"
                stroke="#fff5de"
                strokeWidth="1.2"
                strokeDasharray="2 4"
                fill="none"
                filter="drop-shadow(0 0 6px rgba(255,235,190,0.6))"
              />
              <circle
                cx="180"
                cy="235"
                r={12}
                stroke="#ffffff"
                strokeWidth="1.2"
                fill="none"
                filter="drop-shadow(0 0 8px rgba(255,255,255,0.8))"
              />

              {/* Spatial Envelope Hairlines */}
              <path
                d="M 140 185 C 130 270 135 380 160 470"
                stroke="#faedd5"
                strokeWidth="1.2"
                strokeDasharray="3 5"
                fill="none"
                filter="drop-shadow(0 0 5px rgba(250,237,213,0.5))"
              />
              <path
                d="M 220 185 C 230 270 225 380 200 470"
                stroke="#faedd5"
                strokeWidth="1.2"
                strokeDasharray="3 5"
                fill="none"
                filter="drop-shadow(0 0 5px rgba(250,237,213,0.5))"
              />

              {/* Ground Horizon Bar */}
              <line
                x1="140"
                y1="472"
                x2="220"
                y2="472"
                stroke="#fff8ea"
                strokeWidth="1.8"
                strokeLinecap="round"
                filter="drop-shadow(0 0 6px rgba(255,248,234,0.7))"
              />
              <line
                x1="120"
                y1="480"
                x2="240"
                y2="480"
                stroke="#e2d2b8"
                strokeWidth="1.2"
                strokeDasharray="3 4"
              />
            </g>
          </svg>
        </div>

        {/* Right: Pure Philosophical Insight & Epiphany */}
        <div className="flex-1 max-w-xl flex flex-col justify-center space-y-6 text-left">
          {/* Main Philosophical Insight Heading */}
          <div className="space-y-4 border-b border-[#ffffff12] pb-6">
            <h1 className="font-cinzel text-2xl sm:text-3xl lg:text-4xl text-[#f3ede1] tracking-wider leading-snug">
              THE BODY IS NOT IN SPACE.
              <br />
              <span className="text-[#dfcfae]">THE BODY IS SPACE.</span>
            </h1>
            <p className="font-garamond text-xl sm:text-2xl text-[#d4c9b5] italic">
              “身体不在空间之中，身体即是空间。”
            </p>
          </div>

          {/* User's Exact Core Statement */}
          <div className="p-5 sm:p-6 border border-[#ffffff14] bg-[#121418]/60 backdrop-blur-sm">
            <p className="font-garamond text-lg sm:text-xl text-[#f2eee6] leading-relaxed tracking-wide">
              “这场漫游并非探索了一栋外部建筑，而是一直在重新唤醒并探索你自己的身体。”
            </p>
          </div>

          {/* Actions: Restart & Philosophy */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onRestart}
              className="w-full sm:w-auto px-7 py-3.5 border border-[#ffffff20] bg-[#14161a] text-[#ded8cb] font-mono text-xs tracking-widest hover:bg-[#20232a] hover:border-[#ffffff35] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重新体验</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onOpenPhilosophy}
              className="w-full sm:w-auto px-7 py-3.5 bg-[#ded7c8] text-[#08090b] font-mono text-xs tracking-widest hover:bg-[#eae3d5] transition-all font-medium flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>阅读《肌肤之目》</span>
            </motion.button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-30 p-6 md:p-8 bg-[#08090b]/90 border-t border-[#ffffff10] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="max-w-xl">
          <p className="font-garamond text-base leading-relaxed text-[#c4bdae]">
            “建筑的意义不在于制造轰动的视网膜奇观，而在于构筑身体能够真实寄居、经历并留下记忆的精神庇护所。”
          </p>
        </div>

        <div className="text-xs font-mono text-[#8a8274] tracking-widest">
          JUHANI PALLASMAA · THE EYES OF THE SKIN
        </div>
      </footer>
    </div>
  );
};
