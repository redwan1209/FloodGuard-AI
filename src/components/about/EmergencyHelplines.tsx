import React, { useState } from 'react';
import { EMERGENCY_CONTACTS } from '../../data/emergencyContacts';
import { EmergencyContact } from '../../types';
import { PhoneCall, Shield, Copy, Check, ExternalLink, Search, X } from 'lucide-react';

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
    <section aria-label="Official Disaster Helplines Directory" className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-sm space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-red-50 text-red-700 border border-red-200 flex items-center justify-center">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Official Disaster & Rescue Helplines Directory
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Direct emergency response control rooms for search, water rescue, and relief coordination
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Search state, agency or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-300 rounded pl-9 pr-8 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Grid of Emergency Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filtered.map((contact) => (
          <div
            key={contact.id}
            className="bg-slate-50 border border-slate-200 rounded p-4 flex flex-col justify-between hover:border-slate-300 transition-all shadow-2xs"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                    {contact.type}
                  </span>
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 mt-1.5 leading-snug">
                    {contact.name}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">{contact.agency}</p>
                </div>
                {contact.available24x7 && (
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded shrink-0">
                    24x7
                  </span>
                )}
              </div>

              <p className="mt-3 text-[11px] text-slate-600 border-t border-slate-200 pt-2.5">
                <strong className="text-slate-800">Jurisdiction:</strong> {contact.jurisdiction}
              </p>
            </div>

            <div className="mt-3.5 pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
              <a
                href={`tel:${contact.phone}`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-2xs transition-colors"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Call {contact.phone}</span>
              </a>

              <button
                onClick={() => handleCopy(contact.id, contact.phone)}
                title="Copy phone number"
                className="p-1.5 rounded bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors"
              >
                {copiedId === contact.id ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
