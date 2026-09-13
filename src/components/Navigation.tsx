import React, { useState } from 'react';
import { ActId } from '../types';
import { ACTS_LIST } from '../data/actsData';
import { soundEngine } from '../audio/soundEngine';
import { Volume2, VolumeX, BookOpen } from 'lucide-react';

interface Props {
  currentAct: ActId;
  onSelectAct: (act: ActId) => void;
  onOpenPhilosophy: () => void;
}

export const Navigation: React.FC<Props> = ({ currentAct, onSelectAct, onOpenPhilosophy }) => {
  const [isMuted, setIsMuted] = useState(false);

  const handleToggleSound = () => {
    const nextState = soundEngine.toggleMute();
    setIsMuted(nextState);
  };

  return (
    <nav
      id="main-navigation"
      className="relative z-40 w-full bg-[#08090a]/90 backdrop-blur-md border-b border-[#ffffff10] px-4 py-3 flex items-center justify-between text-xs font-mono"
    >
      {/* Brand Title */}
      <div className="flex items-center space-x-3">
        <span className="font-cinzel tracking-widest text-[#f5f1e8] font-medium text-xs sm:text-sm">
          THE EYES OF THE SKIN
        </span>
        <span className="text-[#69645b] hidden md:inline">|</span>
        <span className="font-serif-sc text-[#a8a193] hidden md:inline text-xs">
          肌肤之目
        </span>
      </div>

      {/* 7 Acts Stepper Pill (Compact on mobile, full on desktop) */}
      <div className="hidden lg:flex items-center space-x-1 bg-[#121316] border border-[#ffffff0a] p-1">
        {ACTS_LIST.map((act) => {
          const isActive = currentAct === act.id;
          return (
            <button
              key={act.id}
              onClick={() => onSelectAct(act.id)}
              className={`px-2.5 py-1 transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-[#ded7c8] text-[#090a0c] font-semibold shadow-sm'
                  : 'text-[#877f72] hover:text-[#ded7c8] hover:bg-[#ffffff06]'
              }`}
              title={`${act.titleZh} (${act.titleEn})`}
            >
              <span>{act.roman}. {act.titleZh.slice(0, 2)}</span>
            </button>
          );
        })}
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2 sm:space-x-3 text-[#948c7e]">
        {/* Audio Mute/Unmute */}
        <button
          onClick={handleToggleSound}
          className="p-1.5 sm:px-2.5 sm:py-1 border border-[#ffffff12] hover:border-[#ffffff25] hover:text-[#f4efe4] transition-colors flex items-center gap-1.5 cursor-pointer"
          title={isMuted ? '开启声音' : '静音'}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-[#e06666]" />
              <span className="hidden sm:inline">静音</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-[#ded7c8]" />
              <span className="hidden sm:inline">空间音效</span>
            </>
          )}
        </button>

        {/* Philosophy Drawer Button */}
        <button
          onClick={onOpenPhilosophy}
          className="p-1.5 sm:px-2.5 sm:py-1 bg-[#1a1c20] border border-[#ffffff18] text-[#ded7c8] hover:bg-[#25282e] transition-colors flex items-center gap-1.5 cursor-pointer"
          title="《肌肤之目》哲学思想与引文"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">引文</span>
        </button>
      </div>
    </nav>
  );
};
