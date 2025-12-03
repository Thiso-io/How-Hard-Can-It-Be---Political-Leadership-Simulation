import React, { useEffect, useState } from 'react';
import { Achievement } from '../types';
import { Trophy, X } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';

interface AchievementToastProps {
  queue: Achievement[];
  onDismiss: (id: string) => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({ queue, onDismiss }) => {
  const [current, setCurrent] = useState<Achievement | null>(null);
  const { playUiSound } = useAudio();

  useEffect(() => {
    if (queue.length > 0 && !current) {
      setCurrent(queue[0]);
      playUiSound('success'); // Use success sound for unlock
    }
  }, [queue, current, playUiSound]);

  useEffect(() => {
    if (current) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [current]);

  const handleDismiss = () => {
    if (current) {
      onDismiss(current.id);
      setCurrent(null);
    }
  };

  if (!current) return null;

  return (
    <div className="fixed top-20 right-6 z-50 animate-slideIn">
      <div className="bg-slate-900 border border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.2)] rounded-lg p-4 flex items-start gap-4 max-w-sm relative overflow-hidden group">
        
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shimmer_1s_infinite] pointer-events-none"></div>

        <div className="bg-yellow-500/20 p-2 rounded-full shrink-0">
          <Trophy className="w-6 h-6 text-yellow-400" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-yellow-400 font-black text-xs uppercase tracking-widest mb-1">Achievement Unlocked</h4>
          <h3 className="text-white font-bold text-sm leading-tight mb-1">{current.title}</h3>
          <p className="text-slate-400 text-xs">{current.description}</p>
        </div>

        <button 
          onClick={handleDismiss}
          className="text-slate-500 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};