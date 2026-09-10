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
    <div className="bg-slate-900/60 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto py-2 scrollbar-none" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChangeTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};
