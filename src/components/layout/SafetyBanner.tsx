import React from 'react';
import { AlertTriangle, ExternalLink, ShieldCheck } from 'lucide-react';

interface SafetyBannerProps {
  onOpenMethodology: () => void;
  language?: 'EN' | 'HI';
}

export const SafetyBanner: React.FC<SafetyBannerProps> = ({ onOpenMethodology, language = 'EN' }) => {
  return (
    <aside
      aria-label="Government Prototype Disclaimer"
      className="bg-amber-50 border-b border-amber-200 px-3 sm:px-4 py-1.5 text-xs text-amber-950 shadow-sm"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 sm:gap-4">
        <div className="flex items-center gap-2 leading-tight">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span className="text-[11px] sm:text-xs text-amber-900">
            {language === 'HI' ? (
              <>
                <strong className="font-bold text-amber-950">हैकाथॉन प्रोटोटाइप सूचना:</strong>{' '}
                यह प्रणाली निर्णय-समर्थन व प्रदर्शन हेतु है। यह प्रमाणित सरकारी चेतावनी नहीं है। कृपया{' '}
                <strong className="text-amber-950 font-bold">IMD / CWC / NDMA</strong> के आधिकारिक बुलेटिन का पालन करें।
              </>
            ) : (
              <>
                <strong className="font-bold text-amber-950">Hackathon Decision-Support Prototype:</strong>{' '}
                Predictions are hydrological estimates generated for academic and demonstration purposes. Not a certified disaster warning system. Always follow official bulletins issued by{' '}
                <strong className="text-amber-950 font-bold">IMD, CWC & NDMA</strong>.
              </>
            )}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0 text-[11px] pt-1 sm:pt-0">
          <button
            onClick={onOpenMethodology}
            className="text-blue-900 hover:text-blue-700 underline font-semibold flex items-center gap-1 transition-colors"
          >
            <ShieldCheck className="w-3 h-3 text-blue-700 shrink-0" />
            <span>
              <span className="sm:hidden">MCDA Model</span>
              <span className="hidden sm:inline">MCDA Methodology & Weights</span>
            </span>
          </button>
          <a
            href="https://ndma.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 bg-amber-100 hover:bg-amber-200 text-amber-900 px-2 py-0.5 rounded border border-amber-300 transition-colors font-medium"
          >
            <span>NDMA Portal</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-80" />
          </a>
        </div>
      </div>
    </aside>
  );
};
