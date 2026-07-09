import { ActiveTab } from '../types';
import { Settings, HelpCircle, User, Zap } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  return (
    <header className="bg-surface-container-lowest border-b border-outline-variant flex justify-between items-center w-full px-5 h-16 shrink-0 z-50 relative">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-primary-container filter drop-shadow-[0_0_4px_rgba(0,229,255,0.6)] animate-pulse" />
          <span className="font-sans text-xl font-bold text-primary-fixed-dim tracking-tight">
            EM-SIM PRO
          </span>
        </div>
        <nav className="hidden md:flex gap-4 ml-6 h-full items-center">
          <button
            onClick={() => setActiveTab('magFieldTab')}
            className={`font-sans text-sm font-medium border-b-2 py-4 px-3 transition-all duration-200 cursor-pointer ${
              activeTab === 'magFieldTab'
                ? 'text-primary-container border-primary-container font-semibold'
                : 'text-on-surface-variant border-transparent hover:text-on-surface hover:bg-surface-container-low'
            }`}
          >
            자기장 시각화 (Magnetic Field Visualization)
          </button>
          <button
            onClick={() => setActiveTab('circuitSimTab')}
            className={`font-sans text-sm font-medium border-b-2 py-4 px-3 transition-all duration-200 cursor-pointer ${
              activeTab === 'circuitSimTab'
                ? 'text-primary-container border-primary-container font-semibold'
                : 'text-on-surface-variant border-transparent hover:text-on-surface hover:bg-surface-container-low'
            }`}
          >
            회로 시뮬레이션 (Circuit Simulation)
          </button>
        </nav>
      </div>

      <div className="flex items-center gap-2">
        <button 
          title="Settings" 
          className="p-2 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-container-high transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
        <button 
          title="Help" 
          className="p-2 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-container-high transition-colors"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
        <button 
          title="Account" 
          className="p-2 text-on-surface-variant hover:text-on-surface rounded-full hover:bg-surface-container-high transition-colors"
        >
          <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
