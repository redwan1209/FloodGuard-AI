import React, { useState } from 'react';
import { Shield, CheckCircle, Circle, Backpack, AlertCircle } from 'lucide-react';

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

  const toggleItem = (id: string) => {
    const updated = new Set(checkedIds);
    if (updated.has(id)) {
      updated.delete(id);
    } else {
      updated.add(id);
    }
    setCheckedIds(updated);
  };

  const progressPercent = Math.round((checkedIds.size / DEFAULT_ITEMS.length) * 100);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Backpack className="w-5 h-5 text-cyan-400" />
            <span>72-Hour "Go-Bag" Survival Readiness Checklist</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Essential emergency supplies recommended by NDMA for rapid evacuation
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs font-semibold text-slate-300">
              Readiness: {checkedIds.size} of {DEFAULT_ITEMS.length} items
            </span>
            <div className="w-32 bg-slate-800 rounded-full h-2 mt-1 overflow-hidden">
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {DEFAULT_ITEMS.map((item) => {
          const isDone = checkedIds.has(item.id);
          return (
            <div
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`p-3 rounded-xl border transition-all cursor-pointer select-none flex items-start gap-3 ${
                isDone
                  ? 'bg-slate-950/80 border-cyan-500/40'
                  : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle className="w-4 h-4 text-cyan-400" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-600" />
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
                  <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                    {item.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-snug">{item.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
