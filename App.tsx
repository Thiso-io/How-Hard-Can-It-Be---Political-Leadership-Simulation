import React, { useState } from 'react';
import { GameState, TabView, InitialSetupResponse, SimulationResponse, DifficultyLevel, Achievement } from './types';
import { initializeCountry, processTurn } from './services/geminiService';
import { StatsPanel } from './components/StatsPanel';
import { Terminal } from './components/Terminal';
import { NewsTicker } from './components/NewsTicker';
import { WorldMap } from './components/WorldMap';
import { SettingsModal } from './components/SettingsModal';
import { DifficultySelector } from './components/DifficultySelector';
import { AchievementToast } from './components/AchievementToast';
import { AchievementsModal } from './components/AchievementsModal';
import { AudioProvider, useAudio } from './contexts/AudioContext';
import { getCountryPreview, CountryPreview } from './utils/countryData';
import { ACHIEVEMENTS } from './utils/achievementData';
import { Globe, ShieldAlert, AlertTriangle, Power, User, BarChart3, Crosshair, Users, Database, CheckCircle2, RefreshCw, Settings, Trophy } from 'lucide-react';

// Define app stages for clear flow control
enum AppStage {
  DIFFICULTY_SELECT = 'DIFFICULTY',
  MAP_SELECT = 'MAP',
  GAMEPLAY = 'GAME'
}

