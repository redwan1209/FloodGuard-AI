import React, { useState } from 'react';
import { EMERGENCY_CONTACTS } from '../../data/emergencyContacts';
import { EmergencyContact } from '../../types';
import { PhoneCall, Shield, Copy, Check, ExternalLink, Search } from 'lucide-react';

export const EmergencyHelplines: React.FC = () => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = EMERGENCY_CONTACTS.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.agency.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopy = (id: string, phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center">
              <PhoneCall className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white">
              Official Indian Disaster & Rescue Helplines Directory
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Direct emergency response control rooms for search, water rescue, and relief coordination
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search state, agency or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>
      </div>

      {/* Grid of Emergency Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((contact) => (
          <div
            key={contact.id}
            className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-cyan-400">
                    {contact.type}
                  </span>
                  <h4 className="font-bold text-sm text-white mt-1.5 leading-snug">
                    {contact.name}
                  </h4>
                  <p className="text-xs text-slate-400">{contact.agency}</p>
                </div>
                {contact.available24x7 && (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded shrink-0">
                    24x7
                  </span>
                )}
              </div>

              <p className="mt-2.5 text-[11px] text-slate-400 border-t border-slate-800/80 pt-2">
                <strong className="text-slate-300">Jurisdiction:</strong> {contact.jurisdiction}
              </p>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-sm transition-all"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call {contact.phone}</span>
              </a>

              <button
                onClick={() => handleCopy(contact.id, contact.phone)}
                title="Copy phone number"
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
              >
                {copiedId === contact.id ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
