import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { soundEngine } from '../../audio/soundEngine';
import { ChevronRight, Hand, Sparkles } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

type MaterialType = 'granite' | 'silk' | 'clay' | 'bronze' | 'water';

interface MaterialPlate {
  type: MaterialType;
  titleZh: string;
  titleEn: string;
  tactileDesc: string;
  temp: string;
  friction: number;
}

export const Act4Skin: React.FC<Props> = ({ onComplete }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mouse / Hand virtual state
  const [activeMaterial, setActiveMaterial] = useState<MaterialType>('granite');
  const [exploredMaterials, setExploredMaterials] = useState<Set<MaterialType>>(new Set());
  const [tactileState, setTactileState] = useState({
    speed: 0,
    resistance: 0.8,
    temp: '16°C 冷石',
    status: '粗糙花岗岩 · 颗粒阻尼',
  });

  const virtualPos = useRef({ x: 300, y: 300 });
  const velocity = useRef({ x: 0, y: 0 });
  const lastRealPos = useRef({ x: 0, y: 0 });
  const isInteracting = useRef(false);
  const waterRipples = useRef<{ x: number; y: number; r: number; alpha: number }[]>([]);

  const plates: MaterialPlate[] = [
    {
      type: 'granite',
      titleZh: '粗粝花岗岩',
      titleEn: 'Rough Granite',
      tactileDesc: '微观凹凸引发游标抖动，触觉提前由视觉预见',
      temp: '14°C 冰冷',
      friction: 0.85,
    },
    {
      type: 'silk',
      titleZh: '天然丝绸',
      titleEn: 'Raw Wild Silk',
      tactileDesc: '极低摩擦力，移动自带惯性滑行',
      temp: '22°C 恒温',
      friction: 0.08,
    },
    {
      type: 'clay',
      titleZh: '深层湿泥土',
      titleEn: 'Damp Clay Earth',
      tactileDesc: '黏稠阻力，如手陷泥沼般被轻微拖住',
      temp: '18°C 潮润',
      friction: 0.95,
    },
    {
      type: 'bronze',
      titleZh: '古拙锻打青铜',
      titleEn: 'Forged Bronze',
      tactileDesc: '锋利爽脆的金属切削感，随划动泛出冷光',
      temp: '11°C 沁寒',
      friction: 0.35,
    },
    {
      type: 'water',
      titleZh: '静止水镜',
      titleEn: 'Still Water Membrane',
      tactileDesc: '破开液体表面张力，产生柔软回波',
      temp: '15°C 清冽',
      friction: 0.25,
    },
  ];

  // Draw procedural textures & water ripples
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render water ripples if on water or previous ripples exist
      waterRipples.current.forEach((rip) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(180, 210, 225, ${rip.alpha * 0.4})`;
        ctx.lineWidth = 1.8;
        ctx.stroke();
        ctx.restore();

        rip.r += 2.2;
        rip.alpha -= 0.015;
      });
      waterRipples.current = waterRipples.current.filter((r) => r.alpha > 0);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const realX = e.clientX - rect.left;
    const realY = e.clientY - rect.top;

    const dx = realX - lastRealPos.current.x;
    const dy = realY - lastRealPos.current.y;
    const dist = Math.hypot(dx, dy);
    lastRealPos.current = { x: realX, y: realY };

    // Determine which section the pointer is over (horizontal 5 stripes)
    const sectionWidth = rect.width / plates.length;
    const plateIndex = Math.min(plates.length - 1, Math.max(0, Math.floor(realX / sectionWidth)));
    const currentPlate = plates[plateIndex];

    setActiveMaterial(currentPlate.type);
    setExploredMaterials((prev) => new Set(prev).add(currentPlate.type));

    // Tactile physics simulation
    let targetX = realX;
    let targetY = realY;

    if (currentPlate.type === 'granite') {
      // Micro-jitter displacement
      const jitter = (Math.random() - 0.5) * 8;
      targetX += jitter;
      targetY += jitter;
      if (dist > 3 && Math.random() < 0.25) {
        soundEngine.playFootstep('stone', (realX / rect.width) * 2 - 1);
        if ('vibrate' in navigator) {
          try { navigator.vibrate(8); } catch {}
        }
      }
      setTactileState({
        speed: dist,
        resistance: 0.85,
        temp: currentPlate.temp,
        status: '粗粝花岗岩 · 颗粒抗阻',
      });
    } else if (currentPlate.type === 'silk') {
      // Inertial momentum
      velocity.current.x = velocity.current.x * 0.85 + dx * 0.3;
      velocity.current.y = velocity.current.y * 0.85 + dy * 0.3;
      targetX += velocity.current.x * 1.5;
      targetY += velocity.current.y * 1.5;
      if (dist > 5 && Math.random() < 0.15) {
        soundEngine.playFootstep('fabric', (realX / rect.width) * 2 - 1);
      }
      setTactileState({
        speed: dist,
        resistance: 0.08,
        temp: currentPlate.temp,
        status: '生丝织物 · 顺滑惯性',
      });
    } else if (currentPlate.type === 'clay') {
      // Viscous drag: lags behind real mouse
      targetX = virtualPos.current.x + dx * 0.32;
      targetY = virtualPos.current.y + dy * 0.32;
      if (dist > 8 && Math.random() < 0.2) {
        soundEngine.playFootstep('clay', (realX / rect.width) * 2 - 1);
        if ('vibrate' in navigator) {
          try { navigator.vibrate(15); } catch {}
        }
      }
      setTactileState({
        speed: dist * 0.3,
        resistance: 0.95,
        temp: currentPlate.temp,
        status: '深层湿泥 · 黏滞迟缓',
      });
    } else if (currentPlate.type === 'bronze') {
      // Sharp, crisp glide + chime
      targetX = realX;
      targetY = realY;
      if (dist > 12 && Math.random() < 0.1) {
        soundEngine.playBronzeChime();
      }
      setTactileState({
        speed: dist,
        resistance: 0.35,
        temp: currentPlate.temp,
        status: '锻打青铜 · 寒冽利落',
      });
    } else if (currentPlate.type === 'water') {
      // Water fluid ripples
      targetX = realX;
      targetY = realY;
      if (dist > 4) {
        waterRipples.current.push({
          x: realX,
          y: realY,
          r: 6,
          alpha: 0.8,
        });
        if (Math.random() < 0.2) {
          soundEngine.playFootstep('water', (realX / rect.width) * 2 - 1);
        }
      }
      setTactileState({
        speed: dist,
        resistance: 0.25,
        temp: currentPlate.temp,
        status: '静止水镜 · 表面张力折射',
      });
    }

    virtualPos.current = { x: targetX, y: targetY };
  }, [plates]);

  // Sync canvas size
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

  const allExplored = exploredMaterials.size >= 4;

  return (
    <div
      ref={containerRef}
      id="act4-skin-container"
      onPointerMove={handlePointerMove}
      onPointerDown={() => { isInteracting.current = true; }}
      onPointerUp={() => { isInteracting.current = false; }}
      className="relative w-full h-full bg-[#0a0b0d] text-[#e3ded4] flex flex-col justify-between overflow-hidden cursor-none select-none"
    >
      {/* 5 Material Physical Stripes as Tactile Plates */}
      <div className="absolute inset-0 flex flex-col sm:flex-row pointer-events-none">
        {plates.map((plate) => {
          const isActive = activeMaterial === plate.type;
          const isExplored = exploredMaterials.has(plate.type);

          return (
            <div
              key={plate.type}
              className={`relative flex-1 h-full border-r border-[#ffffff08] transition-all duration-700 flex flex-col justify-end p-6 ${
                isActive ? 'bg-[#ffffff06]' : 'bg-transparent'
              }`}
            >
              {/* Material Specific Ambient Texture Patterns */}
              {plate.type === 'granite' && (
                <div
                  className="absolute inset-0 opacity-15"
                  style={{
                    backgroundImage: 'radial-gradient(#888 1px, transparent 1px)',
                    backgroundSize: '8px 8px',
                  }}
                />
              )}
              {plate.type === 'silk' && (
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: 'linear-gradient(45deg, #bbb 25%, transparent 25%), linear-gradient(-45deg, #bbb 25%, transparent 25%)',
                    backgroundSize: '16px 16px',
                  }}
                />
              )}
              {plate.type === 'clay' && (
                <div
                  className="absolute inset-0 opacity-15"
                  style={{
                    backgroundImage: 'radial-gradient(circle at 50% 50%, #443 20%, transparent 60%)',
                    backgroundSize: '32px 32px',
                  }}
                />
              )}
              {plate.type === 'bronze' && (
                <div className="absolute inset-0 opacity-10 bg-gradient-to-tr from-[#9e8354]/20 via-transparent to-[#ffffff]/10" />
              )}
              {plate.type === 'water' && (
                <div className="absolute inset-0 opacity-15 bg-gradient-to-b from-[#2a4352]/20 to-transparent" />
              )}

              {/* Material Identification Label */}
              <div className="relative z-10 space-y-1 transition-opacity duration-300">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isExplored ? 'bg-[#c5bca9]' : 'bg-[#423f38]'
                    }`}
                  />
                  <span className="font-mono text-[10px] tracking-widest text-[#8a8477] uppercase">
                    {plate.titleEn}
                  </span>
                </div>
                <h3 className="font-garamond text-xl text-[#edeae1]">{plate.titleZh}</h3>
                <p className="text-xs text-[#9c9688] font-serif leading-relaxed line-clamp-2">
                  {plate.tactileDesc}
                </p>
                <div className="pt-2 flex items-center gap-3 text-[10px] font-mono text-[#7b7569]">
                  <span>{plate.temp}</span>
                  <span>•</span>
                  <span>阻尼: {(plate.friction * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Canvas for Water Ripples & Textures */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

      {/* Virtual Tactile "Hand" Cursor */}
      <div
        className="absolute w-10 h-10 -ml-5 -mt-5 pointer-events-none z-30 transition-transform duration-75 flex items-center justify-center"
        style={{
          left: `${virtualPos.current.x}px`,
          top: `${virtualPos.current.y}px`,
        }}
      >
        {/* Cursor Aura */}
        <div
          className={`w-full h-full rounded-full border border-[#f5f2eb]/70 transition-all duration-300 flex items-center justify-center ${
            activeMaterial === 'granite'
              ? 'scale-110 shadow-[0_0_12px_rgba(200,200,200,0.4)]'
              : activeMaterial === 'silk'
              ? 'scale-90 shadow-[0_0_20px_rgba(255,255,255,0.3)]'
              : activeMaterial === 'clay'
              ? 'scale-125 border-[#8a7e6d]'
              : activeMaterial === 'bronze'
              ? 'scale-100 border-[#d8be8d] shadow-[0_0_15px_rgba(216,190,141,0.5)]'
              : 'scale-110 border-[#9dbbc9]'
          }`}
        >
          <div className="w-1.5 h-1.5 bg-[#f5f2eb] rounded-full" />
        </div>
      </div>

      {/* Header */}
      <header className="relative z-20 p-6 md:p-8 flex items-center justify-between border-b border-[#ffffff10] bg-[#0a0b0d]/80 backdrop-blur-sm">
        <div>
          <span className="font-cinzel text-xs tracking-widest uppercase text-[#8a8477]">Act IV / Tactility</span>
          <h2 className="font-garamond text-xl md:text-2xl tracking-wide font-normal text-[#f5f3ec]">
            触觉的重量 · 界面即皮肤
          </h2>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono text-[#a59e91]">
          <span className="flex items-center gap-1.5 border border-[#ffffff15] px-2.5 py-1">
            <Hand className="w-3.5 h-3.5 text-[#dedad1]" />
            EXPLORED: {exploredMaterials.size} / {plates.length}
          </span>
        </div>
      </header>

      {/* Floating HUD Real-Time Tactile Readout */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center pointer-events-none px-6 text-center">
        <motion.div
          key={tactileState.status}
          initial={{ opacity: 0.6, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#121316]/90 backdrop-blur border border-[#ffffff15] px-6 py-3.5 shadow-2xl flex items-center gap-4 text-xs font-mono"
        >
          <Sparkles className="w-4 h-4 text-[#c7beab]" />
          <div className="text-left">
            <div className="text-[#ece8df] font-garamond text-base">{tactileState.status}</div>
            <div className="text-[#8e887a] text-[11px] flex gap-3 mt-0.5">
              <span>{tactileState.temp}</span>
              <span>摩擦系数: {tactileState.resistance}</span>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-20 p-6 md:p-8 bg-[#0a0b0d]/90 border-t border-[#ffffff10] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="max-w-xl">
          <p className="font-garamond text-base sm:text-lg leading-relaxed text-[#c7c3b8]">
            “眼睛本身就是触觉的器官。看见粗糙的石头，手心便生出沟壑；看见冰冷金属，皮肤便预演寒意。网页与屏幕，在此成为可被触摸的皮肤。”
          </p>
        </div>

        <div className="flex items-center justify-end w-full sm:w-auto">
          {allExplored && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={onComplete}
              className="w-12 h-12 rounded-full border border-[#ffffff20] bg-[#dfdcd5] text-[#0a0b0d] hover:bg-[#ece8df] flex items-center justify-center shadow-lg transition-colors cursor-pointer"
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
