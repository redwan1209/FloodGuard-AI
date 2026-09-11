import React from 'react';
import { Activity, Map, BarChart3, Navigation2, Sliders, Info, ShieldCheck } from 'lucide-react';

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
      label: language === 'HI' ? 'अवलोकन व मानचित्र' : 'Overview & Flood Map',
      icon: Map,
    },
    {
      id: 'analytics' as ActiveTab,
      label: language === 'HI' ? 'नदी व वर्षा टेलीमेट्री' : 'River & Rain Telemetry',
      icon: BarChart3,
    },
    {
      id: 'evacuation' as ActiveTab,
      label: language === 'HI' ? 'निकासी व आश्रय स्थल' : 'Evacuation & Shelters',
      icon: Navigation2,
    },
    {
      id: 'simulator' as ActiveTab,
      label: language === 'HI' ? 'परिदृश्य सिमुलेटर' : 'Scenario Simulator',
      icon: Sliders,
      badge: 'What-If'
    },
    {
      id: 'about' as ActiveTab,
      label: language === 'HI' ? 'कार्यप्रणाली व आपातकाल' : 'Methodology & Helplines',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="bg-white border-b border-slate-200 shadow-sm sticky top-14 z-40">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <nav
          className="flex space-x-1 sm:space-x-3 overflow-x-auto py-1.5 scrollbar-none"
          role="tablist"
          aria-label="Application Navigation"
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-50 text-blue-900 border-b-2 border-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-b-2 border-transparent'
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-blue-700' : 'text-slate-500'
                  }`}
                />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 border border-blue-200 font-bold">
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