const AppContent: React.FC = () => {
  const [appStage, setAppStage] = useState<AppStage>(AppStage.DIFFICULTY_SELECT);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCountryName, setSelectedCountryName] = useState<string | null>(null);
  const [countryPreview, setCountryPreview] = useState<CountryPreview | null>(null);
  
  // Modals & Overlays
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [achievementQueue, setAchievementQueue] = useState<Achievement[]>([]);
  
  const { initializeAudio, playUiSound } = useAudio();

  const [activeTab, setActiveTab] = useState<TabView>(TabView.GOV);
  const [gameState, setGameState] = useState<GameState>({
    countryName: '',
    leaderTitle: '',
    difficulty: DifficultyLevel.NORMAL, // Default
    day: 1,
    isGameOver: false,
    gameOverReason: null,
    stats: {
      approvalRating: 50,
      politicalStability: 50,
      corruption: 20,
      gdp: 0,
      inflation: 2,
      unemployment: 5,
      treasury: 0,
      civilUnrest: 10,
      healthcare: 50,
      militaryReadiness: 50,
      internationalTension: 20
    },
    history: [],
    newsHeadlines: ["Simulation Initialized. Awaiting Leader Input."],
    advisors: [],
    recentEvents: "",
    unlockedAchievementIds: []
  });

  // Flow Step 1: Difficulty Selected
  const handleDifficultySelect = (level: DifficultyLevel) => {
    setGameState(prev => ({ ...prev, difficulty: level }));
    setAppStage(AppStage.MAP_SELECT);
    initializeAudio(); // Good place to ensure audio is ready
  };

  // Flow Step 2: Country Clicked on Map
  const handleCountrySelect = (name: string) => {
    setSelectedCountryName(name);
    setCountryPreview(getCountryPreview(name));
    setError(null);
    playUiSound('open');
  };

  // Flow Step 3: Game Started
  const handleStartGame = async () => {
    if (!selectedCountryName) return;
    
    playUiSound('select');
    setLoading(true);
    setError(null);

    try {
      const data: InitialSetupResponse = await initializeCountry(selectedCountryName);
      setGameState(prev => ({
        ...prev,
        countryName: selectedCountryName,
        leaderTitle: data.leaderTitle,
        stats: data.initialStats,
        newsHeadlines: data.initialNews,
        advisors: data.initialAdvisors,
        history: [{
          day: 1,
          action: "INAUGURATION",
          consequence: data.introNarrative
        }]
      }));
      setAppStage(AppStage.GAMEPLAY);
    } catch (err: any) {
      setError(err.message || "Failed to initialize simulation. Please check your API Key.");
      playUiSound('error');
    } finally {
      setLoading(false);
    }
  };

  // Flow Step 4: Game Reset
  const handleResetGame = () => {
    playUiSound('select');
    setGameState(prev => ({
      countryName: '',
      leaderTitle: '',
      difficulty: DifficultyLevel.NORMAL,
      day: 1,
      isGameOver: false,
      gameOverReason: null,
      stats: {
        approvalRating: 50,
        politicalStability: 50,
        corruption: 20,
        gdp: 0,
        inflation: 2,
        unemployment: 5,
        treasury: 0,
        civilUnrest: 10,
        healthcare: 50,
        militaryReadiness: 50,
        internationalTension: 20
      },
      history: [],
      newsHeadlines: ["Simulation Initialized. Awaiting Leader Input."],
      advisors: [],
      recentEvents: "",
      unlockedAchievementIds: prev.unlockedAchievementIds // Preserve unlocked achievements
    }));
    setAppStage(AppStage.DIFFICULTY_SELECT);
    setSelectedCountryName(null);
    setCountryPreview(null);
    setError(null);
  };

  const handleCommand = async (command: string) => {
    setLoading(true);
    try {
      const result: SimulationResponse = await processTurn(gameState, command);
      
      // Process new achievements
      if (result.newUnlockedAchievementIds && result.newUnlockedAchievementIds.length > 0) {
        const newUnlocks = result.newUnlockedAchievementIds
          .map(id => ACHIEVEMENTS.find(a => a.id === id))
          .filter((a): a is Achievement => !!a);
        
        if (newUnlocks.length > 0) {
          setAchievementQueue(prev => [...prev, ...newUnlocks]);
        }
      }

      playUiSound('success');
      
      setGameState(prev => ({
        ...prev,
        day: prev.day + 1,
        stats: { ...prev.stats, ...result.statChanges },
        newsHeadlines: result.newsHeadlines,
        advisors: result.advisors,
        isGameOver: result.isGameOver,
        gameOverReason: result.gameOverReason || null,
        history: [...prev.history, {
          day: prev.day,
          action: command,
          consequence: result.narrative
        }],
        unlockedAchievementIds: [
          ...prev.unlockedAchievementIds,
          ...(result.newUnlockedAchievementIds || [])
        ]
      }));
    } catch (err: any) {
      console.error(err);
      playUiSound('error');
      alert("Comms link failed (API Error). Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAchievementDismiss = (id: string) => {
    setAchievementQueue(prev => prev.filter(a => a.id !== id));
  };

  // Render Logic based on AppStage
  const renderStage = () => {
    switch(appStage) {
      case AppStage.DIFFICULTY_SELECT:
        return (
          <div className="flex-1 flex flex-col items-center justify-center p-6 relative overflow-y-auto">
             {/* Background Elements */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none"></div>
             <DifficultySelector onSelect={handleDifficultySelect} />
          </div>
        );

      case AppStage.MAP_SELECT:
        return (
          <main className="flex-1 flex flex-col md:flex-row p-6 gap-6 z-10 overflow-hidden animate-fadeIn">
            {/* Left: Map Area */}
            <div className="flex-1 bg-slate-900/50 border border-slate-800 rounded-2xl p-4 flex flex-col shadow-2xl backdrop-blur-sm relative">
              <div className="absolute top-4 left-6 z-10 pointer-events-none">
                 <h2 className="text-lg font-bold text-white flex items-center gap-2">
                   <Crosshair className="w-4 h-4 text-gov-accent" />
                   Select Target Nation
                 </h2>
                 <p className="text-sm text-slate-400 max-w-md mt-1">
                   Select a sovereign entity to begin the simulation.
                 </p>
              </div>
              
              <div className="flex-1 mt-8 relative">
                 <WorldMap onSelect={handleCountrySelect} selectedCountry={selectedCountryName} />
              </div>
  
              {error && (
                <div className="absolute bottom-4 right-4 max-w-md p-4 bg-red-900/90 border border-red-500 text-white rounded shadow-xl flex items-start gap-3 animate-slideIn">
                  <AlertTriangle className="w-5 h-5 text-red-300 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm">Initialization Error</h4>
                    <p className="text-xs text-red-200 mt-1">{error}</p>
                  </div>
                </div>
              )}
            </div>
  
            {/* Right: Info Panel */}
            <div className={`
               w-full md:w-96 shrink-0 transition-all duration-500 ease-out transform
               ${selectedCountryName ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-50'}
            `}>
              {countryPreview ? (
                <div className="h-full bg-slate-900 border-l border-t border-r border-slate-700 rounded-xl p-0 shadow-2xl flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gov-accent"></div>
                  
                  <div className="p-6 pb-2">
                    <div className="flex justify-between items-start mb-1">
                      <h2 className="text-3xl font-black text-white">{countryPreview.name.toUpperCase()}</h2>
                      <span className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-400 border border-slate-700">{countryPreview.metadata.entityStatus}</span>
                    </div>
                    <span className="inline-block px-2 py-1 bg-slate-800 text-gov-accent text-xs font-bold rounded uppercase tracking-wider border border-slate-700">
                      {countryPreview.system}
                    </span>
                  </div>
  
                  <div className="flex-1 overflow-y-auto px-6 py-2 space-y-4 custom-scrollbar">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded border border-slate-700/50">
                         <div className="flex items-center gap-3">
                           <div className="p-2 bg-blue-500/20 rounded-full text-blue-400"><BarChart3 className="w-4 h-4" /></div>
                           <span className="text-sm font-medium text-slate-300">GDP</span>
                         </div>
                         <span className="text-white font-mono font-bold">{countryPreview.gdp}</span>
                      </div>
  
                      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded border border-slate-700/50">
                         <div className="flex items-center gap-3">
                           <div className="p-2 bg-green-500/20 rounded-full text-green-400"><Users className="w-4 h-4" /></div>
                           <span className="text-sm font-medium text-slate-300">Population</span>
                         </div>
                         <span className="text-white font-mono font-bold">{countryPreview.population}</span>
                      </div>
  
                      <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded border border-slate-700/50">
                         <div className="flex items-center gap-3">
                           <div className="p-2 bg-red-500/20 rounded-full text-red-400"><ShieldAlert className="w-4 h-4" /></div>
                           <span className="text-sm font-medium text-slate-300">Military</span>
                         </div>
                         <span className="text-white font-mono font-bold text-xs">{countryPreview.military}</span>
                      </div>
                    </div>
  
                    <div className="p-4 bg-slate-800 rounded border-l-2 border-gov-accent">
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Intelligence Briefing</h4>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {countryPreview.desc}
                      </p>
                    </div>
                  </div>
  
                  {/* Metadata Footer */}
                  <div className="bg-slate-950 p-4 border-t border-slate-800 text-[10px] text-slate-500 flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                       <span className="flex items-center gap-1"><Database className="w-3 h-3" /> {countryPreview.metadata.source}</span>
                       <span className="flex items-center gap-1"><RefreshCw className="w-3 h-3" /> {countryPreview.metadata.lastUpdated}</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-1 mt-1">
                      <div className="bg-green-600 h-1 rounded-full" style={{width: `${countryPreview.metadata.confidence * 100}%`}}></div>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Data Reliability Score</span>
                      <span>{(countryPreview.metadata.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
  
                  <div className="p-6 pt-2 bg-slate-900 border-t border-slate-800">
                    <button 
                      onClick={handleStartGame}
                      onMouseEnter={() => playUiSound('hover')}
                      disabled={loading}
                      className="w-full bg-gov-accent hover:bg-cyan-400 text-slate-900 font-extrabold py-4 rounded-lg uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(56,189,248,0.4)] disabled:opacity-50 disabled:cursor-not-allowed group"
                    >
                      {loading ? (
                        <span className="animate-spin w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full"></span>
                      ) : (
                        <>
                          <Power className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          Take Command
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 border border-slate-800 rounded-xl bg-slate-900/30 p-8 text-center border-dashed">
                  <Globe className="w-16 h-16 mb-4 opacity-20" />
                  <h3 className="text-lg font-bold text-slate-500">No Target Selected</h3>
                  <p className="text-sm max-w-[200px] mt-2">Select a region on the map to view intelligence reports.</p>
                </div>
              )}
            </div>
          </main>
        );

      case AppStage.GAMEPLAY:
        return (
           <div className="flex-1 flex overflow-hidden relative">
            
            {/* Game Over Overlay */}
            {gameState.isGameOver && (
              <div className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center animate-fadeIn p-8 text-center">
                <ShieldAlert className="w-24 h-24 text-red-600 mb-6 animate-pulse" />
                <h2 className="text-5xl font-extrabold text-white mb-4 uppercase tracking-tighter">Regime Ended</h2>
                <p className="text-xl text-red-400 max-w-2xl font-mono mb-8 border-l-4 border-red-600 pl-6 text-left bg-red-900/10 p-4">
                  {gameState.gameOverReason || "You have been removed from power."}
                </p>
                <div className="flex gap-4">
                   <div className="bg-slate-800 p-4 rounded text-center min-w-[120px]">
                     <p className="text-xs text-slate-500 uppercase">Days Survived</p>
                     <p className="text-2xl font-bold text-white">{gameState.day}</p>
                   </div>
                   <div className="bg-slate-800 p-4 rounded text-center min-w-[120px]">
                     <p className="text-xs text-slate-500 uppercase">Final Approval</p>
                     <p className="text-2xl font-bold text-white">{gameState.stats.approvalRating}%</p>
                   </div>
                </div>
                <button 
                  onClick={handleResetGame}
                  className="mt-12 px-8 py-3 bg-white text-black font-bold uppercase hover:bg-slate-200 transition-colors"
                >
                  Start New Simulation
                </button>
              </div>
            )}
    
            {/* Left Stats Panel */}
            <StatsPanel state={gameState} activeTab={activeTab} setActiveTab={setActiveTab} />
    
            {/* Center/Right Terminal */}
            <div className="flex-1 flex flex-col min-w-0">
              <Terminal 
                history={gameState.history} 
                onCommand={handleCommand} 
                isLoading={loading}
                isGameOver={gameState.isGameOver}
              />
            </div>
          </div>
        );
    }
  }

  // Main Layout Wrapper
  return (
    <div className="flex flex-col h-screen bg-slate-950 overflow-hidden font-sans text-slate-200 relative">
      {/* Background Ambient Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none z-0"></div>

      {/* Top Bar */}
      <header className="bg-slate-900/80 backdrop-blur border-b border-slate-800 h-16 flex items-center justify-between px-6 shrink-0 z-20 relative">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
                playUiSound('click');
                setAppStage(AppStage.DIFFICULTY_SELECT); 
            }}
            className="bg-blue-600 p-1.5 rounded cursor-pointer hover:bg-blue-500 transition-colors"
          >
            <Globe className="w-5 h-5 text-white" />
          </button>
          <div>
            <h1 className="font-black text-lg leading-none tracking-tight text-white uppercase italic">
               {appStage === AppStage.GAMEPLAY ? gameState.countryName.toUpperCase() : "HOW HARD CAN IT BE?"}
            </h1>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">
               {appStage === AppStage.GAMEPLAY ? gameState.leaderTitle : "Political Leadership Simulator"}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
            {appStage === AppStage.GAMEPLAY && (
              <>
                <div className="text-center hidden md:block">
                  <span className="text-[10px] uppercase text-slate-500 block">Day in Office</span>
                  <span className="font-mono text-xl font-bold text-white">{gameState.day}</span>
                </div>
                <div className="h-8 w-px bg-slate-800 hidden md:block"></div>
                <div className="text-center hidden md:block">
                   <span className="text-[10px] uppercase text-slate-500 block">Approval</span>
                   <span className={`font-mono text-xl font-bold ${gameState.stats.approvalRating < 30 ? 'text-red-500' : 'text-green-500'}`}>
                     {gameState.stats.approvalRating}%
                   </span>
                </div>
                <div className="h-8 w-px bg-slate-800 hidden md:block"></div>
              </>
            )}
            
            {appStage !== AppStage.GAMEPLAY && (
               <div className="text-right hidden md:block">
                  <p className="text-xs text-slate-500 font-mono">SECURE CONNECTION ESTABLISHED</p>
                  <p className="text-xs text-green-500 font-mono">SYSTEM READY</p>
               </div>
            )}

            <button 
              onClick={() => { playUiSound('click'); setIsAchievementsOpen(true); }}
              className="p-2 hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-yellow-400 relative"
            >
              <Trophy className="w-5 h-5" />
              {gameState.unlockedAchievementIds.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></span>
              )}
            </button>

            <button 
              onClick={() => { playUiSound('click'); setIsSettingsOpen(true); }}
              className="p-2 hover:bg-slate-800 rounded transition-colors text-slate-400 hover:text-white"
            >
              <Settings className="w-5 h-5" />
            </button>
        </div>
      </header>

      {/* News Ticker - Only in Game */}
      {appStage === AppStage.GAMEPLAY && <NewsTicker headlines={gameState.newsHeadlines} />}

      {/* Main Content Render - Placed before modals to ensure modals stack on top */}
      {renderStage()}

      {/* Modals placed at end of DOM to ensure they overlay everything else */}
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <AchievementsModal 
        isOpen={isAchievementsOpen} 
        onClose={() => setIsAchievementsOpen(false)} 
        unlockedIds={gameState.unlockedAchievementIds}
      />
      <AchievementToast queue={achievementQueue} onDismiss={handleAchievementDismiss} />

    </div>
  );
};

const App: React.FC = () => (
  <AudioProvider>
    <AppContent />
  </AudioProvider>
);

export default App;