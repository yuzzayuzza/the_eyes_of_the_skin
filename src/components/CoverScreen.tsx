import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { soundEngine } from '../audio/soundEngine';
import { Headphones, ArrowRight } from 'lucide-react';

interface Props {
  onStart: () => void;
}

export const CoverScreen: React.FC<Props> = ({ onStart }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Atmospheric drifting motes in twilight
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const motes = Array.from({ length: 42 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.25,
      speedY: -Math.random() * 0.3 - 0.08,
      alpha: Math.random() * 0.4 + 0.1,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Subtle ambient vignette
      const grad = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height * 0.45,
        50,
        canvas.width / 2,
        canvas.height * 0.45,
        Math.max(canvas.width, canvas.height) * 0.75
      );
      grad.addColorStop(0, 'rgba(28, 26, 22, 0.35)');
      grad.addColorStop(0.5, 'rgba(14, 15, 18, 0.15)');
      grad.addColorStop(1, 'rgba(5, 6, 8, 0.95)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Motes
      motes.forEach((m) => {
        m.x += m.speedX;
        m.y += m.speedY;
        if (m.y < 0) m.y = canvas.height;
        if (m.x < 0) m.x = canvas.width;
        if (m.x > canvas.width) m.x = 0;

        ctx.beginPath();
        ctx.arc(m.x, m.y, m.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230, 215, 185, ${m.alpha * 0.5})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const handleStart = () => {
    soundEngine.init();
    soundEngine.playFootstep('stone', 0);
    onStart();
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 bg-[#050608] text-[#ede8de] flex flex-col justify-between p-8 sm:p-12 md:p-16 select-none overflow-hidden"
    >
      {/* Background Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Top Header Eyebrow */}
      <header className="relative z-10 flex items-center justify-between border-b border-[#ffffff10] pb-6">
        <div className="flex items-center space-x-3">
          <span className="font-cinzel text-xs tracking-[0.3em] uppercase text-[#9e9482]">
            JUHANI PALLASMAA
          </span>
          <span className="text-[#524d44]">|</span>
          <span className="font-serif text-xs tracking-widest text-[#8a8070]">
            尤哈尼·帕拉斯玛
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#a39a88] border border-[#ffffff12] px-3 py-1.5 bg-[#090a0d]/60 backdrop-blur-sm">
          <Headphones className="w-3.5 h-3.5 text-[#c4b8a2]" />
          <span>建议戴耳机</span>
        </div>
      </header>

      {/* Center Atmospheric Emblem & Title */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto text-center space-y-8 py-8">
        {/* Breathing Architectural Aperture */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.7, 0.35] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full border border-[#d6c7ab]/40"
          />
          <motion.div
            animate={{ scale: [1.15, 1, 1.15], opacity: [0.2, 0.5, 0.2] }}
            transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
            className="absolute -inset-3 rounded-full border border-[#ffffff0a] border-dashed"
          />
          <div className="w-2 h-2 rounded-full bg-[#f3ede1] shadow-[0_0_12px_rgba(243,237,225,0.8)]" />
        </div>

        {/* Title Group */}
        <div className="space-y-4">
          <h1 className="font-cinzel text-3xl sm:text-4xl md:text-5xl tracking-[0.22em] text-[#f7f3eb] font-normal leading-tight">
            THE EYES OF THE SKIN
          </h1>
          <h2 className="font-garamond text-2xl sm:text-3xl md:text-4xl text-[#dfd4be] tracking-[0.35em] font-light">
            肌 肤 之 目
          </h2>
          <p className="font-serif text-xs sm:text-sm tracking-[0.25em] text-[#968c7c] pt-1">
            建筑与感官重构的漫游。
          </p>
        </div>

        {/* Epigraph Quote */}
        <div className="max-w-md mx-auto pt-2 pb-4">
          <p className="font-garamond text-base sm:text-lg text-[#b8afa0] leading-relaxed italic">
            “当世界越来越成为屏幕上的图像，我们是否正在失去用身体感知世界的能力？”
          </p>
        </div>

        {/* Enter Button */}
        <div className="pt-2">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleStart}
            className="group relative px-9 py-4 bg-[#ede6d8] hover:bg-[#fbf7ee] text-[#08090a] font-mono text-xs tracking-[0.25em] transition-all flex items-center gap-3 cursor-pointer shadow-[0_4px_30px_rgba(0,0,0,0.6)]"
            aria-label="步入漫游"
          >
            <span>步入漫游</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1 text-[#08090a]" />
          </motion.button>
        </div>
      </main>

      {/* Footer Details */}
      <footer className="relative z-10 flex items-center justify-between border-t border-[#ffffff10] pt-6 text-[11px] font-mono text-[#787062] tracking-widest">
        <span>ARCHITECTURAL PHENOMENOLOGY</span>
        <span>2026 EDITION</span>
      </footer>
    </motion.div>
  );
};
