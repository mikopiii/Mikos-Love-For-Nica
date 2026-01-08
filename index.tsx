import React, { useState, useEffect, useMemo, useRef, memo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Play, Settings, LogOut, Heart, X, Coffee, 
  Sparkles, Moon, Sun, Volume2, VolumeX, Music, ChevronRight, ChevronLeft,
  ShieldCheck, Star, Smile, PencilLine, Trash2, Plus
} from 'lucide-react';

const CartoonCloud = memo(({ className, style }: { className?: string, style?: React.CSSProperties }) => (
  <svg 
    viewBox="0 0 100 60" 
    className={className} 
    style={style}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M20,40 Q20,20 40,20 Q45,10 60,10 Q80,10 80,30 Q95,30 95,45 Q95,55 80,55 L25,55 Q10,55 10,40 Z" 
      fill="white" 
      stroke="#bae6fd" 
      strokeWidth="2"
    />
    <path 
      d="M30,35 Q35,25 45,25 Q50,25 55,30" 
      fill="none" 
      stroke="#bae6fd" 
      strokeWidth="1.5" 
      strokeLinecap="round"
      opacity="0.5"
    />
  </svg>
));

const AnimatedCatLogo = memo(({ className, isLightMode }: { className?: string, isLightMode: boolean }) => (
  <svg 
    viewBox="0 0 100 100" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect 
      x="25" y="35" width="50" height="40" rx="4"
      fill={isLightMode ? "white" : "#2e102f"}
      stroke={isLightMode ? "#db2777" : "#f9a8d4"}
      strokeWidth="3" 
    />
    <path d="M25,35 L25,15 L45,35 Z" fill={isLightMode ? "white" : "#2e102f"} stroke={isLightMode ? "#db2777" : "#f9a8d4"} strokeWidth="3" />
    <path d="M75,35 L75,15 L55,35 Z" fill={isLightMode ? "white" : "#2e102f"} stroke={isLightMode ? "#db2777" : "#f9a8d4"} strokeWidth="3" />
    <path d="M50,35 Q65,40 75,60 L75,35 Z" fill="#fbcfe8" />
    <line x1="43" y1="35" x2="43" y2="45" stroke={isLightMode ? "#db2777" : "#f9a8d4"} strokeWidth="3" strokeLinecap="round" />
    <line x1="50" y1="35" x2="50" y2="48" stroke={isLightMode ? "#db2777" : "#f9a8d4"} strokeWidth="3" strokeLinecap="round" />
    <line x1="57" y1="35" x2="57" y2="45" stroke={isLightMode ? "#db2777" : "#f9a8d4"} strokeWidth="3" strokeLinecap="round" />
    <circle cx="38" cy="55" r="4" fill={isLightMode ? "#db2777" : "#f9a8d4"} className="animate-blink" />
    <circle cx="62" cy="55" r="4" fill={isLightMode ? "#db2777" : "#f9a8d4"} className="animate-blink" />
    <path d="M47,58 L53,58 L50,62 Z" fill={isLightMode ? "#db2777" : "#f9a8d4"} />
    <line x1="20" y1="58" x2="33" y2="61" stroke={isLightMode ? "#db2777" : "#f9a8d4"} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="21" y1="67" x2="33" y2="65" stroke={isLightMode ? "#db2777" : "#f9a8d4"} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="80" y1="58" x2="67" y2="61" stroke={isLightMode ? "#db2777" : "#f9a8d4"} strokeWidth="2.5" strokeLinecap="round" />
    <line x1="79" y1="67" x2="67" y2="65" stroke={isLightMode ? "#db2777" : "#f9a8d4"} strokeWidth="2.5" strokeLinecap="round" />
  </svg>
));

type CategoryType = 'reassurances' | 'compliments' | 'love';

