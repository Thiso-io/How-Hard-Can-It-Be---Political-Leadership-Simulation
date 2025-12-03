import React from 'react';
import { GameState, TabView } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { Activity, Landmark, Users, Globe, Shield, DollarSign } from 'lucide-react';
import { useAudio } from '../contexts/AudioContext';

interface StatsPanelProps {
  state: GameState;
  activeTab: TabView;
  setActiveTab: (tab: TabView) => void;
}

const ProgressBar = ({ label, value, color = "bg-blue-500", suffix = "%" }: { label: string, value: number, color?: string, suffix?: string }) => (
  <div className="mb-4">
    <div className="flex justify-between mb-1">
      <span className="text-sm font-medium text-gray-300">{label}</span>
      <span className="text-sm font-medium text-white">{value.toFixed(1)}{suffix}</span>
    </div>
    <div className="w-full bg-gray-700 rounded-full h-2.5">
      <div 
        className={`h-2.5 rounded-full ${color} transition-all duration-500`} 
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      ></div>
    </div>
  </div>
);

const KPICard = ({ title, value, icon: Icon, color }: { title: string, value: string, icon: any, color: string }) => (
  <div className="bg-gov-panel border border-slate-700 p-4 rounded-lg flex items-center justify-between shadow-sm">
    <div>
      <p className="text-xs text-slate-400 uppercase tracking-wider">{title}</p>
      <p className="text-xl font-bold text-slate-100">{value}</p>
    </div>
    <div className={`p-2 rounded-full bg-opacity-20 ${color.replace('text-', 'bg-')}`}>
      <Icon className={`w-6 h-6 ${color}`} />
    </div>
  </div>
);

export const StatsPanel: React.FC<StatsPanelProps> = ({ state, activeTab, setActiveTab }) => {
  const { stats } = state;
  const { playUiSound } = useAudio();

  const handleTabClick = (tab: TabView) => {
    playUiSound('click');
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case TabView.GOV:
        return (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-2 gap-4">
              <KPICard title="Approval" value={`${stats.approvalRating}%`} icon={Users} color="text-status-green" />
              <KPICard title="Stability" value={`${stats.politicalStability}%`} icon={Landmark} color="text-yellow-400" />
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <h3 className="text-gov-accent font-bold mb-4 uppercase text-sm">Internal Affairs</h3>
              <ProgressBar label="Political Stability" value={stats.politicalStability} color="bg-indigo-500" />
              <ProgressBar label="Bureaucratic Corruption" value={stats.corruption} color="bg-red-500" />
              <ProgressBar label="Opposition Strength" value={100 - stats.approvalRating} color="bg-orange-500" />
            </div>
          </div>
        );
      case TabView.ECON:
        return (
          <div className="space-y-6 animate-fadeIn">
             <div className="grid grid-cols-2 gap-4">
              <KPICard title="GDP" value={`$${stats.gdp}B`} icon={Activity} color="text-blue-400" />
              <KPICard title="Treasury" value={`$${stats.treasury}B`} icon={DollarSign} color="text-green-400" />
            </div>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <h3 className="text-gov-accent font-bold mb-4 uppercase text-sm">Economic Indicators</h3>
              <ProgressBar label="Inflation Rate" value={stats.inflation} color="bg-red-400" />
              <ProgressBar label="Unemployment" value={stats.unemployment} color="bg-yellow-500" />
            </div>
          </div>
        );
      case TabView.SOCIAL:
        return (
           <div className="space-y-6 animate-fadeIn">
             <div className="grid grid-cols-2 gap-4">
              <KPICard title="Unrest" value={`${stats.civilUnrest}%`} icon={Activity} color="text-red-500" />
              <KPICard title="Healthcare" value={`${stats.healthcare}%`} icon={Activity} color="text-emerald-400" />
            </div>
             <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <h3 className="text-gov-accent font-bold mb-4 uppercase text-sm">Social Welfare</h3>
              <ProgressBar label="Public Healthcare Quality" value={stats.healthcare} color="bg-teal-500" />
              <ProgressBar label="Civil Unrest Risk" value={stats.civilUnrest} color="bg-red-600" />
            </div>
           </div>
        );
      case TabView.MILITARY:
         return (
           <div className="space-y-6 animate-fadeIn">
             <div className="grid grid-cols-2 gap-4">
              <KPICard title="Readiness" value={`${stats.militaryReadiness}%`} icon={Shield} color="text-slate-200" />
              <KPICard title="Tension" value={`${stats.internationalTension}%`} icon={Globe} color="text-orange-500" />
            </div>
             <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
              <h3 className="text-gov-accent font-bold mb-4 uppercase text-sm">Defense & Security</h3>
              <ProgressBar label="Military Readiness" value={stats.militaryReadiness} color="bg-slate-400" />
              <ProgressBar label="International Tension" value={stats.internationalTension} color="bg-orange-600" />
            </div>
           </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gov-bg border-r border-slate-800 w-80 shrink-0">
      <div className="flex border-b border-slate-800">
        {[TabView.GOV, TabView.ECON, TabView.SOCIAL, TabView.MILITARY].map((tab) => {
          let Icon = Landmark;
          if (tab === TabView.ECON) Icon = DollarSign;
          if (tab === TabView.SOCIAL) Icon = Users;
          if (tab === TabView.MILITARY) Icon = Shield;

          return (
            <button
              key={tab}
              onClick={() => handleTabClick(tab)}
              onMouseEnter={() => playUiSound('hover')}
              className={`flex-1 p-3 flex justify-center items-center transition-colors ${
                activeTab === tab 
                  ? 'bg-gov-panel text-gov-accent border-b-2 border-gov-accent' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-900'
              }`}
            >
              <Icon className="w-5 h-5" />
            </button>
          );
        })}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        {renderContent()}
        
        {/* Advisors Section always visible at bottom of tab area */}
        <div className="mt-8 border-t border-slate-800 pt-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase mb-3">Cabinet Advisory</h3>
          <div className="space-y-3">
            {state.advisors.map((advisor, idx) => (
              <div key={idx} className="bg-slate-900 p-3 rounded border border-slate-800 hover:border-slate-600 transition-colors">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-xs font-bold text-slate-200">{advisor.name}</span>
                  <span className="text-[10px] text-gov-accent uppercase">{advisor.role}</span>
                </div>
                <p className="text-xs text-slate-400 italic">"{advisor.suggestion}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};