import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Quote } from 'lucide-react';
import { ACTS_LIST, PHILOSOPHY_SECTIONS } from '../data/actsData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const PhilosophyModal: React.FC<Props> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-text">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#070809]/80 backdrop-blur-md"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 15 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-3xl max-h-[85vh] bg-[#101114] border border-[#ffffff18] text-[#e3ded4] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#ffffff10] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <BookOpen className="w-5 h-5 text-[#cfc2aa]" />
                <div>
                  <h2 className="font-garamond text-xl sm:text-2xl font-normal text-[#f4efe4]">
                    《肌肤之目》思想摘录
                  </h2>
                  <p className="font-cinzel text-xs tracking-widest text-[#8a8274] uppercase mt-0.5">
                    Juhani Pallasmaa · The Eyes of the Skin
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 hover:bg-[#ffffff10] transition-colors text-[#a1998b] hover:text-[#f4efe4]"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 text-sm leading-relaxed">
              {/* Introduction summary */}
              <div className="bg-[#16171b] border-l-2 border-[#cfc2aa] p-4 text-[#c7bfb0] font-garamond text-base sm:text-lg italic">
                “当世界越来越成为屏幕上的图像，我们是否正在丧失用身体感知世界的能力？帕拉斯玛批判‘视网膜建筑’对纯粹图像的拜物教，主张建筑是由多感官整合的生存体验。”
              </div>

              {/* 4 Core Chapters Insights */}
              <div className="space-y-6">
                <h3 className="font-cinzel text-xs tracking-widest uppercase text-[#9e9483] border-b border-[#ffffff10] pb-2">
                  核心哲学要义 / Philosophical Themes
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {PHILOSOPHY_SECTIONS.map((sec, idx) => (
                    <div key={idx} className="bg-[#14161a] border border-[#ffffff0a] p-4 space-y-2">
                      <h4 className="font-garamond text-base text-[#eee9df] font-medium">
                        {sec.title}
                      </h4>
                      <p className="text-xs text-[#9c9384] font-serif leading-relaxed">
                        {sec.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 7 Acts Philosophical Citations */}
              <div className="space-y-6">
                <h3 className="font-cinzel text-xs tracking-widest uppercase text-[#9e9483] border-b border-[#ffffff10] pb-2">
                  七幕感知规则对照 / The 7 Experiential Rules
                </h3>
                <div className="space-y-4">
                  {ACTS_LIST.map((act) => (
                    <div key={act.id} className="p-4 bg-[#141519] border border-[#ffffff08] space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono text-[#8a8375]">
                        <span>ACT {act.roman} · {act.titleEn}</span>
                        <span>{act.titleZh}</span>
                      </div>
                      <div className="flex items-start gap-2 pt-1">
                        <Quote className="w-4 h-4 text-[#cfc2aa] shrink-0 mt-1 opacity-60" />
                        <div>
                          <p className="font-garamond text-sm sm:text-base text-[#e8e2d5]">
                            {act.pallasmaaQuoteZh}
                          </p>
                          <p className="text-xs font-serif text-[#8f8779] mt-1 italic">
                            {act.pallasmaaQuoteEn}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#ffffff10] bg-[#0d0e11] flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 bg-[#ded7c8] text-[#090a0c] font-mono text-xs tracking-widest hover:bg-[#ebe5d8] transition-colors"
              >
                返回空间 (RETURN)
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
