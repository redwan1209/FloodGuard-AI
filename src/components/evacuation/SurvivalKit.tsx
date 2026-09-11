import React, { useState } from 'react';
import { Shield, CheckCircle, Circle, Backpack, AlertCircle, CheckCheck, RefreshCcw } from 'lucide-react';

interface ChecklistItem {
  id: string;
  category: 'Essentials' | 'Medical' | 'Documents' | 'Signaling & Tools';
  name: string;
  detail: string;
}

const DEFAULT_ITEMS: ChecklistItem[] = [
  {
    id: 'item-water',
    category: 'Essentials',
    name: '3-Day Drinking Water (9 Liters per Person)',
    detail: 'Pack in clean sealed plastic containers. Floods contaminate local groundwater & tube wells.'
  },
  {
    id: 'item-food',
    category: 'Essentials',
    name: 'Non-Perishable Ready-to-Eat Rations',
    detail: 'Roasted chana, puffed rice (muri), energy bars, glucose biscuits, dry fruits.'
  },
  {
    id: 'item-meds',
    category: 'Medical',
    name: 'Prescription Medicines (2-3 Weeks Supply)',
    detail: 'Insulin, blood pressure, asthma inhalers, and cardiac medications.'
  },
  {
    id: 'item-ors',
    category: 'Medical',
    name: 'Water Purification Tablets & ORS Packets',
    detail: 'Chlorine tablets (halazone) and Oral Rehydration Salts to avoid waterborne cholera/diarrhea.'
  },
  {
    id: 'item-docs',
    category: 'Documents',
    name: 'Waterproof Pouch with Critical Identity Papers',
    detail: 'Aadhaar, Ration Card, Voter ID, land patta, and insurance documents wrapped in airtight ziplock.'
  },
  {
    id: 'item-power',
    category: 'Signaling & Tools',
    name: 'Charged Power Bank & Heavy-Duty Flashlight',
    detail: 'Submerged substations cause prolonged grid blackouts. Keep phones on ultra battery saver.'
  },
  {
    id: 'item-whistle',
    category: 'Signaling & Tools',
    name: 'Emergency High-Pitch Whistle',
    detail: 'Vital for signaling your location through fog or rain to NDRF motorized rescue boats.'
  },
  {
    id: 'item-shoes',
    category: 'Essentials',
    name: 'Sturdy Waterproof Footwear & Rain Poncho',
    detail: 'Protects feet from hidden debris, broken glass, and submerged venomous snakes in floodwaters.'
  }
];

export const SurvivalKit: React.FC = () => {
  const [checkedIds, setCheckedIds] = useState<Set<string>>(
    new Set(['item-water', 'item-meds', 'item-docs'])
  );
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const toggleItem = (id: string) => {
    const updated = new Set(checkedIds);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setCheckedIds(updated);
  };

  const selectAll = () => {
    setCheckedIds(new Set(DEFAULT_ITEMS.map((item) => item.id)));
  };

  const clearAll = () => {
    setCheckedIds(new Set());
  };

  const filteredItems = DEFAULT_ITEMS.filter((item) => {
    if (activeCategory === 'ALL') return true;
    return item.category === activeCategory;
  });

  const progressPercent = Math.round((checkedIds.size / DEFAULT_ITEMS.length) * 100);

  return (
    <section aria-label="Survival Grab-Bag Readiness" className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Backpack className="w-5 h-5 text-cyan-400" />
            <span>72-Hour "Go-Bag" Survival Readiness Checklist</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Essential emergency supplies recommended by NDMA for rapid household evacuation
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <button
              onClick={selectAll}
              className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Check All
            </button>
            <button
              onClick={clearAll}
              className="text-[11px] font-semibold text-slate-400 hover:text-slate-300 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Clear
            </button>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-slate-200">
              Readiness: {checkedIds.size} / {DEFAULT_ITEMS.length} ({progressPercent}%)
            </span>
            <div className="w-32 sm:w-40 bg-slate-800 rounded-full h-2 mt-1 overflow-hidden shadow-inner">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  progressPercent === 100
                    ? 'bg-emerald-400'
                    : progressPercent >= 60
                    ? 'bg-cyan-400'
                    : 'bg-amber-400'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-1.5 pt-1">
        {['ALL', 'Essentials', 'Medical', 'Documents', 'Signaling & Tools'].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeCategory === cat
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/35'
                : 'text-slate-400 hover:text-slate-200 bg-slate-950/60 border border-slate-800'
            }`}
          >
            {cat === 'ALL' ? 'All Items' : cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredItems.map((item) => {
          const isDone = checkedIds.has(item.id);
          return (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3 shadow-sm ${
                isDone
                  ? 'bg-slate-950/90 border-cyan-500/50 hover:border-cyan-400'
                  : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle className="w-5 h-5 text-cyan-400 fill-cyan-500/20" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-600" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-xs font-bold leading-tight ${
                      isDone ? 'text-white' : 'text-slate-300'
                    }`}
                  >
                    {item.name}
                  </span>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700/60 shrink-0">
                    {item.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">{item.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
