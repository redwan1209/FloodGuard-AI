import React from 'react';
import { AlertTriangle, ExternalLink, ShieldCheck } from 'lucide-react';

interface SafetyBannerProps {
  onOpenMethodology: () => void;
  language?: 'EN' | 'HI';
}

export const SafetyBanner: React.FC<SafetyBannerProps> = ({ onOpenMethodology, language = 'EN' }) => {
  return (
    <div className="bg-amber-950/40 border-b border-amber-500/30 px-4 py-2 text-xs text-amber-200 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span>
          {language === 'HI' ? (
            <>
              <strong className="font-semibold text-amber-300">हैकाथॉन प्रोटोटाइप सूचना:</strong>{' '}
              यह प्रणाली केवल निर्णय-समर्थन व प्रदर्शन हेतु है। यह आधिकारिक चेतावनी नहीं है। कृपया{' '}
              <strong className="text-white">IMD / CWC / NDMA</strong> के निर्देशों का पालन करें।
            </>
          ) : (
            <>
              <strong className="font-semibold text-amber-300">Hackathon Decision-Support Prototype:</strong>{' '}
              Predictions are estimates generated for demonstration. Not an official emergency warning system. Follow official bulletins from{' '}
              <strong className="text-white">IMD / CWC / NDMA</strong>.
            </>
          )}
        </span>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenMethodology}
          className="underline hover:text-white flex items-center gap-1 transition-colors"
        >
          <ShieldCheck className="w-3 h-3 text-cyan-400" />
          Model Methodology & Weights
        </button>
        <a
          href="https://ndma.gov.in"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 px-2 py-0.5 rounded border border-amber-500/40 transition-colors"
        >
          NDMA Portal <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>
    </div>
  );
};
