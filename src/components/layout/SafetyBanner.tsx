import React from 'react';
import { AlertTriangle, ExternalLink, ShieldCheck } from 'lucide-react';

interface SafetyBannerProps {
  onOpenMethodology: () => void;
  language?: 'EN' | 'HI';
}

export const SafetyBanner: React.FC<SafetyBannerProps> = ({ onOpenMethodology, language = 'EN' }) => {
  return (
    <aside
      aria-label="Disaster Decision Support Safety Notice"
      className="bg-amber-950/50 border-b border-amber-500/30 px-3 sm:px-4 py-2 text-xs text-amber-200"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
        <div className="flex items-center gap-2 leading-tight">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>
            {language === 'HI' ? (
              <>
                <strong className="font-bold text-amber-300">हैकाथॉन निर्णय-समर्थन प्रोटोटाइप:</strong>{' '}
                पूर्वानुमान केवल प्रदर्शन हेतु अनुमान हैं। यह आधिकारिक चेतावनी प्रणाली नहीं है। कृपया{' '}
                <strong className="text-white font-semibold">IMD / CWC / NDMA</strong> के निर्देशों का पालन करें।
              </>
            ) : (
              <>
                <strong className="font-bold text-amber-300">Hackathon Decision-Support Prototype:</strong>{' '}
                Predictions are estimates generated for demonstration. Not an official certified emergency warning system. Follow official directives from{' '}
                <strong className="text-white font-semibold">IMD / CWC / NDMA</strong>.
              </>
            )}
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto text-[11px] sm:text-xs">
          <button
            onClick={onOpenMethodology}
            className="underline hover:text-white flex items-center gap-1 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded"
          >
            <ShieldCheck className="w-3 h-3 text-cyan-400" />
            <span>Model Methodology & Weights</span>
          </button>
          <a
            href="https://ndma.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 hover:text-white px-2 py-0.5 rounded border border-amber-500/40 transition-all font-medium"
          >
            <span>NDMA Portal</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-70" />
          </a>
        </div>
      </div>
    </aside>
  );
};
