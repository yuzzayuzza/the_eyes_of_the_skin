import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ActId } from '../types';

interface Props {
  currentAct: ActId;
}

const CHAPTER_TITLES: Record<ActId, { chapter: string; title: string; subtitle: string }> = {
  prologue: {
    chapter: 'Prologue',
    title: '序幕',
    subtitle: '视网膜时代的漫游',
  },
  act1_eye: {
    chapter: 'Act 1',
    title: '视网膜建筑',
    subtitle: '纯粹的观看',
  },
  act2_blindness: {
    chapter: 'Act 2',
    title: '失明与初醒',
    subtitle: '听觉的诞生',
  },
  act3_ear: {
    chapter: 'Act 3',
    title: '声音的建筑',
    subtitle: '材质的共振',
  },
  act4_skin: {
    chapter: 'Act 4',
    title: '触觉的重量',
    subtitle: '界面即皮肤',
  },
  act5_shadow: {
    chapter: 'Act 5',
    title: '阴影的栖居',
    subtitle: '移开目光的凝视',
  },
  act6_memory: {
    chapter: 'Act 6',
    title: '记忆与时间',
    subtitle: '身体重构的空间',
  },
  act7_body: {
    chapter: 'Act 7',
    title: '身体即空间',
    subtitle: '栖居之终章',
  },
};

export const ChapterToast: React.FC<Props> = ({ currentAct }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
    }, 1750);
    return () => clearTimeout(timer);
  }, [currentAct]);

  const info = CHAPTER_TITLES[currentAct];

  return (
    <AnimatePresence>
      {visible && info && (
        <motion.div
          key={`black-screen-${currentAct}`}
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 bg-[#040506] flex flex-col items-center justify-center pointer-events-none px-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, filter: 'blur(5px)' }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            className="text-center max-w-lg space-y-2.5"
          >
            <div className="font-cinzel text-xs sm:text-sm tracking-[0.35em] text-[#8e8575] uppercase">
              {info.chapter}
            </div>
            <h2 className="font-garamond text-3xl sm:text-4xl md:text-5xl text-[#f3ede1] font-normal tracking-wider">
              {info.title}
            </h2>
            <div className="text-xs sm:text-sm font-serif text-[#a69d8d] tracking-[0.2em] opacity-80 pt-1">
              {info.subtitle}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
