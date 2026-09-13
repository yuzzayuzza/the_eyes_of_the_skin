import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ActId } from './types';
import { soundEngine } from './audio/soundEngine';
import { CoverScreen } from './components/CoverScreen';
import { Navigation } from './components/Navigation';
import { PhilosophyModal } from './components/PhilosophyModal';
import { ChapterToast } from './components/ChapterToast';

import { Act1Eye } from './components/acts/Act1Eye';
import { Act2Blindness } from './components/acts/Act2Blindness';
import { Act3Ear } from './components/acts/Act3Ear';
import { Act4Skin } from './components/acts/Act4Skin';
import { Act5Shadow } from './components/acts/Act5Shadow';
import { Act6Memory } from './components/acts/Act6Memory';
import { Act7Body } from './components/acts/Act7Body';

export default function App() {
  const [isCoverOpen, setIsCoverOpen] = useState(true);
  const [currentAct, setCurrentAct] = useState<ActId>('act1_eye');
  const [isPhilosophyOpen, setIsPhilosophyOpen] = useState(false);

  // Initialize audio context on first user gesture anywhere
  useEffect(() => {
    const handleFirstGesture = () => {
      soundEngine.init();
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
    window.addEventListener('pointerdown', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });
    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, []);

  const handleNextAct = () => {
    switch (currentAct) {
      case 'act1_eye':
        setCurrentAct('act2_blindness');
        break;
      case 'act2_blindness':
        setCurrentAct('act3_ear');
        break;
      case 'act3_ear':
        setCurrentAct('act4_skin');
        break;
      case 'act4_skin':
        setCurrentAct('act5_shadow');
        break;
      case 'act5_shadow':
        setCurrentAct('act6_memory');
        break;
      case 'act6_memory':
        setCurrentAct('act7_body');
        break;
      default:
        break;
    }
  };

  const handleRestart = () => {
    setCurrentAct('act1_eye');
    setIsCoverOpen(true);
  };

  return (
    <div className="relative w-screen h-screen flex flex-col bg-[#0a0b0d] text-[#e0dbd1] overflow-hidden select-none">
      {/* 
        In Act 1, per user's prompt ("进入网页以后，没有菜单。只有一间非常明亮、非常漂亮、非常高清的白色空间..."):
        We hide the navigation bar in Act 1 to provide the pure unadulterated "Retinal Architecture" immersion.
        Once the player breaks through into Act 2 and beyond, the architectural navigation gently presents itself.
      */}
      {currentAct !== 'act1_eye' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Navigation
            currentAct={currentAct}
            onSelectAct={(act) => setCurrentAct(act)}
            onOpenPhilosophy={() => setIsPhilosophyOpen(true)}
          />
        </motion.div>
      )}

      {/* Main Experiential Canvas / Chamber */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        <AnimatePresence mode="wait">
          {currentAct === 'act1_eye' && (
            <motion.div
              key="act1_eye"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, filter: 'blur(8px)' }}
              transition={{ duration: 0.8 }}
              className="w-full h-full"
            >
              <Act1Eye onComplete={handleNextAct} />
            </motion.div>
          )}

          {currentAct === 'act2_blindness' && (
            <motion.div
              key="act2_blindness"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full h-full"
            >
              <Act2Blindness onComplete={handleNextAct} />
            </motion.div>
          )}

          {currentAct === 'act3_ear' && (
            <motion.div
              key="act3_ear"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full h-full"
            >
              <Act3Ear onComplete={handleNextAct} />
            </motion.div>
          )}

          {currentAct === 'act4_skin' && (
            <motion.div
              key="act4_skin"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full h-full"
            >
              <Act4Skin onComplete={handleNextAct} />
            </motion.div>
          )}

          {currentAct === 'act5_shadow' && (
            <motion.div
              key="act5_shadow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full h-full"
            >
              <Act5Shadow onComplete={handleNextAct} />
            </motion.div>
          )}

          {currentAct === 'act6_memory' && (
            <motion.div
              key="act6_memory"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full h-full"
            >
              <Act6Memory onComplete={handleNextAct} />
            </motion.div>
          )}

          {currentAct === 'act7_body' && (
            <motion.div
              key="act7_body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="w-full h-full"
            >
              <Act7Body
                onRestart={handleRestart}
                onOpenPhilosophy={() => setIsPhilosophyOpen(true)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Opening Minimalist Atmospheric Cover Screen */}
      <AnimatePresence>
        {isCoverOpen && (
          <CoverScreen onStart={() => setIsCoverOpen(false)} />
        )}
      </AnimatePresence>

      {/* Philosophy Modal & Quotes Drawer */}
      <PhilosophyModal
        isOpen={isPhilosophyOpen}
        onClose={() => setIsPhilosophyOpen(false)}
      />

      {/* Auto-dismissing Chapter Banner (Only after cover is dismissed) */}
      {!isCoverOpen && <ChapterToast currentAct={currentAct} />}
    </div>
  );
}
