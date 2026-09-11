import React from 'react';
import { Activity, Map, BarChart3, Navigation2, Sliders, Info } from 'lucide-react';

export type ActiveTab = 'dashboard' | 'map' | 'analytics' | 'evacuation' | 'simulator' | 'about';

interface TabNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  language: 'EN' | 'HI';
}

export const TabNav: React.FC<TabNavProps> = ({ activeTab, onChangeTab, language }) => {
  const tabs = [
    {
      id: 'dashboard' as ActiveTab,
      label: language === 'HI' ? 'लाइव मॉनिटर' : 'Live Monitor',
      icon: Activity,
    },
    {
      id: 'map' as ActiveTab,
      label: language === 'HI' ? 'आपदा मानचित्र' : 'Hazard Map',
      icon: Map,
    },
    {
      id: 'analytics' as ActiveTab,
      label: language === 'HI' ? 'हाइड्रोग्राफ व विश्लेषण' : 'River & Rain Telemetry',
      icon: BarChart3,
    },
    {
      id: 'evacuation' as ActiveTab,
      label: language === 'HI' ? 'सुरक्षित आश्रय व निकासी' : 'Evacuation & Shelters',
      icon: Navigation2,
    },
    {
      id: 'simulator' as ActiveTab,
      label: language === 'HI' ? 'सिमुलेटर (What-If)' : 'Scenario Simulator',
      icon: Sliders,
      badge: 'Interactive'
    },
    {
      id: 'about' as ActiveTab,
      label: language === 'HI' ? 'प्रणाली व संपर्क' : 'Methodology & SOS',
      icon: Info,
    },
  ];

  return (
    <div className="bg-slate-900/80 border-b border-slate-800/90 shadow-sm relative z-40">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <nav
          className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 scrollbar-none"
          role="tablist"
          aria-label="Navigation Tabs"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => onChangeTab(tab.id)}
                className={`flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap relative group ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/35 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70 border border-transparent'
                } focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-500/25 text-indigo-300 border border-indigo-500/40 font-bold tracking-tight">
                    {tab.badge}
                  </span>
                )}
                {isActive && (
                  <span className="absolute -bottom-2 left-3 right-3 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
