import React from 'react';
import { useAudio } from '../contexts/AudioContext';
import { TypingSoundMode } from '../types';
import { X, Volume2, VolumeX, Keyboard, Music } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const Slider = ({ label, value, onChange, icon: Icon }: any) => (
  <div className="mb-4">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2 text-slate-300">
        <Icon className="w-4 h-4 text-gov-accent" />
        <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
      </div>
      <span className="text-xs font-mono text-gov-accent">{(value * 100).toFixed(0)}%</span>
    </div>
    <input
      type="range"
      min="0"
      max="1"
      step="0.05"
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-gov-accent"
    />
  </div>
);

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { settings, updateSettings, playUiSound } = useAudio();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md shadow-2xl overflow-hidden relative">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h2 className="text-white font-bold flex items-center gap-2">
            <Volume2 className="w-5 h-5 text-gov-accent" />
            AUDIO CONFIGURATION
          </h2>
          <button 
            onClick={() => { playUiSound('click'); onClose(); }}
            className="text-slate-500 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between p-3 bg-slate-800 rounded border border-slate-700">
            <span className="text-sm font-medium text-white">Master Mute</span>
            <button
              onClick={() => updateSettings({ isMuted: !settings.isMuted })}
              className={`p-2 rounded transition-colors ${settings.isMuted ? 'bg-red-500 text-white' : 'bg-slate-700 text-slate-400'}`}
            >
              {settings.isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>

          <div className={`space-y-4 ${settings.isMuted ? 'opacity-50 pointer-events-none' : ''}`}>
             <Slider 
                label="Master Volume" 
                value={settings.masterVolume} 
                onChange={(v: number) => updateSettings({ masterVolume: v })} 
                icon={Volume2}
             />
             <Slider 
                label="Interface SFX" 
                value={settings.uiVolume} 
                onChange={(v: number) => { updateSettings({ uiVolume: v }); playUiSound('click'); }} 
                icon={Keyboard}
             />
             <Slider 
                label="Ambient Drone" 
                value={settings.ambienceVolume} 
                onChange={(v: number) => updateSettings({ ambienceVolume: v })} 
                icon={Music}
             />
          </div>

          <div className={`border-t border-slate-800 pt-6 ${settings.isMuted ? 'opacity-50 pointer-events-none' : ''}`}>
             <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                <Keyboard className="w-4 h-4" /> Typing Sound Mode
             </h3>
             <div className="grid grid-cols-3 gap-2">
                {[
                  { mode: TypingSoundMode.CLICK, label: "Mechanical" },
                  { mode: TypingSoundMode.MURMUR, label: "Data Stream" },
                  { mode: TypingSoundMode.NONE, label: "Silent" }
                ].map((opt) => (
                  <button
                    key={opt.mode}
                    onClick={() => { updateSettings({ typingMode: opt.mode }); playUiSound('select'); }}
                    className={`
                      p-2 text-xs font-bold rounded border transition-all
                      ${settings.typingMode === opt.mode 
                        ? 'bg-gov-accent text-slate-900 border-gov-accent shadow-[0_0_10px_rgba(56,189,248,0.3)]' 
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'}
                    `}
                  >
                    {opt.label}
                  </button>
                ))}
             </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
          <button 
            onClick={() => { playUiSound('click'); onClose(); }}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded border border-slate-700 transition-colors"
          >
            CONFIRM
          </button>
        </div>
      </div>
    </div>
  );
};
