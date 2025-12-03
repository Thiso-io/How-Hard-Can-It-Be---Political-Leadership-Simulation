import React from 'react';
import { Achievement } from '../types';
import { ACHIEVEMENTS } from '../utils/achievementData';
import { Trophy, X, Lock } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  unlockedIds: string[];
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ isOpen, onClose, unlockedIds }) => {
  const { playUiSound } = useAudio();
  
  if (!isOpen) return null;

  const unlockedSet = new Set(unlockedIds);
  const categories = Array.from(new Set(ACHIEVEMENTS.map(a => a.category)));
  const progress = Math.round((unlockedIds.length / ACHIEVEMENTS.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-950 border border-slate-700 rounded-xl w-full max-w-4xl h-[80vh] shadow-2xl overflow-hidden flex flex-col relative">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
          <div className="flex items-center gap-4">
             <div className="bg-yellow-500/20 p-2 rounded-full">
               <Trophy className="w-6 h-6 text-yellow-500" />
             </div>
             <div>
               <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                 Career Milestones <span className="text-slate-500 font-normal">¯\_(ツ)_/¯</span>
               </h2>
               <p className="text-xs text-slate-400 uppercase tracking-widest">
                 Progress: {unlockedIds.length} / {ACHIEVEMENTS.length} ({progress}%)
               </p>
             </div>
          </div>
          <button 
            onClick={() => { playUiSound('click'); onClose(); }}
            className="text-slate-500 hover:text-white transition-colors p-2 hover:bg-slate-800 rounded"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950 custom-scrollbar">
           <div className="space-y-8">
             {categories.map(cat => (
               <div key={cat}>
                 <h3 className="text-gov-accent font-bold text-sm uppercase tracking-wider mb-4 border-b border-slate-800 pb-2">{cat}</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {ACHIEVEMENTS.filter(a => a.category === cat).map(achievement => {
                     const isUnlocked = unlockedSet.has(achievement.id);
                     return (
                       <div 
                         key={achievement.id}
                         className={`
                           p-4 rounded-lg border flex gap-3 transition-all
                           ${isUnlocked 
                             ? 'bg-slate-900 border-yellow-500/30 shadow-[0_4px_20px_rgba(234,179,8,0.05)]' 
                             : 'bg-slate-900/50 border-slate-800 opacity-60 grayscale'}
                         `}
                       >
                         <div className={`
                           shrink-0 w-10 h-10 rounded flex items-center justify-center
                           ${isUnlocked ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-800 text-slate-600'}
                         `}>
                           {isUnlocked ? <Trophy className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                         </div>
                         <div>
                           <h4 className={`font-bold text-sm ${isUnlocked ? 'text-white' : 'text-slate-500'}`}>
                             {achievement.title}
                           </h4>
                           <p className="text-xs text-slate-400 mt-1 leading-snug">
                             {isUnlocked ? achievement.description : "Locked"}
                           </p>
                           {isUnlocked && (
                             <span className="text-[10px] text-slate-600 mt-2 block font-mono">
                               ID: {achievement.id}
                             </span>
                           )}
                         </div>
                       </div>
                     );
                   })}
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};