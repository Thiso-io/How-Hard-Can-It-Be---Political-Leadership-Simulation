import React, { useState } from 'react';
import { DifficultyLevel } from '../types';
import { Shield, Zap, Scale, Skull, Activity, ArrowRight, Gauge } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';

interface DifficultySelectorProps {
  onSelect: (level: DifficultyLevel) => void;
}

const LEVELS = [
  {
    id: DifficultyLevel.RADICAL,
    label: "RADICAL",
    icon: Zap,
    color: "text-blue-400",
    desc: "Sandbox Simulation",
    details: "The world is your playground. Consequences are minimal, public opinion is static, and you can experiment with extreme ideologies without fear of collapse.",
    modifiers: [
      "Public Opinion: STATIC",
      "Media Reaction: IGNORED",
      "Consequences: DISABLED",
      "Survival Chance: 99%"
    ]
  },
  {
    id: DifficultyLevel.EASY,
    label: "",
    icon: Activity,
    color: "text-cyan-400",
    desc: "Forgiving",
    details: "A gentle introduction to power. Mistakes are forgiven, and international backlash is dampened. Good for learning the ropes.",
    modifiers: [
      "Public Opinion: RESILIENT",
      "Media Reaction: MILD",
      "Consequences: REDUCED",
      "Survival Chance: HIGH"
    ]
  },
  {
    id: DifficultyLevel.NORMAL,
    label: "",
    icon: Scale,
    color: "text-green-400",
    desc: "Balanced",
    details: "The standard experience. Actions have logical reactions. You have room to maneuver, but serious errors will damage your administration.",
    modifiers: [
      "Public Opinion: DYNAMIC",
      "Media Reaction: STANDARD",
      "Consequences: LOGICAL",
      "Survival Chance: MODERATE"
    ]
  },
  {
    id: DifficultyLevel.HARD,
    label: "",
    icon: Shield,
    color: "text-orange-400",
    desc: "Strict",
    details: "The world is watching closely. Missteps trigger protests, sanctions, and economic downturns. Political capital is scarce.",
    modifiers: [
      "Public Opinion: VOLATILE",
      "Media Reaction: CRITICAL",
      "Consequences: SEVERE",
      "Survival Chance: LOW"
    ]
  },
  {
    id: DifficultyLevel.REALISTIC,
    label: "REALISTIC",
    icon: Skull,
    color: "text-red-500",
    desc: "Hyper-Realism",
    details: "Unforgiving. Every decision is judged by real-world standards. Wars, coups, and economic collapse are constantly looming. Only for strategists.",
    modifiers: [
      "Public Opinion: MERCILESS",
      "Media Reaction: HOSTILE",
      "Consequences: IMMEDIATE",
      "Survival Chance: MINIMAL"
    ]
  }
];

export const DifficultySelector: React.FC<DifficultySelectorProps> = ({ onSelect }) => {
  const [selectedIndex, setSelectedIndex] = useState(2); // Default to Normal (index 2)
  const { playUiSound } = useAudio();

  const selectedLevel = LEVELS[selectedIndex];
  const Icon = selectedLevel.icon;

  const handleNodeClick = (index: number) => {
    playUiSound('select');
    setSelectedIndex(index);
  };

  const handleContinue = () => {
    playUiSound('success');
    onSelect(selectedLevel.id);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-4xl mx-auto p-8 animate-fadeIn">
      
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center justify-center gap-3 mb-2 uppercase">
           <span className="text-gov-accent text-4xl mr-2">¯\_(ツ)_/¯</span>
           HOW HARD CAN IT BE?
        </h1>
        <p className="text-slate-400 font-mono text-sm uppercase tracking-widest">
          Calibrate Narrative Engine Logic
        </p>
      </div>

      {/* Slider Container */}
      <div className="relative w-full max-w-2xl mb-16 px-6">
        {/* Track Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-800 -translate-y-1/2 rounded-full"></div>
        
        {/* Active Track Line */}
        <div 
          className="absolute top-1/2 left-0 h-1 bg-gov-accent -translate-y-1/2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${(selectedIndex / (LEVELS.length - 1)) * 100}%` }}
        ></div>

        {/* Nodes */}
        <div className="relative flex justify-between w-full">
          {LEVELS.map((level, idx) => {
            const isActive = idx === selectedIndex;
            const isPassed = idx < selectedIndex;
            
            return (
              <button
                key={level.id}
                onClick={() => handleNodeClick(idx)}
                className={`
                  relative z-10 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300
                  ${isActive ? 'scale-150 bg-gov-accent shadow-[0_0_15px_rgba(56,189,248,0.6)]' : ''}
                  ${!isActive && isPassed ? 'bg-gov-accent' : ''}
                  ${!isActive && !isPassed ? 'bg-slate-700 hover:bg-slate-600' : ''}
                `}
              >
                {isActive && <div className="absolute inset-0 bg-white rounded-full opacity-30 animate-ping"></div>}
                
                {/* Labels for First and Last */}
                {level.label && (
                  <span className={`
                    absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap
                    ${isActive ? 'text-white' : 'text-slate-500'}
                  `}>
                    {level.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Info Panel */}
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-xl overflow-hidden relative shadow-2xl transition-all duration-300">
        <div className={`absolute top-0 left-0 w-1 h-full ${selectedLevel.color.replace('text-', 'bg-')}`}></div>
        
        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className={`text-2xl font-black uppercase ${selectedLevel.color} mb-1`}>
                {selectedLevel.desc}
              </h2>
              <div className="flex gap-2">
                 {[...Array(5)].map((_, i) => (
                   <div key={i} className={`w-8 h-1 rounded-full ${i <= selectedIndex ? selectedLevel.color.replace('text-', 'bg-') : 'bg-slate-800'}`}></div>
                 ))}
              </div>
            </div>
            <Icon className={`w-12 h-12 ${selectedLevel.color} opacity-20`} />
          </div>

          <p className="text-slate-300 text-sm leading-relaxed mb-8 border-l-2 border-slate-700 pl-4">
            {selectedLevel.details}
          </p>

          <div className="grid grid-cols-2 gap-4">
            {selectedLevel.modifiers.map((mod, i) => (
              <div key={i} className="bg-slate-950/50 border border-slate-800 p-3 rounded flex items-center gap-2">
                 <div className={`w-1.5 h-1.5 rounded-full ${selectedLevel.color.replace('text-', 'bg-')}`}></div>
                 <span className="text-xs font-mono text-slate-400">{mod}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={handleContinue}
        onMouseEnter={() => playUiSound('hover')}
        className="mt-12 group relative px-8 py-4 bg-gov-accent hover:bg-cyan-400 text-slate-900 font-extrabold uppercase tracking-widest rounded transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(56,189,248,0.4)]"
      >
        Select Target Nation
        <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>

    </div>
  );
};