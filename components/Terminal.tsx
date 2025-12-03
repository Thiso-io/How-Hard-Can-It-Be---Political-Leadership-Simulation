import React, { useState, useRef, useEffect } from 'react';
import { Send, Terminal as TerminalIcon, Loader2 } from 'lucide-react';
import { HistoryEntry } from '../types';
import { Typewriter } from './Typewriter';
import { useAudio } from '../contexts/AudioContext';

interface TerminalProps {
  history: HistoryEntry[];
  onCommand: (cmd: string) => void;
  isLoading: boolean;
  isGameOver: boolean;
}

export const Terminal: React.FC<TerminalProps> = ({ history, onCommand, isLoading, isGameOver }) => {
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const { playUiSound } = useAudio();

  // Auto-scroll effect
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isLoading, input]); // Added input to dependency to scroll while typing if needed

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isGameOver) {
        playUiSound('error');
        return;
    }
    playUiSound('select'); // Sound for sending command
    onCommand(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-black font-mono text-sm border-t border-slate-800 shadow-2xl">
      {/* Log Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-950 bg-opacity-95"
      >
        {history.length === 0 && (
          <div className="text-slate-500 text-center mt-10">
            <TerminalIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Awaiting orders, Leader.</p>
            <p className="text-xs mt-2">Type natural language commands below.</p>
          </div>
        )}

        {history.map((entry, idx) => {
          const isLast = idx === history.length - 1;
          
          return (
            <div key={idx} className="space-y-2 fade-in-up">
              <div className="flex items-start gap-2 text-slate-400">
                <span className="text-gov-accent">Day {entry.day} &gt;</span>
                <p className="font-bold text-white">{entry.action}</p>
              </div>
              <div className="pl-4 border-l-2 border-slate-800 ml-2">
                <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {/* Only use Typewriter for the very last entry to avoid re-typing old history */}
                  {isLast ? (
                     <Typewriter text={entry.consequence} speed={10} />
                  ) : (
                     entry.consequence
                  )}
                </p>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-gov-accent animate-pulse pl-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Googling "how to run a country"...</span>
          </div>
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={handleSubmit} className="p-4 bg-slate-900 border-t border-slate-800 flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gov-accent font-bold">{'>'}</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isGameOver ? "Simulation Terminated" : "Enter executive order..."}
            className="w-full bg-slate-950 border border-slate-700 rounded text-slate-100 pl-8 pr-4 py-3 focus:outline-none focus:border-gov-accent focus:ring-1 focus:ring-gov-accent transition-all disabled:opacity-50"
            disabled={isLoading || isGameOver}
            autoFocus
            onKeyDown={() => playUiSound('hover')} // Subtle click while typing input
          />
        </div>
        <button
          type="submit"
          onMouseEnter={() => playUiSound('hover')}
          disabled={isLoading || isGameOver || !input.trim()}
          className="bg-gov-panel hover:bg-slate-700 text-gov-accent border border-slate-700 px-6 rounded font-bold uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <Send className="w-4 h-4" />
          Exec
        </button>
      </form>
    </div>
  );
};