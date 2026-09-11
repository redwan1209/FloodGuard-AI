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
    <section aria-label="Survival Grab-Bag Readiness" className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Backpack className="w-5 h-5 text-blue-700" />
            <span>72-Hour "Go-Bag" Survival Readiness Checklist</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Essential emergency supplies recommended by NDMA for rapid household flood evacuation
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <button
              onClick={selectAll}
              className="text-[11px] font-semibold text-blue-700 hover:text-blue-800 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
            >
              Check All
            </button>
            <button
              onClick={clearAll}
              className="text-[11px] font-semibold text-slate-500 hover:text-slate-700 px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
            >
              Clear
            </button>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-slate-800">
              Readiness: {checkedIds.size} / {DEFAULT_ITEMS.length} ({progressPercent}%)
            </span>
            <div className="w-32 sm:w-40 bg-slate-100 rounded-full h-2 mt-1 overflow-hidden border border-slate-200">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  progressPercent === 100
                    ? 'bg-emerald-600'
                    : progressPercent >= 60
                    ? 'bg-blue-600'
                    : 'bg-amber-500'
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
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-all ${
              activeCategory === cat
                ? 'bg-blue-50 text-blue-800 border border-blue-200 font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 bg-slate-100 border border-slate-200'
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
              className={`p-3.5 rounded border transition-all cursor-pointer select-none flex items-start gap-3 shadow-2xs ${
                isDone
                  ? 'bg-blue-50/50 border-blue-300 hover:border-blue-400'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle className="w-5 h-5 text-blue-600 fill-blue-100" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-xs font-bold leading-tight ${
                      isDone ? 'text-slate-900' : 'text-slate-700'
                    }`}
                  >
                    {item.name}
                  </span>
                  <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                    {item.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">{item.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
