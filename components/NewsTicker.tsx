import React from 'react';
import { Radio } from 'lucide-react';

interface NewsTickerProps {
  headlines: string[];
}

export const NewsTicker: React.FC<NewsTickerProps> = ({ headlines }) => {
  return (
    <div className="bg-slate-900 border-b border-slate-800 h-10 flex items-center overflow-hidden relative">
      <div className="bg-alert-red px-3 h-full flex items-center z-10 font-bold text-white text-xs uppercase tracking-widest gap-2">
        <Radio className="w-4 h-4 animate-pulse" />
        Live Wire
      </div>
      <div className="flex-1 overflow-hidden relative h-full flex items-center">
        <div className="animate-ticker whitespace-nowrap flex gap-8 px-4 text-slate-300 font-mono text-sm">
          {headlines.map((headline, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="text-gov-accent">•</span>
              {headline}
            </span>
          ))}
          {/* Duplicate for seamless loop */}
          {headlines.map((headline, i) => (
            <span key={`dup-${i}`} className="flex items-center gap-2">
              <span className="text-gov-accent">•</span>
              {headline}
            </span>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 30s linear infinite;
        }
      `}</style>
    </div>
  );
};