const App = () => {
  const [screen, setScreen] = useState<'menu' | 'game' | 'settings'>('menu');
  const [isLightMode, setIsLightMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryType>('compliments');
  const [isAudioUnlocked, setIsAudioUnlocked] = useState(false);
  const [introStep, setIntroStep] = useState(0);
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
  const [newMsg, setNewMsg] = useState('');
  
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [sfxEnabled, setSfxEnabled] = useState(true);
  
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const meowRef = useRef<HTMLAudioElement | null>(null);
  const purrRef = useRef<HTMLAudioElement | null>(null);

  const [messages, setMessages] = useState<Record<CategoryType, string[]>>(() => {
    const saved = localStorage.getItem('cat_cafe_messages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            reassurances: parsed.reassurances || [],
            compliments: parsed.compliments || [],
            love: parsed.love || []
          };
        }
      } catch (e) {
        console.error("Failed to parse saved messages", e);
      }
    }
    return {
      reassurances: [],
      compliments: [],
      love: []
    };
  });

  useEffect(() => {
    localStorage.setItem('cat_cafe_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    const music = new Audio('https://cdn.pixabay.com/audio/2022/05/27/audio_180873747b.mp3');
    music.loop = true;
    music.volume = 0.25;
    musicRef.current = music;

    const meow = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-domestic-cat-meow-56.mp3');
    meow.volume = 0.3;
    meowRef.current = meow;

    const purr = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-cat-purring-and-meow-91.mp3');
    purr.volume = 0.4;
    purrRef.current = purr;

    return () => {
      music.pause();
      musicRef.current = null;
    };
  }, []);

  const tryUnlockAudio = () => {
    if (isAudioUnlocked) return;
    setIsAudioUnlocked(true);
    if (musicEnabled && musicRef.current) {
      musicRef.current.play().catch(() => {
        setIsAudioUnlocked(false);
      });
    }
  };

  useEffect(() => {
    if (musicRef.current && isAudioUnlocked) {
      if (musicEnabled) {
        musicRef.current.play().catch(() => {});
      } else {
        musicRef.current.pause();
      }
    }
  }, [musicEnabled, isAudioUnlocked]);

  const playSfx = (type: 'meow' | 'purr') => {
    if (!sfxEnabled || !isAudioUnlocked) return;
    const sound = type === 'meow' ? meowRef.current : purrRef.current;
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(() => {});
      if (type === 'purr') {
        setTimeout(() => { if (sound && !sound.paused) sound.pause(); }, 3000);
      }
    }
  };

  const backgroundClouds = useMemo(() => {
    return Array.from({ length: 4 }).map((_, i) => ({
      id: i,
      top: `${10 + (i * 20)}%`,
      duration: `${45 + Math.random() * 25}s`,
      delay: `${-Math.random() * 50}s`,
      scale: 0.6 + Math.random() * 0.9,
      opacity: 0.1 + Math.random() * 0.25
    }));
  }, []);

  const backgroundStars = useMemo(() => {
    const count = typeof window !== 'undefined' && window.innerWidth < 640 ? 25 : 45;
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 1.5 + 1,
      duration: `${3 + Math.random() * 5}s`,
      delay: `${Math.random() * 5}s`,
      opacity: 0.3 + Math.random() * 0.5
    }));
  }, []);

  const handleStart = () => {
    tryUnlockAudio();
    setScreen('game');
    setIntroStep(0);
    setActiveCategory('compliments');
    playSfx('meow');
  };

  const handleNext = () => {
    const currentList = messages[activeCategory];
    if (introStep < currentList.length - 1) {
      setIntroStep(introStep + 1);
      playSfx('purr');
    }
  };

  const handlePrevious = () => {
    if (introStep > 0) {
      setIntroStep(introStep - 1);
      playSfx('purr');
    }
  };

  const handleSwitchCategory = (cat: CategoryType) => {
    setActiveCategory(cat);
    setIntroStep(0);
    playSfx('meow');
  };

  const handleAddMessage = () => {
    const content = newMsg.trim();
    if (!content) return;
    
    setMessages(prev => {
      const newList = [...prev[activeCategory], content];
      setIntroStep(newList.length - 1);
      return { ...prev, [activeCategory]: newList };
    });
    
    setNewMsg('');
    setIsWriteModalOpen(false);
    playSfx('purr');
  };

  const handleDeleteMessage = () => {
    const category = activeCategory;
    
    setMessages(prev => {
      const list = prev[category];
      if (list.length === 0) return prev;

      const newList = list.filter((_, i) => i !== introStep);
      const nextIndex = Math.max(0, Math.min(introStep, newList.length - 1));
      setIntroStep(nextIndex);
      
      return { ...prev, [category]: newList };
    });
    
    playSfx('meow');
  };

  const handleQuit = () => {
    tryUnlockAudio();
    if (window.confirm("Ready to leave?")) {
      setScreen('menu');
    }
  };

  const currentList = messages[activeCategory] || [];
  const hasMessages = currentList.length > 0;
  const currentMessage = hasMessages ? currentList[introStep] : null;

  return (
    <div 
      onClick={tryUnlockAudio}
      className={`min-h-[100dvh] w-full flex items-center justify-center p-4 transition-colors duration-1000 select-none ${isLightMode ? 'bg-transparent text-slate-800' : 'bg-slate-900 text-blue-100'}`}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {!isLightMode && backgroundStars.map((star) => (
          <div 
            key={star.id}
            className="absolute animate-twinkle bg-white rounded-full"
            style={{ 
              top: star.top, 
              left: star.left,
              width: star.size + 'px',
              height: star.size + 'px',
              '--duration': star.duration,
              animationDelay: star.delay,
              opacity: star.opacity,
              boxShadow: '0 0 4px 1px rgba(255,255,255,0.4)'
            } as any}
          />
        ))}

        {backgroundClouds.map((cloud) => (
          <div 
            key={cloud.id}
            className="absolute animate-drift"
            style={{ 
              top: cloud.top, 
              animationDuration: cloud.duration, 
              animationDelay: cloud.delay,
              opacity: cloud.opacity
            }}
          >
            <CartoonCloud 
              className="w-24 md:w-48" 
              style={{ transform: `scale(${cloud.scale})` }} 
            />
          </div>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-[min(100%,380px)]">
        {screen === 'menu' && (
          <div className="space-y-5 text-center animate-in fade-in zoom-in duration-500">
            <div className="space-y-1.5">
              <div className="relative inline-block animate-float">
                <div className={`p-2.5 glass rounded-[2.5rem] shadow-sm flex items-center justify-center ${isLightMode ? 'bg-white/40' : 'bg-slate-800/40'}`}>
                  <AnimatedCatLogo className="w-16 h-16 md:w-20 md:h-20" isLightMode={isLightMode} />
                </div>
                <Heart className="absolute -top-1 -right-1 w-6 h-6 text-pink-500 animate-bounce" fill="currentColor" />
              </div>
              <p className="text-[10px] font-medium italic opacity-80 tracking-wide uppercase">
                A purrfect place to seek my love for you
              </p>
            </div>

            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-balance text-blue-400">Miko’s Love For Nica</h1>

            <div className="flex flex-col gap-2">
              <button 
                type="button"
                onClick={handleStart}
                className="group w-full py-2.5 bg-pink-400 hover:bg-pink-500 text-white rounded-full font-bold text-sm shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2 relative overflow-hidden"
              >
                <Play size={16} className="group-hover:translate-x-1 transition-transform z-10" fill="currentColor" /> 
                <span className="z-10">Start Game</span>
              </button>
              
              <button 
                type="button"
                onClick={() => setScreen('settings')}
                className="w-full py-2.5 bg-blue-400 hover:bg-blue-500 text-white rounded-full font-bold text-sm shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Settings size={16} /> Settings
              </button>
              
              <button 
                type="button"
                onClick={handleQuit}
                className="w-full py-2.5 bg-slate-400 hover:bg-slate-500 text-white rounded-full font-bold text-sm shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <LogOut size={16} /> Quit
              </button>
            </div>
          </div>
        )}

        {screen === 'game' && (
          <div className={`glass p-4 md:p-6 rounded-[2rem] text-center space-y-4 animate-in slide-in-from-bottom-6 duration-500 ${isLightMode ? '' : 'bg-slate-800/40 border-white/10'}`}>
            <div className="flex justify-center items-center px-1">
               <div className={`p-2 rounded-full animate-float flex items-center justify-center ${isLightMode ? 'bg-white/30' : 'bg-slate-700/30'}`}>
                 <AnimatedCatLogo className="w-8 h-8" isLightMode={isLightMode} />
               </div>
            </div>

            <div className="flex flex-wrap justify-center gap-1">
              <button 
                type="button"
                onClick={() => handleSwitchCategory('reassurances')}
                className={`px-2.5 py-1.5 rounded-full text-[10px] font-bold transition-all flex items-center gap-1 ${activeCategory === 'reassurances' ? 'bg-blue-400 text-white shadow-sm' : 'bg-blue-100/20 text-blue-300 hover:bg-blue-100/40'}`}
              >
                <ShieldCheck size={10} /> Reassurances
              </button>
              <button 
                type="button"
                onClick={() => handleSwitchCategory('compliments')}
                className={`px-2.5 py-1.5 rounded-full text-[10px] font-bold transition-all flex items-center gap-1 ${activeCategory === 'compliments' ? 'bg-pink-400 text-white shadow-sm' : 'bg-pink-100/20 text-pink-300 hover:bg-pink-100/40'}`}
              >
                <Star size={10} /> Compliments
              </button>
              <button 
                type="button"
                onClick={() => handleSwitchCategory('love')}
                className={`px-2.5 py-1.5 rounded-full text-[10px] font-bold transition-all flex items-center gap-1 ${activeCategory === 'love' ? 'bg-purple-400 text-white shadow-sm' : 'bg-purple-100/20 text-purple-300 hover:bg-purple-100/40'}`}
              >
                <Smile size={10} /> I love you cause
              </button>
            </div>
            
            <div className="min-h-[120px] relative flex flex-col items-center justify-center px-1 overflow-hidden border-y border-white/5 py-4">
              {hasMessages ? (
                <div className="flex items-center justify-between w-full gap-2">
                  <div className="w-8 h-8 flex items-center justify-center">
                    {introStep > 0 && (
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handlePrevious(); }}
                        className={`p-1 rounded-full transition-all active:scale-90 shadow-sm ${isLightMode ? 'bg-blue-100 text-blue-600' : 'bg-blue-900/40 text-blue-300'}`}
                        aria-label="Previous message"
                      >
                        <ChevronLeft size={16} />
                      </button>
                    )}
                  </div>

                  <p 
                    key={`${activeCategory}-${introStep}-${messages[activeCategory].length}`}
                    className={`text-sm md:text-base font-semibold italic leading-relaxed flex-1 animate-in fade-in duration-500 ${isLightMode ? 'text-slate-800' : 'text-blue-100'}`}
                  >
                    {currentMessage}
                  </p>
                  
                  <div className="w-8 h-8 flex items-center justify-center">
                    {introStep < currentList.length - 1 && (
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleNext(); }}
                        className={`p-1 rounded-full transition-all active:scale-90 shadow-sm ${isLightMode ? 'bg-blue-100 text-blue-600' : 'bg-blue-900/40 text-blue-300'}`}
                        aria-label="Next message"
                      >
                        <ChevronRight size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 opacity-60 animate-in fade-in duration-500">
                   <Coffee size={24} className="text-slate-400" />
                   <p className="text-[10px] md:text-xs italic">Empty... click Write!</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between gap-2 pt-1">
              <button 
                type="button"
                onClick={() => setScreen('menu')}
                className={`py-1.5 font-bold transition-colors text-[10px] flex items-center gap-1 ${isLightMode ? 'text-slate-500 hover:text-slate-800' : 'text-blue-300/60 hover:text-blue-200'}`}
              >
                Menu
              </button>

              <div className="flex gap-1.5">
                {hasMessages && (
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleDeleteMessage(); }}
                    className={`p-2 rounded-full transition-all active:scale-90 ${isLightMode ? 'text-slate-400 hover:text-red-500' : 'text-slate-500 hover:text-red-400'}`}
                    aria-label="Delete message"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <button 
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setIsWriteModalOpen(true); }}
                  className="px-3 py-1.5 bg-pink-400 hover:bg-pink-500 text-white rounded-full font-bold text-[10px] flex items-center gap-1 shadow-sm transition-all active:scale-95"
                >
                  <Plus size={12} /> Write
                </button>
              </div>
            </div>
          </div>
        )}

        {screen === 'settings' && (
          <div className={`glass p-5 md:p-6 rounded-[2rem] space-y-4 animate-in fade-in duration-300 ${isLightMode ? '' : 'bg-slate-800/40 border-white/10'}`}>
            <div className={`flex justify-between items-center border-b pb-2 ${isLightMode ? 'border-black/10' : 'border-white/10'}`}>
              <h2 className="text-lg font-bold">Settings</h2>
              <button type="button" onClick={() => setScreen('menu')} className="p-1 hover:bg-black/5 rounded-full transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2">
              <div className={`flex items-center justify-between p-3 rounded-xl ${isLightMode ? 'bg-white/30' : 'bg-slate-700/30'}`}>
                <div className="flex items-center gap-2 text-xs font-bold">
                  {isLightMode ? <Sun size={16} className="text-amber-500" /> : <Moon size={16} className="text-blue-400" />}
                  Light Mode
                </div>
                <button 
                  type="button"
                  onClick={() => setIsLightMode(!isLightMode)}
                  className={`w-10 h-5 rounded-full relative transition-all ${isLightMode ? 'bg-pink-400' : 'bg-slate-600'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${isLightMode ? 'left-5.5' : 'left-0.5'}`} />
                </button>
              </div>

              <div className={`flex items-center justify-between p-3 rounded-xl ${isLightMode ? 'bg-white/30' : 'bg-slate-700/30'}`}>
                <div className="flex items-center gap-2 text-xs font-bold">
                  <Music size={16} className="text-pink-400" />
                  Music
                </div>
                <button 
                  type="button"
                  onClick={() => setMusicEnabled(!musicEnabled)}
                  className={`w-10 h-5 rounded-full relative transition-all ${musicEnabled ? 'bg-pink-400' : 'bg-slate-600'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${musicEnabled ? 'left-5.5' : 'left-0.5'}`} />
                </button>
              </div>

              <div className={`flex items-center justify-between p-3 rounded-xl ${isLightMode ? 'bg-white/30' : 'bg-slate-700/30'}`}>
                <div className="flex items-center gap-2 text-xs font-bold">
                  <Volume2 size={16} className="text-blue-400" />
                  Cat SFX
                </div>
                <button 
                  type="button"
                  onClick={() => setSfxEnabled(!sfxEnabled)}
                  className={`w-10 h-5 rounded-full relative transition-all ${sfxEnabled ? 'bg-blue-400' : 'bg-slate-600'}`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${sfxEnabled ? 'left-5.5' : 'left-0.5'}`} />
                </button>
              </div>
            </div>
          </div>
        )}

        {isWriteModalOpen && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsWriteModalOpen(false)}
          >
            <div 
              className={`w-full max-w-[320px] p-5 rounded-[1.5rem] shadow-2xl space-y-3 ${isLightMode ? 'bg-white' : 'bg-slate-800 text-blue-100'}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold flex items-center gap-2 capitalize">
                   <PencilLine size={16} className="text-pink-400" /> New Note
                </h3>
                <button type="button" onClick={() => setIsWriteModalOpen(false)} className="p-1 opacity-60">
                  <X size={16} />
                </button>
              </div>
              <textarea 
                autoFocus
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder="Write something..."
                className={`w-full h-24 p-3 rounded-lg border-2 focus:ring-0 outline-none transition-all resize-none font-medium text-xs ${isLightMode ? 'bg-slate-50 border-pink-100 focus:border-pink-300 text-slate-700' : 'bg-slate-700/50 border-slate-600 focus:border-pink-400 text-blue-50'}`}
              />
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => setIsWriteModalOpen(false)}
                  className={`flex-1 py-2 rounded-lg font-bold text-[10px] ${isLightMode ? 'bg-slate-100 text-slate-500' : 'bg-slate-700 text-blue-300'}`}
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleAddMessage}
                  disabled={!newMsg.trim()}
                  className="flex-1 py-2 bg-pink-400 hover:bg-pink-500 text-white rounded-lg font-bold text-[10px] shadow-sm transition-all active:scale-95 disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);
