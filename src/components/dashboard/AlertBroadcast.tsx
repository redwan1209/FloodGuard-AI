import React, { useState } from 'react';
import { FloodRiskAssessment, FloodBasin, RiverGauge } from '../../types';
import { Radio, Copy, Check, MessageSquare, Share2 } from 'lucide-react';

interface AlertBroadcastProps {
  assessment: FloodRiskAssessment;
  basin: FloodBasin;
  gauges: RiverGauge[];
}

export const AlertBroadcast: React.FC<AlertBroadcastProps> = ({
  assessment,
  basin,
  gauges
}) => {
  const [copied, setCopied] = useState(false);
  const primaryGauge = gauges[0];

  const advisoryText = `🚨 [FLOODGUARD AI ADVISORY - ${assessment.riskLevel} ALERT] 🚨
Region: ${basin.name} (${basin.state})
River: ${basin.riverName}
Date/Time: ${new Date().toLocaleDateString('en-IN', { dateStyle: 'medium' })} | ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}

STATUS: ${assessment.alertHeadline}
Flood Risk Index: ${assessment.overallScore}/100
${primaryGauge ? `River Stage: ${primaryGauge.currentLevelM}m (Danger Mark: ${primaryGauge.dangerLevelM}m, Trend: ${primaryGauge.trend.toUpperCase()})` : ''}
Estimated Peak: Next ~${assessment.estimatedTimeToPeakHours} Hours

DIRECTIVES:
${assessment.recommendedActions.map((act, i) => `${i + 1}. ${act}`).join('\n')}

EMERGENCY HELPLINES:
• All-India Emergency: 112
• National Disaster Helpline (NEOC): 1070
• District Emergency Control (DEOC): 1077

*Prototype estimate. Please follow official district magistrate & IMD directives.*`;

  const handleCopy = () => {
    navigator.clipboard.writeText(advisoryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-500/15 text-red-400 flex items-center justify-center">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              Public Advisory & Emergency Broadcast Dispatcher
            </h3>
            <p className="text-xs text-slate-400">
              Auto-generated structured bulletin ready for WhatsApp, SMS & public address systems
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-cyan-400" />
                <span>Copy Text</span>
              </>
            )}
          </button>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(advisoryText)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition-all"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Share to WhatsApp</span>
          </a>
        </div>
      </div>

      <div className="bg-slate-950 rounded-xl p-4 border border-slate-800/80 font-mono text-xs text-slate-300 whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto">
        {advisoryText}
      </div>
    </div>
  );
};
